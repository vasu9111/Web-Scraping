import service from "./scrape.service.js";

const searchProducts = async (req, res, next) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }
    const results = await service.searchProducts(keyword);
    res.json({
      keyword,
      results,
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { limit, sort, type } = req.query;
    const products = await service.getProducts(limit, sort, type);
    res.json({
      products,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  searchProducts,
  getProducts,
};
