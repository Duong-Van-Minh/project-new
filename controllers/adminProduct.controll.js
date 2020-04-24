
//require
const mkdirp = require('mkdirp');
let fs = require('fs-extra');
let resizeImg = require('resize-img');
//models database
let Category = require('../models/category.models.js');
let Product = require('../models/product.models.js');


//get product index
module.exports.index = function (req, res) {
	let count;

	Product.count(function (err, c) {
		count = c;
	});

	Product.find({}).exec(function (err, products) {
		if (err)
			return console.log(err)
		res.render('admin/Productindex', {
			product: products,
			count: count
		})
	})

};


//get product add
module.exports.GetaddProduct = function (req, res) {
	let title = "";
	let desc = "";
	let price = "";

	Category.find(function (err, categorys) {
		res.render('admin/Productadd', {
			title: title,
			desc: desc,
			price: price,
			category: categorys
		})
	})
};

//post product add
module.exports.PostaddProduct = function (req, res) {
	let imageFile = typeof req.files.avatar !== "undefined" ? req.files.avatar.name : "";

	req.checkBody('title', 'Title must have a value').notEmpty();
	req.checkBody('desc', 'desc must have a value').notEmpty();
	req.checkBody('price', 'price must have a value').isDecimal();
	req.checkBody('avatar', 'avatar must have a image').isImage(imageFile);

	let title = req.body.title;
	//let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();//tu tim hieu
	let slug = title.replace(/\s+/g, '-').toLowerCase();
	let desc = req.body.desc;
	let price = req.body.price;
	let category = req.body.category;
	let errors = req.validationErrors();

	if (errors) {
		Category.find(function (err, categorys) {
			res.render('admin/Productadd', {
				errors: errors,
				title: title,
				desc: desc,
				price: price,
				category: categorys
			})
		});
	} else {
		Product.findOne({ slug: slug }, function (err, product) {
			if (product) {
				req.flash('daner', 'product slug exits, choose another.');
				Category.find(function (err, categorys) {
					res.render('admin/Productadd', {
						title: title,
						desc: desc,
						price: price,
						category: categorys
					});
				});
			} else {
				let price2 = parseFloat(price).toFixed(2);

				let product = new Product({
					title: title,
					slug: slug,
					desc: desc,
					price: price2,
					category: category,
					image: imageFile
				});
				product.save(function (err) {
					if (err)
						return console.log(err);

					//create folder in public use mkdirp v0.5.5
					mkdirp('public/product_images/' + product._id, err => console.log(err));
					mkdirp('public/product_images/' + product._id + '/gallery', err => console.log(err));
					mkdirp('public/product_images/' + product._id + '/gallery/thumbs', err => console.log(err));
					if (imageFile != "") {
						let productImages = req.files.avatar;

						let path = "public/product_images/" + product._id + "/" + imageFile;
						productImages.mv(path, err => console.log(err));
					}

					req.flash('success', 'product add new');
					res.redirect('/admin/product');
				});
			}
		})
	}
};

//get Product edit
module.exports.GeteditProduct = function (req, res) {
	let errors;
	if (req.session.errors)
		errors = req.session.errors;
	req.session.errors = null;
	id = req.params.id;
	Category.find(function (err, category) {

		Product.findById(id, function (err, p) {
			if (err) {
				console.log(err);
				res.redirect('/admin/product');
			} else {
				let galleryDir = 'public/product_images/' + p._id + '/gallery';
				let galleryImager = null;
				fs.readdir(galleryDir, function (err, files) {
					if (err) {
						console.log(err);
					} else {
						galleryImager = files;
						res.render('admin/Productedit', {
							errors: errors,
							title: p.title,
							slug: p.slug,
							category: p.category.replace(/\s+/g, '-').toLowerCase(),
							categoryid: category,
							price: p.price,
							image: p.image,
							desc: p.desc,
							galleryImager: galleryImager,
							id: p.id
						})
					}
				})
			}
		})





	})
};




//post product edit
module.exports.PosteditProduct = function (req, res) {
	
	let imageFile = typeof req.files !== "" ? req.files.avatar.name : "";
	//console.log(typeof imageFile);
	req.checkBody('title', 'Title must have a value').notEmpty();
	req.checkBody('desc', 'desc must have a value').notEmpty();
	req.checkBody('price', 'price must have a value').isDecimal();
	req.checkBody('avatar', 'avatar must have a image').isImage(imageFile);

	let title = req.body.title;
	//let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();//tu tim hieu
	let slug = title.replace(/\s+/g, '-').toLowerCase();
	let desc = req.body.desc;
	let price = req.body.price;
	let category = req.body.category;
	let imgAvatar = req.body.imgAvatar;// image old
	let id = req.params.id
	let errors = req.validationErrors();

	if (errors) {
		req.session.errors = errors;
		res.redirect('/admin/edit-product/' + id)
	} else {
		Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, p) {// see slack with : slug
			if (err)
				console.log(err)
			if (p) {
				req.flash('danger', 'Product title exists, choose another.');
				res.redirect('/admin/edit-product/' + id);
			} else {
				Product.findById(id, function (err, product) {
					if (err)
						console.log(err)

					product.title = title;
					product.slug = slug;
					product.desc = desc;
					product.price = parseFloat(price).toFixed(2);
					product.category = category;
					if (imageFile !== "" ) {
						product.image = imageFile;
					}else{
						product.image = imgAvatar;
					}

					product.save(function (err) {
						if (err)
							console.log(err);

						if (imageFile != "") {
							if (imgAvatar != "") {
								fs.remove('public/product_images/' + id + '/' + imgAvatar, function (err) {
									if (err)
										console.log(err);
								})
							}
							let productImages = req.files.avatar !== "" ? req.files.avatar : req.body.imgAvatar;
							let path = 'public/product_images/' + id + '/' + imageFile;
							productImages.mv(path, function (err) {
								return console.log(err);
							});


						}

						req.flash('success', 'Product update true');
						res.redirect('/admin/product');

					})

				})
			}

		})
	}
};
//Post  mutiple UploadFiles

module.exports.Postgallery = function (req, res) {
	let productImages = req.files.file;
	let id = req.params.id;
	let path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
	let thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;

	productImages.mv(path, function (err) {
		if (err)
			console.log(err);
		resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(function (buf) {
			fs.writeFileSync(thumbsPath, buf);
		});
	});

	res.sendStatus(200);
};

//get delete image

module.exports.GetDeleteImage = function (req, res) {
	let id = req.query.id;
	let originalImage = 'public/product_images/' + id + '/gallery/' + req.params.image;
	let thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.params.image;

	fs.remove(originalImage, function (err) {
		if (err) {
			console.log(err)
		} else {
			fs.remove(thumbsPath, function (err) {
				if (err) {
					console.log(err)
				} else {
					req.flash('success', 'Product delete image ');
					res.redirect('/admin/edit-product/' + id);
				}
			})
		}
	})
};


//get delete category

module.exports.GetDeleteProduct = function (req, res) {
	id = req.params.id;
	let path = 'public/product_images/' + id;
	fs.remove(path, function (err){
		if(err){
			console.log(err)
		}else{
			Product.findByIdAndRemove(id, err => console.log(err));
			req.flash('success', 'product detete');
			res.redirect('/admin/product');
		}
	})
	
};