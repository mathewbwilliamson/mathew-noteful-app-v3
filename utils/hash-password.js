'use strict';
const bcrypt = require('bcryptjs');

const fakeUser = {
  username: 'bob',
  password: 'password'
};

bcrypt.hash( fakeUser.password, 10 )
  .then(digest => {
    console.log('digest = ', digest);
    return digest;
  })
  .catch( err => {
    console.error('error', err);
  });