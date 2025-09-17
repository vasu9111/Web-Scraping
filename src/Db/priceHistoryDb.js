import PriceHistoryMdl from "../models/priceHistory.js";

const create = async (product) => {
  const result = await PriceHistoryMdl.create(product);
  return result.toJSON();
};

const PriceHistoryfind = async (productId) => {
  const result = await PriceHistoryMdl.find(productId).sort({ timestamp: -1 });
  return result;
};
export default {
  create,
  PriceHistoryfind,
};
