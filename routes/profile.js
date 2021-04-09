const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Proposal = require('../models/proposals');
const log = require('../middleware');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const socket = require('./socket');

router.get('./:id', log.isLoggedIn, async (req, res) => {
    try {
        let arr = [];
        for(const id of req.user.proposalId) {
            const proposal = await Proposal.findById(id);
            arr.push(proposal);
        }
        let arr2 = [];
        for(const id of req.user.projectId) {
            const proposal = await Proposal.findById(id);
            arr2.push(proposal);
        }
        var message;
        if(req.query.err === undefined)
            message = '';
        else
            message = req.query.er;
        res.render('profile/index', {user:req.user, project:arr2, proposals:arr, errorMessage: message, isLog: req.user!==undefined})
    } catch(err) {
        console.log(err);
        const proposals = await Proposal.findById({});
        res.redirect('/?er=' + encodeURIComponent('Could Not Load Page'));
    }
})

router.get('/:id/edit', log.isLoggedIn, (req, res) => {
    res.render('profile/edit', {user: req.user, errorMessage: message, isLog: req.user!==undefined});
})

router.delete('/:id', log.isLoggedIn, async(req, res) => {
    await User.findByIdAndDelete(req.params.id);
    const proposals = await Proposal.find({});
    res.render('index', {user: req.user, proposals: proposal, errorMessage: 'User Deleted', isLog: req.user!==undefined});
})

router.get('/leave/:proposalId', log.isLoggedIn, async(req, res) => {
    const proposal = await Proposal.findById(req.params.proposalId);
    delilah(proposal.developerId, req.user.id);
    await proposal.save();
    delilah(req.user.projectId, proposal.id);
    await req.user.save();
    res.redirect(`/profile/${req.user.id}?leave=${proposal.id}`);
})

router.put('/:id', async(req, res) => {
    let temp;
    try {
        temp = await User.findById(req.user.id);
        temp.name = req.body.name;
        temp.email = req.body.email;
        temp.linkedIn = req.body.linkedin !== '' ? req.body.linkedin : temp.username,
        temp.twitter = req.body.twitter !== '' ? req.body.twitter : temp.username,
        temp.other = req.body.other !== '' ? req.body.other : temp.username
        console.log(temp);
        await temp.save();
        res.redirect(`/profile/${temp.id}`);
    } catch(err) {
        console.log(err);
        res.redirect('/?er=' + encodeURIComponent('Could Not Load Page'));
    }
})


function saveProfilePic(user, picEncoded) {
    if(picEncoded == null) return
    const pic = JSON.parse(picEncoded)
    if(pic!=null && imageMimeTypes.includes(pic.type)) {
        user.profilePic = new Buffer.from(pic.data, 'base64');
        user.profilePicType = pic.type;
    }
}

function delilah(array, value) {
    const index = array.findIndex(function(val) {
        return val === value;
    })
    array.splice(index, 1);
}

module.exports = router