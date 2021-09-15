const express = require('express')
const asyncHandler = require('express-async-handler')

const { Tweet } = require('../db/models')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../utils')
const { requireAuth } = require("../auth");


router = express.Router()

router.use(requireAuth);

const tweetValidators = [
    check('message')
        .exists({ checkFalsy: true })
        .withMessage('Tweet must exist')
        .isLength({ max: 280 })
        .withMessage('Must be length >= 280 characters')
]

const tweetNotFoundError = (tweetId) => {
    err = new Error(`tweet with id: ${tweetId}, could not be found`);
    err.title = 'Tweet not found';
    err.status = 404;
    return err
}

router.get("/", asyncHandler(async (req, res) => {
    const tweets = await Tweet.findAll({
        include: [{ model: User, as: "user", attributes: ["username"] }],
        order: [["createdAt", "DESC"]],
        attributes: ["message"],
    });
    res.json({ tweets });
}));

router.get("/:id(\\d+)", asyncHandler(async (req, res, next) => {
    const tweetId = req.params.id;
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet) {
        res.json({ tweet });
    } else {
        err = tweetNotFoundError(tweetId)
        next(err);
    }
}));


router.post("/", tweetValidators, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const { message } = req.body
    const newTweet = await Tweet.create({
        message,
        userId: req.user.id
    })
    res.json({newTweet})
}))

router.put('/:id(\\d+)', tweetValidators, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { message } = req.body;
    const updatedTweet = await Tweet.update(
    {
        message
    },
    { 
        where: {
            id
        }
    })

    if (updatedTweet[0]) {
        res.json({ updatedTweet })
    } else {
        const err = tweetNotFoundError(id);
        next(err)
    }

}))

router.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const delTweet = await Tweet.destroy({
        where: { id } 
    }) 

    if (delTweet) {
        res.json({ delTweet });
    } else {
        const err = tweetNotFoundError(id);
        next(err)
    }
}))

module.exports = router