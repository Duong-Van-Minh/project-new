//models database
let Category = require('../models/category.models.js');


//get pages index
module.exports.index = function (req, res) {

	Category.find({}).exec(function (err, categorys) {
		if (err)
			return console.log(err)
		res.render('admin/Categoryindex', {
			category: categorys
		})
	})

};


//get Category add
module.exports.GetaddCategory = function (req, res) {
	let title = "";
	let slug = "";
	let content = "";

	res.render('admin/Categoryadd', {
		title: title,
		slug: slug
	})
};

//post page add
module.exports.PostaddCategory = function (req, res) {
	req.checkBody('title', 'Title must have a value').notEmpty();
	let title = req.body.title;
	let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();//tu tim hieu
	if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
	let errors = req.validationErrors();
	if (errors) {
		res.render('admin/Categoryadd', {
			errors: errors,
			title: title,
			slug: slug
		});
	} else {
		Category.findOne({ slug: slug }, function (err, category) {
			if (category) {
				req.flash('daner', 'category slug exits, choose another.');
				res.render('admin/Categoryadd', {
					title: title,
					slug: slug
				});
			} else {
				let category = new Category({
					title: title,
					slug: slug
				});
				category.save(function (err) {
					if (err)
						return console.log(err);
					Category.find({}).sort({ sorting: 1 }).exec(function (err, categorys) {
						if (err) {
							console.log(err);
						} else {
							req.app.locals.categorys = categorys;
						}

					});
					req.flash('success', 'category add new');
					res.redirect('/admin/category');
				});
			}
		})
	}
};

//get page edit
module.exports.GeteditCategory = function (req, res) {
	id = req.params.id;
	Category.findById({ _id: id }, function (err, category) {
		if (err)
			return conselo.log(err)
		res.render('admin/Categoryedit', {
			title: category.title,
			slug: category.slug,
			id: id
		})

	})
};




//post category edit
module.exports.PosteditCategory = function (req, res) {
	req.checkBody('title', 'Title must have a value').notEmpty();
	//req.checkBody('content', 'content must have a value').notEmpty();
	let title = req.body.title;
	let slugs = req.body.slug.replace(/\s+/g, '-').toLowerCase();//tu tim hieu 
	if (slugs == "")
		slugs = title.replace(/\s+/g, '-').toLowerCase();
	//let content = req.body.content;
	let id = req.params.id;
	let errors = req.validationErrors();
	if (errors) {
		res.render('admin/Categoryedit', {
			errors: errors,
			title: title,
			slug: slugs,
			id: id
		});
	} else {
		Category.findOne({ slug: slugs, _id: { '$ne': id } }, function (err, category) {
			if (category) {
				req.flash('daner', 'category slug exits, choose another.');
				res.render('admin/Categoryedit', {
					title: title,
					slug: slugs,
					id: id
				});
			} else {
				Category.findById(id, function (err, category) {
					if (err)
						return console.log(err);
					category.title = title;
					category.slug = slugs;


					category.save(function (err) {
						if (err)
							return console.log(err);
						Category.find({}).sort({ sorting: 1 }).exec(function (err, categorys) {
							if (err) {
								console.log(err);
							} else {
								req.app.locals.categorys = categorys;
							}

						});
						req.flash('success', 'Cate edit true');
						res.redirect('/admin/category');
					});

				});
			}
		})
	}
};


//get delete category

module.exports.GetDeleteCategory = function (req, res) {
	id = req.params.id;
	Category.findByIdAndRemove(id, function (err) {
		if (err)
			return conselo.log(err);
		Category.find({}).sort({ sorting: 1 }).exec(function (err, categorys) {
			if (err) {
				console.log(err);
			} else {
				req.app.locals.categorys = categorys;
			}

		});
		req.flash('success', 'category detete');
		res.redirect('/admin/category');


	})
};