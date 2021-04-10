const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

var NotificationSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    projectname: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

NotificationSchema.plugin(findOrCreate);

module.exports = mongoose.model('notifs', NotificationSchema);