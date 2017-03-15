/* ------------------------------------------------------------------------------------------------------
THIS FILE MANAGES THE SERVER STATE
------------------------------------------------------------------------------------------------------ */
// NOTE: console.logs appear in Terminal (on server side), NOT in Google Chrome's Dev Tools Console (on client side)

// use strict mode
'use strict';

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the HTTP server and store it in a variable
const http = require('http');
// include / require the Express server framework for Node.js and store it in a variable
const express = require('express');
// include / require Socket.io and store it in a variable
const socketIO = require('socket.io');
// include / require the Path package (provides utilities for working with file and directory paths) and store it in a variable
const path = require('path');
// include / require Underscore (provides support for "each, map, reduce, filter, etc." without extending any core JavaScript objects) and store it in a variable
const _ = require('underscore');

/* ------------------------------------------------------------------------------------------------------
APPLICATION "STATE" VARIABLES
------------------------------------------------------------------------------------------------------ */
// initialize array to store all WebSocket connections
var connections = [];
// initialize default title variable
var title = 'WebSocket Demo';
// initialize array to store all audience members
var audience = [];
// initialize object to store speaker data (there is only 1 speaker so an array is not needed)
var speaker = {};
// add questions from app-questions.js and store it in a variable
var questions = require('./app-questions');
// initialize variable that tracks the current question being asked (if no question asked, then false)
var currentQuestion = false;
// initialize variable that tracks the answers from audience members
var results = {
	a: 0,
	b: 0,
	c: 0,
	d: 0
};

/* ------------------------------------------------------------------------------------------------------
SERVER CONFIGURATION (REARRANGE INSIDES)
------------------------------------------------------------------------------------------------------ */
// http://stackoverflow.com/questions/18679690/heroku-nodejs-app-with-r10-h10-and-h20-errors
// "Heroku sets a dynamically assigned port number to your app. Hence if you are strictly specifying a port number to be used, Heroku won't be able to do that. However, you should set a port number so that your app can execute on localhost. Hence, the pipe to a specified port number '3000'."
const PORT = process.env.PORT || 3000;
// provide path to index.html
// __dirname is the directory of this file (the file executing the script)
const INDEX = path.join(__dirname, '/public','index.html');
// create instance of an Express app
const app = express();
// tell Express to serve files from "public" folder for client
// "express.static" is called "middleware"
app.use(express.static(__dirname + '/public'));
// // tell express to also serve files from "bootstrap" folder
// app.use(express.static('./node_modules/bootstrap/dist'));
// GET request to index.html
app.get("/",(req, res) => res.sendFile(INDEX) );
// create the HTTP Express server
const server = http.createServer(app);
// include / require socket.io and listen on the HTTP Express server for incoming sockets
// "io" is a socket server that is also listening on port 3000
const io = socketIO().listen(server);
// tell express which port to run on
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
// confirm that server is running
console.log("Polling server is running at 'http://localhost:3000'");

