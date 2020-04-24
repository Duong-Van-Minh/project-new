//npm 
let passport = require('passport');
var bcrypt = require('bcryptjs')

//models database
let User = require('../models/user.models.js');

//get pages index
module.exports.user = function (req, res) {
	res.render('products/register', {
		title: 'Register'
	})

};


//get page 
module.exports.PostUser = function (req, res) {
	let name = req.body.name;
	let email = req.body.email;
	let username = req.body.username;
	let password = req.body.password;
	let password2 = req.body.password2;

	req.checkBody('name', 'name must have a value').notEmpty();
	req.checkBody('email', 'email must have a value').notEmpty();
	req.checkBody('username', 'username must have a value').notEmpty();
	req.checkBody('password', 'password must have a value').notEmpty();
	req.checkBody('password2', 'password2 must have a value').notEmpty();

	let errors = req.validationErrors();

	if(errors){
		res.render('products/register',{
			errors: errors,
			user: null,
			title: 'Register'
		})
	}else{
		User.findOne({Username: username},{email: email}, function (err, user){
			if(err)
				console.log(err)
			if(user){
				req.flash('danger', 'Username or email exists , choose anther!');
				res.redirect('/user/register')
			}else{
				let user = new User({
					name: name,
					email: email,
					Username: username,
					password: password,
					admin: 0
				});

				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(user.password, salt, function(err, hash) {
						if(err)
							console.log(err)
						user.password = hash;
						user.save(function (err){
							if(err){
								console.log(err)
							}else{
								req.flash('success', 'register true, Please login');
								res.redirect('/user/login')
							}
						})
					});
				});
			}
			
			
		})
	}

};

// //get login
module.exports.GetLogin = function (req, res) {
	if(res.locals.user)
		res.redirect('/')
	res.render('products/login', {
		title: 'Log in'
	})

};

//post login
module.exports.PostLogin = function (req, res, next) {
	passport.authenticate('local',{
		successRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash: true
	})(req, res, next)

};
//get logout
module.exports.GetLogout = function (req, res, next) {
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/user/login')

};