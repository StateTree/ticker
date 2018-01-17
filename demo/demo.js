(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ticker", [], factory);
	else if(typeof exports === 'object')
		exports["ticker"] = factory();
	else
		root["ticker"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Manager = __webpack_require__(2);

var _Manager2 = _interopRequireDefault(_Manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// toDo: support both callback and promise
var TickEntry =
/**
 * @param {object} context - The "this" argument for the listener function.
 * @param {function} listener.
 */
function TickEntry(context, listener) {
	var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	var priority = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	_classCallCheck(this, TickEntry);

	this.context = context;
	this.listener = listener;
	this.callback = callback;
	this.priority = priority;
	this.executionCount = 0;
};

/*---- Public|Prototype Methods ---*/

exports.default = TickEntry;
TickEntry.prototype.dispose = function () {
	TickEntry.stackDebug && console.log("TickEntry dispose:", this);
	this.context = null;
	this.listener = null;
	this.callback = null;
	this.priority = null;
	this.executionCount = NaN;
};

TickEntry.prototype.execute = function () {
	TickEntry.stackDebug && console.log("manager.add: ", this);
	_Manager2.default.add(this);
};

TickEntry.HIGH = 0;
TickEntry.NORMAL = 1;
TickEntry.LOW = 2;

TickEntry.allowedTickCount = 100;
TickEntry.debug = false;
TickEntry.stackDebug = false;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TickEntry = __webpack_require__(0);

var _TickEntry2 = _interopRequireDefault(_TickEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TickEntry2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _TickEntry = __webpack_require__(0);

var _TickEntry2 = _interopRequireDefault(_TickEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var requestAnimationFrameId = 0; // for Windows Env

//[0-HIGH, 1-NORMAL, 2-LOW]
var priorityEntries = [null, null, null];
var waitEntries = null;

var tickCount = 0;
var isExecuting = false;

function onTick() {
	tickCount++;
	if (_TickEntry2.default.debug) {
		console.log("Tick count: ", tickCount);
	}
	if (tickCount < _TickEntry2.default.allowedTickCount) {
		executePriorityEntries();
		moveWaitingEntriesForExecution();
		if (arePriorityEntriesEmpty()) {
			stop();
			return false;
		}
	} else {
		console.warn("Animation frame loop executed to its set limit: ", _TickEntry2.default.allowedTickCount);
		if (_TickEntry2.default.debug) {
			console.log("Entries: ", priorityEntries[0], priorityEntries[1], priorityEntries[2], waitEntries);
		}
		reset();
		return false;
	}
	return true;
}

function stop() {
	tickCount = 0;
	isExecuting = false;
	tickManager.stop();
}

function reset() {
	stop();
	priorityEntries = [null, null, null];
	waitEntries = null;
}

function moveWaitingEntriesForExecution() {
	var entriesCount = waitEntries ? waitEntries.length : 0;
	if (waitEntries && entriesCount > 0) {
		for (var index = 0; index < entriesCount; index++) {
			var tickEntry = waitEntries[index];
			var priority = tickEntry.priority;

			if (!priorityEntries[priority]) {
				priorityEntries[priority] = [];
			}
			var tickEntries = priorityEntries[priority];
			tickEntries.push(tickEntry);
		}
	}
	waitEntries = null;
}

function executePriorityEntries() {
	isExecuting = true;
	for (var index = 0; index < priorityEntries.length; index++) {
		var tickEntries = priorityEntries[index];
		if (tickEntries && tickEntries.length > 0) {
			executeTickEntries(tickEntries);
			//Clear them once executed
			priorityEntries[index] = null;
		}
	}
	isExecuting = false;
}

function executeTickEntries(tickEntries) {
	// important to use for-loop
	// tickEntries grows dynamically by one of its entry
	// for example: let say we have one entry, and executing that entry might adds another entry
	// with map function we cant execute dynamically growing entries.
	for (var i = 0; i < tickEntries.length; i++) {
		var tickEntry = tickEntries[i];
		_TickEntry2.default.stackDebug && console.log("TickManager: executeTickEntries : for ", i, tickEntry);
		tickEntry.listener.call(tickEntry.context || tickEntry.listener['this']);

		if (tickEntry.callback) {
			tickEntry.callback.call(tickEntry.callback['this']);
		}
		tickEntry.executionCount++;
		if (_TickEntry2.default.debug && tickEntry.executionCount > 1) {
			console.log("Executed more than once: ", tickEntry);
		}
	}
}

function arePriorityEntriesEmpty() {
	for (var index = 0; index < priorityEntries.length; index++) {
		var tickEntries = priorityEntries[index];
		if (tickEntries && tickEntries.length > 0) {
			return false;
		}
	}
	return true;
}

function requestAnimationFrameCallback() {
	var shouldContinue = onTick();
	if (shouldContinue) {
		requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
}

var TickManager = function TickManager() {
	_classCallCheck(this, TickManager);
};

TickManager.prototype.add = function (tickEntry) {
	_TickEntry2.default.stackDebug && console.log("TickManager: add : ", tickEntry);
	if (arePriorityEntriesEmpty()) {
		this.start();
	}
	if (isExecuting) {
		_TickEntry2.default.stackDebug && console.log("TickManager: add :  wait ");
		if (!waitEntries) {
			waitEntries = [];
		}
		waitEntries.push(tickEntry);
	} else {
		var priority = tickEntry.priority;

		if (!priorityEntries[priority]) {
			_TickEntry2.default.stackDebug && console.log("TickManager: add : in " + priority + " : new Array");
			priorityEntries[priority] = [];
		}
		_TickEntry2.default.stackDebug && console.log("TickManager: add : in " + priority + " : push");
		var tickEntries = priorityEntries[priority];
		tickEntries.push(tickEntry);
	}
};

// Todo: Support for NodeJS 
TickManager.prototype.start = function () {
	if (window) {
		// will receives timestamp as argument
		requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
		_TickEntry2.default.stackDebug && console.log("TickManager: start : ", requestAnimationFrameId);
	}
};

TickManager.prototype.stop = function () {
	if (window) {
		_TickEntry2.default.stackDebug && console.log("TickManager: stop : ", requestAnimationFrameId);
		window.cancelAnimationFrame(requestAnimationFrameId);
	}
};

var tickManager = new TickManager();

// singletonInstanace
exports.default = tickManager;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lib = __webpack_require__(1);

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_lib2.default.debug = true;
function firstFunction() {
	console.log("first Function");
}

function secondFunction() {
	console.log("Second Function");
}

function thirdFunction() {
	console.log("Third Function");
	ticker4.execute();
}

function fourthFunction() {
	console.log("Fourth Function");
	ticker5.execute();
}
function fifthFunction() {
	console.log("Fifth Function");
	ticker4.execute(); // to test infinite loop detection
}

function callBackFunction() {
	console.log("I am called once per frame last as callback");
}

var ticker1 = new _lib2.default(window, firstFunction, callBackFunction);
var ticker2 = new _lib2.default(window, secondFunction, callBackFunction, 1);
var ticker3 = new _lib2.default(window, thirdFunction, callBackFunction, 2);
var ticker4 = new _lib2.default(window, fourthFunction, null, 2);
var ticker5 = new _lib2.default(window, fifthFunction, null, 1);

ticker3.execute();
ticker2.execute();
ticker1.execute();

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA3OTE4MDdmNDk3NDZlODZhZjQ4MyIsIndlYnBhY2s6Ly8vLi9saWIvVGlja0VudHJ5LmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9kZW1vL2luZGV4LmpzIl0sIm5hbWVzIjpbIlRpY2tFbnRyeSIsImNvbnRleHQiLCJsaXN0ZW5lciIsImNhbGxiYWNrIiwicHJpb3JpdHkiLCJleGVjdXRpb25Db3VudCIsInByb3RvdHlwZSIsImRpc3Bvc2UiLCJzdGFja0RlYnVnIiwiY29uc29sZSIsImxvZyIsIk5hTiIsImV4ZWN1dGUiLCJhZGQiLCJISUdIIiwiTk9STUFMIiwiTE9XIiwiYWxsb3dlZFRpY2tDb3VudCIsImRlYnVnIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQiLCJwcmlvcml0eUVudHJpZXMiLCJ3YWl0RW50cmllcyIsInRpY2tDb3VudCIsImlzRXhlY3V0aW5nIiwib25UaWNrIiwiZXhlY3V0ZVByaW9yaXR5RW50cmllcyIsIm1vdmVXYWl0aW5nRW50cmllc0ZvckV4ZWN1dGlvbiIsImFyZVByaW9yaXR5RW50cmllc0VtcHR5Iiwic3RvcCIsIndhcm4iLCJyZXNldCIsInRpY2tNYW5hZ2VyIiwiZW50cmllc0NvdW50IiwibGVuZ3RoIiwiaW5kZXgiLCJ0aWNrRW50cnkiLCJ0aWNrRW50cmllcyIsInB1c2giLCJleGVjdXRlVGlja0VudHJpZXMiLCJpIiwiY2FsbCIsInJlcXVlc3RBbmltYXRpb25GcmFtZUNhbGxiYWNrIiwic2hvdWxkQ29udGludWUiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJUaWNrTWFuYWdlciIsInN0YXJ0IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJmaXJzdEZ1bmN0aW9uIiwic2Vjb25kRnVuY3Rpb24iLCJ0aGlyZEZ1bmN0aW9uIiwidGlja2VyNCIsImZvdXJ0aEZ1bmN0aW9uIiwidGlja2VyNSIsImZpZnRoRnVuY3Rpb24iLCJjYWxsQmFja0Z1bmN0aW9uIiwidGlja2VyMSIsInRpY2tlcjIiLCJ0aWNrZXIzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQzdEQTs7Ozs7Ozs7QUFFQTtJQUNxQkEsUztBQUVwQjs7OztBQUlBLG1CQUFZQyxPQUFaLEVBQXFCQyxRQUFyQixFQUNBO0FBQUEsS0FEK0JDLFFBQy9CLHVFQUQwQyxJQUMxQztBQUFBLEtBRGdEQyxRQUNoRCx1RUFEMkQsQ0FDM0Q7O0FBQUE7O0FBQ0MsTUFBS0gsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsTUFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxNQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLE1BQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsTUFBS0MsY0FBTCxHQUFzQixDQUF0QjtBQUNBLEM7O0FBSUY7O2tCQWpCcUJMLFM7QUFtQnJCQSxVQUFVTSxTQUFWLENBQW9CQyxPQUFwQixHQUE4QixZQUFVO0FBQ3ZDUCxXQUFVUSxVQUFW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WjtBQUNBMkMsU0FBUXpDLE9BQVI7QUFFQTtBQUNELFNBQVMwQyxhQUFULEdBQXlCO0FBQ3hCN0MsU0FBUUMsR0FBUixDQUFZLGdCQUFaO0FBQ0F5QyxTQUFRdkMsT0FBUixHQUZ3QixDQUVOO0FBQ2xCOztBQUVELFNBQVMyQyxnQkFBVCxHQUE0QjtBQUMzQjlDLFNBQVFDLEdBQVIsQ0FBWSw2Q0FBWjtBQUNBOztBQUVELElBQUk4QyxVQUFVLGtCQUFXYixNQUFYLEVBQW1CSyxhQUFuQixFQUFrQ08sZ0JBQWxDLENBQWQ7QUFDQSxJQUFJRSxVQUFVLGtCQUFXZCxNQUFYLEVBQW1CTSxjQUFuQixFQUFtQ00sZ0JBQW5DLEVBQXNELENBQXRELENBQWQ7QUFDQSxJQUFJRyxVQUFVLGtCQUFXZixNQUFYLEVBQW1CTyxhQUFuQixFQUFrQ0ssZ0JBQWxDLEVBQXFELENBQXJELENBQWQ7QUFDQSxJQUFJSixVQUFVLGtCQUFXUixNQUFYLEVBQW1CUyxjQUFuQixFQUFtQyxJQUFuQyxFQUF5QyxDQUF6QyxDQUFkO0FBQ0EsSUFBSUMsVUFBVSxrQkFBV1YsTUFBWCxFQUFtQlcsYUFBbkIsRUFBa0MsSUFBbEMsRUFBd0MsQ0FBeEMsQ0FBZDs7QUFFQUksUUFBUTlDLE9BQVI7QUFDQTZDLFFBQVE3QyxPQUFSO0FBQ0E0QyxRQUFRNUMsT0FBUixHIiwiZmlsZSI6ImRlbW8vZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwidGlja2VyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInRpY2tlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJ0aWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNzkxODA3ZjQ5NzQ2ZTg2YWY0ODMiLCJpbXBvcnQgbWFuYWdlciBmcm9tICcuL01hbmFnZXInO1xuXG4vLyB0b0RvOiBzdXBwb3J0IGJvdGggY2FsbGJhY2sgYW5kIHByb21pc2VcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY2tFbnRyeVxue1xuXHQvKipcblx0ICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgLSBUaGUgXCJ0aGlzXCIgYXJndW1lbnQgZm9yIHRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihjb250ZXh0LCBsaXN0ZW5lciwgY2FsbGJhY2sgPSBudWxsLCBwcmlvcml0eSA9IDApXG5cdHtcblx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuXHRcdHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0XHR0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0dGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuXHRcdHRoaXMuZXhlY3V0aW9uQ291bnQgPSAwO1xuXHR9XG5cbn1cblxuLyotLS0tIFB1YmxpY3xQcm90b3R5cGUgTWV0aG9kcyAtLS0qL1xuXG5UaWNrRW50cnkucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpe1xuXHRUaWNrRW50cnkuc3RhY2tEZWJ1ZyAmJiBjb25zb2xlLmxvZyhcIlRpY2tFbnRyeSBkaXNwb3NlOlwiLCB0aGlzKTtcblx0dGhpcy5jb250ZXh0ID0gbnVsbDtcblx0dGhpcy5saXN0ZW5lciA9IG51bGw7XG5cdHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuXHR0aGlzLnByaW9yaXR5ID0gbnVsbDtcblx0dGhpcy5leGVjdXRpb25Db3VudCA9IE5hTjtcbn07XG5cblRpY2tFbnRyeS5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKCl7XG5cdFRpY2tFbnRyeS5zdGFja0RlYnVnICYmIGNvbnNvbGUubG9nKFwibWFuYWdlci5hZGQ6IFwiLCB0aGlzKTtcblx0bWFuYWdlci5hZGQodGhpcyk7XG59O1xuXG5cblRpY2tFbnRyeS5ISUdIID0gMDtcblRpY2tFbnRyeS5OT1JNQUwgPSAxO1xuVGlja0VudHJ5LkxPVyA9IDI7XG5cblRpY2tFbnRyeS5hbGxvd2VkVGlja0NvdW50ID0gMTAwO1xuVGlja0VudHJ5LmRlYnVnID0gZmFsc2U7XG5UaWNrRW50cnkuc3RhY2tEZWJ1ZyA9IGZhbHNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL1RpY2tFbnRyeS5qcyIsImltcG9ydCBUaWNrZXIgZnJvbSAnLi9UaWNrRW50cnknO1xuXG5leHBvcnQgZGVmYXVsdCBUaWNrZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvaW5kZXguanMiLCJpbXBvcnQgVGlja0VudHJ5IGZyb20gJy4vVGlja0VudHJ5JztcbmxldCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IDA7Ly8gZm9yIFdpbmRvd3MgRW52XG5cbi8vWzAtSElHSCwgMS1OT1JNQUwsIDItTE9XXVxubGV0IHByaW9yaXR5RW50cmllcyA9IFtudWxsLCBudWxsLCBudWxsXTtcbmxldCB3YWl0RW50cmllcyA9IG51bGw7XG5cbmxldCB0aWNrQ291bnQgPSAwO1xubGV0IGlzRXhlY3V0aW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIG9uVGljaygpe1xuXHR0aWNrQ291bnQrKztcblx0aWYoVGlja0VudHJ5LmRlYnVnKXtcblx0XHRjb25zb2xlLmxvZyhcIlRpY2sgY291bnQ6IFwiLCB0aWNrQ291bnQpO1xuXHR9XG5cdGlmKHRpY2tDb3VudCA8IFRpY2tFbnRyeS5hbGxvd2VkVGlja0NvdW50KXtcblx0XHRleGVjdXRlUHJpb3JpdHlFbnRyaWVzKCk7XG5cdFx0bW92ZVdhaXRpbmdFbnRyaWVzRm9yRXhlY3V0aW9uKCk7XG5cdFx0aWYoYXJlUHJpb3JpdHlFbnRyaWVzRW1wdHkoKSl7XG5cdFx0XHRzdG9wKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnNvbGUud2FybihcIkFuaW1hdGlvbiBmcmFtZSBsb29wIGV4ZWN1dGVkIHRvIGl0cyBzZXQgbGltaXQ6IFwiLCBUaWNrRW50cnkuYWxsb3dlZFRpY2tDb3VudCk7XG5cdFx0aWYoVGlja0VudHJ5LmRlYnVnKXtcblx0XHRcdGNvbnNvbGUubG9nKFwiRW50cmllczogXCIsIHByaW9yaXR5RW50cmllc1swXSxwcmlvcml0eUVudHJpZXNbMV0scHJpb3JpdHlFbnRyaWVzWzJdLHdhaXRFbnRyaWVzKTtcblx0XHR9XG5cdFx0cmVzZXQoKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuIHRydWU7XG5cbn1cblxuXG5mdW5jdGlvbiBzdG9wKCl7XG5cdHRpY2tDb3VudCA9IDA7XG5cdGlzRXhlY3V0aW5nID0gZmFsc2U7XG5cdHRpY2tNYW5hZ2VyLnN0b3AoKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoKXtcblx0c3RvcCgpO1xuXHRwcmlvcml0eUVudHJpZXMgPSBbbnVsbCwgbnVsbCwgbnVsbF07XG5cdHdhaXRFbnRyaWVzID0gbnVsbDtcbn1cblxuXG5mdW5jdGlvbiBtb3ZlV2FpdGluZ0VudHJpZXNGb3JFeGVjdXRpb24oKXtcblx0Y29uc3QgZW50cmllc0NvdW50ID0gd2FpdEVudHJpZXMgPyAgd2FpdEVudHJpZXMubGVuZ3RoIDogMDtcblx0aWYod2FpdEVudHJpZXMgJiYgZW50cmllc0NvdW50ID4gMCkge1xuXHRcdGZvcihsZXQgaW5kZXggPSAwIDsgaW5kZXggPCBlbnRyaWVzQ291bnQ7IGluZGV4Kyspe1xuXHRcdFx0bGV0IHRpY2tFbnRyeSA9IHdhaXRFbnRyaWVzW2luZGV4XTtcblx0XHRcdGNvbnN0IHsgcHJpb3JpdHkgfSA9IHRpY2tFbnRyeTtcblx0XHRcdGlmKCFwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldKXtcblx0XHRcdFx0cHJpb3JpdHlFbnRyaWVzW3ByaW9yaXR5XSA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgdGlja0VudHJpZXMgPSBwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldO1xuXHRcdFx0dGlja0VudHJpZXMucHVzaCh0aWNrRW50cnkpO1xuXHRcdH1cblx0fVxuXHR3YWl0RW50cmllcyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVQcmlvcml0eUVudHJpZXMoKXtcblx0aXNFeGVjdXRpbmcgPSB0cnVlO1xuXHRmb3IobGV0IGluZGV4ID0gMCA7IGluZGV4IDwgcHJpb3JpdHlFbnRyaWVzLmxlbmd0aDsgaW5kZXgrKyl7XG5cdFx0bGV0IHRpY2tFbnRyaWVzID0gcHJpb3JpdHlFbnRyaWVzW2luZGV4XTtcblx0XHRpZih0aWNrRW50cmllcyAmJiB0aWNrRW50cmllcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRleGVjdXRlVGlja0VudHJpZXModGlja0VudHJpZXMpO1xuXHRcdFx0Ly9DbGVhciB0aGVtIG9uY2UgZXhlY3V0ZWRcblx0XHRcdHByaW9yaXR5RW50cmllc1tpbmRleF0gPSBudWxsO1xuXHRcdH1cblx0fVxuXHRpc0V4ZWN1dGluZyA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBleGVjdXRlVGlja0VudHJpZXModGlja0VudHJpZXMpe1xuXHQvLyBpbXBvcnRhbnQgdG8gdXNlIGZvci1sb29wXG5cdC8vIHRpY2tFbnRyaWVzIGdyb3dzIGR5bmFtaWNhbGx5IGJ5IG9uZSBvZiBpdHMgZW50cnlcblx0Ly8gZm9yIGV4YW1wbGU6IGxldCBzYXkgd2UgaGF2ZSBvbmUgZW50cnksIGFuZCBleGVjdXRpbmcgdGhhdCBlbnRyeSBtaWdodCBhZGRzIGFub3RoZXIgZW50cnlcblx0Ly8gd2l0aCBtYXAgZnVuY3Rpb24gd2UgY2FudCBleGVjdXRlIGR5bmFtaWNhbGx5IGdyb3dpbmcgZW50cmllcy5cblx0Zm9yKGxldCBpID0gMDsgaSA8IHRpY2tFbnRyaWVzLmxlbmd0aDsgaSsrKXtcblx0XHRjb25zdCB0aWNrRW50cnkgPSB0aWNrRW50cmllc1tpXTtcblx0XHRUaWNrRW50cnkuc3RhY2tEZWJ1ZyAmJiBjb25zb2xlLmxvZyhcIlRpY2tNYW5hZ2VyOiBleGVjdXRlVGlja0VudHJpZXMgOiBmb3IgXCIgLCBpLCB0aWNrRW50cnkpO1xuXHRcdHRpY2tFbnRyeS5saXN0ZW5lci5jYWxsKHRpY2tFbnRyeS5jb250ZXh0IHx8IHRpY2tFbnRyeS5saXN0ZW5lclsndGhpcyddKTtcblxuXHRcdGlmICh0aWNrRW50cnkuY2FsbGJhY2spIHtcblx0XHRcdHRpY2tFbnRyeS5jYWxsYmFjay5jYWxsKHRpY2tFbnRyeS5jYWxsYmFja1sndGhpcyddKTtcblx0XHR9XG5cdFx0dGlja0VudHJ5LmV4ZWN1dGlvbkNvdW50Kys7XG5cdFx0aWYoVGlja0VudHJ5LmRlYnVnICYmIHRpY2tFbnRyeS5leGVjdXRpb25Db3VudCA+IDEpe1xuXHRcdFx0Y29uc29sZS5sb2coXCJFeGVjdXRlZCBtb3JlIHRoYW4gb25jZTogXCIsIHRpY2tFbnRyeSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFyZVByaW9yaXR5RW50cmllc0VtcHR5KCl7XG5cdGZvcihsZXQgaW5kZXggPSAwIDsgaW5kZXggPCBwcmlvcml0eUVudHJpZXMubGVuZ3RoOyBpbmRleCsrKXtcblx0XHRsZXQgdGlja0VudHJpZXMgPSBwcmlvcml0eUVudHJpZXNbaW5kZXhdO1xuXHRcdGlmKHRpY2tFbnRyaWVzICYmIHRpY2tFbnRyaWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2soKXtcblx0Y29uc3Qgc2hvdWxkQ29udGludWUgPSBvblRpY2soKTtcblx0aWYoc2hvdWxkQ29udGludWUpe1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjayk7XG5cdH1cbn1cblxuY2xhc3MgVGlja01hbmFnZXIge1xuXHRjb25zdHJ1Y3Rvcigpe1xuXHR9XG59XG5cblRpY2tNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodGlja0VudHJ5KSB7XG5cdFRpY2tFbnRyeS5zdGFja0RlYnVnICYmIGNvbnNvbGUubG9nKFwiVGlja01hbmFnZXI6IGFkZCA6IFwiICwgdGlja0VudHJ5KTtcblx0aWYoYXJlUHJpb3JpdHlFbnRyaWVzRW1wdHkoKSl7XG5cdFx0dGhpcy5zdGFydCgpXG5cdH1cblx0aWYoaXNFeGVjdXRpbmcpe1xuXHRcdFRpY2tFbnRyeS5zdGFja0RlYnVnICYmIGNvbnNvbGUubG9nKFwiVGlja01hbmFnZXI6IGFkZCA6ICB3YWl0IFwiKTtcblx0XHRpZighd2FpdEVudHJpZXMpe1xuXHRcdFx0d2FpdEVudHJpZXMgPSBbXTtcblx0XHR9XG5cdFx0d2FpdEVudHJpZXMucHVzaCh0aWNrRW50cnkpO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IHsgcHJpb3JpdHkgfSA9IHRpY2tFbnRyeTtcblx0XHRpZighcHJpb3JpdHlFbnRyaWVzW3ByaW9yaXR5XSl7XG5cdFx0XHRUaWNrRW50cnkuc3RhY2tEZWJ1ZyAmJiBjb25zb2xlLmxvZyhcIlRpY2tNYW5hZ2VyOiBhZGQgOiBpbiBcIitwcmlvcml0eStcIiA6IG5ldyBBcnJheVwiKTtcblx0XHRcdHByaW9yaXR5RW50cmllc1twcmlvcml0eV0gPSBbXTtcblx0XHR9XG5cdFx0VGlja0VudHJ5LnN0YWNrRGVidWcgJiYgY29uc29sZS5sb2coXCJUaWNrTWFuYWdlcjogYWRkIDogaW4gXCIrcHJpb3JpdHkrXCIgOiBwdXNoXCIpO1xuXHRcdGNvbnN0IHRpY2tFbnRyaWVzID0gcHJpb3JpdHlFbnRyaWVzW3ByaW9yaXR5XTtcblx0XHR0aWNrRW50cmllcy5wdXNoKHRpY2tFbnRyeSk7XG5cdH1cblxufTtcblxuXG4vLyBUb2RvOiBTdXBwb3J0IGZvciBOb2RlSlMgXG5UaWNrTWFuYWdlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdGlmKHdpbmRvdyl7XG5cdFx0Ly8gd2lsbCByZWNlaXZlcyB0aW1lc3RhbXAgYXMgYXJndW1lbnRcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2spO1xuXHRcdFRpY2tFbnRyeS5zdGFja0RlYnVnICYmIGNvbnNvbGUubG9nKFwiVGlja01hbmFnZXI6IHN0YXJ0IDogXCIsIHJlcXVlc3RBbmltYXRpb25GcmFtZUlkKTtcblx0fVxufTtcblxuXG5UaWNrTWFuYWdlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcblx0aWYod2luZG93KXtcblx0XHRUaWNrRW50cnkuc3RhY2tEZWJ1ZyAmJiBjb25zb2xlLmxvZyhcIlRpY2tNYW5hZ2VyOiBzdG9wIDogXCIsIHJlcXVlc3RBbmltYXRpb25GcmFtZUlkKTtcblx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQpO1xuXHR9XG59O1xuXG5jb25zdCB0aWNrTWFuYWdlciA9IG5ldyBUaWNrTWFuYWdlcigpO1xuXG4vLyBzaW5nbGV0b25JbnN0YW5hY2VcbmV4cG9ydCBkZWZhdWx0IHRpY2tNYW5hZ2VyO1xuXG5cblxuXG5cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvTWFuYWdlci5qcyIsImltcG9ydCBUaWNrZXIgZnJvbSBcIi4vLi4vbGliXCI7XG5UaWNrZXIuZGVidWcgPSB0cnVlO1xuZnVuY3Rpb24gZmlyc3RGdW5jdGlvbiAoKXtcbiAgICBjb25zb2xlLmxvZyhcImZpcnN0IEZ1bmN0aW9uXCIpO1xufVxuXG5mdW5jdGlvbiBzZWNvbmRGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJTZWNvbmQgRnVuY3Rpb25cIik7XG59XG5cbmZ1bmN0aW9uIHRoaXJkRnVuY3Rpb24gKCl7XG5cdGNvbnNvbGUubG9nKFwiVGhpcmQgRnVuY3Rpb25cIik7XG5cdHRpY2tlcjQuZXhlY3V0ZSgpO1xufVxuXG5mdW5jdGlvbiBmb3VydGhGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJGb3VydGggRnVuY3Rpb25cIik7XG5cdHRpY2tlcjUuZXhlY3V0ZSgpO1xuXG59XG5mdW5jdGlvbiBmaWZ0aEZ1bmN0aW9uICgpe1xuXHRjb25zb2xlLmxvZyhcIkZpZnRoIEZ1bmN0aW9uXCIpO1xuXHR0aWNrZXI0LmV4ZWN1dGUoKTsvLyB0byB0ZXN0IGluZmluaXRlIGxvb3AgZGV0ZWN0aW9uXG59XG5cbmZ1bmN0aW9uIGNhbGxCYWNrRnVuY3Rpb24gKCl7XG5cdGNvbnNvbGUubG9nKFwiSSBhbSBjYWxsZWQgb25jZSBwZXIgZnJhbWUgbGFzdCBhcyBjYWxsYmFja1wiKTtcbn1cblxudmFyIHRpY2tlcjEgPSBuZXcgVGlja2VyKHdpbmRvdywgZmlyc3RGdW5jdGlvbiwgY2FsbEJhY2tGdW5jdGlvbik7XG52YXIgdGlja2VyMiA9IG5ldyBUaWNrZXIod2luZG93LCBzZWNvbmRGdW5jdGlvbiwgY2FsbEJhY2tGdW5jdGlvbiAsIDEpO1xudmFyIHRpY2tlcjMgPSBuZXcgVGlja2VyKHdpbmRvdywgdGhpcmRGdW5jdGlvbiwgY2FsbEJhY2tGdW5jdGlvbiAsIDIpO1xudmFyIHRpY2tlcjQgPSBuZXcgVGlja2VyKHdpbmRvdywgZm91cnRoRnVuY3Rpb24sIG51bGwsIDIpO1xudmFyIHRpY2tlcjUgPSBuZXcgVGlja2VyKHdpbmRvdywgZmlmdGhGdW5jdGlvbiwgbnVsbCwgMSk7XG5cbnRpY2tlcjMuZXhlY3V0ZSgpO1xudGlja2VyMi5leGVjdXRlKCk7XG50aWNrZXIxLmV4ZWN1dGUoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kZW1vL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==