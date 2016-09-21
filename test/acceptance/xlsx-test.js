 var expect = require("chai").expect;

var fse = require('fs-extra');

var tmp = require('tmp');

var main = require('../../main');

var base; 

before(function() {

    base = tmp.dirSync().name;

    fse.copySync('test/acceptance/data/xlsx-test', base);
});


describe("props from-xlsx", function() {
  it("extract properties file from XLSX file", function() {

    var inputFilePath =  base + '/from_xlsx_input.xlsx';

    var configFilePath = base + '/from_xlsx_config.json';

    var actualFilePath = base + '/from_xlsx_actual.properties';
    
    var expectedFilePath = base + '/from_xlsx_expected.properties';

    main.run(['from-xlsx', inputFilePath, configFilePath, actualFilePath]);

    var actualContent = fse.readFileSync(actualFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(actualContent).to.equal(expectedContent);

  });
});
 