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
  
  let filter = {};

  if (searchTerm) {
    // Search the title for a term
    // filter.title = { $regex: searchTerm, $options: 'i' };

    // Mini-Challenge: Search both `title` and `content`
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [{ 'title': re }, { 'content': re }];
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if (tagId) {
    filter.tags = tagId;
  }

  Note
    .find(filter)
    .sort({ updatedAt: 'desc' })
    .populate('folderId')
    .populate('tags')
    .then(results => {
      res.json( results );
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
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
      if (err.code === 11000) {
        err = new Error('The `id` is not valid.');
        err.status = 400;        
      }
      next(err);
    });
  

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, tags } = req.body;
  let { folderId } = req.body;

  /***** Never trust users. Validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (folderId === '') {
    folderId = null;
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  // need to validate tag ids
  if (tags) {
    for (let tag of tags) {
      if (!mongoose.Types.ObjectId.isValid(tag)) {
        const err = new Error('The `tags` array contains an invalid `id`');
        err.status = 400;
        return next(err);
      }
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
      res.location(`${req.originalUrl}/${results.id}`).status(201).json( results );
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    })
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const searchId = req.params.id;
  const { title, content, folderId } = req.body;
  let { tags } = req.body;
  let inputObj = {};

  /***** Never trust users. Validate input *****/
  if (title) {
    inputObj.title = title;
  } else if (!title) {
    const err = new Error('The `title` may not be an empty string');
    err.status = 400;
    return next(err);
  }
  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(searchId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  // need to validate tag ids
  if (tags) {
    for (let tag of tags) {
      if (!mongoose.Types.ObjectId.isValid(tag)) {
        const err = new Error('The `tag id` is not valid');
        err.status = 400;
        return next(err);
      }
    }
    inputObj.tags = tags;
  }

  if (content) inputObj.content = content;
  if (folderId) inputObj.folderId = folderId;

  Note.findByIdAndUpdate(searchId, inputObj, {new:true})
    .then( results => {
      res.location(`${req.originalUrl}/${results.id}`).status(200).json( results );
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The `id` is not valid.');
        err.status = 400;        
      }
      err.status = 404;
      next(err);
    });
  

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
      res.status(500).json({ message: 'Internal Server Error' });
    })
});

module.exports = router;