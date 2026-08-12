const { z } = require('zod');
const { AppError } = require('./errorHandler');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Validation failed: ${errorMessages}`, 400));
    }
    next(err);
  }
};

module.exports = { validate };
