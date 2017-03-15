/* ------------------------------------------------------------------------------------------------------
THIS FILE COLLECT'S THE PRESENTATION TITLE AND SPEAKER'S NAME
------------------------------------------------------------------------------------------------------ */
// "grandchild" component (under Audience in component tree?)
// manages output of the app's "Start presentation" screen / page

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');

/* ------------------------------------------------------------------------------------------------------
JOINSPEAKER COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component
var JoinSpeaker = React.createClass({
	// called when a user submits the form (below) and "starts" the presentation
	// this.refs.name and this.refs.title grab the values of the input form fields with the ref="name" and ref="title" attributes (see the form below)
	start() {
		var speakerName = React.findDOMNode(this.refs.name).value;
		// var title = React.findDOMNode(this.refs.title).value;
		// "emit" sends the input form data "memberName" / (this.refs.name).value from the client back to the server
		// "speakerName" and "title" are the "payload of data" / "data payload"
		this.props.emit('start', { name: speakerName, title: 'WebSocket Demo' });
	},
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    RENDERER
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// render the view
	render() {
		/*
			- "javascript:void(0)" ensures the form data doesn't get sent anywhere
			- onSubmit={this.join} calls the join() function (above) on form submission
			- HTML5 automatically validates all input form data and prevents submission if data is invalid
			- ref="name" and ref="title" is how React gets the input field value (similar to the "name" attribute)
		*/
		return (
			<div className="row">
				<h4>Start the session</h4>
				<form action="javascript:void(0)" onSubmit={this.start}>
					<div className="col-xs-12 col-md-2 no-padding">
						<input ref="name"
							   className="form-control"
						       placeholder="Enter your name..."
						       required />
					</div>
					<button className="col-xs-12 col-md-2 btn btn-success">Start Presentation</button>
				</form>
			</div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = JoinSpeaker;