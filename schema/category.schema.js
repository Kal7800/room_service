const joi = require('joi');

const id = joi.string().min(4).max(7);

const getCategory = joi.object({
  id,
});

module.exports = { getCategory };
