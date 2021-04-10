const User = require('../models/user');
const Proposal = require('../models/proposals');
const fetch = require('node-fetch');

module.exports = io => {
    io.on('connection', socket => {
        console.log(`A socket connection to the server has been made: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`Connection ${socket.id} has left the building`)
        })
        socket.on('join', (data) => {
            console.log(data);
            console.log('End');
        })
        socket.on('newChannel', async (data) => {
            io.emit('setChannelName', data);
        })
        socket.on('closeChannel', async (arr) => {
            const proposal = await Proposal.findById(arr);
            let event = new Date(Date.now());
            let video = {
                sender: 'constant',
                date: event.toISOString(),
                typer : "end"
            }
            proposal.video.push(video);
            await proposal.save();
            io.emit('removeChannelName', arr);
        })
        socket.on('closeChannelUnique', (arr) => {
            socket.emit('removeChannelName', arr)
        })
        socket.on('newMessage', async(data) => {
            const proposal = await Proposal.findById(data.receiver);
            const user = await User.findById(data.sender);
            const info = {
                text: data.message,
                sender: user.username,
                typer: data.typer,
                receiver: data.receiver
            }
            if(proposal.chat.length>200)
                proposal.chat.shift();
            proposal.chat.push(info);
            await proposal.save();
            io.emit('updateMessage', info)
        })

        socket.on('newActiveUser', async(info) => {
            const id = info.userId;
            const user = await User.findById(id);
            user.isActive = true;
            await user.save();
            io.emit('updateActiveUser', info);
        })

        socket.on('updateFeed', async (data) => {
            console.log('updating feed');
            // console.log(data);
            const proposal = await Proposal.findById(data);
            const user = await User.findById(proposal.createId)
            const url = `https://api.github.com/repos/${proposal.githubUserName}/${proposal.githubRepoName}/`;
            let info = [];
            await fetchurl(url, 'commits', info, user.token);
            await fetchurl(url, 'pulls', info, user.token);
            await fetchurl(url, 'issues', info, user.token);
            info.sort(function(a, b) {
                var c = new Date(a.date);
                var d = new Date(b.date);
                return d-c;
            })
            let completeData = {
                receiver: data,
                array: info.slice(0, 10)
            }
            // console.log(completeData);
            io.emit('ReloadFeed', completeData);
        })
    })
}

async function fetchurl(prefix, params, array, token) {
    const url = prefix+params;
    const headers = {
        "accept" : "application/vnd.github.cloak-preview"
    }
    let response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    })
    let result = await response.json();
    console.log(result);
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