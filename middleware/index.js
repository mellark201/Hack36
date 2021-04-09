const Proposals = require('../models/proposals');

var middlewareObj = {};

middlewareObj.isLoggedIn = async function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    var string = encodeURIComponent('You need to login')
    const proposal = await Proposals.find({});
    res.redirect('/?er=' + encodeURIComponent('You need to login'));
}

middlewareObj.isLoggedOut = function(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    var string = encodeURIComponent('You need to logout')
    res.redirect("/?errorMessage=" + string);
}

middlewareObj.hasSpaceLeft = function(req, res, next) {
    if(req.user.proposalId.length + req.user.projectId.length < 6)
    {
        return next();
    }
    res.redirect('/profile/<%=req.user.id%>')
}

middlewareObj.hasAllDetail = async function(req, res, next) {
    var flag = true;
    flag = flag & req.user.email !== req.user.username;
    flag = flag & req.user.name != req.user.username;
    if(flag) {
        return next();
    }
    else {
        const proposal = await Proposals.find({});
        res.redirect('/?er=' + encodeURIComponent('You need to provide necessary detail. Please Check Profile/Edit'));
    }
}

module.exports = middlewareObj;