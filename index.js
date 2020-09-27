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

//db connection
dbConnect();

//middlewares
app.use(cors());
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
