const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

const parser = xml2js.Parser({ explicitArray: false });
function goodreadsService() {
  const tConnDevKey = 'qUm9wyegDxrwxBCTGU2Zyw';
  function getBookById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/book/show/${id}.xml?key=${tConnDevKey}`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }

  function findBookByTitleAuthorIsbn(query) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/search/index.xml?key=${tConnDevKey}&q=${query}`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              debug(result);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }


  return { getBookById, findBookByTitleAuthorIsbn };
}

module.exports = goodreadsService();
