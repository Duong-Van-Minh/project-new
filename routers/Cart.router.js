let express = require('express');
let router = express.Router();
let controller = require('../controllers/Cart.controller.js');


//link
router.get('/cart/add/:product', controller.getcart);
router.get('/cart/checkout', controller.GetProductAdd);
router.get('/cart/update/:product', controller.GetProductUpdate);
router.get('/cart/clear', controller.GetProductClear);


//call out
module.exports = router;