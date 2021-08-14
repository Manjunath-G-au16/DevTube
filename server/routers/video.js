const express = require("express");
const videoRouter = express.Router();
require("../db/conn");
const Video = require("../models/videoSchema");
const Authenticate = require("../middleware/authenticate");
videoRouter.use(express.json())

//Display Videos 
//-----------------------------------------
videoRouter.get("/videos", Authenticate, async (req, res) => {
    try {
        videos = await Video.find({ status: "approved" });
        res.status(200).send(videos);
    } catch (err) {
        res.status(500).send(err)
    }
});

//Display video by ID 
//-----------------------------------------
videoRouter.get("/video/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        video = await Video.findOne({ _id: _id });
        res.status(200).send(video);
    } catch (err) {
        res.status(500).send(err)
    }
});

//Display My Videos 
//-----------------------------------------
videoRouter.get("/myVideos", Authenticate, async (req, res) => {
    const videoBy = req.rootUser.email
    try {
        videos = await Video.find({ videoBy: videoBy });
        res.status(200).send(videos);
    } catch (err) {
        res.status(500).send(err)
    }
});

//Upload Video 
//-----------------------------------------
videoRouter.post("/uploadVideo", Authenticate, async (req, res) => {
    const videoBy = req.rootUser.email
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
        return res.status(422).json({ Error: "plz fill the fields properly" });
    }
    try {
        const video = new Video({ videoBy, title, description, url });
        await video.save();
        res.status(201).json({ message: "Video uploaded successfully" });
    } catch (err) {
        res.status(500).send(err)
    }
});

//Edit Video
//--------------------
videoRouter.put("/editVideo/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        const video = await Video.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        res.status(200).send(video)
    } catch (err) {
        res.status(500).send(err)
    }
});

//Delete Video
//--------------------
videoRouter.delete("/deleteVideo/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        const video = await Video.findByIdAndDelete(_id)
        res.status(200).json({ message: "Video deleted successfully" })
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = videoRouter;