import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
    timestamp: {
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

export default mongoose.model("PriceHistory", priceHistorySchema);
