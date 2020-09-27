const Joi = require('joi');

const schemeDeleteAttachment = Joi.object({
  attachmentId: Joi.string().required(),
});

module.exports = {
  schemeDeleteAttachment,
};
