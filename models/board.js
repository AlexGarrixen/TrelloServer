const { Schema, model, Types } = require('mongoose');

const schemaBoard = Schema({
  title: String,
  description: String,
  picture: {
    path: String,
    publicId: String,
  },
  lists: [{ type: Types.ObjectId, ref: 'List' }],
});

const Board = model('Board', schemaBoard);

module.exports = Board;
