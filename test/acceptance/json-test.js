var expect = require("chai").expect;

var fse = require('fs-extra');

var main = require('../../main');

var fjson = require('format-json');

describe("To JSON Command", function() {
  it("Convert properties file to JSON file", function() {

    var base = 'test/acceptance/data/json-test';

    var fromFilePath =  base + '/to_json_from.properties';
    
    var intoFilePath =  base + '/to_json_into.json';

    var actualFilePath = base + '/to_json_actual.json';

    var expectedFilePath = base + '/to_json_expected.json';

    fse.copySync(intoFilePath, actualFilePath);

    main.run(['to-json', fromFilePath, actualFilePath]);

    var actualContent = fse.readFileSync(actualFilePath, 'utf8').toString();

    actualContent = fjson.diffy(JSON.parse(actualContent));

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expectedContent = fjson.diffy(JSON.parse(expectedContent));

    expect(actualContent).to.equal(expectedContent);

  });
});
 