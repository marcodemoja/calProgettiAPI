'use strict';

function ProjectsModel(database) {
    this.db = database;
    this.schema = new this.db.schema({
        name: {
            type: String,
            unique: true
        }
    });


    this.schema.pre('save',function(next){
       var self = this;

       database.cursor.model('projects').find({name: self.name},function(err, result){

           if(err) next(new Error(err));
           else if(result){
               self.invalidate("name" , "name must be unique");
               next(new Error("name field must be unique"));
           }else{
               next();
           }
       });

    });


    this.model = this.db.cursor.model('projects',this.schema);

};

ProjectsModel.prototype.add = function(newProject) {
    newProject = newProject.trim();
    var project = {
        name: newProject
    }
    var model = new this.model(project);

    return model.save;
};

ProjectsModel.prototype.findAll = function(start, limit){

    if(!start) start = 0;
    if(!limit) limit = 10;

    let promise = this.model.find({}).skip(start).limit(limit).exec();

    return promise;
};


module.exports = ProjectsModel;