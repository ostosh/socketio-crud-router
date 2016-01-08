var models = require('../model/init');

var log = require('../util/log');
var logInfo = log.logInfo;
var logError = log.logError;
var logException = log.logException;


function getModel(sig){
  return models[sig['model']];
}

function getEvent(sig) {
  var e = sig['opt'] + ':'; 
  e += sig['endPoint'] + ':';
  e += sig['model'];
  return e;
};

function handleSucess(conn, msg, sig){
  return function(res){
    var e = getEvent(sig);
    conn.sendSucess(e, {'sig': sig});
  }
}
function handleResponse(conn, msg, sig){
  return function(res){
    var e = getEvent(sig);
    conn.sendResp(e, {'sig': sig, 'content': res});
  }
}
function handleError(conn, msg, sig){
  return function(res){
    var e = getEvent(sig);
    conn.sendError(e, {'sig': sig});
    logException(msg + ' ' +res);
  }
}

function create(conn){
  return function(data){
    logInfo('create request recieved ' + data['sig']['endPoint']);
    try{
      var model = getModel(data['sig']);
      var result = model.create(data);
      result
        .then(handleSucess(conn, '', data['sig']))
        .error(handleError(conn, 'cannot process api create /', data['sig']));
    }catch(err){
      handleError(conn, 'cannot process api create /', data['sig']);
    }
  }
}

function read(conn){
  return function(data){
    logInfo('read request recieved ' + data['sig']['endPoint']);
    try{
      var model = getModel(data['sig']);
      var result = model.read(data['content']);
      result
        .then(handleSucess(conn, '', data['sig']))
        .error(handleError(conn, 'cannot process api read /', data['sig']));
    }catch(err){
      handleError(conn, 'cannot process api read /', data['sig']);
    }
  }
}

function update(conn){
  return function(data){
    logInfo('update request recieved ' + data['sig']['endPoint']);
    try{
      var model = getModel(data['sig']);
      var result = model.update(data['content']);
      result
        .then(handleSucess(conn, '', data['sig']))
        .error(handleError(conn, 'cannot process api update /', data['sig']));
    }catch(err){
      handleError(conn, 'cannot process api update /', data['sig']);
    }
  }
}

function remove(conn){
  return function(data){
    logInfo('delete request recieved ' + data['sig']['endPoint']);
    try{
      var model = getModel(data['sig']);
      var result = model.remove(data['content']);
      result
        .then(handleSucess(conn, '', data['sig']))
        .error(handleError(conn, 'cannot process api delete /', data['sig']));
    }catch(err){
      handleError(conn, 'cannot process api delete /', data['sig']);
    }
  }
}

module.exports = {
  create    : create,
  read      : read,
  update    : update,
  remove    : remove
};
