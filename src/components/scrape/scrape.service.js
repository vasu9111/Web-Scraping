import productDb from "../../Db/productDb.js";
import searchAmazon from "../../scrapers/amazonScraper.js";
import searchFlipkart from "../../scrapers/flipkartScraper.js";
import { setCache } from "../../helper/cache.js";

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
      await productDb.create({
        name: result.name,
        price: result.price,
        currency: result.currency,
        imageUrl: result.imageUrl,
        productUrl: result.productUrl,
        source: result.source,
        searchTage: keyword,
        firstChecked: result.firstChecked,
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

export default { searchProducts, getProducts };
