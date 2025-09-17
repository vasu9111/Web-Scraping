const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errorMessage = [];
      for (let detail of error.details) {
        errorMessage.push(detail.message);
      }
      res.status(400).json({ error: errorMessage });
    }
  };
};
export default {
  validate,
};
