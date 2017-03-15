/* ------------------------------------------------------------------------------------------------------
THIS FILE OUPUTS VIEWS FOR THE SPEAKER ("START PRESENTATION" --> "PICK QUESTION + ATTENDANCE")
------------------------------------------------------------------------------------------------------ */
// child component
// manages output of the app's "speaker" screen / page

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');
// include / require the Display component and store it in a variable
// it will be used to display the speaker's "join" form view / screen when we don't have a speaker member and display the speaker's homepage view / screen when we do have a member

/* ------------------------------------------------------------------------------------------------------
EXTERNAL COMPONENTS
------------------------------------------------------------------------------------------------------ */
var Display = require('./parts/Display');
// include / require the JoinSpeaker component (form) and store it in a variable
var JoinSpeaker = require('./parts/JoinSpeaker');
// include / require the Attendance component (table of members)and store it in a variable
var Attendance = require('./parts/Attendance');
// include / require the Question component (table) and store it in a variable
var Questions = require('./parts/Questions');

/* ------------------------------------------------------------------------------------------------------
SPEAKER COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component for all instances of "speaker" screens / pages
var Speaker = React.createClass({
	// render the view
	// placeholder for questions + attendance
	// "Start the presentation" only displays IF this socket is connected, but there is no value for the member's name
	// <JoinSpeaker emit={this.props.emit} /> passes the "emit" property down to the JoinSpeaker child CHILD component so that it can "emit" the input form field values (speakerName and title) back to the server
	// <Display if={this.props.member.name && this.props.member.type === 'speaker'}> displays a screen of questions + attendance stats to the speaker IF the speaker already has a name and is of type "speaker"
	// if user does NOT already have a name, <Display if={!this.props.member.name}> displays a "Join the session" screen
	render() {
		return (
			<div className="container">
				<Display if={this.props.status === 'connected'}>
					<Display if={this.props.member.name && this.props.member.type === 'speaker'}>
						<Questions questions={this.props.questions} emit={this.props.emit} />
						<Attendance audience={this.props.audience} />
					</Display>
					<Display if={!this.props.member.name}>
						<JoinSpeaker emit={this.props.emit} />
					</Display>
				</Display>
			</div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Speaker;