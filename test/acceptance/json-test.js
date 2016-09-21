var expect = require("chai").expect;

var fse = require('fs-extra');

var tmp = require('tmp');

var fjson = require('format-json');

var main = require('../../main');

var base; 

before(function() {

    base = tmp.dirSync().name;

    fse.copySync('test/acceptance/data/json-test', base);
});

describe("props to-json", function() {
  it("convert properties file to JSON file", function() {

    var fromFilePath =  base + '/to_json_from.properties';
    
    var intoFilePath =  base + '/to_json_into.json';

    var expectedFilePath = base + '/to_json_expected.json';

    main.run(['to-json', fromFilePath, intoFilePath]);

    var actualContent = fse.readFileSync(intoFilePath, 'utf8').toString();

    actualContent = fjson.diffy(JSON.parse(actualContent));

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expectedContent = fjson.diffy(JSON.parse(expectedContent));

    expect(actualContent).to.equal(expectedContent);

  });
});
 