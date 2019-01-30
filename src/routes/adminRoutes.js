const express = require('express');
const adminController = require('../controllers/adminController');
const bookService = require('../services/goodreadsService');

const adminRouter = express.Router();


function router(nav) {
  const { getIndex, insertFromArray } = adminController(bookService, nav);

  adminRouter.route('/insertFromArray')
    .get(insertFromArray);

  adminRouter.route('/')
    .get(getIndex);
  return adminRouter;
}

module.exports = router;
