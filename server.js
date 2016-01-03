'use strict';

const Hapi = require('hapi');
const Fs = require('fs');
const Db = require('./config/database');
const Server = new Hapi.Server({debug: {request:  ['info', 'error'] }});
const database = new Db();

//create server
Server.connection({
    host: 'localhost',
    port: 3000,
    routes: { cors: { origin: ['*'] } }	
});

// Add routes
var fsRoutes = Fs.readdirSync('./routes');
var routes = [];

Array.from(fsRoutes).forEach(function(file){
    var route = file.split('.')[0];
    routes.push({
        register: require('./routes/'+route),
        options: {
            database: database
        }
    });
});
Server.register(routes, function (err) {
    if (err) { throw err; }

    if (!module.parent) {
        Server.start(function(err) {
            if (err) { throw err; }
            console.log('server started at '+ Server.info.uri);
            Server.log('info', 'Server running at: ' + Server.info.uri);
        });
    }
});

module.exports = Server;




