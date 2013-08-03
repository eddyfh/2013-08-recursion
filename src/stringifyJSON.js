// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to have to write it from scratch:
var stringifyJSON = function (obj) {
  // your code goes here

	var type = Object.prototype.toString.call(obj);
	if (type == '[object Boolean]') {
		if (obj == true) return 'true'; 
		else return 'false';
	}
	else if (type == '[object Null]') {
		return 'null';
	}
	else if (type == '[object Number]') {
		return obj.toString();
	}
	else if (type == '[object String]') {
		return '\"'+obj+'\"';

	}
	else if (type == '[object Array]') {
		var str = '';		
		var newarr = [];
		for (var i = 0; i < obj.length; i++) {
			newarr.push(stringifyJSON(obj[i]));
		}
		str = '['+newarr.join()+']';
		return str;
	}
	else if (type == '[object Object]') {
		var objstr = '';
		var objarr = [];
		var olength = 0;
		for (var prop in obj) {
			if (stringifyJSON(obj[prop]) != undefined)
				olength++;
		}
		for (var prop in obj) {
			if (stringifyJSON(obj[prop]) == undefined) {
				objarr.push(null);
			}
			else {
			objarr.push(stringifyJSON(prop));
			objarr.push(':');
			objarr.push(stringifyJSON(obj[prop]));
			}
			if (olength>1) {
				objarr.push(',');
				olength--;
			}

		}
		objstr = '{'+objarr.join('')+'}';		
		return objstr;
	}

};
