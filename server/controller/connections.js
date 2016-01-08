var log = require('../util/log'),
    logInfo = log.logInfo,
    logError = log.logError,
    logException = log.logException;
var controllerDefinitions = require('./definitions');
var api = require('./api');

function Connection(socket){
  this.socket = socket;
}

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


//temp in mem holder for connections
var connections = {};
function processDisconnect(conn){
  return function(data){
    if(!conn){
      logException('cannot process disconnection. invalid socket given ' + conn);
    }else{
      delete connections[conn['socket']['id']];
      var count = Object.keys(connections).length
      logInfo('disconnected '+ conn['socket']['id'] + ' ' + count + ' outstanding');
    }
  }
}

function processConnect(socket){
  if(!socket){
    logException('cannot process connection. invalid socket given ' + socket);
  }else{
    var conn = new Connection(socket);
    connections[socket['id']] = conn;
    var count = Object.keys(connections).length
    logInfo('connected '+ conn['socket']['id'] + ' ' + count + ' outstanding');
    socket.on(controllerDefinitions.disconnect, processDisconnect(conn));
    socket.on(controllerDefinitions.create, api.create(conn));
  }
}


module.exports = {
  processDisconnect : processDisconnect,
  processConnect : processConnect,
  processAuthentication: function(){},
  processLogin: function(){},
  processLogout: function(){}

};
