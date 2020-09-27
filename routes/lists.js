const { Router } = require('express');
const {
  getLists,
  createList,
  updateList,
  deleteList,
} = require('../controllers/lists');
const {
  schemeCreateList,
  schemaUpdateList,
} = require('../utils/validationSchemes/lists');
const validationScheme = require('../middlewares/validationScheme');

const routeLists = (app) => {
  const router = Router();

  app.use('/lists', router);

  router.get('/', getLists);

  router.post('/', validationScheme(schemeCreateList), createList);

  router.put('/:listId', validationScheme(schemaUpdateList), updateList);

  router.delete('/:listId', deleteList);
};

module.exports = routeLists;
