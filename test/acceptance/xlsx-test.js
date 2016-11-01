var expect = require("chai").expect;

var fse = require('fs-extra');

var tmp = require('tmp');

var main = require('../../lib/main');

var base; 

beforeEach(function() { 

    // Very important here to use beforeEach() rather than before()!

    base = tmp.dirSync().name;

    fse.copySync('test/acceptance/data/xlsx-test', base);
});


describe("props from-xlsx", function() {
  
  it("extract properties file from XLSX file", function() {

    var inputFilePath =  base + '/from_xlsx_input.xlsx';

    var configFilePath = base + '/from_xlsx_config.json';

    var intoFilePath = base + '/from_xlsx_into.properties';
    
    var expectedFilePath = base + '/from_xlsx_expected.properties';

    main.run(['from-xlsx', inputFilePath, configFilePath, intoFilePath]);

    var actualContent = fse.readFileSync(intoFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(actualContent).to.equal(expectedContent);

  });
  
  it("extract properties file from XLSX file, supporting default sheet", function() {

    var inputFilePath =  base + '/from_xlsx_input.xlsx';

    var configFilePath = base + '/from_xlsx_config_default_sheet.json';

    var intoFilePath = base + '/from_xlsx_into.properties';
    
    var expectedFilePath = base + '/from_xlsx_expected.properties';

    main.run(['from-xlsx', inputFilePath, configFilePath, intoFilePath]);

    var actualContent = fse.readFileSync(intoFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(actualContent).to.equal(expectedContent);

  });

  it("extract properties file from XLSX file, supporting multiple sheets", function() {

    var inputFilePath =  base + '/from_xlsx_input_multiple_sheets.xlsx';

    var configFilePath = base + '/from_xlsx_config_multiple_sheets.json';

    var intoFilePath = base + '/from_xlsx_into.properties';
    
    var expectedFilePath = base + '/from_xlsx_expected.properties';

    main.run(['from-xlsx', inputFilePath, configFilePath, intoFilePath]);

    var actualContent = fse.readFileSync(intoFilePath, 'utf8').toString();

    var expectedContent = fse.readFileSync(expectedFilePath, 'utf8').toString();

    expect(actualContent).to.equal(expectedContent);

  });
});
 