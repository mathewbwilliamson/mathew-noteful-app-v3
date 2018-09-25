'use strict';

const mongoose = require('mongoose');
const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { username, password, fullname } = req.body;

  //Need to memorize this
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find( field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    next(err);
  }

  //Fields are type String

  const newUserObject = {
    username,
    password,
    fullname
  };

  return User
    .hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
  
})

module.exports = router;