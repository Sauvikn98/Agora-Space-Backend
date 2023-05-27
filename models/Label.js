const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    color: {
        type: String,
    },
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "space",
        required: true,
    }
});

module.exports = labelSchema;
