/* ------------------------------------------------------------------------------------------------------
THIS FILE RUNS IN THE CLIENT'S BROWSER BEFORE ANYTHING ELSE
------------------------------------------------------------------------------------------------------ */
// root *javascript* file

/* ------------------------------------------------------------------------------------------------------
EXTERNAL FRAMEWORKS
------------------------------------------------------------------------------------------------------ */
// include / require the React framework and store it in a variable
var React = require('react');
// include / require the React Router and store it in a variable
var Router = require('react-router');
// use Router's "Route" component and store it in a variable
var Route = Router.Route;
// use Router's "DefaultRoute" component for the homepage and store it in a variable
var DefaultRoute = Router.DefaultRoute;
// use Router's "NotFoundRoute" component (triggered when user visits a URL path that doesn't exist) and store it in a variable
var NotFoundRoute = Router.NotFoundRoute;

/* ------------------------------------------------------------------------------------------------------
EXTERNAL COMPONENTS
------------------------------------------------------------------------------------------------------ */
// include / require the React components from APP.js
var APP = require('./components/APP');
var Audience = require('./components/Audience');
var Speaker = require('./components/Speaker');
var Board = require('./components/Board');
var Whoops404 = require('./components/Whoops404');

/* ------------------------------------------------------------------------------------------------------
ROUTE HANDLER
------------------------------------------------------------------------------------------------------ */
// initialize variable to hold the routes
// use parentheses for React components in JSX (JSX adds XML syntax to JavaScript)
/*
	re: <Route handler={APP}>
			...
		</Route>
	- main route (all other routes nested within it)
	- "the main route handler is the APP component"
	- APP component will always be displayed (contains the Header child component)
*/
/*
	re: <DefaultRoute handler={Audience} />
		<Route name="speaker" path="speaker" handler={Speaker}></Route>
		<Route name="board" path="board" handler={Board}></Route>
		<NotFoundRoute handler={Whoops404} />
	- every Route component has a "handler"
	- by default, show the "Audience" component when this application starts
	- "path" is the URL path the user enters in address bar to display the component ("/" brings user to Audience component)
*/
var routes = (
	<Route handler={APP}>
		<DefaultRoute handler={Audience} />
		<Route name="speaker" path="speaker" handler={Speaker}></Route>
		<Route name="board" path="board" handler={Board}></Route>
		<NotFoundRoute handler={Whoops404} />
	</Route>
);

/* ------------------------------------------------------------------------------------------------------
RENDERER
------------------------------------------------------------------------------------------------------ */
// renders whatever component the user "asked" for by route (URL)
// any properties (data) for the Audience, Speaker, and Board components / views need to be passed through the Handler
Router.run(routes, function(Handler) {
	React.render(<Handler />, document.getElementById('react-container'));
});

// render only the APP component (from APP.js) into the react-container
// React.render(<APP />, document.getElementById('react-container'));