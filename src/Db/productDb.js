import ProductMdl from "../models/Product.js";

const create = async (product) => {
  const result = await ProductMdl.create(product);
  return result.toJSON();
};

const find = async (page, limit, sortBy, sortType) => {
  const skip = (page - 1) * limit;
  const result = await ProductMdl.find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortType });
  return result;
};

const findById = async (id) => {
  const result = await ProductMdl.findById(id);
  return result;
};

const update = async (id, updateData) => {
  return await ProductMdl.findByIdAndUpdate(id, updateData, { new: true });
};
export default {
  create,
  find,
  findById,
  update,
};
