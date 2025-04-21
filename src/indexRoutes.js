import express from "express";
import searchRoute from "./components/scrape/scrape.route.js";

const router = express.Router();

router.use("/", searchRoute);

export default router;
