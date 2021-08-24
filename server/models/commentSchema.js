const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    videoID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    replys: [
        {
            name: {
                type: String
            },
            email: {
                type: String
            },
            reply: {
                type: String
            },
        },
    ],
});

//Comments Storing function
//-------------------------
commentSchema.methods.addReply = async function (reply, name, email) {
    try {
        this.replys = this.replys.concat({ reply, name, email });
        await this.save();
        return this.replys;
    } catch (error) {
        console.log(error);
    }
};

const Comment = mongoose.model("COMMENT", commentSchema);

module.exports = Comment;
