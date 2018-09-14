var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./db');
global.__root   = __dirname + '/'; 

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var usernames = {};

var rooms = [];

var Room = require('./room/Room');
Room.find({}, function (err, rooms) {
    for (var i = 0; i != rooms.length; i++)
    	rooms.push(rooms[i]);
});

var Message = require('./message/Message');

io.on('connection', function(socket) {
	console.log('weshin');
	socket.emit('message', 'Connexion OK');
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username, room) {
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		if (rooms.indexOf(room) != -1) {
			socket.room = room;
			// add the client's username to the global list
			usernames[username] = username;
			// send client to room 1
			socket.join(room);
			// echo to client they've connected
			socket.emit('updatechat', 'SERVER', 'you have connected to ' + room);
			// echo to room 1 that a person has connected to their room
			socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
			socket.emit('updaterooms', rooms, room);
		}
		else
			socket.emit('error', 'Room inexistante');
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		Message.create({
	        id_sender : req.body.id_sender,
	        id_room : req.body.id_room,
	        content : req.body.content,
	        status: "active"
	    }, 
	    function (err, message) {
	        if (err) return res.status(500).send("There was a problem adding the information to the database.")
	        else {
	        	res.status(200).send(message);
	        	io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	        }
	    });
	});

	socket.on('switchRoom', function(newroom){
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// join new room, received as function parameter
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
		console.log('weshout');
	});
});

http.listen(4242, function() {
	console.log('#BalanceTonPort: *:4242');
});

var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;