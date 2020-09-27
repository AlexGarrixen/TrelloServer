const Boom = require('@hapi/boom');
const { cloudinary } = require('../../config/cloudinary');

const deleteResources = (publicId) =>
  new Promise((res, rej) => {
    cloudinary.api.delete_resources([publicId], (err, result) => {
      if (err) rej(err);
      else {
        switch (result.deleted[publicId]) {
          case 'not_found':
            rej(Boom.notFound('Image not found'));
            break;
          case 'deleted':
            res(result);
            break;
          default:
            rej(Boom.badImplementation());
        }
      }
    });
  });

module.exports = {
  deleteResources,
};
