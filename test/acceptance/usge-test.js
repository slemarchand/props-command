var expect = require("chai").expect;

var stdout = require("test-console").stdout;

var main = require('../../lib/main');

describe("Usage", function() {
  it("write some long text to the console", function() {

	inspect = stdout.inspect();

    main.run([]);

   	inspect.restore();

    expect(inspect.output).not.equal(null);

    expect(inspect.output.length).to.be.at.least(1);

	expect(inspect.output[0].length).to.be.at.least(10);

  });
});