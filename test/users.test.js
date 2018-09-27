'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const app = require('../server');
const Tag = require('../models/tag');
const Note = require('../models/note');
const User = require('../models/user');
const Folder = require('../models/folder');

const { notes, folders, tags, users } = require('../db/data');
const { TEST_MONGODB_URI } = require('../config');

const { JWT_SECRET } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;
const sandbox = sinon.createSandbox();
let token = '';
let user = '';

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
      User.insertMany(users),
      Tag.insertMany(tags),
      Folder.insertMany(folders),
      Note.insertMany(notes),
    ])
      .then( ([users]) => {
        user = users[0];
        token = jwt.sign( {user}, JWT_SECRET, { subject: user.username });
      });
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

  describe('POST /api/users', function () {
    it('should create and return a new user when provided valid data', function () {
      const newUser = { 
        username: 'newuser',
        password: 'password', 
        fullname: 'full name' 
      };
      let body;
      return chai.request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .then(function (res) {
          body = res.body;
          //let data = User.findById(body.id)
          
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.have.all.keys('username', 'fullname', 'id');
          return User.findById(body.id);
        })
        .then(data => {
          expect(body.id).to.equal(data.id);
          expect(body.name).to.equal(data.name);
        });
    });

    it('Should reject users with missing username', function() {
      const newUser = { 
        password: 'password', 
        fullname:'full name' 
      };
      let body;
      return chai.request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('code', 'reason', 'message', 'location');
        });
    });

    it.only('Should reject users with a missing password', function() {
      const newUser = { 
        username: 'username', 
        fullname:'full name' 
      };
      let body;
      return chai.request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('code', 'reason', 'message', 'location');
        });
    });

    it('Should reject users with non-string username', function () {
      const newUser = { 
        username: 'thisisanewuser', 
        password: 'password', 
        fullname:'full name' 
      };
      let body;
      return '';
    });

    it('Should reject users with non-string password', function () {
      const newUser = { 
        username: 'thisisanewuser', 
        password: 'password', 
        fullname:'full name' 
      };
      let body;
      return '';
    });

    it('Should reject users with non-string first name', function () {
      const newUser = { 
        username: 'thisisanewuser', 
        password: 'password', 
        fullname:'full name' 
      };
      let body;
      return '';
    });

    it('Should reject users with non-string last name', function () {
      return '';
    });

    it('Should reject users with non-trimmed username', function () {
      return '';
    });

    it('Should reject users with non-trimmed password', function () {
      return '';
    });

    it('Should reject users with empty username', function () {
      return '';
    });

    it('Should reject users with password less than ten characters', function () {
      return '';
    });

    it('Should reject users with password greater than 72 characters', function () {
      return '';
    });

    it('Should reject users with duplicate username', function () {
      return '';
    });

    it('Should create a new user', function () {
      return '';
    });

    it('Should trim firstName and lastName', function () {
      return '';
    });
  });
})