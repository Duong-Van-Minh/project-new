let express = require('express');
let router = express.Router();
let controller = require('../controllers/Page.controller.js');


//link
router.get('', controller.home);
router.get('/:slug', controller.GetPage);


//call out
module.exports = router;