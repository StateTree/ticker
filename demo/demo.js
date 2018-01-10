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
	this.context = null;
	this.listener = null;
	this.callback = null;
	this.priority = null;
	this.executionCount = NaN;
};

TickEntry.prototype.execute = function () {
	_Manager2.default.add(this);
};

TickEntry.HIGH = 0;
TickEntry.NORMAL = 1;
TickEntry.LOW = 2;

TickEntry.allowedTickCount = 100;
TickEntry.debug = false;

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
	if (arePriorityEntriesEmpty()) {
		this.start();
	}
	if (isExecuting) {
		console.log("Added to Wait entries");
		if (!waitEntries) {
			waitEntries = [];
		}
		waitEntries.push(tickEntry);
	} else {
		var priority = tickEntry.priority;

		if (!priorityEntries[priority]) {
			priorityEntries[priority] = [];
		}
		var tickEntries = priorityEntries[priority];
		tickEntries.push(tickEntry);
	}
};

// Todo: Support for NodeJS 
TickManager.prototype.start = function () {
	if (window) {
		// will receives timestamp as argument
		requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
};

TickManager.prototype.stop = function () {
	if (window) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmNzVlMjQ3ZGI3YzBkZGM5Nzk5ZCIsIndlYnBhY2s6Ly8vLi9saWIvVGlja0VudHJ5LmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9kZW1vL2luZGV4LmpzIl0sIm5hbWVzIjpbIlRpY2tFbnRyeSIsImNvbnRleHQiLCJsaXN0ZW5lciIsImNhbGxiYWNrIiwicHJpb3JpdHkiLCJleGVjdXRpb25Db3VudCIsInByb3RvdHlwZSIsImRpc3Bvc2UiLCJOYU4iLCJleGVjdXRlIiwiYWRkIiwiSElHSCIsIk5PUk1BTCIsIkxPVyIsImFsbG93ZWRUaWNrQ291bnQiLCJkZWJ1ZyIsInJlcXVlc3RBbmltYXRpb25GcmFtZUlkIiwicHJpb3JpdHlFbnRyaWVzIiwid2FpdEVudHJpZXMiLCJ0aWNrQ291bnQiLCJpc0V4ZWN1dGluZyIsIm9uVGljayIsImNvbnNvbGUiLCJsb2ciLCJleGVjdXRlUHJpb3JpdHlFbnRyaWVzIiwibW92ZVdhaXRpbmdFbnRyaWVzRm9yRXhlY3V0aW9uIiwiYXJlUHJpb3JpdHlFbnRyaWVzRW1wdHkiLCJzdG9wIiwid2FybiIsInJlc2V0IiwidGlja01hbmFnZXIiLCJlbnRyaWVzQ291bnQiLCJsZW5ndGgiLCJpbmRleCIsInRpY2tFbnRyeSIsInRpY2tFbnRyaWVzIiwicHVzaCIsImV4ZWN1dGVUaWNrRW50cmllcyIsImkiLCJjYWxsIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2siLCJzaG91bGRDb250aW51ZSIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIlRpY2tNYW5hZ2VyIiwic3RhcnQiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImZpcnN0RnVuY3Rpb24iLCJzZWNvbmRGdW5jdGlvbiIsInRoaXJkRnVuY3Rpb24iLCJ0aWNrZXI0IiwiZm91cnRoRnVuY3Rpb24iLCJ0aWNrZXI1IiwiZmlmdGhGdW5jdGlvbiIsImNhbGxCYWNrRnVuY3Rpb24iLCJ0aWNrZXIxIiwidGlja2VyMiIsInRpY2tlcjMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBOzs7Ozs7OztBQUVBO0lBQ3FCQSxTO0FBRXBCOzs7O0FBSUEsbUJBQVlDLE9BQVosRUFBcUJDLFFBQXJCLEVBQ0E7QUFBQSxLQUQrQkMsUUFDL0IsdUVBRDBDLElBQzFDO0FBQUEsS0FEZ0RDLFFBQ2hELHVFQUQyRCxDQUMzRDs7QUFBQTs7QUFDQyxNQUFLSCxPQUFMLEdBQWVBLE9BQWY7QUFDQSxNQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLE1BQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsTUFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxNQUFLQyxjQUFMLEdBQXNCLENBQXRCO0FBQ0EsQzs7QUFJRjs7a0JBakJxQkwsUztBQW1CckJBLFVBQVVNLFNBQVYsQ0FBb0JDLE9BQXBCLEdBQThCLFlBQVU7QUFDdkMsTUFBS04sT0FBTCxHQUFlLElBQWY7QUFD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IHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJ0aWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1widGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInRpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmNzVlMjQ3ZGI3YzBkZGM5Nzk5ZCIsImltcG9ydCBtYW5hZ2VyIGZyb20gJy4vTWFuYWdlcic7XG5cbi8vIHRvRG86IHN1cHBvcnQgYm90aCBjYWxsYmFjayBhbmQgcHJvbWlzZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja0VudHJ5XG57XG5cdC8qKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCAtIFRoZSBcInRoaXNcIiBhcmd1bWVudCBmb3IgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lci5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGNvbnRleHQsIGxpc3RlbmVyLCBjYWxsYmFjayA9IG51bGwsIHByaW9yaXR5ID0gMClcblx0e1xuXHRcdHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cdFx0dGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuXHRcdHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHR0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XG5cdFx0dGhpcy5leGVjdXRpb25Db3VudCA9IDA7XG5cdH1cblxufVxuXG4vKi0tLS0gUHVibGljfFByb3RvdHlwZSBNZXRob2RzIC0tLSovXG5cblRpY2tFbnRyeS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCl7XG5cdHRoaXMuY29udGV4dCA9IG51bGw7XG5cdHRoaXMubGlzdGVuZXIgPSBudWxsO1xuXHR0aGlzLmNhbGxiYWNrID0gbnVsbDtcblx0dGhpcy5wcmlvcml0eSA9IG51bGw7XG5cdHRoaXMuZXhlY3V0aW9uQ291bnQgPSBOYU47XG59O1xuXG5UaWNrRW50cnkucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbigpe1xuXHRtYW5hZ2VyLmFkZCh0aGlzKTtcbn07XG5cblxuVGlja0VudHJ5LkhJR0ggPSAwO1xuVGlja0VudHJ5Lk5PUk1BTCA9IDE7XG5UaWNrRW50cnkuTE9XID0gMjtcblxuVGlja0VudHJ5LmFsbG93ZWRUaWNrQ291bnQgPSAxMDA7XG5UaWNrRW50cnkuZGVidWcgPSBmYWxzZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9UaWNrRW50cnkuanMiLCJpbXBvcnQgVGlja2VyIGZyb20gJy4vVGlja0VudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQgVGlja2VyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2luZGV4LmpzIiwiaW1wb3J0IFRpY2tFbnRyeSBmcm9tICcuL1RpY2tFbnRyeSc7XG5sZXQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQgPSAwOy8vIGZvciBXaW5kb3dzIEVudlxuXG4vL1swLUhJR0gsIDEtTk9STUFMLCAyLUxPV11cbmxldCBwcmlvcml0eUVudHJpZXMgPSBbbnVsbCwgbnVsbCwgbnVsbF07XG5sZXQgd2FpdEVudHJpZXMgPSBudWxsO1xuXG5sZXQgdGlja0NvdW50ID0gMDtcbmxldCBpc0V4ZWN1dGluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBvblRpY2soKXtcblx0dGlja0NvdW50Kys7XG5cdGlmKFRpY2tFbnRyeS5kZWJ1Zyl7XG5cdFx0Y29uc29sZS5sb2coXCJUaWNrIGNvdW50OiBcIiwgdGlja0NvdW50KTtcblx0fVxuXHRpZih0aWNrQ291bnQgPCBUaWNrRW50cnkuYWxsb3dlZFRpY2tDb3VudCl7XG5cdFx0ZXhlY3V0ZVByaW9yaXR5RW50cmllcygpO1xuXHRcdG1vdmVXYWl0aW5nRW50cmllc0ZvckV4ZWN1dGlvbigpO1xuXHRcdGlmKGFyZVByaW9yaXR5RW50cmllc0VtcHR5KCkpe1xuXHRcdFx0c3RvcCgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLndhcm4oXCJBbmltYXRpb24gZnJhbWUgbG9vcCBleGVjdXRlZCB0byBpdHMgc2V0IGxpbWl0OiBcIiwgVGlja0VudHJ5LmFsbG93ZWRUaWNrQ291bnQpO1xuXHRcdGlmKFRpY2tFbnRyeS5kZWJ1Zyl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkVudHJpZXM6IFwiLCBwcmlvcml0eUVudHJpZXNbMF0scHJpb3JpdHlFbnRyaWVzWzFdLHByaW9yaXR5RW50cmllc1syXSx3YWl0RW50cmllcyk7XG5cdFx0fVxuXHRcdHJlc2V0KCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xuXG59XG5cblxuZnVuY3Rpb24gc3RvcCgpe1xuXHR0aWNrQ291bnQgPSAwO1xuXHRpc0V4ZWN1dGluZyA9IGZhbHNlO1xuXHR0aWNrTWFuYWdlci5zdG9wKCk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0KCl7XG5cdHN0b3AoKTtcblx0cHJpb3JpdHlFbnRyaWVzID0gW251bGwsIG51bGwsIG51bGxdO1xuXHR3YWl0RW50cmllcyA9IG51bGw7XG59XG5cblxuZnVuY3Rpb24gbW92ZVdhaXRpbmdFbnRyaWVzRm9yRXhlY3V0aW9uKCl7XG5cdGNvbnN0IGVudHJpZXNDb3VudCA9IHdhaXRFbnRyaWVzID8gIHdhaXRFbnRyaWVzLmxlbmd0aCA6IDA7XG5cdGlmKHdhaXRFbnRyaWVzICYmIGVudHJpZXNDb3VudCA+IDApIHtcblx0XHRmb3IobGV0IGluZGV4ID0gMCA7IGluZGV4IDwgZW50cmllc0NvdW50OyBpbmRleCsrKXtcblx0XHRcdGxldCB0aWNrRW50cnkgPSB3YWl0RW50cmllc1tpbmRleF07XG5cdFx0XHRjb25zdCB7IHByaW9yaXR5IH0gPSB0aWNrRW50cnk7XG5cdFx0XHRpZighcHJpb3JpdHlFbnRyaWVzW3ByaW9yaXR5XSl7XG5cdFx0XHRcdHByaW9yaXR5RW50cmllc1twcmlvcml0eV0gPSBbXTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHRpY2tFbnRyaWVzID0gcHJpb3JpdHlFbnRyaWVzW3ByaW9yaXR5XTtcblx0XHRcdHRpY2tFbnRyaWVzLnB1c2godGlja0VudHJ5KTtcblx0XHR9XG5cdH1cblx0d2FpdEVudHJpZXMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBleGVjdXRlUHJpb3JpdHlFbnRyaWVzKCl7XG5cdGlzRXhlY3V0aW5nID0gdHJ1ZTtcblx0Zm9yKGxldCBpbmRleCA9IDAgOyBpbmRleCA8IHByaW9yaXR5RW50cmllcy5sZW5ndGg7IGluZGV4Kyspe1xuXHRcdGxldCB0aWNrRW50cmllcyA9IHByaW9yaXR5RW50cmllc1tpbmRleF07XG5cdFx0aWYodGlja0VudHJpZXMgJiYgdGlja0VudHJpZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0ZXhlY3V0ZVRpY2tFbnRyaWVzKHRpY2tFbnRyaWVzKTtcblx0XHRcdC8vQ2xlYXIgdGhlbSBvbmNlIGV4ZWN1dGVkXG5cdFx0XHRwcmlvcml0eUVudHJpZXNbaW5kZXhdID0gbnVsbDtcblx0XHR9XG5cdH1cblx0aXNFeGVjdXRpbmcgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZXhlY3V0ZVRpY2tFbnRyaWVzKHRpY2tFbnRyaWVzKXtcblx0Ly8gaW1wb3J0YW50IHRvIHVzZSBmb3ItbG9vcFxuXHQvLyB0aWNrRW50cmllcyBncm93cyBkeW5hbWljYWxseSBieSBvbmUgb2YgaXRzIGVudHJ5XG5cdC8vIGZvciBleGFtcGxlOiBsZXQgc2F5IHdlIGhhdmUgb25lIGVudHJ5LCBhbmQgZXhlY3V0aW5nIHRoYXQgZW50cnkgbWlnaHQgYWRkcyBhbm90aGVyIGVudHJ5XG5cdC8vIHdpdGggbWFwIGZ1bmN0aW9uIHdlIGNhbnQgZXhlY3V0ZSBkeW5hbWljYWxseSBncm93aW5nIGVudHJpZXMuXG5cdGZvcihsZXQgaSA9IDA7IGkgPCB0aWNrRW50cmllcy5sZW5ndGg7IGkrKyl7XG5cdFx0Y29uc3QgdGlja0VudHJ5ID0gdGlja0VudHJpZXNbaV07XG5cdFx0dGlja0VudHJ5Lmxpc3RlbmVyLmNhbGwodGlja0VudHJ5LmNvbnRleHQgfHwgdGlja0VudHJ5Lmxpc3RlbmVyWyd0aGlzJ10pO1xuXHRcdGlmICh0aWNrRW50cnkuY2FsbGJhY2spIHtcblx0XHRcdHRpY2tFbnRyeS5jYWxsYmFjay5jYWxsKHRpY2tFbnRyeS5jYWxsYmFja1sndGhpcyddKTtcblx0XHR9XG5cdFx0dGlja0VudHJ5LmV4ZWN1dGlvbkNvdW50Kys7XG5cdFx0aWYoVGlja0VudHJ5LmRlYnVnICYmIHRpY2tFbnRyeS5leGVjdXRpb25Db3VudCA+IDEpe1xuXHRcdFx0Y29uc29sZS5sb2coXCJFeGVjdXRlZCBtb3JlIHRoYW4gb25jZTogXCIsIHRpY2tFbnRyeSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFyZVByaW9yaXR5RW50cmllc0VtcHR5KCl7XG5cdGZvcihsZXQgaW5kZXggPSAwIDsgaW5kZXggPCBwcmlvcml0eUVudHJpZXMubGVuZ3RoOyBpbmRleCsrKXtcblx0XHRsZXQgdGlja0VudHJpZXMgPSBwcmlvcml0eUVudHJpZXNbaW5kZXhdO1xuXHRcdGlmKHRpY2tFbnRyaWVzICYmIHRpY2tFbnRyaWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2soKXtcblx0Y29uc3Qgc2hvdWxkQ29udGludWUgPSBvblRpY2soKTtcblx0aWYoc2hvdWxkQ29udGludWUpe1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjayk7XG5cdH1cbn1cblxuY2xhc3MgVGlja01hbmFnZXIge1xuXHRjb25zdHJ1Y3Rvcigpe1xuXHR9XG59XG5cblRpY2tNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodGlja0VudHJ5KSB7XG5cdGlmKGFyZVByaW9yaXR5RW50cmllc0VtcHR5KCkpe1xuXHRcdHRoaXMuc3RhcnQoKVxuXHR9XG5cdGlmKGlzRXhlY3V0aW5nKXtcblx0XHRjb25zb2xlLmxvZyhcIkFkZGVkIHRvIFdhaXQgZW50cmllc1wiKTtcblx0XHRpZighd2FpdEVudHJpZXMpe1xuXHRcdFx0d2FpdEVudHJpZXMgPSBbXTtcblx0XHR9XG5cdFx0d2FpdEVudHJpZXMucHVzaCh0aWNrRW50cnkpO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IHsgcHJpb3JpdHkgfSA9IHRpY2tFbnRyeTtcblx0XHRpZighcHJpb3JpdHlFbnRyaWVzW3ByaW9yaXR5XSl7XG5cdFx0XHRwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldID0gW107XG5cdFx0fVxuXHRcdGNvbnN0IHRpY2tFbnRyaWVzID0gcHJpb3JpdHlFbnRyaWVzW3ByaW9yaXR5XTtcblx0XHR0aWNrRW50cmllcy5wdXNoKHRpY2tFbnRyeSk7XG5cdH1cblxufTtcblxuXG4vLyBUb2RvOiBTdXBwb3J0IGZvciBOb2RlSlMgXG5UaWNrTWFuYWdlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdGlmKHdpbmRvdyl7XG5cdFx0Ly8gd2lsbCByZWNlaXZlcyB0aW1lc3RhbXAgYXMgYXJndW1lbnRcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2spO1xuXHR9XG59O1xuXG5cblRpY2tNYW5hZ2VyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuXHRpZih3aW5kb3cpe1xuXHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCk7XG5cdH1cbn07XG5cbmNvbnN0IHRpY2tNYW5hZ2VyID0gbmV3IFRpY2tNYW5hZ2VyKCk7XG5cbi8vIHNpbmdsZXRvbkluc3RhbmFjZVxuZXhwb3J0IGRlZmF1bHQgdGlja01hbmFnZXI7XG5cblxuXG5cblxuXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9NYW5hZ2VyLmpzIiwiaW1wb3J0IFRpY2tlciBmcm9tIFwiLi8uLi9saWJcIjtcblRpY2tlci5kZWJ1ZyA9IHRydWU7XG5mdW5jdGlvbiBmaXJzdEZ1bmN0aW9uICgpe1xuICAgIGNvbnNvbGUubG9nKFwiZmlyc3QgRnVuY3Rpb25cIik7XG59XG5cbmZ1bmN0aW9uIHNlY29uZEZ1bmN0aW9uICgpe1xuXHRjb25zb2xlLmxvZyhcIlNlY29uZCBGdW5jdGlvblwiKTtcbn1cblxuZnVuY3Rpb24gdGhpcmRGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJUaGlyZCBGdW5jdGlvblwiKTtcblx0dGlja2VyNC5leGVjdXRlKCk7XG59XG5cbmZ1bmN0aW9uIGZvdXJ0aEZ1bmN0aW9uICgpe1xuXHRjb25zb2xlLmxvZyhcIkZvdXJ0aCBGdW5jdGlvblwiKTtcblx0dGlja2VyNS5leGVjdXRlKCk7XG5cbn1cbmZ1bmN0aW9uIGZpZnRoRnVuY3Rpb24gKCl7XG5cdGNvbnNvbGUubG9nKFwiRmlmdGggRnVuY3Rpb25cIik7XG5cdHRpY2tlcjQuZXhlY3V0ZSgpOy8vIHRvIHRlc3QgaW5maW5pdGUgbG9vcCBkZXRlY3Rpb25cbn1cblxuZnVuY3Rpb24gY2FsbEJhY2tGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJJIGFtIGNhbGxlZCBvbmNlIHBlciBmcmFtZSBsYXN0IGFzIGNhbGxiYWNrXCIpO1xufVxuXG52YXIgdGlja2VyMSA9IG5ldyBUaWNrZXIod2luZG93LCBmaXJzdEZ1bmN0aW9uLCBjYWxsQmFja0Z1bmN0aW9uKTtcbnZhciB0aWNrZXIyID0gbmV3IFRpY2tlcih3aW5kb3csIHNlY29uZEZ1bmN0aW9uLCBjYWxsQmFja0Z1bmN0aW9uICwgMSk7XG52YXIgdGlja2VyMyA9IG5ldyBUaWNrZXIod2luZG93LCB0aGlyZEZ1bmN0aW9uLCBjYWxsQmFja0Z1bmN0aW9uICwgMik7XG52YXIgdGlja2VyNCA9IG5ldyBUaWNrZXIod2luZG93LCBmb3VydGhGdW5jdGlvbiwgbnVsbCwgMik7XG52YXIgdGlja2VyNSA9IG5ldyBUaWNrZXIod2luZG93LCBmaWZ0aEZ1bmN0aW9uLCBudWxsLCAxKTtcblxudGlja2VyMy5leGVjdXRlKCk7XG50aWNrZXIyLmV4ZWN1dGUoKTtcbnRpY2tlcjEuZXhlY3V0ZSgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RlbW8vaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9