const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { authorize } = require('passport');

router.get('/', async (req, res) => {
    const url = `https://api.github.com/repos/mellark201/SmartBrain/`;
    let info = [];
    await fetchurl(url, 'commits', info);
    await fetchurl(url, 'pulls', info);
    await fetchurl(url, 'issues', info);
    info.sort(function(a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return d-c;
    })
    res.send(info.slice(0, 10));
})

async function fetchurl(prefix, params, array) {
    const url = prefix+params;
    const headers = {
        "Accept" : "application/vnd.github.cloak-preview"
    }
    let response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    })
    let result = await response.json();
    // console.log(result);
    result.forEach(item => {
        let info = {};
        if(params === 'commits') {
            info.user = item.author.login;
            info.message = item.commit.message;
            info.date = item.commit.author.date;
            info.link = item.html_url;
        } else {
            info.user = item.user.login;
            info.message = item.title;
            info.date = item.created_at;
            info.link = item.html_url;
        }
        info.type = params;
        array.push(info);
    })
}

module.exports = router;