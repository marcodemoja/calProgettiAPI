'use strict';

var Joi = require('joi');
var MachinesController = require('../controllers/machines');

exports.register = function(server, options, next){
    var machinesController = new MachinesController(options.database, server);

    server.bind(machinesController);

    server.route([
        {
            method: 'GET',
            path: '/machines',
            config: {
                handler : machinesController.index,
                validate: {
                    query: Joi.object().keys({
                        start: Joi.number().min(0),
                        limit: Joi.number().min(1)
                    })
                }
            }
        },
        {
            method: 'POST',
            path: '/machines',
            config: {
                handler: machinesController.store,
                validate: {
                    payload: Joi.object().keys( {
                        data:{
                          type: "machines",
                          id: Joi.string(),
                          attributes: {
                            rif: Joi.string().required().min(1).max(12),
                            sigla: Joi.string().required().min(1).max(12),
                            descrizione: Joi.string().required().min(1).max(100),
                            numero: Joi.number().required().min(1).max(12),
                            servizio: Joi.string().required().min(1).max(12),
                            fluidoTrattato: Joi.string().required().min(1).max(12),
                            temperatura: Joi.number().required().min(1).max(12),
                            ph: Joi.string().required().min(1).max(12),
                            child:Joi.object()
                          }

                        }})
                }
            }
        },
        {
            method: 'PUT',
            path: '/machines/{id}',
            config: {
                handler: machinesController.update,
                validate: {
                    params: {
                        id: Joi.string().regex(/[a-zA-Z0-9]{16}/)
                    },
                    payload: Joi.object().length(1).keys({
                        data: {
                          type: "machines",
                          id: Joi.string(),
                          attributes:{
                            descrizione: Joi.string().min(1).max(100),
                            numero: Joi.number().min(1).max(12),
                            servizio: Joi.string().min(1).max(12),
                            fluidoTrattato: Joi.string().min(1).max(12),
                            temperatura: Joi.number().min(1).max(12),
                            ph: Joi.string().min(1).max(12)
                          }
                        }
                    })
                }
            }
        },
        {
            method: 'DELETE',
            path: '/machines/{id}',
            config: {
                handler: machinesController.destroy,
                validate: {
                    params: {
                        id: Joi.string().regex(/[a-zA-Z0-9]{16}/)
                    }
                }
            }
        }
    ]);

    next();
}


exports.register.attributes = {
    name: 'routes-machines',
    version: '0.0.1'
}
