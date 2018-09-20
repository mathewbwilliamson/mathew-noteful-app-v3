'use strict';
const express = require('express');
const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const { PORT, MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');

const router = express.Router();
const app = express();
app.use(express.json());

/* ================ GET/READ ALL FOLDERS ================ */
router.get('/', (req, res, next) => {
  console.log('in folders/get')
  Folder.find().sort({'name': 'asc'})
    .then( results => {
      res.json( results );
    })
    .catch( err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;