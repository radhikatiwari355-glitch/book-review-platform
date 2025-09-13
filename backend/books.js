const express = require('express');
const router = express.Router();
const { getAllBooks, getBookWithReviews } = require('../controllers/bookController');

router.get('/', getAllBooks);
router.get('/:id', getBookWithReviews);

module.exports = router;
