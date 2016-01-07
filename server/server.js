var express = require('express');
var socketio = require('socket.io');


var log = require('./util/log');
var logInfo = log.logInfo;
var logError = log.logError;
var logException = log.logException;

var controllerDefinitions = require('./controller/definitions');
var connectionsController = require('./controller/connections');

var conn = require('./util/thinky');
var model = require('./model/init');

//init socket controller
function initSockets(io){
  var io = socketio.listen(server);
  io.sockets.on(controllerDefinitions['connection'], connectionsController.processConnect);
}


//init server
function initServer(){ 
  
  var app = express();
  app.use(express.static('./public/dist'));
  var server = app.listen(3000);
  logInfo('dev server started listening on http://localhost:' + 3000);
  return server;
}


var server = initServer();
initSockets(server);