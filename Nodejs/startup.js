// const sql = require('./lib/sqllib');
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const mime = require('mime');

const root = __dirname + '/public';
var server = http.createServer((req, res) => {

    let urlobj = url.parse(req.url);
    let urlpath = urlobj.pathname;
    if (urlpath == '/'){
    urlpath='/index.html'
    }
    let fullpath = path.join(root, urlpath);
    fs.exists(fullpath, (exists) => {
        if (exists) {
            let stream = fs.createReadStream(fullpath);
            res.statusCode = 200;
            res.setHeader('Content-Type', mime.lookup(path.basename(urlpath)));
            stream.pipe(res);        
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain')
            res.write('EORROR 404, Resource Not Found.')
            res.end()
        }
    }) 
});
server.listen(3000, () => {
    console.log('Server is running!');
});