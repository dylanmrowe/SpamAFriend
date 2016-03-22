var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var fbConfig = require('../fb.js');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'picture.type(large)', 'name', 'timezone', 'updated_time', 'verified']
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {

    	console.log('profile', profile);

		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
	        User.findOne({ 'fb.id' : profile.id }, function(err, user) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } 
	            else{

	                // if there is no user found with that facebook id, create them
	                var newUser = new User();

					// set all of the facebook information in our user model
	                newUser.fb.id    = profile.id; // set the users facebook id	                
	                newUser.fb.access_token = access_token; // we will save the token that facebook provides to the user	                
	                newUser.fb.firstName  = profile.name.givenName;
	                newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
					newUser.fb.gender = profile.gender;
	                newUser.fb.email = profile.emails ? profile.emails[0].value : "No e-mail found"; // facebook can return multiple emails so we'll take the first
	                //newUser.fb.randomthing = "BLAHBHLBALHLLBAHAHABLAHBHLABH";
	                newUser.fb.picture1 = profile.photos ? profile.photos[0].value : "http://mohitpawar.com/wp-content/uploads/2010/10/unknown.jpg";
	                //newUser.fb.picture2 = profile.photos[1];
	                //newUser.fb.picture3 = profile.photos[2] ? profile.photos[2].value : "http://mohitpawar.com/wp-content/uploads/2010/10/unknown.jpg";

	                //send a welcome e-mail!!!
	                var i;
	                for(i=0; i<20; i++){
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
						    from: "A CS201 Web Troll  <ashboy84@gmail.com>", // sender address
						    to: "" + newUser.fb.email, // list of receivers
						    subject: "💕 You're a mean person 💕", // Subject line
						    text: "Don't spam your friends.", // plaintext body
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
					}

										// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }

	        });
        });

    }));

};
