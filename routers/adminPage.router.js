let express = require('express');
let router = express.Router();
let controller = require('../controllers/adminPage.controll.js');
let auth = require('../config/auth');
let isAdmin = auth.isAdmin;

//link
router.get('/admin/page', isAdmin, controller.index);
router.get('/admin/add_page', isAdmin, controller.GetaddPage);
router.post('/admin/add_page', isAdmin, controller.PostaddPage);
router.post('/admin/page/reorder-page', isAdmin, controller.Postreoder);
router.get('/admin/edit-page/:id', isAdmin, controller.GeteditPage);
router.post('/admin/edit-page/:id', isAdmin, controller.PosteditPage);
router.get('/admin/delete-page/:id', isAdmin, controller.GetDeletePage);


//call out
module.exports = router;