const { Router } = require('express');
const { multerUpload } = require('../middlewares/multerUpload');
const validationSchema = require('../middlewares/validationScheme');
const {
  schemeDeleteAttachment,
} = require('../utils/validationSchemes/attachments');
const {
  handleAttachmentUpload,
  deleteAttachment,
} = require('../controllers/attachments');

const attachments = (app) => {
  const router = Router();

  app.use('/attachments', router);

  router.post('/', multerUpload.single('attachment'), handleAttachmentUpload);

  router.delete(
    '/',
    validationSchema(schemeDeleteAttachment),
    deleteAttachment
  );
};

module.exports = attachments;
