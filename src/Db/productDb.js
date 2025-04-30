import ProductMdl from "../models/Product.js";
import PriceHistoryMdl from "../models/priceHistory.js";

const create = async (product) => {
  const result = await ProductMdl.create(product);
  return result.toJSON();
};

const find = async (limit, sortBy, type) => {
  const result = await ProductMdl.find()
    .limit(limit)
    .sort({ [sortBy]: Number(type) });
  return result;
};

const findById = async (id) => {
  const result = await ProductMdl.findById(id);
  return result;
};
const PriceHistoryfind = async (productId) => {
  const result = await PriceHistoryMdl.find(productId).sort({ timestamp: -1 });
  return result;
};

const update = async (id, updateData) => {
  return await ProductMdl.findByIdAndUpdate(id, updateData, { new: true });
};
export default {
  create,
  find,
  findById,
  PriceHistoryfind,
  update,
};
