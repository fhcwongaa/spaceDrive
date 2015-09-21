
//export module for routes
module.exports = function(app, passport, mongoose){
	//Home page
	app.get('/', function(req,res){
		res.render('home.html.ejs', {message: req.flash('loginMessage')});//home page file
	})


	//send post request for login process
	// app.post('/login', function(req,res){


	// })

	app.get('/game', isLoggedIn, function(req,res){
		res.render('dashboard.html.ejs',{
			user: req.user
		})
	})
   app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/game', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
   }));

	// test connection to Local DB
   app.get('/User', function(req,res){
   	mongoose.model('User').find(function(err, users){
   		res.send(users);
   	})
   })


	//send post request for create new user
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/game', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


	//log out route
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})



	//check for authentication
	function isLoggedIn(req, res, next){
		
		//check for session authentication
		if(req.isAuthenticated())
			return next();

		res.redirect('/');
	}


}