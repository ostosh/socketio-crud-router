var log = require('../util/log'),
    logInfo = log.logInfo,
    logError = log.logError,
    logException = log.logException;
var controllerDefinitions = require('./definitions');
var api = require('./api');

function Connection(socket){
  this.socket = socket;
}

Connection.prototype.getEvent = function(sig) {
  var e = sig['opt'] + ':'; 
  e += sig['endPoint'] + ':';
  e += sig['model'];
  return e;
};

Connection.prototype.send = function(ns, data){
 this.socket.emit(ns, data);
};
Connection.prototype.sendError = function(ns, data){
  this.send(ns, {'sig' : data['sig'], 'success' : false});
};
Connection.prototype.sendSucess = function(ns, data){
  this.send(ns, {'sig' : data['sig'], 'success' : true});
};
Connection.prototype.sendResp = function(ns, data){
  this.send(ns, {content : data});
};
Connection.prototype.handleError = function(msg, sig){
  var conn = this;
  return function(res){    
    var e = conn.getEvent(sig);
    conn.sendError(e, {'sig': sig});
    logError(msg + ' ' +res);
  }
};
Connection.prototype.handleSucess = function (msg, sig){
  var conn = this;
  return function(res){
    var e = conn.getEvent(sig);
    conn.sendSucess(e, {'sig': sig});
  }
};
Connection.prototype.handleResp = function(msg, sig){
  var conn = this;
  return function(res){
    var e = conn.getEvent(sig);
    conn.sendResp(e, {'sig': sig, 'content': res});
  }
};

//temp in mem holder for connections
var connections = {};
function processDisconnect(conn){
  return function(data){
    if(!conn){
      logError('cannot process disconnection. invalid socket given ' + conn);
    }else{
      delete connections[conn['socket']['id']];
      var count = Object.keys(connections).length
      logInfo('disconnected '+ conn['socket']['id'] + ' ' + count + ' outstanding');
    }
  }
}

function processConnect(socket){
  if(!socket){
    logError('cannot process connection. invalid socket given ' + socket);
  }else{
    var conn = new Connection(socket);
    connections[socket['id']] = conn;
    var count = Object.keys(connections).length
    logInfo('connected '+ conn['socket']['id'] + ' ' + count + ' outstanding');

    socket.on(controllerDefinitions.disconnect, processDisconnect(conn));
    socket.on(controllerDefinitions.create, api.create(conn));
    socket.on(controllerDefinitions.read, api.read(conn));
    socket.on(controllerDefinitions.update, api.update(conn));
    socket.on(controllerDefinitions.remove, api.remove(conn));
  }
}


module.exports = {
  processDisconnect : processDisconnect,
  processConnect : processConnect,
  processAuthentication: function(){},
  processLogin: function(){},
  processLogout: function(){}

};
