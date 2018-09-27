'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const sinon = require('sinon');

const app = require('../server');
const Tag = require('../models/tag');
const Note = require('../models/note');
const User = require('../models/user');
const Folder = require('../models/folder');

const { notes, folders, tags, users } = require('../db/data');
const { TEST_MONGODB_URI } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('Noteful API - Users', function () {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => Promise.all([
        Note.deleteMany(),
        Tag.deleteMany(),
        Folder.deleteMany(),
        User.deleteMany()
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      Tag.insertMany(tags),
      Folder.insertMany(folders),
      Note.insertMany(notes),
      User.insertMany(users)
    ]);
  });

  afterEach(function () {
    sandbox.restore();
    return Promise.all([
      Note.deleteMany(),
      Tag.deleteMany(),
      Folder.deleteMany(),
      User.deleteMany()
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/users', function () {
    it('Should reject users with missing username', function() {
      
    })

  })
})