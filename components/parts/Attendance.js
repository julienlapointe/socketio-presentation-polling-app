/* ------------------------------------------------------------------------------------------------------
THIS FILE OUTPUTS THE LIST / TABLE OF AUDIENCE MEMBERS
------------------------------------------------------------------------------------------------------ */
// "grandchild" component (under Speaker in component tree)
// manages output of the app's attendance data

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');

/* ------------------------------------------------------------------------------------------------------
ATTENDANCE COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component for the attendance data
var Attendance = React.createClass({
	// returns a JSX table row element
	// invoked once for each audience member
	// "member" is the audience member's data (name)
	// "i" is the index of that audience member
	addMemberRow(member, i) {
		return (
			<tr key={i}>
				<td>{member.name}</td>
				<td>{member.id}</td>
			</tr>
		);
	},
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    RENDERER
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// render the view
	render() {
		// .map() functions returns an array of JSX table row elements
		return (
			<div className="row">
				<h4>Attendance ({this.props.audience.length})</h4>
				<table className="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Socket ID</th>
						</tr>
					</thead>
					<tbody>
						{this.props.audience.map(this.addMemberRow)}
					</tbody>
				</table>
			</div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Attendance;