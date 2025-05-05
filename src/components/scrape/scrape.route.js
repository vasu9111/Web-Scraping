import express from "express";
import scrapeController from "./scrape.controller.js";
import middleware from "../../middleware/scrape.js";
import validation from "../scrape/scrape.validation.js";

const router = express.Router();

router.post(
  "/search",
  middleware.validate(validation.searchSchema),
  scrapeController.searchProducts
);
router.get("/products", scrapeController.getProducts);
router.get("/products/:id", scrapeController.getProductById);
router.get("/products/:id/history", scrapeController.getPriceHistory);
router.post("/products/:id/refresh", scrapeController.refreshProductPrice);
export default router;
