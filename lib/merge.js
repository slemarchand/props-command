'use strict';

var rw = require('./rw')
	, read = rw.read
	, write = rw.write
	, backup = rw.backup;

var merge = function(fromPath, intoPath) {
	
	backup(intoPath);

	var fromData = read(fromPath);
	var intoData = read(intoPath);

	Object.assign(intoData, fromData);

	write(intoPath, intoData);
};

module.exports = merge;