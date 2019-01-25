const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const chalk = require('chalk');
const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();
function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server...');

          const db = client.db(dbName);

          const col = db.collection('users');
          const user = { username, password };
          const results = await col.insertOne(user);
          debug(results);
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err.stack);
        }
      }());
    });

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      // res.json(req.user);
      debug(req.user);
      res.render('profileView',
        {
          nav,
          title: 'Library Profile',
          user: req.user
        });
    });

  authRouter.route('/signIn')
    .get((req, res) => {
      res.render('signIn', {
        nav,
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  authRouter.route('/logout')
    .get((req, res) => {
      if (req.user) {
        debug(`${chalk.magenta('Logging out user:')} ${chalk.green(req.user.username)}${chalk.magenta('...')}`);
        req.logout();
      } else {
        debug(chalk.magenta('No user registered with session...'));
      }
      res.redirect('/');
    });
  return authRouter;
}

module.exports = router;
