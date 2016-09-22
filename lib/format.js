'use strict';

var rw = require('./rw')
	, read = rw.read
	, write = rw.write
	, backup = rw.backup;

var format = function(path) {
	
	backup(path);

	var data = read(path);

	write(path, data);
};

module.exports = format;
