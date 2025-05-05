import productDb from "../../Db/productDb.js";
import priceHistoryDb from "../../Db/priceHistoryDb.js";
import searchQueryDb from "../../Db/serchQueryDb.js";
import searchAmazon from "../../scrapers/amazonScraper.js";
import searchFlipkart from "../../scrapers/flipkartScraper.js";
import { setCache, getCache } from "../../helper/cache.js";
import mongoose from "mongoose";
import { sendPriceChangeEmail } from "../../services/emailService.js";
import { common } from "../../common.js";

const searchProducts = async (keyword) => {
  try {
    const [flipkartRsults, amazonResults] = await Promise.all([
      searchFlipkart(keyword, common.source.Flipkart),
      searchAmazon(keyword, common.source.Amazon),
    ]);

    const combinedResults = [...flipkartRsults, ...amazonResults];

    combinedResults.map(async (result) => {
      switch (result.currency) {
        case common.CURRENCY_SIMBOL.INR:
          result.currency = common.CURRENCY.INR;
          break;
        case common.CURRENCY_SIMBOL.USD:
          result.currency = common.CURRENCY.USD;
          break;
        default:
          break;
      }
      const {
        name,
        price,
        currency,
        imageUrl,
        productUrl,
        source,
        firstChecked,
        isAvailable,
      } = result;
      const product = await productDb.create({
        name,
        price,
        currency,
        imageUrl,
        productUrl,
        source,
        searchTag: keyword,
        firstChecked,
        isAvailable,
      });
      await priceHistoryDb.create({
        productId: product._id,
        price,
        currency,
      });
    });
    await searchQueryDb.create({
      keyword,
      resultCount: combinedResults.length,
      cacheHit: false,
    });
    return combinedResults;
  } catch (err) {
    console.error("Error in searchProducts:", err);
    throw err;
  }
};

const getProducts = async (page, limit, sortBy, sortType) => {
  try {
    const products = await productDb.find(page, limit, sortBy, sortType);
    if (!products || products.length === 0) {
      throw new Error("PRODUCTS_NOT_FOUND");
    }
    products.map(async (product) => {
      const cacheKey = `products:${product._id}`;
      await setCache(cacheKey, product);
    });
    return products;
  } catch (err) {
    console.error("Error in getProducts:", err);
    throw err;
  }
};

const getProductById = async (id) => {
  try {
    let product;
    const cacheKey = `products:${id}`;
    product = await getCache(cacheKey);
    if (!product || product.length === 0) {
      product = await productDb.findById(id);
    }
    if (!product) {
      throw new Error("PRODUCTS_NOT_FOUND");
    }
    return product;
  } catch (err) {
    console.error("Error in getProductById:", err);
    throw err;
  }
};

const getPriceHistory = async (productId) => {
  try {
    if (!mongoose.isValidObjectId(productId)) {
      throw new Error("INVALID_PRODUCT_ID");
    }
    const priceHistory = await priceHistoryDb.PriceHistoryfind({ productId });
    if (!priceHistory || priceHistory.length === 0) {
      throw new Error("PRODUCTS_HISTORY_NOT_FOUND");
    }
    return priceHistory;
  } catch (err) {
    console.error("Failed to fetch price history:", err);
    throw err;
  }
};
const refreshPrice = async (productId) => {
  try {
    const product = await productDb.findById(productId);
    if (!product || product.length === 0) {
      throw new Error("PRODUCTS_NOT_FOUND");
    }

    const keyword = product.name;
    const scraper =
      product.source === "Amazon.in" ? searchAmazon : searchFlipkart;

    const results = await scraper(keyword);

    const refreshed = results.find((item) => item.name === product.name);
    if (!refreshed || refreshed.length === 0) {
      throw new Error("REFRESHED_PRODUCT_NOT_FOUND");
    }
    switch (refreshed.currency) {
      case common.CURRENCY_SIMBOL.INR:
        refreshed.currency = common.CURRENCY.INR;
        break;
      case common.CURRENCY_SIMBOL.USD:
        refreshed.currency = common.CURRENCY.USD;
        break;
      default:
        break;
    }
    const { price = refreshPrice, isAvailable = true, currency } = refreshed;
    let updated;
    if (product.price != refreshed.price) {
      updated = await productDb.update(productId, {
        price,
        currency,
        isAvailable,
      });
      await sendPriceChangeEmail(product, product.price, refreshed.price);
    }
    const priceHistory = await priceHistoryDb.create({
      productId,
      price,
      currency,
    });
    return {
      oldPrice: product.price,
      newPrice: price,
      currency,
      priceHistory,
      updated,
    };
  } catch (err) {
    console.error("Error in refreshPrice:", err);
    throw err;
  }
};
export default {
  searchProducts,
  getProducts,
  getProductById,
  getPriceHistory,
  refreshPrice,
};
