'use strict';

var rw = require('./rw')
	, read = rw.read
	, write = rw.write
	, backup = rw.backup;

var subset = function(path, pattern) {
	
	var regexp = new RegExp(pattern);

	var data = read(path);

	var subsetData = {};

	Object.keys(data).forEach(function(key) {
		var result = regexp.exec(key);
	    if(result != null && result[0] === key) {
	    	subsetData[key] = data[key];
	    }
	});

	var subsetPath = path + '.subset';

	write(subsetPath, subsetData);
};

module.exports = subset;
