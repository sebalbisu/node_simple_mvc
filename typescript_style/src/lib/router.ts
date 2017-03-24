import * as http from "http";
import {IncomingMessage as IReq, ServerResponse as IResp} from "http";
import {IRoutes, IRoute} from "./iroute";
import App from "./app";

export const GET = 'GET';
export const POST = 'POST';

export default class Router
{
    protected routes:IRoutes;

    protected app:App;

    protected req:IReq;

    protected resp:IResp;

    constructor(routes:IRoutes, app:App)
    {
        this.routes = routes;
        this.app = app;
    }

    notFound(req:IReq, resp:IResp, app:App):void
    {
        let httpCode = 404;
        resp.statusCode = httpCode;
        resp.statusMessage = http.STATUS_CODES[httpCode];
        resp.end(http.STATUS_CODES[httpCode]);
    }

    error(req:IReq, resp:IResp, app:App):void
    {
        let httpCode = 500;
        resp.statusCode = httpCode;
        resp.statusMessage = http.STATUS_CODES[httpCode];
        resp.end(http.STATUS_CODES[httpCode]);    
    }

    find(req:IReq):IRoute 
    {
        let [urlPath, query] = req.url.split('?', 2);

        let routeName:string = req.method.toUpperCase() + urlPath;

        return this.routes.hasOwnProperty(routeName) ?
            this.routes[routeName] : 
            this.notFound;
    }

    run(req:IReq, resp:IResp):void
    {     
        this.find(req)(req, resp, this.app);
    }
}