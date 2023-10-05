const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");
const { UserRoutes } = require("./routes/UserRoutes");
const { PostRoutes } = require("./routes/PostRoutes");
const { SpaceRoutes } = require("./routes/SpaceRoutes");
const { CommentRoutes } = require("./routes/CommentRoutes");
const { NotificationRoutes } = require("./routes/NotificationRoutes");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(UserRoutes);
app.use(PostRoutes);
app.use(SpaceRoutes);
app.use(CommentRoutes);
app.use(NotificationRoutes);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
}); 