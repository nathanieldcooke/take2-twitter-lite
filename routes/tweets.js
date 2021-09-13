const express = require('express')
const { Tweet } = require('../db/models')
const asyncHandler = require('express-async-handler')

router = express.Router()

router.get("/", asyncHandler(async (req, res) => {
    const tweets = await Tweet.findAll()
    res.json({ tweets });
}));

router.get("/:id(\\d+)", asyncHandler(async (req, res, next) => {
    const tweetId = req.params.id;
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet) {
        res.json({ tweet });
    } else {
        err = new Error(`tweet with id: ${tweetId}, could not be found`);
        err.title = 'Tweet not found';
        err.status = 404;
        next(err);
    }
}));

module.exports = router