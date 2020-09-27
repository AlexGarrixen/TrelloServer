const { Schema, Types, model } = require('mongoose');

const schemeCard = Schema({
  listId: Types.ObjectId,
  listName: String,
  boardId: Types.ObjectId,
  title: String,
  description: String,
  picture: { publicId: String, path: String },
  labels: [{ title: String, color: String }],
  attachments: [
    { path: String, publicId: String, originalname: String, date: String },
  ],
  comments: [{ description: String, cardId: Types.ObjectId, date: String }],
});

const Card = model('Card', schemeCard);

module.exports = Card;
