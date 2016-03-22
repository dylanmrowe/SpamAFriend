var express = require('express');
var router = express.Router();
//var User = require('models/user');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home2', { user: req.user });
	});

	router.get('/spamfriends', function(req, res){
		res.render('home2', { user: req.user });
	});

	router.post('/spamfriends', function(req, res){
	    console.log(req.body.title);
	    console.log(req.body.description);
	    res.send(req.body.title);
	    	                //send a welcome e-mail!!!
        var i;
        /*for(i=0; i<10; i++){
			var nodemailer = require("nodemailer");

			// create reusable transport method (opens pool of SMTP connections)
			var smtpTransport = nodemailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: "ashboy84@gmail.com",
			        pass: "scapapenguin1"
			    }
			});

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: "The Justice Troll  <ashboy84@gmail.com>", // sender address
			    to: req.body.title, // list of receivers
			    subject: "You're a mean person. 💕", // Subject line
			    text: "You're a mean person.", // plaintext body
			    html: "<b>Don't spam your friends.</b> <br>  <img src='http://b1969d.medialib.glogster.com/media/48772393b279e6c9a2c02358aaa092f4251dc7648adaf2f15f27edb7ecbec257/ie-6-troll-internet-explorer-browser-trollface.png' />", // html body
			}

			// send mail with defined transport object
			smtpTransport.sendMail(mailOptions, function(error, response){
			    if(error){
			        console.log(error);
			    }else{
			        console.log("Message sent: " + response.message);
			    }

			    // if you don't want to use this transport object anymore, uncomment following line
			    //smtpTransport.close(); // shut down the connection pool, no more messages
			});
		}*/
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook', 
		passport.authenticate('facebook', { authType: 'reauthenticate', scope : ["email"]}
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/home',
			failureRedirect : '/'
		})
	);

	// route for twitter authentication and login
	// different scopes while logging in
	router.get('/login/twitter', 
		passport.authenticate('twitter'));

	// handle the callback after facebook has authenticated the user
	router.get('/login/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/twitter',
			failureRedirect : '/'
		})
	);

	/* GET Twitter View Page */
	router.get('/twitter', isAuthenticated, function(req, res){
		res.render('twitter', { user: req.user });
	});

	return router;
}





