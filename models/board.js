const { Schema, model } = require('mongoose');

const schemaBoard = Schema({
  title: String,
  description: String,
  picture: String,
});

const Board = model('Board', schemaBoard);

module.exports = Board;
