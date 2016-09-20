# props-command
Command-line tool to manipulate Java properties files

[![Build Status](https://travis-ci.org/slemarchand/props-command.svg?branch=master)](https://travis-ci.org/slemarchand/props-command)
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
                                                                            
```js
{
	"sheet": "Sheet 1",
	"keyColumn": "I",
	"valueColumn": "H",
	"firstLine": 2,
	"lastLine": 7
}
 ```

### to-json

```bash
$ props to-json <properties-file> <into-properties-file>
```                   
          	                                                                      
Each property extracted from `<properties-file>` is added to `<json-file>`. For each property key containing some dot, a proper nested object is created. For each property with same key inside the two files, the value from `<properties-file>` is used to overwrite the property in `<json-file>`.

If `<json-file>` file does not exist, it will be created.

[nodei-image]: https://nodei.co/npm/props-command.png
[nodei-url]: https://www.npmjs.com/package/props-command
