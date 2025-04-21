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

export default {
  searchProducts,
};
