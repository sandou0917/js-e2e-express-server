const server = require('./server');
var snowflake = require('snowflake-sdk');

var connectionPool = snowflake.createPool(
    {
        account: 'uv38148.ap-northeast-1.aws',
        username: 'TESTSYSUSER',
        password: 'Sysuser0001',
        warehouse: 'PDB_DEV_WH',
        database: 'SFKSTD_CICD_FLY',
        application: 'ClientAppName'
    },
    // pool options
    {
        max: 10, // specifies the maximum number of connections in the pool
        min: 0   // specifies the minimum number of connections in the pool
    }
);

connectionPool.use(async (clientConnection) =>
{
    // Process using SELECT result.
    const statement4 = await clientConnection.execute({
        sqlText: 'SELECT MAX(id) AS MAXID FROM SFKSTD_CICD_FLY.TRZ_VC_OPT.DATATBL001;',
        complete: function (err, stmt, rows)
        {
            var stream = statement4.streamRows();
            stream.on('data', function (row)
            {
                console.log(row.MAXID);
            });
            stream.on('end', function (row)
            {
                console.log('All rows consumed');
            });
        }
    });
});

const port = process.env.PORT || 3000;

server.create()
    .then(app => {
        app.listen(port, () => {
            console.log(`Server has started on port ${port}!`);
        });
    }).catch(err => console.log(err));