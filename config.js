const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  remote_db: process.env.MONGODB_ATLAS_URI,
  port: process.env.PORT,
};