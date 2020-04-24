let express = require('express');
let router = express.Router();
let controller = require('../controllers/adminCategory.controll.js');
let auth = require('../config/auth');
let isAdmin = auth.isAdmin;
//link
router.get('/admin/category', isAdmin, controller.index);
router.get('/admin/add_Category', isAdmin, controller.GetaddCategory);
router.post('/admin/add_Category', isAdmin, controller.PostaddCategory);
router.get('/admin/edit-Category/:id', isAdmin, controller.GeteditCategory);
router.post('/admin/edit-Category/:id', isAdmin, controller.PosteditCategory);
router.get('/admin/delete-Category/:id', isAdmin, controller.GetDeleteCategory);


//call out
module.exports = router;