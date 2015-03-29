var express = require('express');
var router = express.Router();


/* import all needed Models */
var mongoose = require('mongoose');
var User = require('../models/User.js');


/* routes for user */

// get all users
router.get('/', function(req, res, next) {
	User.find(function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

// get a specific user by id
router.get('/:id', function(req, res, next){
	User.findById(req.params.id, function(err, user){
		if(err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

// create a user
router.post('/', function(req, res, next) {
	User.create(req.body, function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

// update user by id
router.put('/:id', function(req, res, next) {
	User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

// soft delete user by setting current date for deletedAt
router.delete('/:id', function(req, res, next) {
	User.findByIdAndUpdate(req.params.id, {deletedAt: Date.now()} , function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

module.exports = router;
