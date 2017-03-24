const http = require('http');

class Router
{
    ["@properties"](){ return {

    routes: null,

    app: null,

    req: null,

    resp: null
        
    };}    

    constructor(routes, app)
    {
        this.routes = routes;
        this.app = app;
    }

    notFound(req, resp, app)
    {
        let httpCode = 404;
        resp.statusCode = httpCode;
        resp.statusMessage = http.STATUS_CODES[httpCode];
        resp.end(http.STATUS_CODES[httpCode]);
    }

    error(req, resp, app)
    {
        let httpCode = 500;
        resp.statusCode = httpCode;
        resp.statusMessage = http.STATUS_CODES[httpCode];
        resp.end(http.STATUS_CODES[httpCode]);    
    }

    find(req) 
    {
        let [urlPath, query] = req.url.split('?', 2);
        req.path = urlPath;
        req.query = query;

        let routeName = [req.method.toUpperCase(),urlPath];

        return this.routes.hasOwnProperty(routeName) ?
            this.routes[routeName] : 
            this.notFound;
    }

    run(req, resp)
    {     
        this.find(req)(req, resp, this.app);
    }
}

Object.assign(Router.prototype, Router.prototype["@properties"]());

module.exports = Router;