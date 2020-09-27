const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { isDev } = require('../config/env');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: isDev ? 'trelloCloneDev' : 'trelloClone',
  },
});

const multerUpload = multer({ storage });

module.exports = {
  multerUpload,
};
