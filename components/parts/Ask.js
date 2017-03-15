/* ------------------------------------------------------------------------------------------------------
THIS FILE MANAGES THE QUESTIONS / ANSWERS DISPLAYED TO AUDIENCE MEMBERS
------------------------------------------------------------------------------------------------------ */
// "grandchild" component
// manages output of the app's "question answering" screen / page for audience members

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
ASK COMPONENT
------------------------------------------------------------------------------------------------------ */
// create React component for all instances of "question answering" screens / pages for all audience members
var Ask = React.createClass({
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    INITIALIZE VARIABLES
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// when this component first loads, "choices" is empty and "answer" is undefined
    // need to keep the *client* states (below) in sync with *server* states (in app-server.js)
	getInitialState() {
		return {
			choices: [],
			answer: undefined
		};
	},
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    EVENT HANDLERS
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// listeners that trigger callback functions / actions when a specific event happens
	componentWillMount() {
		this.setUpChoices();
	},
	// "The componentWillReceiveProps() method is called when props are passed to the component instance." - https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/component_will_receive_props.html
	componentWillReceiveProps() {
		this.setUpChoices();
	},
	// sets state for / assign values to "choices" and "answer" (if user already answered and their answer was stored in sessionStorage)
	setUpChoices() {
		var choices = Object.keys(this.props.question);
		// choices.shift();
		this.setState({ 
			choices: ["a", "b", "c", "d"],
			answer: sessionStorage.answer
		});
	},
	// sets state for / assign values to "answer" and sends "answer" back to server
	select(choice) {
		this.setState({ answer: choice });
		sessionStorage.answer = choice;
		this.props.emit('answer', {
			question: this.props.question,
			choice: choice
		});
	},
	// prepares answer buttons for output
	addChoiceButton(choice, i) {
		var buttonTypes = ['primary', 'info', 'warning', 'danger'];
		return (
			<div className="button-spacing col-xs-12 col-md-6">
				<button key={i} 
				        className={"btn btn-" + buttonTypes[i]}
				        onClick={this.select.bind(null, choice)}>
					{choice.toUpperCase()}. {this.props.question[choice]}
				</button>
			</div>
		);
	},
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    RENDERER
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// render the view
	// className="row" not needed here because already included in Audience.js
	render() {
		return (
			<div id="currentQuestion">
				<Display if={this.state.answer}>
					<h4><Link to="/board">See results &#8594;</Link></h4>
					<h4>Your answer: {this.state.answer.toUpperCase()}. {this.props.question[this.state.answer]}</h4>
					<h4 className="green-font">Correct answer: {this.props.question.correct}</h4>
				</Display>
				<Display if={!this.state.answer}>
					<h4>{this.props.question.q}</h4>
					<div className="col-md-9">
						{this.state.choices.map(this.addChoiceButton)}
					</div>
				</Display>
			</div>
		);
	}
});

// make this module's properties and functions (above) available to other files
module.exports = Ask;