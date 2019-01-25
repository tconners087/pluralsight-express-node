const express = require('express');
const adminController = require('../controllers/adminController');
const bookService = require('../services/goodreadsService');

const adminRouter = express.Router();


function router(nav) {
  const { getIndex, insertFromArray } = adminController(bookService, nav);

  adminRouter.route('/')
    .get(insertFromArray);
  return adminRouter;
}

module.exports = router;
