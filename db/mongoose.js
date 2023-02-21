const mongoose = require("mongoose")
const {remote_db} = require("../config.js");

mongoose
    .connect(remote_db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=> {
        console.log("MongoDB connected successfully...");
    })
    .catch((e) => {
        console.log(e);
    });