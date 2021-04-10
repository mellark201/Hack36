const express = require('express');
const Proposals = require('../models/proposals');
const router = express.Router();
const log = require('../middleware');

router.get('/:a/:b', log.isLoggedIn, async(req, res) => {
    const proposal = await Proposals.findById(req.params.a);
    if(proposal.developerId.includes(req.params.b) || proposal.createId === req.params.b)
        res.render('check/show', {proposal: proposal, errorMessage: '', isLog: req.user !== undefined});
    else
        res.redirect(`/proposal/${proposal.id}?er=` + encodeURIComponenet('Signup for this project first'));
})

module.exports = router;