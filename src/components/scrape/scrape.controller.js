import service from "./scrape.service.js";

const searchProducts = async (req, res, next) => {
  try {
    const { keyword } = req.body;
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
    let { page, limit, sort, sortType } = req.query;
    sortType = Number(sortType);
    const products = await service.getProducts(page, limit, sort, sortType);
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

const getPriceHistory = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const history = await service.getPriceHistory(productId);
    res.json(history);
  } catch (error) {
    next(error);
  }
};
const refreshProductPrice = async (req, res, next) => {
  try {
    const response = await service.refreshPrice(req.params.id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
export default {
  searchProducts,
  getProducts,
  getProductById,
  getPriceHistory,
  refreshProductPrice,
};
