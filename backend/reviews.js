const express = require('express');
const router = express.Router();
const { addReview, getReviewsByBook } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, addReview);
router.get('/:bookId', getReviewsByBook);

module.exports = router;
