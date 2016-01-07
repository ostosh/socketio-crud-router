var model = require('./model/init');


var log = require('../util/log');
var logInfo = log.logInfo;
var logError = log.logError;
var logException = log.logException;



function getModel(sig){
  return model[sig['model']];
}

function getEvent(sig) {
  var e = sig['opt'] + ':'; 
  e += sig['endPoint'] + ':';
  e += sig['key'];
  return e;
};

function create(conn){
  return function(data){
    var model = getModel(data['sig']);
    var e = getEvent(data['sig']);
    try{
      model.create(data['content']);
    }catch(err){
      conn['socket'].sendError(e);
    }
    conn['socket'].sendSucess(e);
  }
}

function read(conn){
  return function(data){
    var model = getModel(data['sig']);
    var e = getEvent(data['sig']);
    try{
      var record = model.read(data['content']);
    }catch(err){
      conn['socket'].sendError(e);
    }
    conn['socket'].sendResp(e, record);
  }
}

function update(conn){
  return function(data){
    var model = getModel(data['sig']);
    var e = getEvent(data['sig']);
    try{
      model.update(data['content']);
    }catch(err){
      conn['socket'].sendError(e);
    }
    conn['socket'].sendSucess(e);
  }
}

function remove(conn){
  return function(data){
    var model = getModel(data['sig']);
    var e = getEvent(data['sig']);
    try{
      model.remove(data['content']);
    }catch(err){
      conn['socket'].sendError(e);
    }
    conn['socket'].sendSucess(e);
  }
}

module.exports = {
  create    : create,
  read      : read,
  update    : update,
  remove    : remove
};
