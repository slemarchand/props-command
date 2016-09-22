var fileExists = require('file-exists');

var fs = require('fs');

require('./rw');

var readJson = function(path) {

	var data, content = fs.readFileSync(path, 'utf8').toString();

	if(content.trim().length == 0) {
		data = {}; 
	} else {
		data = JSON.parse (content);
	}

	return data;
};

var writeJson = function(path, data) {
	
	var content = JSON.stringify(data, null, 4);

	fs.writeFileSync(path, content, { 
		encoding: 'utf8',
		flag: 'w'
	});
};

var toJson = function(path, jsonPath) {
	
	var json;

	if(fileExists(jsonPath)) {

		console.log('Target file exists, JSON will be merged');
 
		backup(jsonPath);

		json = readJson(jsonPath);
	} else {
		json = {};
	}

	data = read(path);

	function insert(key, value, target) {
		var sepIndex = key.indexOf('.');
		if(sepIndex == -1) {
			target[key] = value;
		} else {

			var nextKey = key.substring(sepIndex + 1);

			var targetProperty = key.substring(0, sepIndex);

			var nextTarget;

			if(target.hasOwnProperty(targetProperty)) {

				nextTarget = target[targetProperty];

			} else {

				nextTarget = {};

				target[targetProperty] = nextTarget;
			}

			insert(nextKey, value, nextTarget);
		}
	};

	Object.keys(data).forEach(function(key) {
		var value = data[key];
	  	insert(key, value, json)
	});

	writeJson(jsonPath, json);
};

exports.toJson = toJson;