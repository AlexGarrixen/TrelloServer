const { Router } = require('express');

const routeRoot = (app) => {
  const router = Router();

  app.use('/', router);

  router.get('/', (req, res, next) => {
    res.send('Server Root');
  });
};

module.exports = routeRoot;
