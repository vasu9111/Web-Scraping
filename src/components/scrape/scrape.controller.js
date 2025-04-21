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

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await service.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export default {
  searchProducts,
  getProducts,
  getProductById,
};
