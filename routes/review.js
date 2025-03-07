const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/review');
const isAuth = require('../middlewares/isAuth');
const upload = require('../middlewares/upload');

router.post('/', isAuth, upload.array('photos'), reviewController.addReview);
router.get('/',isAuth, reviewController.getUserReviews);
router.delete('/:id', isAuth, reviewController.deleteReview);
router.get('/:type/:reference', reviewController.getReviews);


module.exports = router;
