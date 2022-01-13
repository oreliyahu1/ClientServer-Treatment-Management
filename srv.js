const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const mongooseUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const app = express();
const port = process.env.PORT || 80;

__dirname += '/web/';
const pagesRef = {
  'login':'login.html',
  'contactus':'contactus.html',
  'signup':'signup.html',
  'maintance' : 'maintance.html',
  'notfound':'404.html'
};

const pagesLocation = {
  'login':'/log-in',
  'contactus':'/contact-us',
  'signup':'/sign-up',
  'maintance':'/maintance',
  'notfound':'/404',
};

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({secret:"clientserverproject!@#!@%@#a092340", resave:false, saveUninitialized:true}));
app.use('/alert', express.static(path.join(__dirname, 'alert'))); //static for web alert jquery html
app.use('/css', express.static(path.join(__dirname, 'css'))); //static for web css
app.use('/js', express.static(path.join(__dirname, 'js'))); //static for web js
app.use('/images', express.static(path.join(__dirname, 'images'))); //static for web images

require('./pages/contactus')(app, pagesLocation); //handle contact-us page requests
require('./api/user')(app, '/api/user', pagesLocation); //handle users requests
require('./api/treatment')(app, '/api/treatments'); //handle treatments requests

//init server => mongodb & port listen
mongoose.connect(mongooseUrl,  {dbName:'heroku_tgpxqtfq', useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }).then(() => {
	console.log("DB connected");
	app.listen(port);
	console.log("Server is running"); }
).catch(error  => { console.log("Cannot connect DB"); });

app.get('/', function(req, res) {
	res.redirect(pagesLocation.login);
});

//block fav.ico
app.get('/favicon.ico', function(req, res) {
	res.end();
});

//login page
app.get(pagesLocation.login, function(req, res) {
	if(req.session.user) //logged in
		res.redirect(pagesLocation.maintance);
	else
		res.sendFile(path.join(__dirname + pagesRef.login));
});

//contactus page
app.get(pagesLocation.contactus, function(req, res) {
	res.sendFile(path.join(__dirname + pagesRef.contactus));
});

//maintance page
app.get(pagesLocation.maintance, function(req, res) {
	if(!req.session.user) //block guests
		res.redirect(pagesLocation.notfound);
	else
		res.sendFile(path.join(__dirname + pagesRef.maintance));
});

//signup page
app.get(pagesLocation.signup, function(req, res) {
	if(req.session.user)
		res.redirect(pagesLocation.maintance);
	else
		res.sendFile(path.join(__dirname + pagesRef.signup));
});

//404 page
app.get(pagesLocation.notfound, function(req, res) {
	res.status(404);
	res.sendFile(path.join(__dirname + pagesRef.notfound));
});

//redirect to 404 page
app.get('*', function(req, res){
	res.redirect(pagesLocation.notfound);
});