import * as http from "http";
import {IncomingMessage as IReq, ServerResponse as IResp} from "http";
import {IRoutes} from "./iroute";
import Router from "./router";
import View from "./view";

export default class App
{
	protected _req:IReq;

	protected _resp:IResp;

	protected port:number = 8080;

	protected _routes:IRoutes;

	protected _router:Router;

	protected _server:http.Server;

	protected _view:View;

	constructor(config: {routes:IRoutes, viewFolder:string, port?:number})
	{
		this.port = config.port || this.port;
		this._routes = config.routes;
		this._router = new Router(this._routes, this);
		this._server = http.createServer();
		this._view = new View({folder: config.viewFolder, app: this});
	}

	run():void
	{	
		let viewPromise:Promise<any> = this._view.loadTemplates();

		this._server.on('request', (req:IReq, resp:IResp) => {

		    this._router.run(req, resp);
		});

		Promise.all([viewPromise]).then(()=> {
			this._server.listen(this.port);
		})
		.catch((e:Error)=> console.log(e));
	}

	get req():IReq { return this._req; }	

	get resp():IResp { return this._resp; }	
	
	get router():Router { return this._router; }

	get server():http.Server { return this._server; }

	get view():View { return this._view; }
}