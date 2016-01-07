
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function log(type, message){
  console.log(Date.now() + ' [' + type + ']: ' + message);
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
