const Boom = require('@hapi/boom');

const wrapError = (err, req, res, next) => {
  if (!err.isBoom) next(Boom.badImplementation(err));
  else next(err);
};

const errorConsole = (err, req, res, next) => {
  console.log(err.stack);

  next(err);
};

const errorHandler = (err, req, res, next) => {
  const {
    output: { statusCode, payload },
  } = err;

  res.status(statusCode).json(payload);
};

module.exports = {
  wrapError,
  errorConsole,
  errorHandler,
};
