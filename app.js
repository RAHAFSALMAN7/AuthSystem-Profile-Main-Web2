const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require("dotenv").config();

// New stuff to add
//---------------------------------------------------
const hbs = require('hbs');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyparser = require("body-parser");
const exphbs = require("express-handlebars");
//const Strategy = require('passport-local').Strategy;
const authUtils = require('./utils/auth');
const session = require('express-session');
const flash = require('connect-flash');
const users = require("./models/userModel");
const connection = require("./db");

// --------------------------------------------------
const userControllerRouter = require("./controllers/userController");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const assetpageRouter = require('./routes/assetpage');
const userassetpageRouter=require('./routes/userassetpage');
const myassetRouter = require('./routes/myasset');

// Add new routes
// --------------------------------------------------
const authRouter = require('./routes/auth');
const assetRouter = require('./routes/asset');

const port = 3000
const app = express();
app.use(express.json());
connection();
passport.serializeUser((users, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  done(null, { id });
});
// --------------------------------------------------



app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(express.static("images"));
app.get("/static", (req, res) => {
  res.render("static");
});

// Route to display dynamic src images
app.get("/dynamic", (req, res) => {
  imageList = [];
  imageList.push({ src: "/public/images/home.png", name: "home" });
  imageList.push({ src: "/public/images/user.png", name: "user" });
  imageList.push({ src: "/public/images/myasset.png", name: "myasset" });
  imageList.push({ src: "/public/images/logout.png", name: "logout" });

  res.render("userasset", { imageList: imageList });
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.engine('hbs',  exphbs.engine({ extname: 'hbs', defaultLayout: 'layout',
        runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true,
        },
     layoutsDir: __dirname + '/views/layout' }));
app.use(express.static(__dirname + '/public'));

// Set partials for handlebars
// --------------------------------------------------
hbs.registerPartials(path.join(__dirname, 'views/partials'));
// --------------------------------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'session secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  next();
});
// --------------------------------------------------

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/assetpage',assetpageRouter);
app.use('/userassetpage',userassetpageRouter);
app.use('/myasset',myassetRouter);

// Add new routes
// --------------------------------------------------
app.use('/auth', authRouter);
app.use('/asset', assetRouter);
//app.use('/', userControllerRouter);
// --------------------------------------------------

//------------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
})

module.exports = app;
