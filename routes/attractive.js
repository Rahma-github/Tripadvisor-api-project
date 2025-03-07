const express = require('express');
const router = express.Router();

const attractiveController = require('../controllers/attractive');
const isAuth = require('../middlewares/isAuth');
const upload = require('../middlewares/upload');


router.post('/', isAuth, upload.array('images'), attractiveController.addAtractive);
router.get('/', attractiveController.getAtractives);
router.get('/filter', attractiveController.filterAttractives);
router.get('/:id', attractiveController.getAtractive);
router.get('/destination/:destinationId', attractiveController.getAtractivesInDestination);
router.delete('/:id', isAuth, attractiveController.deleteAtractive);


module.exports = router;
