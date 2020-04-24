//models database
let Page = require('../models/page.models.js');


//get pages index
module.exports.index = function (req, res) {
	Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
		res.render('admin/Pageindex', {
			pages: pages
		})
	})

};


//get page add
module.exports.GetaddPage = function (req, res) {
	let title = "";
	let slug = "";
	let content = "";

	res.render('admin/PageAdd', {
		title: title,
		slug: slug,
		content: content
	})
};

//post page add
module.exports.PostaddPage = function (req, res) {
	req.checkBody('title', 'Title must have a value').notEmpty();
	req.checkBody('content', 'content must have a value').notEmpty();
	let title = req.body.title;
	let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();//tu tim hieu
	if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
	let content = req.body.content;
	let errors = req.validationErrors();
	if (errors) {
		res.render('admin/PageAdd', {
			errors: errors,
			title: title,
			slug: slug,
			content: content
		});
	} else {
		Page.findOne({ slug: slug }, function (err, page) {
			if (page) {
				req.flash('daner', 'page slug exits, choose another.');
				res.render('admin/PageAdd', {
					title: title,
					slug: slug,
					content: content
				});
			} else {
				let page = new Page({
					title: title,
					slug: slug,
					content: content,
					sorting: 100
				});
				page.save(function (err) {
					if (err)
						return conselo.log(err);
					Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
						if(err){
						  console.log(err);
						}else{
						  req.app.locals.pages = pages;
						}
					  
					});
					req.flash('success', 'Page add new');
					res.redirect('/admin/page');
				});
			}
		})
	}
};
// sort pages function
function sortPages(ids, callback) {
	let count = 0;
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		count++;
		(function (count) {
			Page.findById(id, function (err, page) {
				page.sorting = count;
				page.save(function (err) {
					if (err)
						return conselo.log(err);
					++count;
					if(count >= ids.length){
						callback();
					}
				});
			});
		})(count);


	}
}
//get reoder page
module.exports.Postreoder = function (req, res) {
	let ids = req.body['id[]'];
	sortPages(ids, function(){
		Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
			if(err){
			  console.log(err);
			}else{
			  req.app.locals.pages = pages;
			}
		  
		});
	});
};
//get page edit
module.exports.GeteditPage = function (req, res) {
	id = req.params.id;
	Page.findById({ _id: id }, function (err, page) {
		if (err)
			return conselo.log(err)
		res.render('admin/PageEdit', {
			title: page.title,
			slug: page.slug,
			content: page.content,
			id: page._id
		})


	})
};




//post page edit
module.exports.PosteditPage = function (req, res) {
	req.checkBody('title', 'Title must have a value').notEmpty();
	req.checkBody('content', 'content must have a value').notEmpty();
	let title = req.body.title;
	let slugs = req.body.slug;//tu tim hieu .replace(/\s+/g, '-').toLowerCase();
	if (slugs == "")
		slugs = title.replace(/\s+/g, '-').toLowerCase();
	let content = req.body.content;
	let id = req.params.id;
	let errors = req.validationErrors();
	if (errors) {
		res.render('admin/PageEdit', {
			errors: errors,
			title: title,
			slug: slugs,
			content: content,
			id: id
		});
	} else {
		Page.findOne({ slug: slugs, _id: { '$ne': id } }, function (err, page) {
			if (page) {
				req.flash('daner', 'page slug exits, choose another.');
				res.render('admin/PageEdit', {
					title: title,
					slug: slugs,
					content: content,
					id: id
				});
			} else {
				Page.findById(id, function (err, page) {
					if (err)
						return console.log(err);
					page.title = title;
					page.slug = slugs;
					page.content = content;
					
					page.save(function (err) {
						if (err)
							return console.log(err);
						Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
							if(err){
							  console.log(err);
							}else{
							  req.app.locals.pages = pages;
							}
						  
						});		
						req.flash('success', 'Page added');
						res.redirect('/admin/page');
					});

				});
			}
		})
	}
};


//get delete page

module.exports.GetDeletePage = function (req, res) {
	id = req.params.id;
	Page.findByIdAndRemove(id, function (err) {
		if (err)
			return conselo.log(err);
		Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
			if(err){
			  console.log(err);
			}else{
			  req.app.locals.pages = pages;
			}
		  
		});	
		req.flash('success', 'Page detete');
		res.redirect('/admin/page');


	})
};