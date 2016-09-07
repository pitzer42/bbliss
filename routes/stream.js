'use strict'

const express = require('express');
const router = express.Router();
const url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  const querystring = req.query.profile
  const profile = JSON.parse(querystring)
  res.render('stream', profile);
});

router.get('/add', function(req, res, next) {
  res.render('streamAdd');
});

module.exports = router;
