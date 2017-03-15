/* ------------------------------------------------------------------------------------------------------
THIS FILE OUTPUTS THE CONNECTION STATUS, PRESENTATION TITLE, AND SPEAKER'S NAME
------------------------------------------------------------------------------------------------------ */
// child component (move to "components" folder?)
// manages output of the app's header

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
var Display = require('./Display');

/* ------------------------------------------------------------------------------------------------------
HEADER COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component for the header on all screens / pages
var Header = React.createClass({
	// title property is required (must "send in a title" to use this Header component)
	propTypes: {
		title: React.PropTypes.string.isRequired
	},
	// status property is optional
	getDefaultProps() {
		return {
			status: 'disconnected'
		}
	},
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    RENDERER
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// render the view
	render() {
		/* must use "className" below bc "class" is a reserved word in JS */
		return (
			<header className="row">
				<Display if={this.props.status === 'connected'}>
					<div className="banner-connected">
						<Display if={this.props.audience.length > 1 || this.props.audience.length === 0}>
							<div>{this.props.audience.length} students connected.</div>
						</Display>
						<Display if={this.props.audience.length == 1}>
							<div>{this.props.audience.length} student connected.</div>
						</Display>
					</div>
				</Display>
				<Display if={this.props.status !== 'connected'}>
					<div className="banner-disconnected">Disconnected...</div>
				</Display>
				<div className="col-xs-12">
					<h2>
						{this.props.title} 
						<span className="grey-font"> by {this.props.speaker}</span>
					</h2>	
				</div>
			</header>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Header;