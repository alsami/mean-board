var express = require('express');
var router = express.Router();


/* import mongoose and all needed Models */
var mongoose = require('mongoose');
var Category = require('../models/Category.js');


/* routes for category */

// get all main categories
router.get('/', function(req, res, next){
	Category.find({parent: null})
		.deepPopulate('threads categories.categories categories.threads categories.categories.threads')
		.exec(function(err, category){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(category);
		});
});

// get a specific category by id
router.get('/:id', function(req, res, next){
	Category.findById(req.params.id)
		.deepPopulate('categories.categories')
		.exec(function(err, category){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(category);
		});
});

// create a category
router.post('/', function(req, res, next) {
	Category.create(req.body, function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

// update category by id
router.put('/:id', function(req, res, next) {
	Category.findByIdAndUpdate(req.params.id, req.body, function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});


// ONLY FOR DEBUG AND DEVELOPMENT: get all categories
router.get('/debug/getall', function(req, res, next) {
	Category.find(function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

// ONLY FOR DEBUG AND DEVELOPMENT: delete a category by id */
router.delete('/debug/delete/:id', function(req, res, next) {
	Category.findByIdAndRemove(req.params.id, req.body, function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

module.exports = router;
