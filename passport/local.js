'use strict';
const passport = module.require('passport');
const { Strategy: LocalStrategy } = module.require('passport-local');

const User = module.require('../models/user');

const localStrategy = new LocalStrategy( (username, password, done) => {
    let user;
    User
        .findOne( { username })
        .then( results => {
            user = results;
        
            if (!user) {
                return Promise.reject( {
                    reason: 'LoginError',
                    message: 'Incorrect username',
                    location: 'username'
                });
            }
            return user.validatePassword(password);
        })
        .then( isValid => {
            if (!isValid) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect Password',
                    location: 'password'
                })
            }
            console.log(user)
            return done(null, user);
        })
        .catch( err => {
            if (err.reason === 'LoginError') {
                return done(null, false);
            }
            return done(err);
        });
    });

module.exports = localStrategy;