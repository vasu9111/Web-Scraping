import express from "express";
import scrapeProducts from "./scrape.controller.js";
import middleware from "../../middleware/scrape.js";
import validation from "../scrape/scrape.validation.js";

const router = express.Router();

router.post(
  "/search",
  middleware.validate(validation.searchSchema),
  scrapeProducts.searchProducts
);
router.get("/products", scrapeProducts.getProducts);
router.get("/products/:id", scrapeProducts.getProductById);
router.get("/products/:id/history", scrapeProducts.getPriceHistory);
export default router;
