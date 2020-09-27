const { Schema, Types, model } = require('mongoose');

const schemaList = Schema({
  boardId: Types.ObjectId,
  title: String,
  cards: [{ type: Types.ObjectId, ref: 'Card' }],
});

const List = model('List', schemaList);

module.exports = List;
