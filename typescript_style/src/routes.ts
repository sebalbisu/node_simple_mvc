import * as fs from "fs";
import {GET, POST} from "./lib/router";
import {IncomingMessage as IReq, ServerResponse as IResp} from "http";
import {IRoutes, IRoute} from "./lib/iroute";
import App from "./lib/app";


export let routes:IRoutes = 
{
	[GET+'/']: (req:IReq, resp:IResp, app:App) => {

		resp.end('plain text');
	},

	[GET+'/notfound']: (req:IReq, resp:IResp, app:App) => {

		app.router.notFound(req, resp, app);
	},

	[GET+'/error']: (req:IReq, resp:IResp, app:App) => {

		fs.readFile('not exists file', 'utf8', (err,data) =>{
			if (err) {
				app.router.error(req, resp, app); 
				throw err; 
			}
		});
	},

	[GET+'/view']: (req:IReq, resp:IResp, app:App) => {

		resp.end(app.view.render('layout.html', {
			title: 'hola mundo',
			content: app.view.render('view.html')
		}));
	},

	[GET+'/json']: (req:IReq, resp:IResp, app:App) => {

		resp.setHeader('Content-Type', 'application/json');
		resp.end(JSON.stringify({data: 123}));
	}
};

export default routes;