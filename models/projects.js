'use strict';

var crypto = require('crypto');

function ProjectsModel(database) {
    this.db = database;
    this.model = this.db.setModel('projects',{
        name: '',
    });

};

ProjectsModel.prototype.getAllProjects = function(callback) {
    var query;

    if( typeof callback == 'function')
        query = this.model.find(callback).exec();
    else
       query = this.model.find().exec();

    return query;
};

ProjectsModel.prototype.findProjectsByProperty = function(prop, value) {
    var project, i, len;
    var projects = this.getAllProjects();

    for (i = 0, len = projects.length; i < len; i++) {
        project = projects[i];
        if (project[prop] === value) {
            return project;
        }
    }

    return null;
};

ProjectsModel.prototype.getProjects = function(start, limit) {
    var promise = this.getAllProjects(function(err, models){
        return models.slice(start, limit + 1);
    });

    return promise;
};

ProjectsModel.prototype.getProject = function(id) {
    var project = this.findProjectsByProperty('id', id);

    if (!project) {
        throw new Error('Project doesn\'t exists.');
    }

    return project;
};

ProjectsModel.prototype.addProject = function(newProject) {
    var projects = this.getAllProjects();
    newProject = newProject.trim();

    // We don't want duplicates
    if (this.findProjectByProperty('value', newProject)) {
        throw new Error('Project already exists for id: ' + project.id);
    }

    var project = {
        // Collisions can happen but unlikely
        // 1 byte to hex turns into two characters
        id: crypto.randomBytes(8).toString('hex'),
        value: newProject
    }
    projects.push(project);

    //this.db.set('projects', projects);

    return project;
};

ProjectsModel.prototype.updateProject = function(id, updatedProject) {
    updatedProject = updatedProject.trim();

    var project = this.findProjectByProperty('id', id);

    if (!project) {
        throw new Error('Project doesn\'t exists.');
    }

    project.value = updatedProject;

    return project;
};

ProjectsModel.prototype.deleteProject = function(id) {
    if (!this.findProjectByProperty('id', id)) {
        throw new Error('Project doesn\'t exists.');
    }

    var project, i, len;
    var projects = this.getAllProjects();

    for (i = 0, len = projects.length; i < len; i++) {
        project = projects[i];
        if (project.id === id) {
            // Removes task
            projects.splice(i, 1);
            //this.db.set('projects', projects);
            return;
        }
    }
};

module.exports = ProjectsModel;