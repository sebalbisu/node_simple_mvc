import {IncomingMessage as IReq, ServerResponse as IResp} from "http";
import App from "./app";

export interface IRoute 
{
    (req: IReq, resp: IResp, app:App): void;
}

export interface IRoutes
{
    [propName: string]: IRoute;
}