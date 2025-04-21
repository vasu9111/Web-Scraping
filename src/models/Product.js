import mongoose, { isValidObjectId } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
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
      enum: ["Amazon.in", "Flipkart.com"],
    },
    searchTage: {
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
