var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	body: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Category'},
	deletedAt: Date
});

module.exports = mongoose.model('Post', PostSchema);
