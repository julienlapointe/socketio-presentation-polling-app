/* ------------------------------------------------------------------------------------------------------
THIS FILE OUTPUTS THE BAR GRAPH IF A QUESTION HAS BEEN ASKED
------------------------------------------------------------------------------------------------------ */
// child component
// manages output of the app's "board" screen / page

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
// include / require the React D3 BarChart component and store it in a variable
var BarChart = require('react-d3').BarChart;

/* ------------------------------------------------------------------------------------------------------
BOARD COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component for all instances of "board" screens / pages
var Board = React.createClass({
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    PREPARE DATA FOR D3 BAR GRAPH
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	barGraphData(results, currentQuestion) {
		var a = currentQuestion.a;
		var b = currentQuestion.b;
		var c = currentQuestion.c;
		var d = currentQuestion.d;
		var answers = [a, b, c, d];
		var counter = 0;
		return Object.keys(results).map(function(choice) {
			var label = choice.toUpperCase() + ". " + answers[counter];
			counter++;
			console.log(counter);
			return {
				label: label,
				value: results[choice]
			};
		});
	},
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    RENDERER
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// render the view
	render() {
		return (
			<div id="scoreboard" className="container">
				<h4><Link to="/">&#8592; Back to question</Link></h4>
				<Display if={this.props.status === 'connected' && this.props.currentQuestion}>
					<BarChart data={this.barGraphData(this.props.results, this.props.currentQuestion)} 
							  title={this.props.currentQuestion.q} 
							  height={window.innerHeight * 0.5} 
							  width={window.innerWidth * 0.6}
							  margin={{top: 10, bottom: 500, left: 50, right: 10}}
					/>
				</Display>
				<Display if={this.props.status === 'connected' && !this.props.currentQuestion}>
					<h4>Awaiting a Question...</h4>
				</Display>
			</div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Board;