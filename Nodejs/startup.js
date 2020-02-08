const sql = require('./lib/sqllib');
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const mime = require('mime');

var cnt = 0;
const root = __dirname + '/public';
var server = http.createServer((req, res) => {
    console.log('NO.' + cnt);
    cnt++;
    console.log('Method: ' + req.method);
    switch (req.method) {
        case 'GET':
            getResponse(req,res);
            break;
        default:
            break;
    }   
});
server.listen(3000, () => {
    console.log('Server is running!');
});

function getResponse(req, res) {
    let urlobj = url.parse(req.url);
    console.dir(urlobj);
    let urlpath = urlobj.pathname;
    if (urlpath == '/lib/sqllib.js') {
        sql.aaRetrieve((data) => {
            let htmstr = '<tr><th>ID</th><th>Value</th><th>Date and Time</th><th>Comment</th></tr>';
            for (let i in data) {
                htmstr += '<tr>';
                for (let j in data[i]) {
                    htmstr += '<td>' + data[i][j] + '</td>';
                }
                htmstr += '</tr>';
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.write(htmstr);
            res.end();
        });

    } else {
        if (urlpath == '/'){
            urlpath='/index.html'
        }
        let fullpath = path.join(root, urlpath);                    
        fs.exists(fullpath, (exists) => {
            if (exists) {
                let stream = fs.createReadStream(fullpath);
                res.statusCode = 200;
                let contype = mime.getType(path.basename(urlpath));
                console.log(contype);
                res.setHeader('Content-Type', contype);
                stream.pipe(res);
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain')
                res.write('EORROR 404, Resource Not Found.')
                res.end()
            }
        });
    }
}