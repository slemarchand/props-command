var expect = require("chai").expect;

var fse = require('fs-extra');

var tmp = require('tmp');

var main = require('../../main');

var base; 

before(function() {

    base = tmp.dirSync().name;

    fse.copySync('test/acceptance/data/merge-test', base);
});

describe("props merge", function() {
  it("merge a properties file into another properties file", function() {

    var fromFilePath =  base + '/merge_from.properties';
    
    var intoFilePath =  base + '/merge_into.properties';

    var expectedFilePath = base + '/merge_expected.properties';

    main.run(['merge', fromFilePath, intoFilePath]);

    var actualContent = fse.readFileSync(intoFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(actualContent).to.equal(expectedContent);

  });
});
 