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
    server: 'WAN_AI',
    database: 'Historian'
};
// const connectstr = 'mssql://sa:P@ssword@localhost/Historian';
//async await style  not use stream--------------------------------------------------
async function fn1() {
    try {
        let pool = await sql.connect(connectconfig);
        let result1 = await pool.request().query('SELECT * FROM dbo.TimeLog;');
        console.log(result1);
        console.log('connect successfully!');
        var data = result1.recordsets[0];
        
        for (let i in data) {
            let instr = '';
            for (let j in data[i]) {
                instr += j + ': ' + data[i][j] + ' | ';
            }
            console.log(instr);
        }
        await pool.close()
    } catch (err) {
        console.log(err);
    }
};//not used

sql.on('error', err => {
    console.log('连接失败!');
});

/*---------------------------------callback style------------------------*/
const cpool = new sql.ConnectionPool(connectconfig);
cpool.on('error', err => {
    console.error('SQL error', err);
});

cpool.connect(err => {
    if (err) {
        console.error('connecting error', err);
        return;
    }
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
        cpool.close();
    });
});
 
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
        cpool.close();
    });
};//not used