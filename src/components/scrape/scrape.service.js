import productDb from "../../Db/productDb.js";
import priceHistory from "../../models/priceHistory.js";
import searchQuery from "../../models/searchQuery.js";
import searchAmazon from "../../scrapers/amazonScraper.js";
import searchFlipkart from "../../scrapers/flipkartScraper.js";
import { setCache, getCache } from "../../helper/cache.js";
import mongoose from "mongoose";
import  sendPriceChangeEmail  from "../../services/emailService.js";

const searchProducts = async (keyword) => {
  try {
    const [flipkartRsults, amazonResults] = await Promise.all([
      searchFlipkart(keyword),
      searchAmazon(keyword),
    ]);

    const combinedResults = [...flipkartRsults, ...amazonResults];

    combinedResults.map(async (result) => {
      switch (result.currency) {
        case "₹":
          result.currency = "INR";
          break;
        case "$":
          result.currency = "USD";
          break;
        default:
          break;
      }
      const product = await productDb.create({
        name: result.name,
        price: result.price,
        currency: result.currency,
        imageUrl: result.imageUrl,
        productUrl: result.productUrl,
        source: result.source,
        searchTage: keyword,
        firstChecked: result.firstChecked,
        isAvailable: result.isAvailable,
      });
      await priceHistory.create({
        productId: product._id,
        price: result.price,
        currency: result.currency,
      });
    });
    await searchQuery.create({
      keyword: keyword,
      resultCount: combinedResults.length,
      cacheHit: false,
    });
    return combinedResults;
  } catch (err) {
    console.error("Error in searchProducts:", err);
    throw err;
  }
};

const getProducts = async (limit, sortBy, type) => {
  try {
    const products = await productDb.find(limit, sortBy, type);
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
      throw new Error("PRODUCTS_NOT_FOUND");
    } else {
      product = await productDb.findById(id);
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
    const priceHistory = await productDb.PriceHistoryfind({ productId });
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
console.log({scraper});

    const results = await scraper(keyword);
    
    const refreshed = results.find((item) => item.name === product.name);
    if (!refreshed || refreshed.length === 0) {
      throw new Error("REFRESHED_PRODUCT_NOT_FOUND");
    }
    switch (refreshed.currency) {
      case "₹":
        refreshed.currency = "INR";
        break;
      case "$":
        refreshed.currency = "USD";
        break;
      default: 
        break;
    }
    let updated;
    if (product.price != refreshed.price) {
      updated = await productDb.update(productId, {
        price: refreshed.price,
        currency: refreshed.currency,
        isAvailable: refreshed.isAvailable ?? true,
      });       
      await sendPriceChangeEmail(product, product.price, refreshed.price);
    }
    const price = await priceHistory.create({
      productId,
      price: refreshed.price,
      currency: refreshed.currency,
    });
    return {
      oldPrice: product.price,
      newPrice: refreshed.price,
      currency: refreshed.currency,
      priceHistory: price,
      updated:updated,
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
  refreshPrice
};
