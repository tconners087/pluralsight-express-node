const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authController');
const chalk = require('chalk');

function authController(nav) {
  function signUp(req, res) {
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

        req.login(results.ops[0], () => {
          res.redirect('/auth/profile');
        });
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  function viewProfile(req, res) {
    debug(req.user);
    res.render('profileView',
      {
        nav,
        title: 'Library Profile',
        user: req.user
      });
  }

  function profileMiddleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  function signIn(req, res) {
    res.render('signIn', {
      nav,
      title: 'Sign In'
    });
  }

  function logout(req, res) {
    if (req.user) {
      debug(`${chalk.magenta('Logging out user:')} ${chalk.green(req.user.username)}${chalk.magenta('...')}`);
      req.logout();
    } else {
      debug(chalk.magenta('No user registered with session...'));
    }
    res.redirect('/');
  }

  return {
    signUp,
    viewProfile,
    profileMiddleware,
    signIn,
    logout
  };
}

module.exports = authController;
