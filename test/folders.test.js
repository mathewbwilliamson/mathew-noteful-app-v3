'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');

const { notes } = require('../db/seed/notes');
const { folders } = require('../db/seed/folders');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Reality Check', () => {
  it('true should be true', () => {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', () => {
    expect(2 + 2).to.equal(4);
  });
});

describe('All folder tests are here for Noteful API', () => {
  before(function () {
    console.log('Starting up the connection DB for Folders');
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true})
      .then( () => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    console.log('resetting test DB Folders');
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Folder.createIndexes(),
    ]);
  });

  afterEach(function () {
    console.log('Starting up the connection DB for Folders');
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    console.log('Disconnecting the server for Folders');
    return mongoose.disconnect();
  });

  describe('GET /api/folders', function () {
    // 1) Call the database **and** the API
    // 2) Wait for both promises to resolve using `Promise.all`
    it('should check length of api/folders', function() {
      return Promise.all([
        Folder.find(),
        chai.request(app).get('/api/folders')
      ])
        // 3) then compare database results to API response
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    })

    describe('GET /api/folders/:id', function () {
      it('should return correct folder', function () {
        let data;
        // 1) First, call the database
        return Folder.findOne()
          .then(_data => {
            data = _data;
            // 2) then call the API with the ID
            return chai.request(app).get(`/api/folders/${data.id}`);
          })
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
  
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('name', 'id', 'createdAt', 'updatedAt');
  
            // 3) then compare database results to API response
            expect(res.body.id).to.equal(data.id);
            expect(res.body.name).to.equal(data.name);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
          });
      });
    });
  });
})