require('dotenv').config();
const express = require('express');
let path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
let passport = require('passport');
//router
//router admin
let page = require('./routers/adminPage.router.js');
let category = require('./routers/adminCategory.router.js');
let product = require('./routers/adminProduct.router.js');
// router index
let indexPage = require('./routers/Page.router.js');
let indexProduct = require('./routers/Product.router.js');
let indexCart = require('./routers/Cart.router.js');
let indexuser = require('./routers/User.router.js');
//content
mongoose.connect(process.env.MONGOSE_URL, { useNewUrlParser: true });
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('conten mongoose db')
});
//Init app;
let app = express();
//get Page Model
let Page = require('./models/page.models');
//get all pages to pass to header.ejs
Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
  if (err) {
    console.log(err);
  } else {
    app.locals.pages = pages;
  }

});
//get Category Model
let Category = require('./models/category.models');
//get all Category to pass to header.ejs
Category.find({}).sort({ sorting: 1 }).exec(function (err, categorys) {
  if (err) {
    console.log(err);
  } else {
    app.locals.categorys = categorys;
  }

});

// view engine setup
app.set('view engine', 'ejs');
app.set('views', './views');
//set global errors valiable
app.locals.errors = null;
// parse application
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())
//middleware validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      let extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default:
          return false;
      }
    }
  }
}));
// middleware session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  //cookie: { secure: true }
}))
//middleware messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//passport Config
require('./config/passport')(passport);
//passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next){
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
})

// middleware fileupload
app.use(fileUpload());
//set pucblic folder
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', function (req, res) {
//   res.render('index', { title: 'Hey', message: 'Hello there!' })
// })
// app.get('/', function (res, rep) {
//   res.render('index')
// })
//admin
app.use('', page);
app.use('', category);
app.use('', product);
//index
app.use('', indexPage);
app.use('', indexProduct);
app.use('', indexCart);
app.use('', indexuser);
//Start the server

let port = 4000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))