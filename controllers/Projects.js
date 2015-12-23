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
    this.projectsModel.getProjects(start, limit).then(function(projects){
        console.log(projects);
        reply(projects);
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

// [POST] /tasks
ProjectsController.prototype.store = function(request, reply) {
    try {
        var value = request.payload.project;

        reply(this.projectsModel.addProject(value))
            .created();
    } catch (e) {
        reply(Boom.badRequest(e.message));
    }
};

// [PUT] /tasks/{id}
ProjectsController.prototype.update = function(request, reply) {
    try {
        var id = request.params.id;
        var task = request.payload.project;

        reply(this.projectsModel.updateProject(id, project));
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

// [DELETE] /tasks/{id}
ProjectsController.prototype.destroy = function(request, reply) {
    try {
        var id = request.params.id;

        this.projectsModel.deleteProject(id);
        reply().code(204);
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

module.exports = ProjectsController;