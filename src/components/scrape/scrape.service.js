import productDb from "../../Db/productDb.js";
import priceHistory from "../../models/priceHistory.js";
import searchAmazon from "../../scrapers/amazonScraper.js";
import searchFlipkart from "../../scrapers/flipkartScraper.js";
import { setCache, getCache } from "../../helper/cache.js";
import mongoose from "mongoose";

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
    return combinedResults;
  } catch (err) {
    console.error("Error in searchProducts:", err);
    throw err;
  }
};

const getProducts = async (limit, sortBy, type) => {
  try {
    const products = await productDb.find(limit, sortBy, type);
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
    if (product) {
      console.log("Return if found in cache");
      return product;
    } else {
      product = await productDb.findById(id);
      console.log("Return if found in mongodb");
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
      throw new Error("Invalid product ID");
    }

    const priceHistory = await productDb.PriceHistoryfind({ productId });

    return priceHistory;
  } catch (err) {
    console.error("Failed to fetch price history:", err);
    throw err;
  }
};

export default {
  searchProducts,
  getProducts,
  getProductById,
  getPriceHistory,
};
