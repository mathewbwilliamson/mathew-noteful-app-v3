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

const router = express.Router();
const app = express();
app.use(express.json());

/* ========== GET/READ ALL ITEMS ========== */
//DONE  
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  let re = '';
  let searchObj;

  if (searchTerm) {
    //filter.title = { $regex: searchTerm, $options: 'gi' };
    re = new RegExp(searchTerm, 'gi');
    searchObj = {
      $or: [
        {title: re},
        {content:re}
      ]
    };
  }

  Note.find(searchObj).sort({ updatedAt: 'desc' })
    .then(results => {
      res.json( results );
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    })


});

/* ========== GET/READ A SINGLE ITEM ========== */
//DONE
router.get('/:id', (req, res, next) => {
  const searchId = req.params.id;

  Note.findById(searchId).sort({ updatedAt: 'desc' })
    .then(results => {
      if (results) {
        res.json(results);
      } else {
        res.status(404);
        next();
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    })
  

});

/* ========== POST/CREATE AN ITEM ========== */
//DONE
router.post('/', (req, res, next) => {
  const inputObj = req.body;
  //TODO: Go through old version to check their code
  Note.create(inputObj)
    .then(results => {
      res.json( results );
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    })
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  console.log('Update a Note');
  res.json({ id: 1, title: 'Updated Temp 1' });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();
});

module.exports = router;