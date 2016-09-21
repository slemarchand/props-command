var expect = require("chai").expect;

var fse = require('fs-extra');

var tmp = require('tmp');

var main = require('../../lib/main');

var base; 

before(function() {

    base = tmp.dirSync().name;

    fse.copySync('test/acceptance/data/format-test', base);
});


describe("Format Command", function() {
  it("format properties file", function() {

    var inputFilePath =  base + '/format_input.properties';
    
    var expectedFilePath = base + '/format_expected.properties';

    main.run(['format', inputFilePath]);

    var actualContent = fse.readFileSync(inputFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(actualContent).to.equal(expectedContent);

  });
});
 