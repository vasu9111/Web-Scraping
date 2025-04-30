import mongoose from "mongoose";

const searchQuerySchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    resultCount: {
      type: Number,
      required: true,
    },
    cacheHit: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

export default mongoose.model("SearchQuery", searchQuerySchema);
