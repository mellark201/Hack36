const express = require('express');
const router = express.Router();

router.get('/landing', async (req, res) => {
    res.render("landing");
})

router.get('/', async(req, res) => {
    res.render("index");
})

module.exports = router