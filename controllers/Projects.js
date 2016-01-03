'use strict';

var Boom = require('boom');
var ProjectsModel = require('../models/projects');

function ProjectsController(database) {
    this.projectsModel = new ProjectsModel(database);
};

// [GET] /projects
ProjectsController.prototype.index = function(request, reply) {
    var start = request.query.start;
    var limit = request.query.limit;

    if (start == null) {
        start = 0
    }

    if (limit == null) {
        limit = start + 9
    }
    this.projectsModel.findAll(start, limit).then(function(projects){
        reply({data:projects});
    });
};

// [GET] /projects/{id}
ProjectsController.prototype.show = function(request, reply) {
    try {
        var id = request.params.id;

        reply(this.ProjectsModel.getProject(id));
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

// [POST] /projects
ProjectsController.prototype.store = function(request, reply) {
    try {
        var value = request.payload.data.attributes.name;

        this.projectsModel.add(value)(function(err){
	   if(err){
            	reply(Boom.badRequest(err.message));
	   }
        }).then(function(){
            reply().created();
        });
    } catch (e) {
        reply(Boom.badRequest(e.message));
    }
};

// [PUT] /projects/{id}
ProjectsController.prototype.update = function(request, reply) {
    try {
        var id = request.params.id;
        var project = request.payload.data.attributes;

        reply(this.projectsModel.updateProject(id, project));
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

// [DELETE] /projects/{id}
ProjectsController.prototype.destroy = function(request, reply) {
    try {
        let id = request.params.id;

        this.projectsModel.destroy(id).then(function(result){
            reply().code(204);
        });
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

module.exports = ProjectsController;
