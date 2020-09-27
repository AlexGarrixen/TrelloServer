const Joi = require('joi');

const schemeCreateBoard = Joi.object({
  title: Joi.string().required(),
  picture: Joi.string().allow('').required(),
});

const schemeUpdateBoard = Joi.object({
  title: Joi.string(),
  picture: Joi.string().allow(''),
  description: Joi.string(),
});

const schemeDeleteBoard = Joi.object({
  boardId: Joi.string().required(),
});

module.exports = {
  schemeCreateBoard,
  schemeUpdateBoard,
  schemeDeleteBoard,
};
