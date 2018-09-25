'use strict';

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://mbw:mongopass1@ds261342.mlab.com:61342/noteful-app-mw',
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://mbw:mongopass1@ds163382.mlab.com:63382/noteful-test',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};