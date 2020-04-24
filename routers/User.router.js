let express = require('express');
let router = express.Router();
let controller = require('../controllers/User.controller.js');


//link
router.get('/user/register', controller.user);
router.post('/user/register', controller.PostUser);
router.get('/user/login', controller.GetLogin);
router.post('/user/login', controller.PostLogin);
router.get('/user/logout', controller.GetLogout);

//call out
module.exports = router;