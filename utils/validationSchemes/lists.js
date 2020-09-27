const Joi = require('joi');

const schemeCreateList = Joi.object({
  title: Joi.string().required(),
});

const schemaUpdateList = Joi.object({
  title: Joi.string(),
  cards: Joi.array().items(Joi.string()),
});

module.exports = {
  schemeCreateList,
  schemaUpdateList,
};
