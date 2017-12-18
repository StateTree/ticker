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

var _TickEntry = __webpack_require__(1);

var _TickEntry2 = _interopRequireDefault(_TickEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TickEntry2.default;

/***/ }),
/* 1 */
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
};

/*---- Public|Prototype Methods ---*/

exports.default = TickEntry;
TickEntry.prototype.dispose = function () {
	this.context = null;
	this.listener = null;
	this.callback = null;
	this.priority = null;
};

TickEntry.prototype.execute = function () {
	_Manager2.default.add(this);
};

TickEntry.prototype.getMaxPriority = function () {
	return _Manager2.default.getMaxPriority();
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var requestAnimationFrameId = NaN;
var priorityEntries = [null, null, null, null];

function onTick() {
	for (var index = 0; index < priorityEntries.length; index++) {
		var tickEntries = priorityEntries[index];
		if (tickEntries && tickEntries.length > 0) {
			executeTickEntries(tickEntries);
			//Clear them once executed
			priorityEntries[index] = null;
		}
	}
}

function executeTickEntries(tickEntries) {
	tickEntries.map(function (tickEntry, index) {
		tickEntry.listener.call(tickEntry.context || tickEntry.listener['this']);
		if (tickEntry.callback) {
			tickEntry.callback.call(tickEntry.callback['this']);
		}
	});
}

function requestAnimationFrameCallback() {
	onTick();
	requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
}

var TickManager = function TickManager() {
	_classCallCheck(this, TickManager);

	requestAnimationFrameId = 0; // for Windows Env
	this.start();
};

TickManager.prototype.add = function (tickEntry) {
	var priority = tickEntry.priority;

	if (!priorityEntries[priority]) {
		priorityEntries[priority] = [];
	}
	var tickEntries = priorityEntries[priority];
	tickEntries.push(tickEntry); // todo: Stack or Queue
};

// Todo: Support for NodeJS 
TickManager.prototype.start = function () {
	if (window) {
		// will receives timestamp as argument
		//todo: Learn:  the purpose of timestamp
		requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
};

TickManager.prototype.stop = function () {
	if (window) {
		window.cancelAnimationFrame(requestAnimationFrameId);
	}
};

TickManager.prototype.getMaxPriority = function () {
	return priorityEntries.length - 1;
};

var singletonInstance = new TickManager();

exports.default = singletonInstance;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lib = __webpack_require__(0);

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function firstFunction() {
	console.log("first Function");
}

function secondFunction() {
	console.log("Second Function");
}

function thirdFunction() {
	console.log("Third Function");
}

function fourthFunction() {
	console.log("Fourth Function");
}

function callBackFunction() {
	console.log("I am called once per frame last as callback");
}

var ticker1 = new _lib2.default(window, firstFunction, callBackFunction);
var ticker2 = new _lib2.default(window, secondFunction, callBackFunction, 1);
var ticker3 = new _lib2.default(window, thirdFunction, callBackFunction, 2);
var ticker4 = new _lib2.default(window, fourthFunction, callBackFunction, 3);

ticker4.execute();
ticker3.execute();
ticker2.execute();
ticker1.execute();

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiMDFhYjYzNDc1M2FhZmRjM2ViNCIsIndlYnBhY2s6Ly8vLi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1RpY2tFbnRyeS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9kZW1vL2luZGV4LmpzIl0sIm5hbWVzIjpbIlRpY2tFbnRyeSIsImNvbnRleHQiLCJsaXN0ZW5lciIsImNhbGxiYWNrIiwicHJpb3JpdHkiLCJwcm90b3R5cGUiLCJkaXNwb3NlIiwiZXhlY3V0ZSIsImFkZCIsImdldE1heFByaW9yaXR5IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQiLCJOYU4iLCJwcmlvcml0eUVudHJpZXMiLCJvblRpY2siLCJpbmRleCIsImxlbmd0aCIsInRpY2tFbnRyaWVzIiwiZXhlY3V0ZVRpY2tFbnRyaWVzIiwibWFwIiwidGlja0VudHJ5IiwiY2FsbCIsInJlcXVlc3RBbmltYXRpb25GcmFtZUNhbGxiYWNrIiwid2luZG93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiVGlja01hbmFnZXIiLCJzdGFydCIsInB1c2giLCJzdG9wIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJzaW5nbGV0b25JbnN0YW5jZSIsImZpcnN0RnVuY3Rpb24iLCJjb25zb2xlIiwibG9nIiwic2Vjb25kRnVuY3Rpb24iLCJ0aGlyZEZ1bmN0aW9uIiwiZm91cnRoRnVuY3Rpb24iLCJjYWxsQmFja0Z1bmN0aW9uIiwidGlja2VyMSIsInRpY2tlcjIiLCJ0aWNrZXIzIiwidGlja2VyNCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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OztBQUVELElBQUlLLFVBQVUsa0JBQVdmLE1BQVgsRUFBbUJRLGFBQW5CLEVBQWtDTSxnQkFBbEMsQ0FBZDtBQUNBLElBQUlFLFVBQVUsa0JBQVdoQixNQUFYLEVBQW1CVyxjQUFuQixFQUFtQ0csZ0JBQW5DLEVBQXNELENBQXRELENBQWQ7QUFDQSxJQUFJRyxVQUFVLGtCQUFXakIsTUFBWCxFQUFtQlksYUFBbkIsRUFBa0NFLGdCQUFsQyxFQUFxRCxDQUFyRCxDQUFkO0FBQ0EsSUFBSUksVUFBVSxrQkFBV2xCLE1BQVgsRUFBbUJhLGNBQW5CLEVBQW1DQyxnQkFBbkMsRUFBc0QsQ0FBdEQsQ0FBZDs7QUFFQUksUUFBUWpDLE9BQVI7QUFDQWdDLFFBQVFoQyxPQUFSO0FBQ0ErQixRQUFRL0IsT0FBUjtBQUNBOEIsUUFBUTlCLE9BQVIsRyIsImZpbGUiOiJkZW1vL2RlbW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcInRpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJ0aWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1widGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGIwMWFiNjM0NzUzYWFmZGMzZWI0IiwiaW1wb3J0IFRpY2tlciBmcm9tICcuL1RpY2tFbnRyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IFRpY2tlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9pbmRleC5qcyIsImltcG9ydCBtYW5hZ2VyIGZyb20gJy4vTWFuYWdlcic7XG5cbi8vIHRvRG86IHN1cHBvcnQgYm90aCBjYWxsYmFjayBhbmQgcHJvbWlzZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja0VudHJ5XG57XG5cdC8qKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCAtIFRoZSBcInRoaXNcIiBhcmd1bWVudCBmb3IgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lci5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGNvbnRleHQsIGxpc3RlbmVyLCBjYWxsYmFjayA9IG51bGwsIHByaW9yaXR5ID0gMClcblx0e1xuXHRcdHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cdFx0dGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuXHRcdHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHR0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XG5cdH1cblxufVxuXG4vKi0tLS0gUHVibGljfFByb3RvdHlwZSBNZXRob2RzIC0tLSovXG5cblRpY2tFbnRyeS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCl7XG5cdHRoaXMuY29udGV4dCA9IG51bGw7XG5cdHRoaXMubGlzdGVuZXIgPSBudWxsO1xuXHR0aGlzLmNhbGxiYWNrID0gbnVsbDtcblx0dGhpcy5wcmlvcml0eSA9IG51bGw7XG59O1xuXG5UaWNrRW50cnkucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbigpe1xuXHRtYW5hZ2VyLmFkZCh0aGlzKTtcbn07XG5cblRpY2tFbnRyeS5wcm90b3R5cGUuZ2V0TWF4UHJpb3JpdHkgPSBmdW5jdGlvbigpe1xuXHRyZXR1cm4gbWFuYWdlci5nZXRNYXhQcmlvcml0eSgpO1xufTtcblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvVGlja0VudHJ5LmpzIiwiXG5sZXQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQgPSBOYU47XG5sZXQgcHJpb3JpdHlFbnRyaWVzID0gW251bGwsIG51bGwsIG51bGwsIG51bGxdO1xuXG5mdW5jdGlvbiBvblRpY2soKXtcblx0Zm9yKGxldCBpbmRleCA9IDAgOyBpbmRleCA8IHByaW9yaXR5RW50cmllcy5sZW5ndGg7IGluZGV4Kyspe1xuXHRcdGxldCB0aWNrRW50cmllcyA9IHByaW9yaXR5RW50cmllc1tpbmRleF07XG5cdFx0aWYodGlja0VudHJpZXMgJiYgdGlja0VudHJpZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0ZXhlY3V0ZVRpY2tFbnRyaWVzKHRpY2tFbnRyaWVzKTtcblx0XHRcdC8vQ2xlYXIgdGhlbSBvbmNlIGV4ZWN1dGVkXG5cdFx0XHRwcmlvcml0eUVudHJpZXNbaW5kZXhdID0gbnVsbDtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZXhlY3V0ZVRpY2tFbnRyaWVzKHRpY2tFbnRyaWVzKXtcblx0dGlja0VudHJpZXMubWFwKCAodGlja0VudHJ5ICwgaW5kZXggKT0+IHtcblx0XHR0aWNrRW50cnkubGlzdGVuZXIuY2FsbCh0aWNrRW50cnkuY29udGV4dCB8fCB0aWNrRW50cnkubGlzdGVuZXJbJ3RoaXMnXSk7XG5cdFx0aWYgKHRpY2tFbnRyeS5jYWxsYmFjaykge1xuXHRcdFx0dGlja0VudHJ5LmNhbGxiYWNrLmNhbGwodGlja0VudHJ5LmNhbGxiYWNrWyd0aGlzJ10pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZUNhbGxiYWNrKCl7XG5cdG9uVGljaygpO1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2spO1xufVxuXG5jbGFzcyBUaWNrTWFuYWdlciB7XG5cdGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gMDsgLy8gZm9yIFdpbmRvd3MgRW52XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcblx0fVxufVxuXG5cblRpY2tNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodGlja0VudHJ5KSB7XG5cdGNvbnN0IHsgcHJpb3JpdHkgfSA9IHRpY2tFbnRyeTtcblx0aWYoIXByaW9yaXR5RW50cmllc1twcmlvcml0eV0pe1xuXHRcdHByaW9yaXR5RW50cmllc1twcmlvcml0eV0gPSBbXTtcblx0fVxuXHRjb25zdCB0aWNrRW50cmllcyA9IHByaW9yaXR5RW50cmllc1twcmlvcml0eV07XG5cdHRpY2tFbnRyaWVzLnB1c2godGlja0VudHJ5KTsgLy8gdG9kbzogU3RhY2sgb3IgUXVldWVcbn07XG5cblxuLy8gVG9kbzogU3VwcG9ydCBmb3IgTm9kZUpTIFxuVGlja01hbmFnZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRpZih3aW5kb3cpe1xuXHRcdC8vIHdpbGwgcmVjZWl2ZXMgdGltZXN0YW1wIGFzIGFyZ3VtZW50XG5cdFx0Ly90b2RvOiBMZWFybjogIHRoZSBwdXJwb3NlIG9mIHRpbWVzdGFtcFxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjayk7XG5cdH1cbn07XG5cblxuVGlja01hbmFnZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cdGlmKHdpbmRvdyl7XG5cdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RBbmltYXRpb25GcmFtZUlkKTtcblx0fVxufTtcblxuVGlja01hbmFnZXIucHJvdG90eXBlLmdldE1heFByaW9yaXR5ID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gcHJpb3JpdHlFbnRyaWVzLmxlbmd0aCAtIDE7XG59O1xuXG5jb25zdCBzaW5nbGV0b25JbnN0YW5jZSA9IG5ldyBUaWNrTWFuYWdlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBzaW5nbGV0b25JbnN0YW5jZTtcblxuXG5cblxuXG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL01hbmFnZXIuanMiLCJpbXBvcnQgVGlja2VyIGZyb20gXCIuLy4uL2xpYlwiO1xuXG5mdW5jdGlvbiBmaXJzdEZ1bmN0aW9uICgpe1xuICAgIGNvbnNvbGUubG9nKFwiZmlyc3QgRnVuY3Rpb25cIik7XG59XG5cbmZ1bmN0aW9uIHNlY29uZEZ1bmN0aW9uICgpe1xuXHRjb25zb2xlLmxvZyhcIlNlY29uZCBGdW5jdGlvblwiKTtcbn1cblxuZnVuY3Rpb24gdGhpcmRGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJUaGlyZCBGdW5jdGlvblwiKTtcbn1cblxuZnVuY3Rpb24gZm91cnRoRnVuY3Rpb24gKCl7XG5cdGNvbnNvbGUubG9nKFwiRm91cnRoIEZ1bmN0aW9uXCIpO1xufVxuXG5mdW5jdGlvbiBjYWxsQmFja0Z1bmN0aW9uICgpe1xuXHRjb25zb2xlLmxvZyhcIkkgYW0gY2FsbGVkIG9uY2UgcGVyIGZyYW1lIGxhc3QgYXMgY2FsbGJhY2tcIik7XG59XG5cbnZhciB0aWNrZXIxID0gbmV3IFRpY2tlcih3aW5kb3csIGZpcnN0RnVuY3Rpb24sIGNhbGxCYWNrRnVuY3Rpb24pO1xudmFyIHRpY2tlcjIgPSBuZXcgVGlja2VyKHdpbmRvdywgc2Vjb25kRnVuY3Rpb24sIGNhbGxCYWNrRnVuY3Rpb24gLCAxKTtcbnZhciB0aWNrZXIzID0gbmV3IFRpY2tlcih3aW5kb3csIHRoaXJkRnVuY3Rpb24sIGNhbGxCYWNrRnVuY3Rpb24gLCAyKTtcbnZhciB0aWNrZXI0ID0gbmV3IFRpY2tlcih3aW5kb3csIGZvdXJ0aEZ1bmN0aW9uLCBjYWxsQmFja0Z1bmN0aW9uICwgMyk7XG5cbnRpY2tlcjQuZXhlY3V0ZSgpO1xudGlja2VyMy5leGVjdXRlKCk7XG50aWNrZXIyLmV4ZWN1dGUoKTtcbnRpY2tlcjEuZXhlY3V0ZSgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RlbW8vaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9