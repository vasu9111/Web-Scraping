import Joi from "joi";
const searchSchema = Joi.object({
  keyword: Joi.string().trim().min(1).required(),
});

export default {
  searchSchema,
};
