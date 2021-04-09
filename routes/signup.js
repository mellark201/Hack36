const express = require('express');
const router = express.Router();
const log = require('../middleware');
const Proposal = require('../models/proposals');

router.get('/:id', log.isLoggedIn, log.hasSpaceLeft, async(req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);
        console.log(req.user.id);
        console.log(proposal.createId);
        if(req.user.proposalId.length<3 && !req.user.proposalId.includes(req.params.id) && req.user.id !== proposal.createId) {
            proposal.developerId.push(req.user.id);
            proposal.save();
            req.user.projectId.push(req.params.id);
            await req.user.save();
            console.log('New Proposal');
        }
        res.redirect(`/profile/${req.user.id}?join=` + proposal.id);
    } catch(err) {
        console.log(err);
        res.redirect('/proposal/<%=req.params.id%>?er=' + encodeURIComponent('Could Not Signup'));
    }
})

module.exports = router