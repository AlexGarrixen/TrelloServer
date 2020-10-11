const Joi = require('joi');

const schemeCreateBoard = Joi.object({
  title: Joi.string().required(),
  picture: Joi.object({
    path: Joi.string().allow('').required(),
    publicId: Joi.string().allow('').required(),
  }).required(),
});

const schemeUpdateBoard = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  lists: Joi.array(),
});

const schemeDeleteBoard = Joi.object({
  boardId: Joi.string().required(),
});

module.exports = {
  schemeCreateBoard,
  schemeUpdateBoard,
  schemeDeleteBoard,
};
