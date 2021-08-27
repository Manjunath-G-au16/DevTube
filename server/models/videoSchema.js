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
    thumbnail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "approved",
    },
    comments: [
        {
            comment: {
                type: String,
            },
            commentBy: {
                type: String,
            },
        },
    ],
});

//Comments Storing function
//-------------------------
videoSchema.methods.addComment = async function (comment, commentBy) {
    try {
        this.comments = this.comments.concat({ comment, commentBy });
        await this.save();
        return this.comments;
    } catch (error) {
        console.log(error);
    }
};
const Video = mongoose.model("VIDEO", videoSchema);

module.exports = Video;
