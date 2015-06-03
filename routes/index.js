/**
 * All needed routes to offer CRUD functionality
 * CRUD:
 * CREATE - post
 * READ - get
 * UPDATE - put
 * DELETE - put / delete
 */

// dependencies
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
