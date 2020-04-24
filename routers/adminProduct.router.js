let express = require('express');
let router = express.Router();
let controller = require('../controllers/adminProduct.controll.js');
let auth = require('../config/auth');
let isAdmin = auth.isAdmin;
//link
router.get('/admin/product', isAdmin, controller.index);
router.get('/admin/add_Product', isAdmin, controller.GetaddProduct);
router.post('/admin/add_Product', isAdmin, controller.PostaddProduct);
router.get('/admin/edit-product/:id', isAdmin, controller.GeteditProduct);
router.post('/admin/product-gallery/:id', isAdmin, controller.Postgallery);
router.get('/admin/delete-image/:image', isAdmin, controller.GetDeleteImage);
router.post('/admin/edit-Product/:id', isAdmin, controller.PosteditProduct);
router.get('/admin/delete-product/:id', isAdmin, controller.GetDeleteProduct);


//call out
module.exports = router;