//npm
let fs = require('fs-extra');
let auth = require('../config/auth');
let isUser = auth.isUser;
//models database
let Product = require('../models/product.models.js');
let Category = require('../models/category.models.js');
//get product index
module.exports.product = function (req, res) {
	Product.find(function (err, products) {
		if(err)
			conselo.log(err)
		res.render('products/all_product', {
			title: 'all_product',
			products: products
		})
	})

};


//get product by category
module.exports.GetProduct = function (req, res) {
	categorySlug = req.params.slug;
	Category.findOne({slug: categorySlug},function (err, c){
		if(err)
			return conselo.log(err)
		Product.find({category: categorySlug} , function (err, products) {
			if(err)
				conselo.log(err)
			res.render('products/all_product', {
				title: c.title,
				products: products
			})
		})
	})
	
};

// get product details
module.exports.GetProductdetailes = function (req, res) {
	let galleryImages = null;
	let loggedIn = (req.isAuthenticated()) ? true : false;
	Product.findOne({slug: req.params.product}, function(err, product){
		if(err){
			conselo.log(err)
		}else{
			let gallerydir = 'public/product_images/'+ product._id + '/gallery';
			fs.readdir(gallerydir, function(err, files){
				if(err){
					conselo.log(err)
				}else{
					galleryImages = files;
					res.render('products/product',{
						title: product.title,
						p: product,
						galleryImages: galleryImages,
						loggedIn: loggedIn
					})

				}
			})
		}

	})
	
};
