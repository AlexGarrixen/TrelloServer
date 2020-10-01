const Boom = require('@hapi/boom');
const Board = require('../models/board');
const List = require('../models/list');
const Card = require('../models/card');
const { deleteResources } = require('../utils/cloudinary');

const getBoards = async (req, res, next) => {
  const { boardId } = req.query;
  let query = {};

  if (boardId) query._id = boardId;

  try {
    const response = await Board.find(query).populate(
      boardId && {
        path: 'lists',
        populate: { path: 'cards' },
      }
    );

    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

const createBoard = async (req, res, next) => {
  const { title, picture } = req.body;
  const placeholderPicture =
    'https://res.cloudinary.com/dxarbtyux/image/upload/v1600541466/trelloPlaceholders/placeholder_600x400_z3stnz.svg';
  const board = new Board({
    title,
    picture: {
      path: picture.path || placeholderPicture,
      publicId: picture.publicId || '',
    },
    description: '',
    lists: [],
  });

  try {
    const response = await board.save();
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

const updateBoard = async (req, res, next) => {
  const { boardId } = req.params;
  const { title, picture, description, lists } = req.body;
  let query = {};

  if (title) query.title = title;
  if (picture) query.picture = picture;
  if (description) query.description = description;
  if (lists) query.lists = lists;

  try {
    const board = await Board.findById(boardId);

    if (board === null)
      return next(Boom.notFound(`Not found board with id:${boardId}`));

    const newBoard = await Board.findByIdAndUpdate(boardId, query, {
      new: true,
    });

    res.status(200).json(newBoard);
  } catch (e) {
    next(e);
  }
};

const deleteBoard = async (req, res, next) => {
  const { boardId } = req.params;

  try {
    const board = await Board.findById(boardId);

    if (board === null)
      return next(Boom.notFound(`Not found board with id:${boardId}`));

    const boardDeleted = await Board.findByIdAndDelete(boardId);

    let attachmentsIds = [];
    board.picture.publicId && attachmentsIds.push(board.picture.publicId);

    const cards = await Card.find({ boardId }, 'attachments');

    cards.forEach(({ attachments }) =>
      attachments.forEach(({ publicId }) => attachmentsIds.push(publicId))
    );

    const promisesDeleteAttachments = attachmentsIds.map((publicId) =>
      deleteResources(publicId)
    );

    await List.deleteMany({ boardId });
    await Card.deleteMany({ boardId });
    await Promise.all(promisesDeleteAttachments);

    res.status(200).json(boardDeleted);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
};
