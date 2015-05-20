var express = require('express');
var router = express.Router();
var permission = require('./lib/permission');


/* import mongoose and all needed Models */
var mongoose = require('mongoose');
var Post = require('../models/Post.js');
var Thread = require('../models/Thread.js');
var Category = require('../models/Category.js');


/* routes for post */


// get a specific post by id
router.get('/:id', function(req, res, next){
	Post.find({_id: req.params.id, deletedAt: null})
		.select('_id parent body createdBy createdAt updatedBy updatedAt deletedAt')
		.deepPopulate(
			'parent' +
			' parent.parent' +
			' parent.parent.parent' +
			' parent.parent.parent.parent' +
			' createdBy' +
			' updatedBy'
		)
		.exec(function(err, post){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(post);
		});
});


// create a post
router.post('/', function(req, res, next) {
	// add the user ID to the post before creating it
	req.url = '/post'; // hack for acl
	// -> fix this
	// var permitted_obj = permission.permitted_obj(req);
	//permitted_obj.createdBy = req.user._id;
	req.body.createdBy = req.user._id;

	Post.create(req.body, function(err, post) {
		if (err) return next(err);

		// register the new post at the parent thread
		Thread.findByIdAndUpdate(post.parent, { lastPost: post._id, $push : { posts: post}}, function(err, thread){
			if(err) return next(err);

			// update lastPost for all parent categories
			setLastPostForAllCategories(thread.parent, post._id);
		});

		return_populated_post(post, res, next);
	});
});


var setLastPostForAllCategories = function(categoryId, lastPostId){
	Category.findByIdAndUpdate(categoryId, {lastPost: lastPostId}, function(err, category){
		if(err) return next(err);
		if(category.parent !== null){
			setLastPostForAllCategories(category.parent, lastPostId);
		}
	});
};


var return_populated_post = function(post, res, next){
	Post.findById(post._id)
		.select('_id body createdBy createdAt updatedBy updatedAt deletedAt')
		.deepPopulate(
			'createdBy' +
			' updatedBy'
		)
		.exec(function(err, populated_post){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(populated_post);
		});
};


// update post by id
router.put('/:id', permission.check, function(req, res, next) {
	req.url = '/post'; // hack for acl
	var permitted_obj = permission.permitted_obj(req);
	permitted_obj.updatedBy = req.user._id;
	permitted_obj.updatedAt = Date.now();
	update_and_return_populated_post(req.params.id, permitted_obj, res, next);
});


var update_and_return_populated_post = function(id, update_obj, res, next){
	Post.findByIdAndUpdate(id, update_obj, function (err, post) {
		if (err) return next(err);
		return_populated_post(post, res, next);
	});
};


// soft delete post by setting current date for deletedAt
router.delete('/:id', permission.check, function(req, res, next) {
	delete_info = {
		deletedAt: Date.now(),
		updatedBy: req.user._id
	};

	update_and_return_populated_post(req.params.id, delete_info, res, next);
});


// ONLY FOR DEBUG AND DEVELOPMENT: get all posts
router.get('/debug/getall', function(req, res, next) {
	Post.find()
		.deepPopulate(
			'parent' +
			' createdBy' +
			' updatedBy'
		)
		.exec(function (err, post) {
		if(err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(post);
	});
});


// ONLY FOR DEBUG AND DEVELOPMENT: delete a post by id */
router.delete('/debug/delete/:id', function(req, res, next) {
	Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(post);
	});
});


module.exports = router;
