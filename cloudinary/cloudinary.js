const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/";
    if (fs.existsSync(dir)) {
      console.log("The path exists.");
      return cb(null, dir);
    } else {
      return fs.mkdir(dir, (error) => cb(error, dir));
    }
  },
  filename: (req, file, cb) => {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, "-");
    cb(null, date + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  //dest:'uploads/',
  limits: { fileSize: 4 * 1024 * 1024 }, //4 * 1024 * 1024 = 4MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("file not supported"), false);
    }
  },
});

const deleteFile = (file) => {
  fs.unlink("./uploads/" + file, function (err) {
    if (err && err.code == "ENOENT") {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
};

module.exports = {
  upload,
  deleteFile,
};
