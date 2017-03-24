let fs = require('fs');

const GET = 'GET';
const POST = 'POST';

module.exports = 
{
    [[GET,'/']]: (req, resp, app) => {

        resp.end('plain text');
    },

    [[GET,'/notfound']]: (req, resp, app) => {

        app.router.notFound(req, resp);
    },

    [[GET,'/error']]: (req, resp, app) => {

        fs.readFile('not exists file', 'utf8', (err,data) =>{
            if (err) {
                app.router.error(req, resp); 
                throw err; 
            }
        });
    },

    [[GET,'/view']]: (req, resp, app) => {

        resp.end(app.view.render('layout.html', {
            title: 'hola mundo',
            content: app.view.render('view.html')
        }));
    },

    [[GET,'/json']]: (req, resp, app) => {

        resp.setHeader('Content-Type', 'application/json');
        resp.end(JSON.stringify({data: 123}));
    }
};