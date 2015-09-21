var express = require('express');

//set port to 8080
var port = process.env.PORT || 4004
var dotenv = require('dotenv').load();

//socket io
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
// var SessionSockets = require('session.socket.io')
//   , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

//database file
var configDB = require('./config/database.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/***********Middleware***************/


require('./config/passport')(passport); // pass passport for configuration

//connect mongoose to MongoDB
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error){
    	console.error(error);
    } 
    else{
    	console.log('mongo connected');
    }
});

//set up express
app.use(morgan('dev'));
app.use(cookieParser()); //read cookies
app.use(bodyParser());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//passport js
// required for passport
app.use(session({ secret: 'gadianaartemis', key:'express.sid'})); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

var usernames = {};

// sessionSockets.on('connection', function (err, socket, session) {
  io.on('connection', function(socket){
		//open a socket
		socket.on('message', function(msg){
			console.log(msg);
			io.emit('message', socket.username, msg);
		})
		console.log("user connected");

		socket.on('adduser', function(username){
			socket.username = username; 
			usernames[username] = username; 
			socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
			io.sockets.emit('updateusers', usernames);
		})
		socket.on('disconnect', function(){
			delete usernames[socket.username];
			io.sockets.emit('updateusers',usernames);
		})

	});
// });



//routes
require('./app/routes.js')(app, passport,mongoose);


http.listen(port, function(){
	console.log("connecting on Server");
})



