'use strict';

var fs = require('fs');

var getUsage = require('command-line-usage');

var includes = require('array-includes');

var rw = require('./rw')
	, read = rw.read
	, write = rw.write
	, noBackup = rw.noBackup;

var merge = require('./merge');

var format = require('./format');

var subset = require('./subset');	

var xlsx = require('./xlsx');	

var json = require('./json');	

var run = function(args) {

	var subcommand = args[0];

	noBackup = includes(args, '--no-backup');

	if(subcommand == 'merge') {

		if(args.length < 3) raiseArgsError();

		var fromPath = args[1];

		var intoPath = args[2];

		merge(fromPath, intoPath);

	} else if(subcommand == 'format' || subcommand == 'sort') {

		if(args.length < 2) raiseArgsError();

		var path = args[1];

		format(path);

	} else if(subcommand == 'subset') {

		if(args.length < 3) raiseArgsError();

		var path = args[1];

		var pattern = args[2];

		subset(path, pattern);

	} else if(subcommand == 'from-xlsx') {

		if(args.length < 4) raiseArgsError();

		var excelPath = args[1];

		var configPath = args[2];

		var path = args[3];

		var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

		xlsx.extractFromExcel(excelPath, config, path);

	} else if(subcommand == 'to-json') {

		if(args.length < 3) raiseArgsError();

		var path = args[1];

		var jsonPath = args[2];

		json.toJson(path, jsonPath);

	}  else {

		printUsage();
	}
}

var raiseArgsError = function() {
	printUsage();
	process.exit();
}

var printUsage = function() {

	var usage = getUsage([
	  {
	    header: 'NAME',
	    content: '  props - working on Java properties files.',
	    raw: true
	  },
	  {
	    header: 'SYNOPSIS',
	    content: '$ props <command> <command-args>'
	  },
	  {
	    header: 'COMMAND LIST',
	    content: [
	      { 
	      	name: 'merge', 
	      	summary: 'Merge a properties file into an other properties file.'
	      },
	      { 
	      	name: 'sort',
	      	summary: 'Sort '
	      },
	      { 
	      	name: 'format', 
	      	summary: 'Alias for sort command.' 
	      },
	      { name: 'subset',

	      	summary: 'Select a subset of properties according to a pattern for keys.'
	      },
	      { 
	      	name: 'from-xlsx', 
	      	summary: 'Extract properties file from an XLSX (Excel) file.' 
	      }
	    ]
	  },
	  {
	    header: 'MERGE',
	    content: 
	    	'$ props merge <from-properties-file>  <into-properties-file>\n\n'
	    	+ 'Each property of <from-properties-file> is added to '
	    	+ '<into-properties-file>.'
	    	+ 'For each property with same key inside the two files, the value '
	    	+ 'from <from-properties-file> is used to overwrite the property in '
	    	+ '<into-properties-file>.'
	  },
	  {
	    header: 'FROM-XLSX',
	    content: 
	    	'$ props from-xlsx <from-excel-file> '
	    	+ '<excel-file-structure-description> <into-properties-file>\n\n'
	    	+ 'Each property extracted from <from-excel-file> is added to '
	    	+ '<into-properties-file>.'
	    	+ 'For each property with same key inside the two files, the value '
	    	+ 'from <from-excel-file> is used to overwrite the property in '
	    	+ '<into-properties-file>.\n'
	    	+ 'If <into-properties-file> file does not exist, it will be '
	    	+ 'created.\n\n'
	    	+ '<excel-file-structure-description> is a JSON file describing '
	    	+ 'where properties keys and values are stored in the Excel file. See sample below: \n\n'
	  },
	  {
	    content:
	    	  '     {\n'
			+ '          "sheet": "Sheet 1",\n'
			+ '          "keyColumn": "I",\n'
			+ '          "valueColumn": "H",\n'
			+ '          "firstLine": 2,\n'
			+ '          "escape": true\n'
			+ '     }\n',
		raw: true	
	  },
	  {
	  	content: 'escape option specify if special characters like \\ must be escaped. Default value is false.'
	  },
	  {
	    header: 'TO-JSON',
	    content: 
	    	'$ props to-json <properties-file> '
	    	+ ' <json-file>\n\n'
	    	+ 'Each property extracted from <properties-file> is added to '
	    	+ '<json-file>. '
	    	+ 'For each property key containing some dot, a proper nested object is created.'
	    	+ 'For each property with same key inside the two files, the value '
	    	+ 'from <properties-file> is used to overwrite the property in '
	    	+ '<json-file>.\n'
	    	+ 'If <json-file> file does not exist, it will be '
	    	+ 'created.\n\n'
	  },
	]);

	console.log(usage);
};

module.exports = {
  run: run
};