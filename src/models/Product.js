import mongoose from "mongoose";
import { common } from "../common.js";
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    productUrl: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: [common.source.Amazon, common.source.Flipkart],
    },
    searchTag: {
      type: Array,
      required: true,
    },
    firstChecked: {
      type: Date,
      default: Date.now,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model("Product", ProductSchema);
