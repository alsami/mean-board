var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadSchema = new Schema({
	title: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
	posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
	lastPost: {type: Schema.Types.ObjectId, ref: 'Post'},
	deletedAt: Date
});

module.exports = mongoose.model('Thread', ThreadSchema);