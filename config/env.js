require('dotenv').config();

const isDev = process.env.NODE_ENV !== 'production';

const env = {
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUDNAME,
  cloudinaryApiKey: process.env.CLOUDINARY_APIKEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_APISECRET,
  mongoUser: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoDbName: isDev ? process.env.MONGO_DBNAME_DEV : process.env.MONGO_DBNAME,
  isDev,
};

module.exports = env;
