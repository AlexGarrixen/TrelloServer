const Boom = require('@hapi/boom');
const Board = require('../models/board');
const List = require('../models/list');
const Card = require('../models/card');
const { deleteResources } = require('../utils/cloudinary');

const getLists = async (req, res, next) => {
  const { boardId } = req.query;
  let query = {};

  if (boardId) query.boardId = boardId;

  try {
    const lists = await List.find(query).populate('cards');
    res.status(201).json(lists);
  } catch (e) {
    next(e);
  }
};

const createList = async (req, res, next) => {
  const { boardId } = req.query;
  const { title } = req.body;
  const data = { boardId, notes: [], title };
  const list = new List(data);

  try {
    const board = await Board.findById(boardId);

    if (board === null)
      return next(Boom.notFound(`Not found board width id:${boardId}`));

    const listCreated = await list.save();

    res.status(201).json(listCreated);
  } catch (e) {
    next(e);
  }
};

const updateList = async (req, res, next) => {
  const { listId } = req.params;
  const { title, cards } = req.body;
  let query = {};

  if (title) query.title = title;
  if (cards) query.cards = cards;

  try {
    const list = await List.findById(listId);

    if (list === null)
      return next(Boom.notFound(`Not fount list with id:${listId}`));

    const newList = await List.findByIdAndUpdate(listId, query, {
      new: true,
    });

    res.status(200).json(newList);
  } catch (e) {
    next(e);
  }
};

const deleteList = async (req, res, next) => {
  const { listId } = req.params;

  try {
    const list = await List.findById(listId);

    if (list === null)
      return next(Boom.notFound(`Not found list with id:${listId}`));

    const listDeleted = await List.findByIdAndDelete(listId);
    const cards = await Card.find({ listId }, 'attachments');
    let attachmentsCards = [];

    cards.forEach(({ attachments }) =>
      attachments.forEach(({ publicId }) => attachmentsCards.push(publicId))
    );

    const promisesDeleteAttachments = attachmentsCards.map((publicId) =>
      deleteResources(publicId)
    );

    await Promise.all(promisesDeleteAttachments);
    await Card.deleteMany({ listId });

    res.status(200).json(listDeleted);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getLists,
  createList,
  updateList,
  deleteList,
};
