//Node.js file
const sql=require('mssql');
const connectconfig = {
    user: 'sa',
    password: 'P@ssword',
    server: '(LocalDB)\\MSSQLLocalDB',
    database: 'Historian'
};
//UID=sa;PWD=P@ssword;
const connectstr = 'Driver=msnodesqlv8;Server=(localdb)\\MSSQLLocalDB;Integrated Security=true;Database=Historian;';

(async function () {
    try {
        let pool = await sql.connect(connectstr);
        let result1 = await pool.request().query('SELECT * FROM dbo.TimeLog;');
        console.dir(result1);
        await pool.close()
    } catch (err) {
        console.log(err);
    }
})();

sql.on('error', err => {
    console.log('连接失败!');
});