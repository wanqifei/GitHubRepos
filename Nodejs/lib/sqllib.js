//Node.js file
/* 
 *   result.recordsets.length // count of recordsets returned by the procedure
 *   result.recordsets[0].length // count of rows contained in first recordset
 *   result.recordset) // first recordset from result.recordsets
 *   result.returnValue // procedure return value
 *   result.output // key/value collection of output values
 *   result.rowsAffected // array of numbers, each number represents the number of rows affected by executed statemens
 */
const sql = require('mssql');
const connectconfig = {
    user: 'sa',
    password: 'P@ssword',
    server: 'WANQIFEI',
    database: 'Historian'
};
// const connectstr = 'mssql://sa:P@ssword@localhost/Historian';
var queryStr = 'SELECT id, tagname, eroom, meter, devname, circuit, cabinet FROM dbo.TagInfo;';

/*--------------------callback style and use stream------------------------*/
/* const cpool = new sql.ConnectionPool(connectconfig);
cpool.on('error', err => {
    console.error('SQL error', err);
});

cpool.connect(err => {
    if (err) {
        console.error('connecting error', err);
        return;
    }
      retrieve(queryStr);
    for (let n = 67.7; n < 80; n++){
        insert(n);
    } 
    aaRetrieve();
});  */
//async await style  not use stream--------------------------------------------------
async function aaRetrieve( qStr, res, rej) {
    try {
        if (qStr) {
            queryStr = queryStr.slice(0, -1);
            queryStr += queryStr + ' WHERE ' + qStr + ';';
        }
        let cpool = await sql.connect(connectconfig);
        let result1 = await cpool.request().query(queryStr);
        
        let restable = result1.recordset;
        if (res) {
            res(restable);
        }
        //console.log(restable);
        // return restable;
        /* var data = result1.recordsets[0];        
        for (let i in data) {
            let instr = '';
            for (let j in data[i]) {
                instr += j + ': ' + data[i][j] + ' | ';
            }
            console.log(instr);
        } */
        await cpool.close()
    } catch (err) {
        console.error('Retrieve error!', err);
        if (rej) {
            rej(err);
        }
    }
}
function retrieve(queryStr) {
    let request = cpool.request();// or: new sql.Request(cpool)
    request.stream = true;
    request.query(queryStr);
    request.on('recordset', columns => {
        console.log('the columns of first recordset:');
        for (let i in columns) {
            console.log(i + ': ' + columns[i]);
        }
    });
    request.on('row', row => {
        console.log('Rows as follows:');
        for (let i in row) {
            console.log(i + ': ' + row[i]);
        }
    });
    request.on('error', err => {
        console.error('Data error!', err);
    });
    request.on('done', result => {
        console.log('The last one!')
        for (let i in result) {
            console.log(i + ': ' + result[i]);
        }
        // cpool.close();
    });    
}
function insert(value) {
    /* CREATE PROCEDURE dbo.storeProc
    @input_val AS FLOAT,
    @input_cmt AS NVARCHAR(100)
    AS
    BEGIN
    INSERT INTO dbo.TimeLog(val, comment)
    VALUES
    (@input_val, @input_cmt)
    END; */
    let request = new sql.Request(cpool);
    request.input('input_val', sql.Float, value)
        .input('input_cmt', sql.NVarChar, '通过nodejs程序插入的值')
        .execute('dbo.storeProc', (err, res) => {
            if (err) {
                console.error('insert error!', err);
                return false;
            }
            console.log('insert successed.');
            return true;
            // console.log(res);            
        });
}
 
// async await style should add try catch clause
async function asyncawaitfn() {
    await cpool.connect();    
    let request = cpool.request();
    request.stream = true;
    request.query('SELECT * FROM dbo.TimeLog;');
    request.on('recordset', columns => {
        console.log('the columns of first recordset:');
        for (let i in columns) {
            console.log(i + ': ' + columns[i]);
        }
    });
    request.on('row', row => {
        console.log('Rows as follows:');
        for (let i in row) {
            console.log(i + ': ' + row[i]);
        }
    });
    request.on('error', err => {
        console.error('Data error!', err);
    });
    request.on('done', result => {
        console.log('The last one!')
        for (let i in result) {
            console.log(i + ': ' + result[i]);
        }
        // cpool.close();
    });
}//not used

function closepool() {
    cpool.close();
    console.log('Connection pool is closed.');
}

module.exports = {
    closepool: closepool,
    insert: insert,
    aaRetrieve: aaRetrieve
}