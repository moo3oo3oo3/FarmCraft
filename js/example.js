//Example of how to refactor

function someFunction() {
	return false;
}

function otherFunction() {
	return true;
}

module.exports = Object.assign( { someFunction, otherFunction });