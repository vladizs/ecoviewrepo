const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const db = require('./config/db')
const parser = require('./app/parser');
app.use(bodyParser.urlencoded({extended: true}));
const port = process.env.PORT || 3000;

MongoClient.connect(db.url, (err, client) => {
    if (err) return console.log(err);
    let database = client.db('ecoview_data');
    require('./app/routes')(app, database);
    app.listen(port, () => {
        console.log('Listening on port ' + port);
    });
    parser.startUpdater(database);
});