/* ------------------------------------------------------------------------------------------------------
EVENT HANDLERS (REARRANGE INSIDES)
------------------------------------------------------------------------------------------------------ */
// event handler for when a socket connects
// when the "connection" event happens, the callback function fires
// ON
io.sockets.on('connection', function (socket) {
	// add new socket ID to connections array
	connections.push(socket);
	// confirm new # of sockets connected
    console.log("Connected: %s sockets connected.", connections.length);
    // listens for a "join" event (when a new audience member joins)
	// payload (memberName) gets passed into callback function as an argument
	// this.id inside the callback function refers to the ID of the socket that just emitted a "join" event
	// "newMember" is an object that contains both  the socket ID + the payload data ("memberName" from the client)
	// server now emits custom event "joined" back to client; it contains the socket ID + payload data (memberName) to confirm that the data was received
	// audience.push(newMember); adds new member to audience array
	// io.sockets.emit('audience', audience); *broadcasts* the updated audience array to *all* sockets (this.emit('joined', newMember); only emits to 1 socket)
	// ON
	socket.on('join', function(payload) {
		var newMember = {
			id: this.id,
			name: payload.name,
			type: 'audience'
		};
		this.emit('joined', newMember);
		audience.push(newMember);
		io.sockets.emit('audience', audience);
		console.log("Audience Joined: %s", payload.name);
	});
	// when a user connects, send data to them using "emit"
	// the "emit" method emits events that can be handled by the client
	// the "title" value gets passed from the server (this file) to the client (in APP.js, the "title" value is set to '' [nothing] at first, then updated to the server's value [serverState.title] in the "welcome" event), this value then gets rendered / returned in APP.js to the Header child component (Header.js) as properties and gets outputted to the user
	// only speaker's name (speaker.name) is passed to the client because the audience members / users don't need to know the speaker's ID (is this important?)
	// EMIT
	socket.emit('welcome', {
		title: title,
		audience: audience,
		speaker: speaker.name,
		questions: questions,
		currentQuestion: currentQuestion,
		results: results
	});
	// listens for the "start" event (when the speaker joins)
	// payload data contains both  the speaker's name and the presentation title
	// ON
	socket.on('start', function(payload) {
		speaker.name = payload.name
		speaker.id = this.id;
		speaker.type = 'speaker';
		title = payload.title;
		this.emit('joined', speaker);
		// broadcast presentation title and speaker's name to *all* sockets (just in case some audience members joined before the presentation started)
		io.sockets.emit('start', { title: title, speaker: speaker.name });
		// %s is similar to ? in PHP PDO bind parameters for database queries
		console.log("Presentation Started: '%s' by %s", title, speaker.name);
	});
	// when the speaker asks a question, we handle it with this callback function where the question is an argument
	// ON
	socket.on('ask', function(question) {
		currentQuestion = question;
		results = {a:0, b:0, c:0, d:0};
		// broadcast the current question to *all* sockets
		io.sockets.emit('ask', currentQuestion);
		console.log("Question Asked: '%s'", question.q);
	});
	// ON
	socket.on('answer', function(payload) {
		results[payload.choice]++;
		io.sockets.emit('results', results);
		console.log("Answer: '%s' - %j", payload.choice, results);
	});
	// disconnect event handler
	// "this" socket can only disconnect *once*
	// ONCE
	socket.once('disconnect', function() {
		// Underscore's _.findWhere() function takes the audience array and returns the audience member that has the same ID as the socket ID 
		// { id: this.id } is called the "query parameters"
		// this.id refers to the ID of the socket that just emitted a "disconnect" event (this socket)
		var member = _.findWhere(audience, { id: this.id });
		// only remove the member from the audience array IF the socket emitting the "disconnect" event is an Audience Member socket
		// audience.splice(audience.indexOf(member), 1); finds the index of the member that emitted the "disconnect" event and splices / removes that specific member from the audience array ("1" indicates to only remove 1 item from the array)
		// io.sockets.emit('audience', audience); emits / *broadcasts* the updated audience array to *all* sockets
		if (member) {
			audience.splice(audience.indexOf(member), 1);
			io.sockets.emit('audience', audience);
			console.log("Left: %s (%s audience members)", member.name, audience.length)
		}
		// if the socket ID emitting the "disconnect" event is NOT found in the "audience" array, then it must be the speaker's socket
		// if the speaker's socket is emitting the "disconnect" event, then clear the speaker object (name, ID) and reset presentation title
		// *broadcast* the "end" event to all sockets with resetted presentation title and speaker name
		// MEMBER SOCKETS WILL BE LISTENING FOR THE "END" EVENT?
		else if (this.id === speaker.id) {
			console.log("%s has left. '%s' is over.", speaker.name, title);
			speaker = {};
			title = "WebSocket Demo";
			io.sockets.emit('end', { title: title, speaker: '' });
		}
		// remove member associated with socket that emitted this "disconnect" event
		connections.splice(connections.indexOf(socket), 1);
		// in case the client has disconnected from socket, but the server hasn't...
		socket.disconnect();
		// confirm socket has disconnected
		console.log("Disconnected: %s sockets remaining.", connections.length);
	});
});

// NOTE: nothing gets rendered here because this is the server