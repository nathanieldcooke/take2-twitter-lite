const express = require('express')

router = express.Router()

router.get("/", (req, res) => {
    res.json({message: 'test root index'})
});

module.exports = router