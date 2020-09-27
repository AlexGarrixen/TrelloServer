const Boom = require('@hapi/boom');

const validationScheme = (schema, source = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[source]);

  error ? next(Boom.badRequest(error)) : next();
};

module.exports = validationScheme;
