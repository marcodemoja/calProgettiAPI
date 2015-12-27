'use strict';

function MachinesModel(database,type){
    this.db = database;
    this.setSchema(type);
};

MachinesModel.prototype.setSchema = function(){
        this.schema = new this.db.schema({
            rif:{
                type: String,
                unique: true
            },
            sigla:{
                type: String,
                unique: true
            },
            descrizione:{
                type:String
            },
            numero:{
                type: Number
            },
            servizio:{
                type: String
            },
            fluidoTrattato:{
                type: String
            },
            temperatura:{
                type: Number
            },
            ph: {
                type: String
            },
            child: {}
        });


    this.model = this.db.cursor.model('machines',this.schema);

    this.preSave();


};

MachinesModel.prototype.preSave = function(){
    var model = this.model;
    return this.schema.pre('save', function(next){
        var self = this;

        model.findOne({$or: [{rif: self.rif}, {sigla: self.sigla}]}, function(err, result){
            if(err){
                next(new Error(err));
            }  else if(result){
                var duplicateKeyError = [];

                if(result.rif == self.rif) {
                    self.invalidate("rif", "rif must be unique");
                    duplicateKeyError[0] = "|rif field must be unique";
                }
                if(result.sigla == self.sigla){
                    self.invalidate("sigla", "sigla must be unique");
                    duplicateKeyError[1] = "|sigla field must be unique";
                }

                next(new Error(duplicateKeyError));

            }else{
                next();
            }
        });
    });
};

MachinesModel.prototype.add = function(machine, callback){

    var newMachine = new this.model(machine);

    if(typeof callback == 'function')
        return newMachine.save(callback);
    else
        return newMachine.save();
};

MachinesModel.prototype.findAll = function(start, limit){

    if(!start) start = 0;
    if(!limit) limit = 10;

    let promise = this.model.find({}).skip(start).limit(limit).exec();

    return promise;
};

MachinesModel.prototype.update = function(id, machine){
    let promise = this.model.where({ _id: id }).update(machine);

    return promise;
};

module.exports = MachinesModel;
