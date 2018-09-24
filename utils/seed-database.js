'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');
const Tags = require('../models/tags');

const { notes } = require('../db/seed/notes');
const { folders } = require('../db/seed/folders');
const { tags } = require('../db/seed/tags');

mongoose.connect(MONGODB_URI, { useNewUrlParser: true})
  .then( () => mongoose.connection.db.dropDatabase())
  .then( () => {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Folder.createIndexes(),
      Tags.insertMany(tags),
      Tags.createIndexes()
    ]);
  })
  .then( returnVals => {
    console.info( `Inserted ${returnVals[0].length} Notes`);
    console.info( `Inserted ${returnVals[1].length} Folders`);
    console.info( `Inserted ${returnVals[3].length} Tags`);
  })
  .then( () => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });