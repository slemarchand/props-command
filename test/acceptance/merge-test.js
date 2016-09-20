var expect = require("chai").expect;

var fse = require('fs-extra');

var main = require('../../main');

describe("Merge Command", function() {
  it("merge properties files", function() {

    var base = 'test/acceptance/data/merge-test';

    var fromFilePath =  base + '/merge_from.properties';
    
    var intoFilePath =  base + '/merge_into.properties';

    var actualFilePath = base + '/merge_actual.properties';

    var expectedFilePath = base + '/merge_expected.properties';

    fse.copySync(intoFilePath, actualFilePath);

    main.run(['merge', fromFilePath, actualFilePath]);

    var actualContent = fse.readFileSync(actualFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(actualContent).to.equal(expectedContent);

  });
});
 