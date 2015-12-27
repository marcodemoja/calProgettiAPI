'use strict';

var Boom = require('boom');
var MachinesModel = require('../models/machines');


function MachinesController(database){
      this.machinesModel = new MachinesModel(database);
};

/* [POST] /machines/{type} */
MachinesController.prototype.store = function(request, reply){
    try{

        let machine = request.payload.data;

        this.machinesModel.add(machine, function(err){
            if(err) reply(Boom.badRequest(err.message));
        }).then(function(){
            reply().created();
        });

    }catch(e){
        reply(Boom.badRequest(e.message));
    }
};

/* [GET] /machines */
MachinesController.prototype.index = function(request, reply){
    try{

        let findMachines = this.machinesModel.findAll();

        findMachines.then(function(results){
            reply(results);
        });


    }catch(e){
        reply(Boom.badRequest(e.message));
    }
};

/* [PUT] /machines/{id} */
MachinesController.prototype.update = function(request, reply){
    try{
        let promise = this.machinesModel.update(request.params.id, request.payload.data).exec();

        promise.then(function(res){
            reply(res);
        });


    }catch(e){
        reply(Boom.BadRequest(e.message));
    }
};

/*[DELETE] /machines/{id}*/
MachinesController.prototype.destroy = function(request, reply){
    try{
        this.machinesModel.destroy(request.params.id).then(function(result){
           reply().code(204);
        });
    }catch(e){
        reply(Boom.notFound(e.message));
    }
};

module.exports = MachinesController;
