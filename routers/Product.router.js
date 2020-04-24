let express = require('express');
let router = express.Router();
let controller = require('../controllers/Product.controller.js');


//link
router.get('/product/all', controller.product);
router.get('/product/:slug', controller.GetProduct);
router.get('/product/:slug/:product', controller.GetProductdetailes);

//call out
module.exports = router;