const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../models/user');
const Proposals = require('../models/proposals');
const log = require('../middleware');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

//New Proposal Page
router.get('/new', log.isLoggedIn, log.hasSpaceLeft, log.hasAllDetail, async(req, res) => {
    const url = `https://api.github.com/users/${req.user.username}/repos`;
    const response = await fetch(url);
    const result = await response.json();
    let arr = [];
    result.forEach(i => {
        if(!req.user.alreadyUsedRepos.includes(i.name))
            arr.push(i.name);
    })
    if(result.length===0) {
        const proposals = await Proposals.find({});
        res.redirect('/?er=' + encodeURIComponent('You have no repositores. Add one to start'));
    } else {
        var message;
        if(req.query.er === undefined)
            message='';
        else
            message = req.query.id;
        res.render('proposals/new', {proposal: new Proposals(), repos: arr, errorMessage: message, isLog: req.user!=undefined})
    }
})

//Saving Proposals
router.post('/', async(req, res) => {
    const user = req.user;
    const proposal = new Proposals({
        title: req.body.title,
        organization: user.username,
        description: req.body.description,
        contact: user.email,
        deadline: new Date(req.body.deadline),
        createId: req.user.id,
        techStack: req.body.techstack,
        githubRepoName: req.body.repo,
        githubUserName: req.user.username
    })
    if(req.body.cover!=null && req.body.cover!='')
        saveCover(proposal, req.body.cover);
    try {
        const newProposal = await proposal.save();
        req.user.proposalId.push(proposal.id);
        req.user.alreadyUsedRepos.push(req.body.repo);
        await req.user.save();
        res.redirect('/');
    } catch(err) {
        console.log(err);
        res.redirect('/?er=' + encodeURIComponent('Some Error Occured. Please try again'));
    }
})

router.get('/all', async(req, res) => {
    const proposals = await Proposals.find({});
    res.render('proposals/all', {proposals: proposals, errorMessage: '', isLog: req.user!==undefined});
})

//Show Proposal
router.get('/:id', async(req, res) => {
    const proposal = await Proposals.findById(req.params.id);
    const user = await User.findById(proposal.createId);
    var message;
    if(req.query.er === undefined)
        message='';
    else
        message = req.query.er;
    res.render('proposals/show', {proposal:proposal, developer:user, user:req.user, errorMessage: message, isLog: req.user!==undefined})
})

//Edit Proposal
router.get('/:id/edit', log.isLoggedIn, async(req, res) => {
    const proposal = await Proposals.findById(req.params.id);
    if(req.user.id===proposal.createId)
        res.render('proposals/edit', {proposal:proposal, repos:[], errorMessage:''});
    else
        res.redirect(`/proposal/${req.params.id}?er=` + encodeURIComponent('You dont have access to edit this'));
})

//Get All Proposal
router.get('/all', async(req, res) => {
    const proposal = await Proposals.findById(req.params.id);
    var message = '';
    if(req.query.er !==undefined)
        message = req.query.er;
    res.render('/proposals/all', {proposals: proposal, errorMessage: message, isLog: req.user!==undefined});
})

//Edit Proposal
router.put('/:id', async(req, res) => {
    let temp;
    try {
        temp = await Proposals.findById(req.params.id);
        temp.title = req.body.title;
        temp.description = req.body.description;
        temp,techStack = req.body.techstack;
        temp.deadline = new Date(req.body.deadline);
        if(req.body.cover != null && req.body.cover!='')
            saveCover(temp, req.body.cover);
        await temp.save();
        res.redirect(`/proposal/${req.params.id}?er=` + encodeURIComponent('Details Updated'));
    } catch(err) {
        console.log(err);
        res.redirect('/?er=' + encodeURIComponent('Failed to Update'));
    }
})

router.delete('/:id', log.isLoggedIn, async (req, res) => {
    deleteProposal(req.params.id);
    res.redirect('/?er=' + encodeURIComponent('Proposal Deleted'));
})

function saveCover(proposal, picEncoded) {
    if(picEncoded == null) return
    const pic = JSON.parse(picEncoded)
    if(pic != null && imageMimeTypes.includes(pic.type)) {
        proposal.coverImage = new Buffer.from(pic.data, 'base64');
        console.log(proposal.coverImage);
        console.log("type");
        console.log(pic.type);
        proposal.coverImageType = pic.type;
    }
}

async function deleteProposal(pid) {
    const proposal = await Proposals.findById(pid);
    const creator = await User.findById(proposal.createId);
    deleteIndex(creator.proposalId, proposal.id);
    deleteIndex(creator.alreadyUsedRepos, proposal.githubRepoName);
    creator.save();
    for(const id of proposal.developerId) {
        const developer = await User.findById(id);
        deleteIndex(developer.projectId, proposal.id);
        developer.save();
    }
    await proposal.delete();
}

function deleteIndex(array, compId) {
    const index = array.findIndex(function(id) {
        return id === compId;
    })
    array.splice(index, 1);
}

module.exports = router