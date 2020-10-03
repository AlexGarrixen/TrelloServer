const Boom = require('@hapi/boom');
const List = require('../models/list');
const Card = require('../models/card');
const { deleteResources } = require('../utils/cloudinary');

const getCards = async (req, res, next) => {
  const { cardId } = req.query;
  let query = {};

  if (cardId) query.cardId = cardId;

  try {
    const cards = await Card.find(query);

    res.status(200).json(cards);
  } catch (e) {
    next(e);
  }
};

const createCard = async (req, res, next) => {
  const { listId } = req.query;
  const { title } = req.body;
  const pathDefaultPicture =
    'https://res.cloudinary.com/dxarbtyux/image/upload/v1601709268/trelloPlaceholders/placeholder_1_y0xhnv.png';

  const data = {
    listId,
    labels: [],
    attachments: [],
    title,
    description: '',
    picture: { path: pathDefaultPicture, publicId: '' },
  };

  try {
    const list = await List.findById(listId, 'cards boardId title');

    if (list === null)
      return next(Boom.notFound(`Not found list with id:${listId}`));

    const card = new Card({
      ...data,
      boardId: list.boardId,
      listName: list.title,
    });
    const cardCreated = await card.save();
    const newCards = [...list.cards, cardCreated._id];

    await List.findByIdAndUpdate(listId, { cards: newCards }, { new: true });

    res.status(201).json(cardCreated);
  } catch (e) {
    next(e);
  }
};

const createComment = async (req, res, next) => {
  const { cardId } = req.params;
  const { comment } = req.body;

  try {
    const card = await Card.findById(cardId, 'comments');

    if (card === null)
      return next(Boom.notFound(`Not found card width id:${cardId}`));

    const newComment = {
      description: comment,
      date: new Date(),
      cardId,
    };
    const newComments = [newComment, ...card.comments];

    const newCard = await Card.findByIdAndUpdate(
      cardId,
      {
        comments: newComments,
      },
      { new: true }
    );

    res.status(201).json({ newCard });
  } catch (e) {
    next(e);
  }
};

const createLabel = async (req, res, next) => {
  const { cardId } = req.params;
  const { title, color } = req.body;

  try {
    const card = await Card.findById(cardId, 'labels');

    if (card === null)
      return next(Boom.notFound(`Not found card with id:${cardId}`));

    const newLabels = [{ title, color }, ...card.labels];

    const newCard = await Card.findByIdAndUpdate(
      cardId,
      { labels: newLabels },
      { new: true }
    );

    res.status(200).json({ newCard });
  } catch (e) {
    next(e);
  }
};

const updateCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { title, description, listId, picture } = req.body;
  let query = {};

  if (title) query.title = title;
  if (description) query.description = description;
  if (listId) query.listId = listId;
  if (picture) query.picture = picture;

  try {
    const card = await Card.findById(cardId);

    if (card === null)
      return next(Boom.notFound(`Not found card with id:${cardId}`));

    const newCard = await Card.findByIdAndUpdate(cardId, query, {
      new: true,
    });

    res.status(200).json({ newCard });
  } catch (e) {
    next(e);
  }
};

const updateComment = async (req, res, next) => {
  const { commentId, cardId } = req.params;
  const { newComment } = req.body;

  try {
    const card = await Card.findById(cardId, 'comments');

    if (card === null)
      return next(Boom.notFound(`Not found card width id:${commentId}`));

    const newComments = card.comments.map((comment) => {
      if (comment._id == commentId) {
        comment.description = newComment;
        return comment;
      }
      return comment;
    });

    const newCard = await Card.findByIdAndUpdate(
      cardId,
      { comments: newComments },
      { new: true }
    );

    res.status(200).json({ newCard });
  } catch (e) {
    next(e);
  }
};

const handleAttachmentsUploaded = async (req, res, next) => {
  const { originalname, path, filename: publicId } = req.file;
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId, 'attachments');

    if (card === null)
      return next(Boom.notFound(`Not found card with id:${cardId}`));

    const newCard = await Card.findByIdAndUpdate(
      cardId,
      {
        picture: { path, publicId },
        attachments: [
          { originalname, path, publicId, date: new Date() },
          ...card.attachments,
        ],
      },
      { new: true }
    );

    res
      .status(200)
      .json({ newCard, attachmentUploaded: { originalname, path, publicId } });
  } catch (e) {
    next(e);
  }
};

const deleteLabel = async (req, res, next) => {
  const { cardId, labelId } = req.params;

  try {
    const card = await Card.findById(cardId, 'labels');

    if (card === null)
      return next(Boom.notFound(`Not found card with id:${cardId}`));

    const newLabels = card.labels.filter((label) => label._id != labelId);

    const newCard = await Card.findByIdAndUpdate(
      cardId,
      { labels: newLabels },
      { new: true }
    );

    res.status(200).json({ newCard });
  } catch (e) {
    next(e);
  }
};

const deleteAttachent = async (req, res, next) => {
  const { cardId } = req.params;
  const { publicId } = req.body;

  try {
    const card = await Card.findById(cardId, 'attachments picture');

    if (card === null)
      return next(Boom.notFound(`Not found card with id:${cardId}`));

    await deleteResources(publicId);
    const query = {};
    const cardPictureCurrent = card.picture;

    if (cardPictureCurrent.publicId === publicId)
      query.picture = { path: '', publicId: '' };

    const newAttachments = card.attachments.filter(
      (attachment) => attachment.publicId !== publicId
    );
    query.attachments = newAttachments;

    const newCard = await Card.findByIdAndUpdate(cardId, query, { new: true });

    res.status(200).json({
      deleted: true,
      newCard,
    });
  } catch (e) {
    next(e);
  }
};

const deleteComment = async (req, res, next) => {
  const { commentId, cardId } = req.params;

  try {
    const card = await Card.findById(cardId, 'comments');

    if (card === null)
      return next(Boom.notFound(`Not found card width id:${commentId}`));

    const newComments = card.comments.filter(
      (comment) => comment._id != commentId
    );

    const newCard = await Card.findByIdAndUpdate(
      cardId,
      { comments: newComments },
      { new: true }
    );

    res.status(200).json({ newCard });
  } catch (e) {
    next(e);
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const cardDeleted = await Card.findByIdAndDelete(cardId);

    if (cardDeleted === null)
      return next(Boom.notFound(`Not found card with id:${cardId}`));

    const list = await List.findById(cardDeleted.listId, 'cards');
    const newCards = list.cards.filter((id) => id !== cardId);

    await List.findByIdAndUpdate(cardDeleted.listId, { cards: newCards });

    const promisesDeleteAttachments = cardDeleted.attachments.map(
      ({ publicId }) => publicId && deleteResources(publicId)
    );

    await Promise.all(promisesDeleteAttachments);

    res.status(200).json(cardDeleted);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  updateCard,
  createLabel,
  handleAttachmentsUploaded,
  deleteAttachent,
  createComment,
  updateComment,
  deleteComment,
  deleteLabel,
};
