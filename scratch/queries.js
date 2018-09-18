'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

////////////////////////////////////////////////////////////////
//Find using a filter and searchTerm
////////////////////////////////////////////////////////////////
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm, $options: 'gi' };
//     }

//     return Note.find(filter).sort({ updatedAt: 'desc' });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

////////////////////////////////////////////////////////////////
//FindbyId
////////////////////////////////////////////////////////////////
mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    const searchId = '000000000000000000000004'; //7 things lady gaga has in common with cats
    let filter = {};

    // if (searchTerm) {
    //   filter.title = { $regex: searchTerm, $options: 'gi' };
    // }

    return Note.findById(searchId).sort({ updatedAt: 'desc' });
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });