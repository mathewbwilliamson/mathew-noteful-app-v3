'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

////////////////////////////////////////////////////////////////
//Find using a filter and searchTerm
////////////////////////////////////////////////////////////////
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const searchTerm = 'odio';
//     let re;

//     if (searchTerm) {
//       //filter.title = { $regex: searchTerm, $options: 'gi' };
//       re = new RegExp(searchTerm, 'gi');
//     }

//     return Note.find({
//       $or: [
//         {title: re},
//         {content:re}
//       ]
//     }).sort({ updatedAt: 'desc' });
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
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const searchId = '000000000000000000000004'; //7 things lady gaga has in common with cats
//     let filter = {};

//     // if (searchTerm) {
//     //   filter.title = { $regex: searchTerm, $options: 'gi' };
//     // }

//     return Note.findById(searchId).sort({ updatedAt: 'desc' });
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
//Create a New Note
////////////////////////////////////////////////////////////////
mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    const inputObj = {title: '72 lessons learned from cats',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      createdAt: new Date('January 1, 2015')
    };

    return Note.create(inputObj);
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

////////////////////////////////////////////////////////////////
//Update a Note By Id using Note.findByIdAndUpdate
////////////////////////////////////////////////////////////////
mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    const searchId = '000000000000000000000004';
    const inputObj = {title: '42 lessons learned from cats',
      content: 'Smaller Lorem, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    };

    return Note.findByIdAndUpdate(searchId, inputObj, {new:true});
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

////////////////////////////////////////////////////////////////
//Delete a note by id using Note.findByIdAndRemove
////////////////////////////////////////////////////////////////
mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    const searchId = '000000000000000000000004';

    return Note.findByIdAndRemove(searchId);
  })
  .then( () => {
    console.log('Status should be 204');
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });