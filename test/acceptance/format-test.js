var expect = require("chai").expect;

var fse = require('fs-extra');

var main = require('../../main');

describe("Format Command", function() {
  it("format properties file", function() {

    var base = 'test/acceptance/data/format-test';

    var inputFilePath =  base + '/format_input.properties';
    
    var actualFilePath = base + '/format_actual.properties';

    var expectedFilePath = base + '/format_expected.properties';

    fse.copySync(inputFilePath, actualFilePath);

    main.run(['format', actualFilePath]);

    var actualContent = fse.readFileSync(actualFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(actualContent).to.equal(expectedContent);

  });
});
 