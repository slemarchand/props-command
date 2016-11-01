# props-command
Command-line tool to manipulate Java properties files

[![NPM version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/slemarchand/props-command.svg?branch=master)](https://travis-ci.org/slemarchand/props-command)
[![Coverage Status](https://coveralls.io/repos/github/slemarchand/props-command/badge.svg?branch=master)](https://coveralls.io/github/slemarchand/props-command?branch=master)
[![Dependency Status][david-image]][david-url] 
[![devDependency Status][david-dev-image]][david-dev-url] 
[![peerDependency Status][david-peer-image]][david-peer-url]  

[![NPM][nodei-image]][nodei-url]

## Installation

```bash
npm install -g props-command
```

## Usage

### Synopsis

```bash
$ props <command> <command-args> [<global-options>]
``` 

### Command List

* `merge`: Merge a properties file into an other properties file.  
* `sort`: Sort by keys.  
* `format`: Alias for sort command.  
* `subset`: Select a subset of properties according to a pattern for keys.  
* `from-xlsx`: Extract properties file from an XLSX (Excel) file.  

### Global options

* `--no-backup`: There will no more backup made for overwritten files.

### merge

```bash
$ props merge <from-properties-file> <into-properties-file>
```                   
                                                                            
Each property of `<from-properties-file>` is added to `<into-properties-file>`. For each property with same key inside the two files, the value from `<from-properties-file>` is used to overwrite the property in `<into-properties-file>.`                                                                        

### from-xlsx

```bash
$ props from-xlsx <from-excel-file> <excel-file-structure-description> <into-properties-file>
```                                                             
                                                                            
Each property extracted from `<from-excel-file>` is added to `<into-properties-file>`. For each property with same key inside the two files, the value from `<from-excel-file>` is used to overwrite the property in `<into-properties-file>`.                                                                        
If `<into-properties-file>` file does not exist, it will be created.            
                                                                            
`<excel-file-structure-description>` is a JSON file describing where properties keys and values are stored in the Excel file. See sample below:               
                                                                            
```json
{
	"sheet": "Sheet 1",
	"keyColumn": "I",
	"valueColumn": "H",
	"firstLine": 2,
	"lastLine": 7,
	"escape": true
}
 ```
`escape` option specify if special characters like `\` must be escaped. Default value is `false`.

#### Filter

In order to skip some lines, it's possible to define a filter, testing a particular column for a particular value.

```json
{
	"sheet": "Sheet 1",
	"keyColumn": "I",
	"valueColumn": "H",
	"firstLine": 2,
	"lastLine": 7,
	"escape": true,
	"filter": {
		"column": "C",
		"value": "OK"
	}
}
 ```

### to-json

```bash
$ props to-json <properties-file> <json-file>
```                   
          	                                                                      
Each property extracted from `<properties-file>` is added to `<json-file>`. For each property key containing some dot, a proper nested object is created. For each property with same key inside the two files, the value from `<properties-file>` is used to overwrite the property in `<json-file>`.

If `<json-file>` file does not exist, it will be created.

[npm-url]: https://www.npmjs.com/package/props-command
[npm-image]: https://img.shields.io/npm/v/props-command.svg

[david-url]: https://david-dm.org/slemarchand/props-command
[david-image]: https://img.shields.io/david/slemarchand/props-command.svg
[david-dev-url]: https://david-dm.org/slemarchand/props-command#info=devDependencies
[david-dev-image]: https://david-dm.org/slemarchand/props-command/dev-status.svg
[david-peer-url]: https://david-dm.org/slemarchand/props-command#info=peerDependencies
[david-peer-image]: https://david-dm.org/slemarchand/props-command/peer-status.svg

[nodei-image]: https://nodei.co/npm/props-command.png
[nodei-url]: https://www.npmjs.com/package/props-command
