'use strict';

var Joi = require('joi');
var ProjectsController = require('../controllers/projects');


exports.register = function(server, option, next){
    //setup controller
    var projectsController = new ProjectsController(option.database);

    server.bind(projectsController);

    server.route([
        {
            method: 'GET',
            path: '/projects',
            config: {
                handler : projectsController.index,
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
            path: '/projects',
            config: {
                handler: projectsController.store,
                validate: {
                    payload: Joi.object().length(1).keys({
                        project: Joi.string().required().min(1).max(60)
                    })
                }
            }
        },
        {
            method: 'PUT',
            path: '/projects/{id}',
            config: {
                handler: projectsController.update,
                validate: {
                    params: {
                        id: Joi.string().regex(/[a-zA-Z0-9]{16}/)
                    },
                    payload: Joi.object().length(1).keys({
                        project: Joi.string().required().min(1).max(60)
                    })
                }
            }
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'routes-projects',
    version: '0.0.1'
};