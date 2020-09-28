const { Schema, model } = require('mongoose');

const schemaBoard = Schema({
  title: String,
  description: String,
  picture: {
    path: String,
    publicId: String,
  },
});

const Board = model('Board', schemaBoard);

module.exports = Board;
