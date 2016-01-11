var log = require('../util/log');
var logInfo = log.logInfo;
var logError = log.logError;
var logException = log.logException;

var validator = require('../util/validator');

function Router(models){
  this.models = models;
}   

Router.prototype.getModel = function (sig){
  if(!validator.isField(sig['model'], this.models) ){
    logException('model object not found: ' + sig['model']);
    return null;
  }
  return this.models[sig['model']];
};

Router.prototype.create = function(conn){
  var router = this;
  return function(req){
    logInfo('create request recieved ' + req['sig']['endPoint']);
    try{
      var model = router.getModel(req['sig']);
      model.create(conn, req);
    }catch(err){
      conn.handleError('cannot process api create ' + req['sig']['model'], req['sig']);
    }
  }
};

Router.prototype.read = function read(conn){
  var router = this;
  return function(req){
    logInfo('read request recieved ' + req['sig']['endPoint']);
    try{
      var model = router.getModel(req['sig']);
      model.read(conn, req);
    }catch(err){
      conn.handleError('cannot process api read for ' + req['sig']['model'], req['sig']);
    }
  }
};

Router.prototype.update = function update(conn){
  var router = this;
  return function(req){
    logInfo('update request recieved ' + req['sig']['endPoint']);
    try{
      var model = router.getModel(req['sig']);
      model.update(conn, req);
    }catch(err){
      conn.handleError('cannot process api update for ' + req['sig']['model'], req['sig']);
    }
  }
};

Router.prototype.remove = function remove(conn){
  var router = this;
  return function(req){
    logInfo('delete request recieved ' + req['sig']['endPoint']);
    try{
      var model = router.getModel(req['sig']);
      model.remove(conn, req);
    }catch(err){
      conn.sendError('cannot process api delete ' + req['sig']['model'], req);
    }
  }
};

function isModel(model){
  if(!validator.isObject(model)){
    logException('invalid type passed for model object: '  + model + ' ignoring model');
    return false;
  } else if(!validator.isField('create', model) || !validator.isFunction(model['create'])){
    logException('model object does not have "create" handler. ignoring.');
    return false;
  } else if(!validator.isField('read', model) || !validator.isFunction(model['read'])){
    logException('model object does not have "read" handler. ignoring.');
    return false;
  } else if(!validator.isField('update', model) || !validator.isFunction(model['update'])){
    logException('model object does not have "update" handler. ignoring.');
    return false;
  } else if(!validator.isField('remove', model) || !validator.isFunction(model['remove'])){
    logException('model object does not have "remove" handler. ignoring.');
    return false;
  }
  return true;
}

function sanitizeModels(models){
  for(var model in models){
    if(!isModel(models[model]))
      delete models[model];
  }
  return models;
}

function init(opts){
  var models = require(process.cwd() + opts['models']);
  if(!validator.isObject(models)){
    logException('initialization failed. invalid type passed for models object');
    return {};
  } else
    return new Router(sanitizeModels(models));
}

module.exports = {
  init : init
};
