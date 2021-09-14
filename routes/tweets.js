const express = require('express')
const { Tweet } = require('../db/models')
const asyncHandler = require('express-async-handler')
const { check, validationResult } = require('express-validator')


router = express.Router()

const tweetValidators = [
    check('message')
        .exists({ checkFalsy: true })
        .withMessage('Tweet must exist')
        .isLength({ max: 280 })
        .withMessage('Must be length >= 280 characters')
]

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => error.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }
    next();
};

const tweetNotFoundError = (tweetId) => {
    err = new Error(`tweet with id: ${tweetId}, could not be found`);
    err.title = 'Tweet not found';
    err.status = 404;
    return err
}

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
        err = tweetNotFoundError(tweetId)
        next(err);
    }
}));

router.post("/", tweetValidators, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const { message } = req.body
    const newTweet = await Tweet.create({
        message
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