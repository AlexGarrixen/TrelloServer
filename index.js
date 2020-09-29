const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const routeBoards = require('./routes/boards');
const routeAttachments = require('./routes/attachments');
const routeLists = require('./routes/lists');
const routeCards = require('./routes/cards');
const routeRoot = require('./routes/root');
const dbConnect = require('./db/config');
const notFound = require('./middlewares/notFound');
const {
  wrapError,
  errorConsole,
  errorHandler,
} = require('./middlewares/errors');
const env = require('./config/env');

//db connection
dbConnect();

//middlewares
const whitelist = [
  'https://trello-clone-js.vercel.app',
  'https://trello-clone-next.vercel.app',
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!env.isDev) {
        const originAllowed = whitelist.indexOf(origin) !== -1;
        originAllowed ? cb(null, true) : cb(new Error('Not allowed by CORS'));
      } else cb(null, true);
    },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//routes
routeRoot(app);
routeBoards(app);
routeAttachments(app);
routeLists(app);
routeCards(app);

//error middlewares
app.use(errorConsole);
app.use(wrapError);
app.use(errorHandler);

//404
app.use(notFound);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`ready server on port ${port}`);
});
