import ProductMdl from "../models/Product.js";

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
export default {
  create,
  find,
  findById,
};
