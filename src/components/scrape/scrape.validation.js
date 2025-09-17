import Joi from "joi";
const searchSchema = Joi.object({
  keyword: Joi.string().min(1).required(),
});

export default {
  searchSchema,
};
