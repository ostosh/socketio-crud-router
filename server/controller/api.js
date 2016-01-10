var models = require('../model/init');

var log = require('../util/log');
var logInfo = log.logInfo;
var logError = log.logError;
var logException = log.logException;


function getModel(sig){
  return models[sig['model']];
}

function create(conn){
  return function(req){
    logInfo('create request recieved ' + req['sig']['endPoint']);
    try{
      var model = getModel(req['sig']);
      model.create(conn, req);
    }catch(err){
      conn.handleError('cannot process api create /', req['sig']);
    }
  }
}

function read(conn){
  return function(req){
    logInfo('read request recieved ' + req['sig']['endPoint']);
    try{
      var model = getModel(req['sig']);
      model.read(conn, req);
    }catch(err){
      conn.handleError('cannot process api read /', req['sig']);
    }
  }
}

function update(conn){
  return function(req){
    logInfo('update request recieved ' + req['sig']['endPoint']);
    try{
      var model = getModel(req['sig']);
      model.update(conn, req);
    }catch(err){
      conn.handleError('cannot process api update /', req['sig']);
    }
  }
}

function remove(conn){
  return function(req){
    logInfo('delete request recieved ' + req['sig']['endPoint']);
    try{
      var model = getModel(req['sig']);
      model.remove(conn, req);
    }catch(err){
      conn.sendError('cannot process api delete /', req);
    }
  }
}

module.exports = {
  create    : create,
  read      : read,
  update    : update,
  remove    : remove
};
