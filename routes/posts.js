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
	Post.findById(req.params.id)
		.populate('parent') // check if we need this
		.exec(function(err, post){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(post);
		});
});

// create a post
router.post('/', function(req, res, next) {
	// add the user ID to the post before creating it
	req.body.createdBy = req.user._id;

	Post.create(req.body, function(err, post) {
		if (err) return next(err);

		// register the new post at the parent thread
		Thread.findByIdAndUpdate(post.parent, { lastPost: post._id, $push : { posts: post}}, function(err, thread){
			if(err) return next(err);

			// update lastPost for all parent categories
			setLastPostForAllCategories(thread.parent, post._id);
		});

		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(post);
	});
});

var setLastPostForAllCategories = function(categoryId, lastPostId){
	Category.findByIdAndUpdate(categoryId, {lastPost: lastPostId}, function(err, category){
		if(err) return next(err);
		if(category.parent !== null){
			setLastPostForAllCategories(category.parent, lastPostId);
		}
	});
}

// update post by id
router.put('/:id', permission.check, function(req, res, next) {
	req.body.updatedBy = req.user._id;
	req.body.updatedAt = Date.now();
	Post.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
		if(err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(post);
	});
});

// soft delete post by setting current date for deletedAt
router.delete('/:id', permission.check, function(req, res, next) {
	delete_info = {
		deletedAt: Date.now(),
		updatedBy: req.user._id
	};

	Post.findByIdAndUpdate(req.params.id, delete_info , function (err, post) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(post);
	});
});

// ONLY FOR DEBUG AND DEVELOPMENT: get all posts
router.get('/debug/getall', function(req, res, next) {
	Post.find(function (err, post) {
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
