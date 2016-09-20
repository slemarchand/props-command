var fs = require('fs');

var fse = require('fs-extra');

var properties = require ('properties');

var moment = require('moment');

var XLSX = require('xlsx');

var fileExists = require('file-exists');

var getUsage = require('command-line-usage');

var includes = require('array-includes');

var noBackup;

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

		extractFromExcel(excelPath, config, path);

	} else if(subcommand == 'to-json') {

		if(args.length < 3) raiseArgsError();

		var path = args[1];

		var jsonPath = args[2];

		toJson(path, jsonPath);

	}  else {

		raiseArgsError();
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

var readJson = function(path) {

	var content = fs.readFileSync(path, 'utf8').toString();

	var data = JSON.parse (content);

	return data;
};

var writeJson = function(path, data) {
	
	var content = JSON.stringify(data);

	fs.writeFileSync(path, content, { 
		encoding: 'utf8',
		flag: 'w'
	});
};

var backup = function(path) {

	if(noBackup) return;

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

			data[propKey] = propValue;
		}
	};

	write(path, data);
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
			+ '          "lastLine": 7\n'
			+ '     }\n',
		raw: true	
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