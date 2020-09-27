const { deleteResources } = require('../utils/cloudinary');

const handleAttachmentUpload = async (req, res, next) => {
  const { path, filename: id } = req.file;
  try {
    res.status(201).json({
      path,
      id,
    });
  } catch (e) {
    next(e);
  }
};

const deleteAttachment = async (req, res, next) => {
  const { attachmentId } = req.body;

  try {
    await deleteResources(attachmentId);

    res.status(200).json({
      deleted: true,
      attachmentId,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  handleAttachmentUpload,
  deleteAttachment,
};
