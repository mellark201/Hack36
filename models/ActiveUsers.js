var mongoose = require('mongoose');
var findorcreate = require('mongoose-findorcreate');

var ActiveSchema = new mongoose.Schema({
    activeId: [String]
});

ActiveSchema.plugin(findorcreate);

module.exports = mongoose.model("active", ActiveSchema);