'use strict';

const Mongoose = require('mongoose'),
Schema = Mongoose.Schema;

module.exports = function(){

    function Database(){
        this.cursor = Mongoose.connect('mongodb://localhost/calProgetti');
        this.connection = Mongoose.connection;
        this.schema = Schema;

        this.connection.once('open',function(callback){
            console.log('opened connection to mongodb');
        });

    };

    return new Database();

};




