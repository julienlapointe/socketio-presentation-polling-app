/* ------------------------------------------------------------------------------------------------------
THIS FILE:
1. MANAGES THE CLIENT STATE 
2. ALL DATA SENT BETWEEN CLIENT <--> SERVER
THIS IS THE FIRST COMPONENT THAT GETS RENDERED INTO INDEX.HTML BY APP-CLIENT.JS
------------------------------------------------------------------------------------------------------ */
// root *component* file
// manages the "state" of the app
// all data sent between server (app-server.js) and client (app-client.js) passes through this APP component

/* ------------------------------------------------------------------------------------------------------
COMPONENT TREE
---------------------------------------------------------------------------------------------------------
- APP.js (renders Header.js [header appears in all components below])
    - Header.js
	- Audience.js (renders Join.js and Ask.js)
        - Join.js
        - Ask.js
	- Board.js (renders the D3 bar chart [not in "parts" folder])
    - Speaker.js (renders Questions.js, Attendance.js, and JoinSpeaker.js)
        - Questions.js
        - Attendance.js
        - JoinSpeaker.js
    - Whoops404.js (renders links to above components)
NOTE: all components make use of the Display.js component for conditional rendering w/ IF statements
------------------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');
// include / require the React Router and store it in a variable
var Router = require('react-router');
// include / require the React RouterHandler and store it in a variable
// RouteHandler is a variable that represents either the Audience, Board, or Speaker routes
var RouteHandler = Router.RouteHandler;
// include / require the Socket.io *client* framework and store it in a variable
var io = require('socket.io-client');

/* ------------------------------------------------------------------------------------------------------
EXTERNAL COMPONENTS
------------------------------------------------------------------------------------------------------ */
// include / require the Header React component and store it in a variable
var Header = require('./parts/Header');

