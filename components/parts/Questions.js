/* ------------------------------------------------------------------------------------------------------
THIS FILE OUTPUTS A LIST OF QUESTIONS FOR THE SPEAKER TO CHOOSE / ASK THE AUDIENCE
------------------------------------------------------------------------------------------------------ */
// "grandchild" component (under Speaker in component tree?)
// manages output of the app's questions on the speaker screen / page

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');

/* ------------------------------------------------------------------------------------------------------
QUESTIONS COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component
var Questions = React.createClass({
	// emits an "ask" event and sends the clicked / current question to the server
	ask(question) {
		this.props.emit('ask', question);
	},
	// returns a JSX table row element
	// invoked once for each question
	// "question" is the question
	// "i" is the index of that question
	// <span onClick={this.ask.bind(null, question)}>{question.q}</span> means that when the speaker clicks on the <span>, question.q gets sent into the ask() function as the "question" argument
	addQuestion(question, i) {
		return (
			<div key={i}>
				<span onClick={this.ask.bind(null, question)}>{question.q}</span>
			</div>
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
				<h4>Questions</h4>
				<div id="questions">
					{this.props.questions.map(this.addQuestion)}
				</div>
			</div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Questions;