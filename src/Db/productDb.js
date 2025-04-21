import ProductMdl from "../models/Product.js";

const create = async (product) => {
  const result = await ProductMdl.create(product);
  return result.toJSON();
};

export default {
  create,
};
