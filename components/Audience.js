/* ------------------------------------------------------------------------------------------------------
THIS FILE OUPUTS VIEWS FOR AUDIENCE MEMBERS (JOIN FORM --> WELCOME SCREEN W/ # OF AUDIENCE MEMBERS 
--> CURRENT QUESTION BEING ASKED)
------------------------------------------------------------------------------------------------------ */
// child component
// manages output of the app's "audience" screen / page

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');
// Router's "Link" component (<a href=""></a>)
var Link = require('react-router').Link;

/* ------------------------------------------------------------------------------------------------------
EXTERNAL COMPONENTS
------------------------------------------------------------------------------------------------------ */
// include / require the Display component and store it in a variable
var Display = require('./parts/Display');
// include / require the Join component (form) and store it in a variable
var Join = require('./parts/Join');
// include / require the Ask component (question answering) and store it in a variable
var Ask = require('./parts/Ask');

/* ------------------------------------------------------------------------------------------------------
AUDIENCE COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component for all instances of "audience" screens / pages
var Audience = React.createClass({
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    RENDERER
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// render the view
	render() {
		// "Join the session" only displays IF this socket is connected
		// <Join emit={this.props.emit} /> passes the "emit" property down to the Join child CHILD component so that it can "emit" the input form field value (memberName) back to the server
		// <Display if={this.props.member.name}> displays a welcome screen to user if the user already has a name
		// if user does NOT already have a name, <Display if={!this.props.member.name}> displays a "Join the session" screen
		return (
			<div className="container">
				<Display if={this.props.status === 'connected'}>
					<Display if={this.props.member.name}>
						<Display if={!this.props.currentQuestion}>
							<div className="row">
								<h4>Welcome {this.props.member.name} &#9786;</h4>
								<p className="top-margin">Questions will appear here...</p>
							</div>
						</Display>
						<Display if={this.props.currentQuestion}>
							<div className="row">
								<Ask question={this.props.currentQuestion} emit={this.props.emit} />
							</div>
						</Display>
					</Display>
					<Display if={!this.props.member.name}>
					    <Join emit={this.props.emit} />
					</Display>
				</Display>
			</div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Audience;