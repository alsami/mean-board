/**
 * Blueprint for threads and interface
 * for MongoDB
 */

// dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

// schema
var ThreadSchema = new Schema({
	title: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Category', required: true}, // thread must have a category as parent
	posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
	lastPost: {type: Schema.Types.ObjectId, ref: 'Post'},
	createdBy: {type: Schema.Types.ObjectId, ref: 'User', default: null},
	createdAt: {type: Date, default: Date.now},
	updatedBy: {type: Schema.Types.ObjectId, ref: 'User', default: null},
	updatedAt: {type: Date, default: Date.now},
	deletedAt: {type: Date, default: null}
});

// declare what a deepPopulate (chaining population) will return
// for a specific attribute
ThreadSchema.plugin(deepPopulate, {
	populate: {
		'parent' : {
			select : '_id title'
		},
		'createdBy' : {
			select : '_id userName role'
		},
		'posts' : {
			select : '_id body createdBy updatedBy updatedAt updateReason deletedAt'
		},
		'posts.createdBy' : {
			select : '_id userName createdAt role posts'
		},
		'posts.updatedBy' : {
			select : '_id userName role'
		}
	}
});

module.exports = mongoose.model('Thread', ThreadSchema);
