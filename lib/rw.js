'use strict';

var fs = require('fs');

var fse = require('fs-extra');

var properties = require ('properties');

var moment = require('moment');

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

var noBackup = false;

var backup = function(path) {

	if(noBackup) return;

	var extension = '.backup-' + moment().format('YYYYMMDDHHmmssSSS');

	fse.copySync(path, path + extension);

}

module.exports.read = read;

module.exports.write = write;

module.exports.noBackup = noBackup;

module.exports.backup = backup;

