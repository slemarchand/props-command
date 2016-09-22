var expect = require("chai").expect;

var fse = require('fs-extra');

var tmp = require('tmp');

var main = require('../../lib/main');

var base; 

before(function() {

    base = tmp.dirSync().name;

    fse.copySync('test/acceptance/data/subset-test', base);
});

describe("props subset", function() {
  it("extract properties with keys matching some pattern", function() {

    var inputFilePath =  base + '/subset_input.properties';
    
    var outputFilePath =  inputFilePath + '.subset';

    var expectedFilePath = base + '/subset_expected.properties';

    main.run(['subset', inputFilePath, 'hello.*']);

    var outputContent = fse.readFileSync(outputFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(outputContent).to.equal(expectedContent);

  });
});
 