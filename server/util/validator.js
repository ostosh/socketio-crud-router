var validator = require('validator');

//string validation

validator.extend('isPhone', function (val) {
  let len = val.match(/\d/g).length;
  return len===10||len===11;
});

validator.extend('isPassword', function (val) {
  return this.isString(val) && val.length >= 6;
});

validator.extend('inRange', function (bounds) {
  return function(val){
    return val >= bounds[0] && val <= bounds[1];
  }
});

//object validation

validator.hasField = function (obj, field) {
  return validator.isObject(obj) && field in obj;
};

//type validation

validator.isObject= function (obj) {
  return obj instanceof Object;
};

validator.extend('isString', function (val) {
  return typeof val === 'string';
});

validator.isArray = function (arr) {
  return arr instanceof Array;
};

validator.isFunction = function (fn) {
  return fn instanceof Function;
};


module.exports = validator;     

