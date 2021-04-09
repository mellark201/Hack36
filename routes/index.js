const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Proposals = require('../models/proposals');
const log = require('../middleware');

router.get('/landing', async (req, res) => {
    res.render("landing");
})

//Base Page Router
router.get('/', async(req, res) => {
    let info;
    let proposals;
    try {
        info = await User.find({});
        proposals = await Proposals.find({}).sort({createdAt: 'desc'}).limit(10).exec();
    } catch {
        console.log('Not feasible');
    }
    console.log(req.query);
    if(req.query.er === undefined)
        message = '';
    else
        message = req.query.er;
    res.render('index', {user: req.user, proposals: proposals, errorMessage: message, isLog: req.user!==undefined});
})

router.get('/logout', log.isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/');
})

router.get('/about', (req, res) => {
    res.render('/profile/admin', {errorMessage: '', isLog: req.user !== undefined});
})

module.exports = router