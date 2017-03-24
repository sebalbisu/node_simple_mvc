require('source-map-support').install();
import * as path from "path";
import App from "./lib/app";
import {IncomingMessage as IReq, ServerResponse as IResp} from "http";
import routes from "./routes";


let app:App = new App({
	port: 1234,
	viewFolder: path.join(__dirname, '/../views/'),
	routes: routes
});

app.server.prependListener('request', (req:IReq, res:IResp) => 
{
    console.log(req.method + ' ' + req.url);
});

process.on('uncaughtException', (err:Error) => 
{
    console.error(err);
});

app.run();