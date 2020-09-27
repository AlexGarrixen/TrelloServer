const mongoose = require('mongoose');
const { mongoUser, mongoPassword, mongoDbName } = require('../config/env');

const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@trello.lslge.mongodb.net/${mongoDbName}?retryWrites=true&w=majority`;

const connection = () => {
  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('db connection success');
  } catch (e) {
    console.log(e);
    throw new Error('error db connection ');
  }
};

module.exports = connection;