/* ------------------------------------------------------------------------------------------------------
APP COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component
// the state of the APP component gets passed down to children components (Header, Audience, Speaker, Board, etc.)
const PORT = window.location.port || '';
console.log('port from APP.js: ' + PORT);
var APP = React.createClass({
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    INITIALIZE VARIABLES
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // when app first loads, app is disconnected, title is empty, and member is empty by default
    // need to keep the *client* states (below) in sync with *server* states (in app-server.js)
    // ex. "audience" state on client (below) needs to stay in sync with "audience" state on server (app-server.js)
    // NOTE: member object will hold the user's name and ID (member could be the speaker or an audience member)
    getInitialState() {
        return {
            status: 'disconnected',
            title: 'WebSocket Demo',
            member: {},
            audience: [],
            speaker: '',
            questions: [],
            currentQuestion: false,
            results: {}
        }
    },
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    EVENT HANDLERS
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // listeners that trigger callback functions / actions when a specific event happens
    // all incoming / outgoing data is handled by this.socket
    // all data coming FROM the server will go through these listeners in the componentWillMount() function
    // ex. when component mounts, add a socket to "this" component
    // "The first true life cycle method called is componentWillMount(). This method is only called one time, which is before the initial render. Since this method is called before render() our Component will not have access to the Native UI (DOM, etc.). We also will not have access to the children refs, because they are not created yet. The componentWillMount() is a chance for us to handle configuration, update our state, and in general prepare for the first render. At this point, props and initial state are defined. We can safely query this.props and this.state, knowing with certainty they are the current values. This means we can start performing calculations or processes based on the prop values." - https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/birth/premounting_with_componentwillmount.html
	componentWillMount() {
/* *****************************************************************************************************
        // THIS IS WHERE THE CLIENT ADDS / REQUESTS A WEBSOCKET CONNECTION
***************************************************************************************************** */
        // "io" is the socket.io-client
        // "http://" + window.location.hostname..." is the socket server that the client should connect to and PORT = window.location.port || '';
        // "this" refers to this instance of the APP component (for *this* user)
        // when component mounts, add a socket to "this" component
        // all incoming / outgoing data is handled by this.socket
        this.socket = io("http://" + window.location.hostname + PORT != '' ? (':'+PORT) : '');
        // event handlers
        this.socket.on('connect', this.connect);
        this.socket.on('welcome', this.updateState);
        this.socket.on('joined', this.joined);
        this.socket.on('audience', this.updateAudience);
        this.socket.on('start', this.start);
        this.socket.on('ask', this.ask);
        this.socket.on('results', this.updateResults);
        this.socket.on('end', this.updateState);
        this.socket.on('disconnect', this.disconnect);
    },
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    FUNCTIONS TRIGGERED BY EVENTS HANDLERS (ABOVE)
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // when a user / socket connects, check if they are a new user or returning user (data in sessionStorage)
    // if they are a returning user / socket, then re-populate their state with values from last session (ex. name, presentation title)
    connect() {
        // if this member is already in sessionStorage, then assign member ID in sessionStorage to this member; otherwise, do nothing
        var member = (sessionStorage.member) ? JSON.parse(sessionStorage.member) : null;
        // if we found the member in sessionStorage then re-join that member by emitting a "join" event and sending this member data back to the server
        // triggers "join" event on server
        if (member && member.type === 'audience') {
            this.emit('join', member);
        }
        // do the same for the speaker, but include their presentation title 
        // triggers "start" event on server
        else if (member && member.type === 'speaker') {
            this.emit('start', { name: member.name, title: sessionStorage.title });
        }
        // when this.connect callback function fires above, then set state status to "connected"
        // whenever we call "setState", React automatically reinvokes / re-runs render() below
        this.setState({ status: 'connected' });
        // alert user that they are connected and provide the socket ID
        // alert("Connected: " +  this.socket.id);
    },
    // when user is welcomed, they receive serverState data (ex. name of presentation) 
    // welcome(serverState) {
    // when user is welcomed, set / update the current title state on the client to mirror the state on the server
    // "this.setState({ title: serverState.title });" updates 1 property at a time
    // NOTE TO SELF: welcome() was replaced with updateState()
    updateState(serverState) {
        this.setState(serverState);
    },
    // this.joined is triggered (?) when we receive a new audience member / user
    // add "member" node to sessionStorage so that if the member / user refreshes the page, the app doesn't consider them a brand new member / user
    joined(member) {
        sessionStorage.member = JSON.stringify(member);
        this.setState({ member: member });
    },
    // updateAudience handler that updates the state of the audience on the client
    updateAudience(newAudience) {
        this.setState({ audience: newAudience });
    },
    // start handler is triggered (?) / "fired" by all sockets when the presentation starts
    // store the presentation title in sessionStorage; if speaker disconnects, then rejects (ex. refreshes the page), then the presentation title is not lost (the speaker's name is already saved in sessionStorage in the joined() function above
    start(presentation) {
        if (this.state.member.type === 'speaker') {
            sessionStorage.title = presentation.title;
        }
        this.setState(presentation);
    },
    // sets currentQuestion to the question that the speaker just asked
    ask(question) {
        sessionStorage.answer = '';
        this.setState({ 
            currentQuestion: question,
            results: {a:0,b:0,c:0,d:0} 
        });
    },
    // 
    updateResults(data) {
        this.setState({ results: data });
    },
    // this.disconnect function used in componentWillMount() above
    disconnect() {
        this.setState({ 
            status: 'disconnected',
            title: 'WebSocket Demo',
            speaker: '' 
        });
    },
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    PROPERTY FOR CLIENT COMPONENTS TO EMIT / SEND DATA BACK TO SERVER
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // all data going TO the server will go through this emit() function
    // ex. for Join component, the eventName is "join" and the payload (the data) is memberName
    emit(eventName, payload) {
        this.socket.emit(eventName, payload);
    },
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    RENDERER
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// NOTE: the render() function in ES5 looks like "render: function(){...}"
	// render function in ES6
	render() {
		// returns JSX
		// return (<h1>Hello World form React</h1>);
		// {this.state.status} would pass "connected" / "disconnected" state down to child component (Header)
		// {this.state.title} would pass title state (of presentation) down to child component (Header)
		/*
			re: <RouteHandler {...this.state} />
			- "..." is a "spread operator" that let's you pass in an entire object of properties (instead of 1 property at a time)
			- this.state passes down the entire "state" down to the Route Handler as properties (status, title, etc.)
		*/
		// emit={this.emit} passes the "emit" property down to the Audience child component so that it can (in turn) pass it down to the Join child component so that it can (in turn) "emit" the input form field value (memberName) back to the server
        // "this" refers to this instance of the APP component (for *this* user)
		return (
			<div>
		        <Header {...this.state} />
		        <RouteHandler emit={this.emit} {...this.state} />
		    </div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = APP;