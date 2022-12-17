// Shitify main file
const randomPackages = require('./config/randomPackages.json');
const randomVariableNames = require('./config/randomVariableNames.json');
const randomCode = require('./config/randomCode.json');
const randomComments = require('./config/randomComments.json');

const fs = require('fs');
const path = require('path');
function addRandomImportStatements (str) {
  	const numberOfPackages = Math.floor(Math.random() * 4) + 2;
		const packages = [];
		for (let i = 0; i < numberOfPackages; i++) {
			// Choose packages without repetition
			let package;
			do {
				package = randomPackages[Math.floor(Math.random() * randomPackages.length)];
			} while (packages.includes(package));
			packages.push(package);
		}
		// Import packages
		let result = packages.map(package => `const ${package} = require('${package}');`).join('\n');
		return result;
}
let declarations = ["let", "const", "var"];

function randomVariableDeclaration (str) {
	const numberOfVariables = Math.floor(Math.random() * 4) + 2;
	const variables = [];
	for (let i = 0; i < numberOfVariables; i++) {
		// Choose variables without repetition
		let variable;
		do {
			variable = randomVariableNames[Math.floor(Math.random() * randomVariableNames.length)];
		} while (variables.includes(variable));
		variables.push(variable);
	}
	// Declare variables
	let result = variables.map(variable => `${declarations[Math.floor(Math.random() * declarations.length)]} ${variable} = ${Math.floor(Math.random() * 100)};`).join('\n');
	return result;
}

function randomCodeSnippet() {
	// Return a random code snippet (or a few)
	const numberOfSnippets = Math.floor(Math.random() * 4) + 2;
	const snippets = [];
	for (let i = 0; i < numberOfSnippets; i++) {
		// Choose snippets without repetition
		let snippet;
		do {
			snippet = randomCode[Math.floor(Math.random() * randomCode.length)];
		} while (snippets.includes(snippet));
		snippets.push(snippet);
	}
	// Return snippets
	let result = snippets.join('\n');
	return result;
}

function createRandomFunction (str) {
	// Template
	const template = `${declarations[Math.floor(Math.random() * declarations.length)]} ${randomVariableNames[Math.floor(Math.random() * randomVariableNames.length)]} = () => {
		${randomVariableDeclaration()}
		${randomCodeSnippet()}
		${addRandomImportStatements()}
	}`;
	return template;
}

function randomCommentSnippet (str) {
	// Return a random comment
	const comment = randomComments[Math.floor(Math.random() * randomComments.length)];
	return comment;
}

// Combine it all into one shitify function
function shitifyString (str) {
	let temp = str;
	// Add random import statements
	str = addRandomImportStatements(str);
	// Add random variable declarations
	str = randomVariableDeclaration(str);
	// Add random code snippets
	str += temp;
	str = randomCodeSnippet(str);
	// Add random functions
	str = createRandomFunction(str);
	// Choose places to add random comments
	const numberOfComments = Math.floor(Math.random() * 4) + 2;
	const commentIndices = [];
	for (let i = 0; i < numberOfComments; i++) {
		// Choose a place in str to add a comment
		let index;
		do {
			index = Math.floor(Math.random() * str.split('\n').length);
		} while (commentIndices.includes(index));
		commentIndices.push(index);
	}
	// Add random comments
	commentIndices.forEach(index => {
		str = str.split('\n');
		str.splice(index, 0, randomCommentSnippet());
		str = str.join('\n');
	});
	return str;
}

function shitifyFile (fileName) {
	// Filename can be file or directory.
	// If it's a directory, shitify all js files in it.
	// If it's a file and it's a js file, shitify it.
	// If it's a file and it's not a js file, do nothing.
	// lstat it
	let stats;
	try {
		stats = fs.lstatSync(fileName);
	} catch (err) {
		console.log('File or directory not found');
		process.exit(1);
	}
	// If it's a directory, shitify all js files in it
	if (stats.isDirectory()) {
		// Read the directory
		const files = fs.readdirSync(fileName);
		// Filter out non-js files
		const jsFiles = files.filter(file => path.extname(file) === '.js');
		// Shitify each js file
		jsFiles.forEach(file => {
			// Read the file
			let fileContents = fs.readFileSync(path.join(fileName, file), 'utf8');
			// Shitify the file
			fileContents = shitifyString(fileContents);
			// Write the file
			fs.writeFileSync(path.join(fileName, file), fileContents);
    });
	} else if (stats.isFile()) {
		// If it's a file and it's a js file, shitify it
		if (path.extname(fileName) === '.js') {
			// Read the file
			let fileContents = fs.readFileSync(fileName, 'utf8');
			// Shitify the file
			fileContents = shitifyString(fileContents);
			// Write the file
			fs.writeFileSync(fileName, fileContents);
		}
	}
}

module.exports = {
	shitifyString,
	shitifyFile
}
