const { Router } = require('express');
const { multerUpload } = require('../middlewares/multerUpload');
const {
  createCard,
  createComment,
  getCards,
  updateCard,
  deleteCard,
  handleAttachmentsUploaded,
  createLabel,
  updateComment,
  deleteAttachent,
  deleteComment,
  deleteLabel,
} = require('../controllers/cards');
const {
  schemeCreateCard,
  schemeCreateComment,
  schemeCreateLabel,
  schemeUpdateCard,
  schemeUpdateComment,
  schemeDeleteLabel,
} = require('../utils/validationSchemes/cards');
const validationScheme = require('../middlewares/validationScheme');

const routeCards = (app) => {
  const router = Router();

  app.use('/cards', router);

  router.get('/', getCards);

  router.post('/', validationScheme(schemeCreateCard), createCard);

  router.put('/:cardId', validationScheme(schemeUpdateCard), updateCard);

  router.put(
    '/:cardId/labels',
    validationScheme(schemeCreateLabel),
    createLabel
  );

  router.put(
    '/:cardId/comments',
    validationScheme(schemeCreateComment),
    createComment
  );

  router.put(
    '/:cardId/comments/:commentId',
    validationScheme(schemeUpdateComment),
    updateComment
  );

  router.put(
    '/:cardId/attachments',
    multerUpload.single('attachment'),
    handleAttachmentsUploaded
  );

  router.delete('/:cardId/attachments', deleteAttachent);

  router.delete('/:cardId', deleteCard);

  router.delete('/:cardId/comments/:commentId', deleteComment);

  router.delete(
    '/:cardId/labels/:labelId',
    validationScheme(schemeDeleteLabel, 'params'),
    deleteLabel
  );
};
module.exports = routeCards;
