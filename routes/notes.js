'use strict';

const express = require('express');
const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const Note = require('../models/note');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */  
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId } = req.query;
  
  let reSearch = '';
  let searchObj = {};
  
  if (searchTerm) {
    reSearch = new RegExp(searchTerm, 'gi');
    searchObj = {
      $or: [
        {title: reSearch},
        {content: reSearch}
      ]
    };
  }

  if (folderId) {
    searchObj.folderId = folderId;
  }
  //TODO: Get tagId to work
  if (tagId) {
    searchObj.tagId = tagId;
  }

  Note
    .find(searchObj)
    .sort({ updatedAt: 'desc' })
    .populate('folderId')
    .populate('tags')
    .then(results => {
      res.json( results );
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const searchId = req.params.id;

  Note
    .findById(searchId)
    .sort({ updatedAt: 'desc' })
    .populate('folderId')
    .populate('tags')
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
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users. Validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  // need to validate tag ids
  for (let tag of tags) {
    if (!mongoose.Types.ObjectId.isValid(tag)) {
      const err = new Error('The `tag id` is not valid');
      err.status = 400;
      return next(err);
    }
  }
  
  const inputObj = {
    title: title,
    content: content,
    folderId: folderId,
    tags: tags
  };

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
  const searchId = req.params.id;
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users. Validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  // need to validate tag ids
  for (let tag of tags) {
    if (!mongoose.Types.ObjectId.isValid(tag)) {
      const err = new Error('The `tag id` is not valid');
      err.status = 400;
      return next(err);
    }
  }

  const inputObj = {
    title: title,
    content: content,
    folderId: folderId,
    tags: tags
  };
  
  Note.findByIdAndUpdate(searchId, inputObj, {new:true})
    .then( results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json( results );
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    })
  

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const searchId = req.params.id;

  Note.findByIdAndRemove(searchId)
    .then( results => {
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    })
});

module.exports = router;