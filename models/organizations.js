const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

var OrganizationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    isDeveloper: {
        type: Boolean,
        required: true,
    },
    organization: {
        type: String
    },
    about: {
        type: String,
    },
    officialEmail: {
        type: String
    },
    telephone: {
        type: String
    },
    address: {
        type: String
    },
    organizationLogo: {
        type: Buffer
    },
    organizationLogoType: {
        type: String,
    },
    proposalId: [String]
});

OrganizationSchema.plugin(findOrCreate);
OrganizationSchema.plugin(passportLocalMongoose);

OrganizationSchema.virtual('organizationLogoPath').get(function() {
    if(this.organizationLogo != null && this.organizationLogoType!=null)
    {
        return `data: ${this.organizationLogoType}; charset=utf-8; base64, ${this.organizationLogo.toString('base64')}`
    }
})

module.exports = mongoose.model('Organizations', OrganizationSchema);