const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const utils = require('./utils');
var snowflake = require('snowflake-sdk');

var connection = snowflake.createConnection({
    account: 'uv38148.ap-northeast-1.aws',
    username: 'TESTSYSUSER',
    password: 'Sysuser0001',
    warehouse: 'PDB_DEV_WH',
    database: 'SFKSTD_CICD_FLY',
    application: 'ClientAppName'
});

connection.connect( 
    function(err, conn) {
        if (err) {
            console.error('Unable to connect: ' + err.message);
        } 
        else {
            console.log('Successfully connected to Snowflake.');
            // Optional: store the connection ID.
            connection_ID = conn.getId();
        }
    }
);

var count = 0;

connection.execute({
    sqlText: 'SELECT COUNT(*) AS COUNTROW FROM SFKSTD_CICD_FLY.TRZ_VC_OPT.DATATBL001;',
    complete: function (err, stmt, rows)
    {
        count=rows[0].COUNTROW;
        console.log(rows[0].COUNTROW);
        console.log(rows);
        console.log(count);
    }
});

// fn to create express server
const create = async () => {

    // server
    const app = express();

    const router = express.Router();

    // app.set("view engine", "ejs");
    // app.set("views", "src");

    // app.use(express.urlencoded({ extended: false }));

    // app.use(
    //     router.get("/", (req, res, next) => {
    //       // views/index.ejsをレンダリングし、データを渡す
    //       res.render("index", { title: "Book Reviews" });
    //     })
    // );

    app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    
    // Log request
    app.use(utils.appLogger);

    // root route - serve static file
    app.get('/api/hello', (req, res) => {
        res.json({hello: 'goodbye'});
        res.end();
    });

    // root route - serve static file
    app.get('/', (req, res) => {
        //return res.sendFile(path.join(__dirname, '../public/client.html'));
        return res.send('<h1>Record Count='+count+'</h1>');
    });

    // Catch errors
    app.use(utils.logErrors);
    app.use(utils.clientError404Handler);
    app.use(utils.clientError500Handler);
    app.use(utils.errorHandler);

    return app;
};

module.exports = {
    create
};
