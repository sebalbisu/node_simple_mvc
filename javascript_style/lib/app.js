const http = require('http');
const path = require('path');
const Router = require('./router');
const View = require('./view');

module.exports = class App
{
	["@properties"](){ return {

	req: null,

	resp: null,

	port: null,

	routes: null,

	router: null,

	server: null,

	view: null,

	};}

	constructor({routes, viewFolder, port = 8080})
	{
		this.port = port;
		this.routes = routes;
		this.router = new Router(this.routes, this);
		this.server = http.createServer();
		this.view = new View({folder: viewFolder, app: this});
	}

	run()
	{	
		let viewPromise = this.view.loadTemplates();

		this.server.on('request', (req, resp) => {

		    this.router.run(req, resp);
		});

		Promise.all([viewPromise]).then(()=> {
			this.server.listen(this.port);
		});
	}
};

Object.assign(App.prototype, App.prototype["@properties"]());