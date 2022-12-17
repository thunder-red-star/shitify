#! /usr/bin/env node
// Create a command line interface for our script (only takes one argument: file name)
const shitify = require('./shitify');

const args = process.argv.slice(2);
const fileName = args[0];

if (!fileName) {
	console.log('Usage: shitify <file name or directory name>');
	process.exit(1);
}

shitify.shitifyFile(fileName);