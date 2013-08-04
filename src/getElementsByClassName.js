// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But in stead we're going to implement it from scratch:
var getElementsByClassName = function (className) {
  // your code here
	var finalnode = [];

	var checkNodes = function(input) {
		if (input.classList && input.classList.contains(className)) {
			finalnode.push(input);
		}
		if (input.childNodes) {
			for (var item in input.childNodes) {
				checkNodes(input.childNodes[item]);
			}
		}
	};

	checkNodes(document.body);
	return finalnode;
};