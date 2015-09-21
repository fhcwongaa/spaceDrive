
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


//user Schema model
var userSchema = mongoose.Schema({
	local : {
		name : String,
		username: String,
		password: String,
		racetime: String,

	}
})


//generate hash for password
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//password validity
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
};

//create model for users
module.exports = mongoose.model('User',userSchema);