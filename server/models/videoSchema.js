const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    videoBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "approved",
    }
});

const Video = mongoose.model("VIDEO", videoSchema);

module.exports = Video;
