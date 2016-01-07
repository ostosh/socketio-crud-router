var log = require('../util/log'),
    logInfo = log.logInfo,
    logError = log.logError,
    logException = log.logException;
var controllerDefinitions = require('./definitions');

function Connection(socket){
  this.socket = socket;
}

Connection.prototype = {
  send: function(ns, data){
    this.socket.emit(ns, data);
  },
  sendError: function(ns){
    this.send(ns, {success : false});
  },
  sendSucess: function(ns){
    this.send(ns, {success : true});
  },
  sendResp: function(ns, data){
    this.send(ns, {content : data});
  }
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
    connections[socket['id']] = socket;
    var count = Object.keys(connections).length
    logInfo('connected '+ conn['socket']['id'] + ' ' + count + ' outstanding');
    socket.on(controllerDefinitions.disconnect, processDisconnect(conn));

  }
}


module.exports = {
  processDisconnect : processDisconnect,
  processConnect : processConnect,
  processAuthentication: function(){},
  processLogin: function(){},
  processLogout: function(){}

};
