var time = require('./time');

function log(type, message){
  console.log(time.now() + ' [' + type + ']: ' + message);
}

module.exports = {
  logInfo: function (message){
   log('INFO', message);
  },
  
  logError: function (message){
    log('ERROR', message);
  },
  
  logException: function (message){
    log('EXCEPTION', message);
  }
};
