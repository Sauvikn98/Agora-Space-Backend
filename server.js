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
const {RefreshTokenRoutes} = require("./routes/RefreshTokenRoutes")
const app = express();
const server = require('http').createServer(app);
const setupSocket = require("./socket")
setupSocket(server);

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setting up cors, headers
app.use(cors());
app.use(compression());
app.use(UserRoutes);
app.use(PostRoutes);
app.use(SpaceRoutes);
app.use(CommentRoutes);
app.use(NotificationRoutes);
app.use(RefreshTokenRoutes);


const port = process.env.PORT || 5000;

server.listen(port, '0.0.0.0', err => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
}); 
