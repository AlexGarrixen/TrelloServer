const Joi = require('joi');

const schemeCreateCard = Joi.object({
  title: Joi.string().min(1).required(),
});

const schemeUpdateCard = Joi.object({
  title: Joi.string().min(1),
  description: Joi.string().min(1),
  picture: Joi.object({
    path: Joi.string(),
    publicId: Joi.string(),
  }),
  listId: Joi.string(),
});

const schemeCreateLabel = Joi.object({
  title: Joi.string().min(1).required(),
  color: Joi.string().required(),
});

const schemeCreateComment = Joi.object({
  comment: Joi.string().min(1).required(),
});

const schemeUpdateComment = Joi.object({
  newComment: Joi.string().required(),
});

const schemeDeleteLabel = Joi.object({
  cardId: Joi.string().required(),
  labelId: Joi.string().required(),
});

module.exports = {
  schemeCreateCard,
  schemeUpdateCard,
  schemeUpdateComment,
  schemeCreateLabel,
  schemeCreateComment,
  schemeDeleteLabel,
};
