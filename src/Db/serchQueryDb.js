import searchQuery from "../models/searchQuery.js";

const create = async (product) => {
  const result = await searchQuery.create(product);
  return result.toJSON();
};
export default {
  create,
};
