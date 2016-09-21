#! /usr/bin/env node

var main = require('./lib/main');

var args = process.argv.slice(2);

main.run(args);
