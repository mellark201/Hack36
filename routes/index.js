const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hello There');
})

module.exports = router