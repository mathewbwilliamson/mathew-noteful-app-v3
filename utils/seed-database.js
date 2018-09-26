'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');
const Tags = require('../models/tag');
const Users = require('../models/user')

const { notes } = require('../db/data');
const { folders } = require('../db/data');
const { tags } = require('../db/data');
const { users } = require('../db/data')

mongoose.connect(MONGODB_URI, { useNewUrlParser: true})
  .then( () => mongoose.connection.db.dropDatabase())
  .then( () => {
    return Promise.all([
      Users.insertMany(users),
      Users.createIndexes(),
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Folder.createIndexes(),
      Tags.insertMany(tags),
      Tags.createIndexes(),
      
    ]);
  })
  .then( returnVals => {
    console.info( `Inserted ${returnVals[0].length} Users`);
    console.info( `Inserted ${returnVals[2].length} Notes`);
    console.info( `Inserted ${returnVals[3].length} Folders`);
    console.info( `Inserted ${returnVals[5].length} Tags`);
  })
  .then( () => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });