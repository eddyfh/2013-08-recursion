// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But in stead we're going to implement it from scratch:

/*
var getElementsByClassName = function (className, root) {
  // your code here 
  root = root || document.body;
  var results = [];

  if (root.classList && root.classList.contains(className)) {
    results.push(root);
  }

  for (var i = 0; i < root.childNodes.length; i++) {
    results = results.concat(getElementsByClassName(className, root.childNodes[i]));
  }

  return results;
};
*/

var getElementsByClassName = function(className) {
  var root = document.body;
  var results = [];

  var checker = function(node) {
    if (node.classList && node.classList.contains(className)) {
      results.push(node);
    }

    for (var i = 0; i < node.childNodes.length; i++) {
      checker(node.childNodes[i]);
    }
  };

  checker(root);
  return results;
};
