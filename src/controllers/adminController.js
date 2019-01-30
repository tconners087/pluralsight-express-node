const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');
const chalk = require('chalk');

function adminController(bookService, nav) {
  const books = [
    {
      title: 'Huge Butts',
      genre: 'Fantasy',
      author: 'Kenneth Grahame',
      bookId: 656,
      read: false
    },
    {
      title: 'Life On The Mississippi',
      genre: 'History',
      author: 'Mark Twain',
      bookId: 86,
      read: false
    },
    {
      title: 'Childhood',
      genre: 'Biography',
      author: 'Lev Nikolayevich Tolstoy',
      bookId: 34,
      read: false
    }
  ];

  function getIndex(req, res) {
    res.render(
      'adminView',
      {
        nav,
        title: 'Admin'
      }
    );
  }

  function insertFromArray(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug(chalk.green('Connected correctly to MongoDB server'));

        const db = client.db(dbName);

        const response = await db.collection('books').insertMany(books);
        res.json(response);
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  return {
    getIndex,
    insertFromArray
  };
}

module.exports = adminController;
