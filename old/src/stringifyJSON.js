// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to have to write it from scratch:
// 


// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to have to write it from scratch:
var stringifyJSON = function (obj) {
  // your code goes here
    if (typeof(obj) === 'string') {
      return '"' + obj + '"';
    }
    else if (typeof(obj) === 'number' || typeof(obj) === 'boolean') {
      return obj.toString();
    }
    else if (_.isArray(obj)) {
      return '[' + _.map(obj, stringifyJSON).join(',') + ']';
    }
    else if (typeof(obj) === 'object') {
      if (obj === null) {
        return obj + '';
      }
      var arrstr = [];
      _.each(obj, function(value, key) {
         if (typeof(value) === 'undefined' || typeof(value) === 'function') {
          return null;
         }
         arrstr.push(stringifyJSON(key) + ':' + stringifyJSON(value));
      });
      console.log('{' + arrstr.join(',')+ '}');
      return ('{' + arrstr.join(',')+ '}');
    }
};

/*
var stringifyJSON = function (obj) {
  // your code goes here
    if (typeof(obj) === 'string') {
      return '"' + obj + '"';
    }
    else if (typeof(obj) === 'number' || typeof(obj) === 'boolean') {
      return obj.toString();
    }
    else if (_.isArray(obj)) {
      return '[' + _.map(obj, stringifyJSON).join(',') + ']';
    }
    else if (obj && typeof(obj) === 'object') {
      return '{' + _.filter(_.map(obj, function(value, key) {
          if (!(typeof(value) === 'function' || value === undefined)) {
            return stringifyJSON(key) + ':' + stringifyJSON(value);
          }
        }), function(el) {
        if (el !== '') {
          return el;
        }
      }).join(',') + '}';
    }

    else { //null
    
      return obj + '';
    }
};

*/

