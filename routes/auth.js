'use strict';

//const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//const User = require('../models/user');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const router = express.Router();

// Note: the following example uses failWithError: true which 
//    is unique to the Noteful app. The failWithError option 
//    configures the middleware to throw an error instead of 
//    automatically returning a 401 response. The error is 
//    then caught by the error handling middleware on 
//    server.js and returned as JSON.
const options = { session: false, failWithError: true };
const localAuth = passport.authenticate('local', options);

function createAuthToken( user ) {
  return jwt.sign( {user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/', localAuth, function(req, res) {
  const authToken = createAuthToken( req.user );
  res.json({ authToken });
})

module.exports = router;