/* ------------------------------------------------------------------------------------------------------
THIS FILE MANAGES CONDITIONAL OUTPUT FOR COMPONENTS (IF STATEMENT)
------------------------------------------------------------------------------------------------------ */
// child component used by many other components
// manages output of all child and "grandchild" components

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');

/* ------------------------------------------------------------------------------------------------------
DISPLAY COMPONENT
------------------------------------------------------------------------------------------------------ */
// create a React component
// if the "if" property is true, then display the component's children
// "                     " false, then do nothing
var Display = React.createClass({
	render() {
		return (this.props.if) ? <div>{this.props.children}</div> : null;
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Display;