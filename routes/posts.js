var express = require('express');
var router = express.Router();


/* import mongoose and all needed Models */
var mongoose = require('mongoose');
var Post = require('../models/Post.js');


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
	Post.create(req.body, function (err, post) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(post);
	});
});

// update post by id
router.put('/:id', function(req, res, next) {
	Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(post);
	});
});


// ONLY FOR DEBUG AND DEVELOPMENT: get all posts
router.get('/debug/getall', function(req, res, next) {
	Post.find(function (err, post) {
		if (err) return next(err);
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
