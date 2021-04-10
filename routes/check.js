const express = require('express');
const Proposals = require('../models/proposals');
const User = require('../models/user');
const router = express.Router();
const log = require('../middleware');

router.get('/:a/:b', log.isLoggedIn, async(req, res) => {
    // console.log(req.params.a);
    const proposal = await Proposals.findById(req.params.a);
    let names= [];
    const activeUser = [];
     
    console.log(proposal.developerId);
    
    const admin= await User.findById(proposal.createId);
    const adminName= admin.name;
    console.log(adminName);
    for(const id of proposal.developerId) {
        const tempDeveloper = await User.findById(id);
        
        names.push(tempDeveloper.name);
        if(tempDeveloper.isActive) {
            let temptemp = {};
            temptemp.username = tempDeveloper.username;
            temptemp.id = tempDeveloper.id;
            console.log(temptemp);
            activeUser.push(temptemp);
        }
    }
    if(proposal.developerId.includes(req.params.b) || proposal.createId === req.params.b)
        res.render('check/show', {adminName:adminName,names:names,proposal: proposal, errorMessage: '', isLog: req.user !== undefined, activeusers:activeUser});
    else
        res.redirect(`/proposal/${proposal.id}?er=` + encodeURIComponenet('Signup for this project first'));
})

module.exports = router;