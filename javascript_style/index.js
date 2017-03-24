const path = require('path');
const App = require('./lib/app');
let routes = require('./routes');

let app = new App({
	port: 1234,
	viewFolder: path.join(__dirname, 'views/'),
	routes: routes
});

app.server.prependListener('request', (req, res) => 
{
    console.log(req.method + ' ' + req.url);
});

process.on('uncaughtException', (err) => 
{
    console.error(err);
});

app.run();