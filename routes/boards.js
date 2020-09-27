const { Router } = require('express');
const {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} = require('../controllers/boards');
const validationScheme = require('../middlewares/validationScheme');
const {
  schemeCreateBoard,
  schemeUpdateBoard,
  schemeDeleteBoard,
} = require('../utils/validationSchemes/boards');

const boards = (app) => {
  const router = Router();

  app.use('/boards', router);

  router.get('/', getBoards);

  router.post('/', validationScheme(schemeCreateBoard), createBoard);

  router.put('/:boardId', validationScheme(schemeUpdateBoard), updateBoard);

  router.delete(
    '/:boardId',
    validationScheme(schemeDeleteBoard, 'params'),
    deleteBoard
  );
};

module.exports = boards;
