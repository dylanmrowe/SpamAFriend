
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	fb: {
		id: String,
		access_token: String,
		firstName: String,
		lastName: String,
		gender: String,
		email: String,
		randomthing: String,
		picture1: String,
		picture2: String,
		picture3: String
	},
	twitter: {
		id: String,
		token: String,
		username: String,
		displayName: String,
		lastStatus: String
	}
	
});