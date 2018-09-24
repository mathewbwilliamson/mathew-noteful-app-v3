'use strict';

const mongoose = require('mongoose');
const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { username, password, fullname } = req.body;

  const newUserObject = {
    username,
    password,
    fullname
  };

  User
    .create( newUserObject )
    .then( response => {
      res.json(response);
    })
    .catch( err => {
      next(err);
    })
})

module.exports = router;