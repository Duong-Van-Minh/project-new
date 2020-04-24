//models database
let Product = require('../models/product.models.js');

//get pages index
module.exports.getcart = function (req, res) {
	let slug = req.params.product;
	Product.findOne({ slug: slug }, function (err, p) {
		if (err)
			conselo.log(err)
		if (typeof req.session.cart == "undefined") {
			req.session.cart = [];
			req.session.cart.push({
				title: slug,
				qty: 1,
				price: parseFloat(p.price).toFixed(2),
				image: '/product_images/' + p._id + '/' + p.image
			});
		} else {
			let cart = req.session.cart;
			let newItem = true;

			for (let i = 0; i < cart.length; i++) {
				if (cart[i].title == slug) {
					cart[i].qty++;
					newItem = false;
					break;
				}
			}

			if (newItem) {
				cart.push({
					title: slug,
					qty: 1,
					price: parseFloat(p.price).toFixed(2),
					image: '/product_images/' + p._id + '/' + p.image
				});
			}
		}


		//console.log(req.session.cart);
		req.flash('success', 'add product succes');
		res.redirect('back');
	})

};


//get add product to cart 
module.exports.GetProductAdd = function (req, res) {
	if(req.session.cart && req.session.cart.length == 0){
		delete req.session.cart;
		res.redirect('/cart/checkout');
	}else{
		res.render('products/checkout', {
			title: 'checkout',
			cart: req.session.cart
		})
	}
	
};

//get update product to cart 
module.exports.GetProductUpdate = function (req, res) {
	let slug = req.params.product;
	let cart = req.session.cart;
	let action = req.query.action;

	for (let i = 0; i < cart.length; i++) {
		if(cart[i].title == slug) {
			switch (action) {
				case "add":
					cart[i].qty++;
					break;
				case "remove":
					cart[i].qty--;
					if(cart[i].qty < 1)
					 	cart.splice(i,1);
					break;
				case "clear":
					cart.splice(i, 1);
					if(cart.length == 0)
						delete req.session.cart;
					break;
				
				default:
					console.log('update problem');
					break;
			}
		}
		
	}

	req.flash('success', 'cart update');
	res.redirect('/cart/checkout');
};

//get clear cart 
module.exports.GetProductClear = function (req, res) {
	delete req.session.cart;
	req.flash('success', 'clear cart ');
	res.redirect('/cart/checkout');
	
};