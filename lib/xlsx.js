'use strict';

var fileExists = require('file-exists');

var fs = require('fs');

var rw = require('./rw')
	, read = rw.read
	, write = rw.write
	, backup = rw.backup;

var XLSX = require('xlsx');

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

	var defaultConfig = {

		escape: true
	};

	var actualConfig = Object.assign({}, defaultConfig, config);

	var keyCol = actualConfig.keyColumn,
	 	valueCol = actualConfig.valueColumn,
	 	start = actualConfig.firstLine,
	 	end = actualConfig.lastLine

	var workbook = XLSX.readFile(excelPath);	

	var worksheet = workbook.Sheets[actualConfig.sheet];

	if(!worksheet || worksheet == null) {
		workbook.Sheets[workbook.SheetNames[0]];
	}

	for (var i = start; i <= end; i++) {
		
		var propKeyAddress = keyCol + i;

		if(!worksheet.hasOwnProperty(propKeyAddress )) {
			console.log('Key missing at cell ' + propKeyAddress);
			continue;
		}

		var propKey = worksheet[propKeyAddress].v;

		var propValueAddress = valueCol + i;

		if(!worksheet.hasOwnProperty(propValueAddress)) {
			console.log('Value missing at cell ' + propValueAddress + ' (for key ' + propKey  + ')');
			continue;
		}

		var propValue = worksheet[propValueAddress].v;

		if(propKey && propKey !== "" && propValue && propValue !== "" ) {

			if(!actualConfig.escape) {
				propValue = eval('"' + propValue.replace(/"/g,'\\"') + '"');
			}

			data[propKey] = propValue;
		}
	};

	write(path, data);
};

exports.extractFromExcel = extractFromExcel;