#! /usr/bin/env node

var fs = require('fs');

var fse = require('fs-extra');

var properties = require ('properties');

var moment = require('moment');

var XLSX = require('xlsx');

var fileExists = require('file-exists');

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

	} else if(subcommand == 'from-xlsx') {

		var excelPath = args[1];

		var configPath = args[2];

		var path = args[3];

		var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

		extractFromExcel(excelPath, config, path);
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

var extractFromExcel = function(excelPath, config, path) {
	
	var data = {};

	if(fileExists(path)) {

		console.log('Target file exists, properties will be merged');
 
		backup(path);

		data = read(path);
	}


	/*
	
	Config sample :

		{
			"sheet": "Sheet 1",
			"keyColumn": "I",
			"valueColumn": "H",
			"firstLine": 2,
			"lastLine": 7
		}
	*/


	var keyCol = config.keyColumn,
	 	valueCol = config.valueColumn,
	 	start = config.firstLine
	 	end = config.lastLine;

	var workbook = XLSX.readFile(excelPath);	

	var worksheet = workbook.Sheets[config.sheet];

	if(!worksheet || worksheet == null) {
		workbook.Sheets[workbook.SheetNames[0]];
	}

	for (var i = start; i <= end; i++) {
		
		var propKeyAddress = keyCol + i;

		if(!worksheet.hasOwnProperty(propKeyAddress )) continue;

		var propKey = worksheet[propKeyAddress].v;

		var propValueAddress = valueCol + i;

		var propValue = worksheet[propValueAddress].v;

		if(propKey && propKey !== "" && propValue && propValue !== "" ) {

			data[propKey] = propValue;
		}
	};

	write(path, data);
};

var args = process.argv.slice(2);

main(args);
