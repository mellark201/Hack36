const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github', {failureRedirect: '/login'}),
    async function(req, res) {
        req.user.token = req.query.code;
        await req.user.save();
        console.log(req.user);
        console.log('Got back successfully');
        res.redirect('/?active=' + encodeURIComponent(req.user.id));
    }
);

router.get('/login', (req, res) => {
    res.send('Failure');
})

module.exports = router;