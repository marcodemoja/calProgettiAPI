'use strict';

const Mongoose = require('mongoose');

module.exports = function(){

    function Database(){
        this.cursor = Mongoose.connect('mongodb://localhost/calProgetti');
        this.connection = Mongoose.connection;

        this.connection.once('open',function(callback){
            console.log('opened connection to mongodb');
        });

    };


    Database.prototype.setModel = function(modelName,modelObject){
            var schema = this.cursor.Schema(modelObject);

            return this.cursor.model(modelName,schema);
    };

    Database.prototype.createIndex = function(){

    }




    return new Database();

};




