'use strict';

function ProjectsModel(database) {
    this.db = database;
    this.model = this.db.setModel('projects',{
        name: {
            type: String,
            unique: true
        }
    });

};

ProjectsModel.prototype.findAll = function(args, callback) {
    var query;

    if( typeof callback == 'function')
        query = this.model.find(args, callback).exec();
    else
       query = this.model.find(args).exec();

    return query;
};

ProjectsModel.prototype.findByProperty = function(prop, value) {
    var project, i, len;
    var query = this.findAll({})

    for (i = 0, len = projects.length; i < len; i++) {
        project = projects[i];
        if (project[prop] === value) {
            return project;
        }
    }

    return null;
};

ProjectsModel.prototype.findAllWithStartLimit = function(start, limit) {
    var promise = this.findAll({},function(err, models){
        return models.slice(start, limit + 1);
    });

    return promise;
};

ProjectsModel.prototype.findOne = function(id) {
    var project = this.findByProperty('id', id);

    if (!project) {
        throw new Error('Project doesn\'t exists.');
    }

    return project;
};

ProjectsModel.prototype.add = function(newProject) {
    newProject = newProject.trim();
    var project = {
        name: newProject
    }
    var model = new this.model(project);

    return model.save();
};

ProjectsModel.prototype.update = function(id, updatedProject) {
    updatedProject = updatedProject.trim();

    var project = this.findByProperty('id', id);

    if (!project) {
        throw new Error('Project doesn\'t exists.');
    }

    project.value = updatedProject;

    return project;
};

ProjectsModel.prototype.delete = function(id) {
    if (!this.findByProperty('id', id)) {
        throw new Error('Project doesn\'t exists.');
    }

    var project, i, len;
    var projects = this.findAll();

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