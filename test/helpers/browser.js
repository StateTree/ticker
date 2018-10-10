require('@babel/register')();

//polyfills for testing
global.window = {};
global.window.requestAnimationFrame = function (cb) {
	return setTimeout(cb, 0);
};

global.window.cancelAnimationFrame = function(id) {
	clearTimeout(id);
};
global.navigator = {
	userAgent: 'node.js'
};
