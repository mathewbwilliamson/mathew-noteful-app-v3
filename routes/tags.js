'use strict';
const express = require('express');
const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
//const { PORT, MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tags');

const router = express.Router();

/* ================ GET/READ ALL TAGS ================ */
router.get('/', (req, res, next) => {
  Tag
    .find()
    .sort({'name':1})
    .then( results => {
      if (results) {
        return res.json(results);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error'})
    });
})

/* ================ GET/READ A SINGLE TAG ================ */
router.get('/:id', (req, res, next) => {
  const searchId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(searchId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag
    .findById(searchId)
    .then( results => {
      if (results) {
        res.json(results);
      } else {
        res.status(404);
        next();
      }
    })
    .catch( error => {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error'});
    })
})

/* ================ POST A TAG =========================== */
router.post('/', (req, res, next) => {
  const name = req.body.name;
  
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newTag = {
    name: name
  };

  Tag
    .create(newTag)
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json( results );
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;        
      }
      next(err);
    });
})

/* ================ UPDATE A TAG =========================== */
router.put('/:id', (req, res, next) => {
  const name = req.body.name;
  const searchId = req.params.id;

  /***** Never trust users. Validate input *****/
  if (!mongoose.Types.ObjectId.isValid(searchId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!name) {
    const err = new Error('Name is a required field')
    err.status = 400;
    return next(err)
  }

  const updateObj = { name: name };

  Tag
    .findByIdAndUpdate(searchId, updateObj, {new:true})
    .then( results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json( results );
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;        
      }
      next(err);
    })
})

/* ========== DELETE/REMOVE A SINGLE TAG ========== */
router.delete('/:id', (req, res, next) => {
  const searchId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(searchId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const tagRemovePromise = Tag.findByIdAndRemove(searchId);

  const noteRemovePromise = Note.updateMany(
    {tags: searchId},
    {$pull: {tags:searchId}}
  );

  Promise.all([tagRemovePromise, noteRemovePromise])
    .then( () => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    })
})
module.exports = router;