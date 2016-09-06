#! /usr/bin/env node

var fs = require('fs');

var fse = require('fs-extra');

var properties = require ('properties');

var moment = require('moment')

var main = function(args) {

	var subcommand = args[0];

	if(subcommand == 'merge') {

		var fromPath = args[1];

		var intoPath = args[2];

		merge(fromPath, intoPath);

	} else if(subcommand == 'format' || subcommand == 'sort') {

		var path = args[1];

		format(path);

	} else if(subcommand == 'subset') {

		var path = args[1];

		var pattern = args[2];

		subset(path, pattern);
	} 
}

var read = function(path) {

	var content = fs.readFileSync(path, 'utf8').toString();

	var data = properties.parse (content, {});

	return data;
};

var write = function(path, data) {
	
	var content = properties.stringify(data);

	var content = content.split('\n').sort().join('\n');

	fs.writeFileSync(path, content, { 
		encoding: 'utf8',
		flag: 'w'
	});
};

var backup = function(path) {

	var extension = '.backup-' + moment().format('YYYYMMDDHHmmssSSS');

	fse.copySync(path, path + extension);

}

var merge = function(fromPath, intoPath) {
	
	backup(intoPath);

	var fromData = read(fromPath);
	var intoData = read(intoPath);

	Object.assign(intoData, fromData);

	write(intoPath, intoData);
};

var format = function(path) {
	
	backup(path);

	var data = read(path);

	write(path, data);
};

var subset = function(path, pattern) {
	
	backup(path);

	var regexp = new RegExp(pattern);

	var data = read(path);

	var dataSubset = {};

	Object.keys(data).forEach(function(key) {
		var result = regexp.exec(key);
	    if(result != null && result[0] === key) {
	    	dataSubset[key] = data[key];
	    }
	});

	write(path, dataSubset);
};

var args = process.argv.slice(2);

main(args);
