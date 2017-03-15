/* ------------------------------------------------------------------------------------------------------
THIS FILE COLLECT'S THE NEW AUDIENCE MEMBER'S NAME
------------------------------------------------------------------------------------------------------ */
// "grandchild" component (under Audience in component tree?)
// manages output of the app's "Join the session" screen / page

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');
// Router's "Link" component (<a href=""></a>)
var Link = require('react-router').Link;

/* ------------------------------------------------------------------------------------------------------
JOIN COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component
var Join = React.createClass({
	// called when a user submits the form (below) 
	// this.refs.name grabs the value of the input form field with the ref="name" attribute (see the form below)
	join() {
		var memberName = React.findDOMNode(this.refs.name).value;
		// alert("TODO: Join member " + memberName);
		// "emit" sends the input form data "memberName" / (this.refs.name).value from the client back to the server
		// "memberName" can be called the "payload of data" / "data payload"
		this.props.emit('join', { name: memberName });
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
			- ref="name" is how React gets the input field value (similar to the "name" attribute)
			- <Link to="/speaker">Start the presentation</Link> is an anchor link to the "/speaker" route to join as a "speaker" type
		*/
		return (
			<div className="row">
				<h4>Join the session</h4>
				<form action="javascript:void(0)" onSubmit={this.join}>
						<div className="col-xs-12 col-md-2 no-padding">
							<input ref="name"
								   className="form-control"
							       placeholder="Enter your name..."
							       required />
						</div>
						<button className="col-xs-12 col-md-2 btn btn-primary">Join</button>
				</form>
			</div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Join;