const Boom = require('@hapi/boom');

const notFound = (req, res, next) => {
  const {
    output: { statusCode, payload },
  } = Boom.notFound();

  res.status(statusCode).json(payload);
};

module.exports = notFound;
