const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Proposals = require('../models/proposals');
const log = require('../middleware');
const socket = require('./socket');

router.get('/landing', async (req, res) => {
    res.render("landing", {isLog: false});
})

router.get('/about', async(req, res) => {
    res.render('about_us/team', {isLog: false});
})

//Base Page Router
router.get('/', async(req, res) => {
    console.log(req.user);
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
    let active = '';
    let deactive = '';
    if(req.query.active !== undefined)
        active = req.query.active;
    if(req.query.deactive !== undefined)
        deactive = req.query.deactive;
    res.render('index', {user: req.user, proposals: proposals, errorMessage: message, isLog: req.user!==undefined, active: active, deactive:deactive});
})

router.get('/logout', log.isLoggedIn, async(req, res) => {
    req.user.isActive = false;
    await req.user.save();
    const id = req.user.id;
    req.logout();
    res.redirect('/?deactive=' + encodeURIComponent(id));
})

router.get('/dashboard/about', (req, res) => {
    res.render('/profile/admin', {errorMessage: '', isLog: req.user !== undefined});
})

module.exports = router