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
			"firstLine": 2
		}
	*/

	var defaultConfig = {

		escape: false
	};

	var actualConfig = Object.assign({}, defaultConfig, config);

	var filter = actualConfig.filter;

	if(filter) {
		var c = filter.column; 
		if(!c || c === null || c === "") {
			throw "'column' field missing for filter";
		}
		var v = filter.value; 
		if(!v || v === null || v === "") {
			throw "'value' field missing for filter";
		}
	}

	var keyCol = actualConfig.keyColumn,
	 	valueCol = actualConfig.valueColumn,
	 	start = actualConfig.firstLine;

	var workbook = XLSX.readFile(excelPath);	

	var worksheet = workbook.Sheets[actualConfig.sheet];

	if(!worksheet || worksheet == null) {
		worksheet = workbook.Sheets[workbook.SheetNames[0]];
	}

	var range = XLSX.utils.decode_range(worksheet['!ref']);

	var end = range.e.r + 1;

	console.log(range);

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

		if(filter) {
			var column = filter.column;
			var expectedValue = filter.value;
			var actualValueCell = worksheet[column + i];
			if(!actualValueCell || actualValueCell.v !== expectedValue) {
				continue;
			}
		}

		var propValueCell = worksheet[propValueAddress];

		if(!propValueCell) {
			continue;
		}

		var propValue = propValueCell.v;

		if(propKey && propKey !== "" && propValue && propValue !== "" ) {

			if(!actualConfig.escape) {
				propValue = propValue.replace(/[\r\n\t]/g,'');
				propValue = eval('"' + propValue.replace(/"/g,'\\"') + '"');
			}

			data[propKey] = propValue;
		}
	};

	write(path, data);
};

exports.extractFromExcel = extractFromExcel;