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
  Folder
    .find()
    .sort({'name': 'asc'})
    .then( results => {
      res.json( results );
    })
    .catch( err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

/* ================ GET/READ A SINGLE FOLDER ================ */
router.get('/:id', (req, res, next) => {
  const searchId = req.params.id;

  Folder
    .findById(searchId)
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
    });
});

/* ================ POST A FOLDER =========================== */
router.post('/', (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const inputObj = {
    name: name
  };

  Folder
    .create(inputObj)
    .then( results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json( results );
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;        
      }
      next(err);
    });
});

/* ================ POST A FOLDER =========================== */
router.put('/:id', (req, res, next) => {
  const { name } = req.body;
  console.log(req.body);
  const searchId = req.params.id;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const inputObj = {
    name: name
  };

  Folder
    .findByIdAndUpdate(searchId, inputObj, {new:true})
    .then( results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json( results );
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;        
      }
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE FOLDER ========== */
//Also should remove all the related notes
router.delete('/:id', (req, res, next) => {
  const searchId = req.params.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(searchId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const folderRemovePromise = Folder.findByIdAndRemove( searchId );

  //On DELETE SET CASCADE functionality
  //const noteRemovePromise = Note.deleteMany({ folderId: searchId});

  //ON DELETE SET NULL functionality
  const noteRemovePromise = Note.updateMany(
    {folderId: searchId},
    {$unset: {folderId:1}}
  )

  Promise.all([folderRemovePromise, noteRemovePromise])
    .then( () => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    })
  
});

module.exports = router;