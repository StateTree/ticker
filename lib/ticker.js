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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
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

var TickEntry =
/**
 * @param {object} context - The "this" argument for the listener function.
 * @param {function} listener.
 */
function TickEntry(context, listener, callback) {
	_classCallCheck(this, TickEntry);

	this.context = context;
	this.listener = listener;
	this.callback = callback;
};

/*---- Public|Prototype Methods ---*/

exports.default = TickEntry;
TickEntry.prototype.dispose = function () {
	this.context = null;
	this.listener = null;
};

TickEntry.prototype.execute = function () {
	_Manager2.default.add(this, false);
};

TickEntry.prototype.executeLast = function () {
	_Manager2.default.add(this, true);
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
var tickEntries = null;
var callLastEntries = null;

function onTick() {
	if (tickEntries && tickEntries.length > 0) {
		tickEntries.map(function (tickEntry) {
			tickEntry.listener.call(tickEntry.context || tickEntry.listener['this']);
			if (tickEntry.callback) {
				tickEntry.callback.call(tickEntry.callback['this']);
			}
		});

		//Clear them once executed
		tickEntries = null;
	}

	if (callLastEntries && callLastEntries.length > 0) {
		callLastEntries.map(function (tickEntry) {
			tickEntry.listener.call(tickEntry.context || tickEntry.listener['this']);
			if (tickEntry.callback) {
				tickEntry.callback.call(tickEntry.callback['this']);
			}
		});

		//Clear them once executed
		callLastEntries = null;
	}
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

TickManager.prototype.add = function (tickEntry, callLast) {
	if (callLast) {
		if (!callLastEntries) {
			callLastEntries = [];
		}
		callLastEntries.push(tickEntry); // todo: Stack or Queue
	} else {
		if (!tickEntries) {
			tickEntries = [];
		}
		tickEntries.push(tickEntry); // todo: Stack or Queue
	}
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

var singletonInstance = new TickManager();

exports.default = singletonInstance;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxZmZlZjEzZmZjMmYyYmFlMjY4YyIsIndlYnBhY2s6Ly8vLi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1RpY2tFbnRyeS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJUaWNrRW50cnkiLCJjb250ZXh0IiwibGlzdGVuZXIiLCJjYWxsYmFjayIsInByb3RvdHlwZSIsImRpc3Bvc2UiLCJleGVjdXRlIiwiYWRkIiwiZXhlY3V0ZUxhc3QiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCIsIk5hTiIsInRpY2tFbnRyaWVzIiwiY2FsbExhc3RFbnRyaWVzIiwib25UaWNrIiwibGVuZ3RoIiwibWFwIiwidGlja0VudHJ5IiwiY2FsbCIsInJlcXVlc3RBbmltYXRpb25GcmFtZUNhbGxiYWNrIiwid2luZG93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiVGlja01hbmFnZXIiLCJzdGFydCIsImNhbGxMYXN0IiwicHVzaCIsInN0b3AiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInNpbmdsZXRvbkluc3RhbmNlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVB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Q0FiRDs7QUFnQkE7QUFDQUssWUFBWWpCLFNBQVosQ0FBc0JrQixLQUF0QixHQUE4QixZQUFZO0FBQ3pDLEtBQUdILE1BQUgsRUFBVTtBQUNUO0FBQ0E7QUFDQVYsNEJBQTBCVSxPQUFPQyxxQkFBUCxDQUE2QkYsNkJBQTdCLENBQTFCO0FBQ0E7QUFDRCxDQU5EOztBQVNBRyxZQUFZakIsU0FBWixDQUFzQnFCLElBQXRCLEdBQTZCLFlBQVk7QUFDeEMsS0FBR04sTUFBSCxFQUFVO0FBQ1RBLFNBQU9PLG9CQUFQLENBQTRCakIsdUJBQTVCO0FBQ0E7QUFDRCxDQUpEOztBQU1BLElBQU1rQixvQkFBb0IsSUFBSU4sV0FBSixFQUExQjs7a0JBRWVNLGlCIiwiZmlsZSI6ImxpYi90aWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcInRpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJ0aWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1widGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDFmZmVmMTNmZmMyZjJiYWUyNjhjIiwiaW1wb3J0IFRpY2tlciBmcm9tICcuL1RpY2tFbnRyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IFRpY2tlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9pbmRleC5qcyIsImltcG9ydCBtYW5hZ2VyIGZyb20gJy4vTWFuYWdlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY2tFbnRyeVxue1xuXHQvKipcblx0ICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgLSBUaGUgXCJ0aGlzXCIgYXJndW1lbnQgZm9yIHRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihjb250ZXh0LCBsaXN0ZW5lciwgY2FsbGJhY2spXG5cdHtcblx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuXHRcdHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0XHR0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdH1cblxufVxuXG4vKi0tLS0gUHVibGljfFByb3RvdHlwZSBNZXRob2RzIC0tLSovXG5cblRpY2tFbnRyeS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCl7XG5cdHRoaXMuY29udGV4dCA9IG51bGw7XG5cdHRoaXMubGlzdGVuZXIgPSBudWxsO1xufTtcblxuVGlja0VudHJ5LnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oKXtcblx0bWFuYWdlci5hZGQodGhpcyxmYWxzZSk7XG59O1xuXG5UaWNrRW50cnkucHJvdG90eXBlLmV4ZWN1dGVMYXN0ID0gZnVuY3Rpb24oKXtcbiAgICBtYW5hZ2VyLmFkZCh0aGlzLHRydWUpO1xufTtcblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvVGlja0VudHJ5LmpzIiwiXG5sZXQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQgPSBOYU47XG5sZXQgdGlja0VudHJpZXMgPSBudWxsO1xubGV0IGNhbGxMYXN0RW50cmllcyA9IG51bGw7XG5cblxuZnVuY3Rpb24gb25UaWNrKCl7XG5cdGlmKHRpY2tFbnRyaWVzICYmIHRpY2tFbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGlja0VudHJpZXMubWFwKCAodGlja0VudHJ5ICk9PiB7XG5cdFx0XHR0aWNrRW50cnkubGlzdGVuZXIuY2FsbCh0aWNrRW50cnkuY29udGV4dCB8fCB0aWNrRW50cnkubGlzdGVuZXJbJ3RoaXMnXSk7XG5cdFx0XHRpZiAodGlja0VudHJ5LmNhbGxiYWNrKSB7XG5cdFx0XHRcdHRpY2tFbnRyeS5jYWxsYmFjay5jYWxsKHRpY2tFbnRyeS5jYWxsYmFja1sndGhpcyddKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vQ2xlYXIgdGhlbSBvbmNlIGV4ZWN1dGVkXG4gICAgICAgIHRpY2tFbnRyaWVzID0gbnVsbDtcblx0fVxuXG4gICAgaWYoY2FsbExhc3RFbnRyaWVzICYmIGNhbGxMYXN0RW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNhbGxMYXN0RW50cmllcy5tYXAoICh0aWNrRW50cnkgKT0+IHtcbiAgICAgICAgICAgIHRpY2tFbnRyeS5saXN0ZW5lci5jYWxsKHRpY2tFbnRyeS5jb250ZXh0IHx8IHRpY2tFbnRyeS5saXN0ZW5lclsndGhpcyddKTtcblx0ICAgICAgICBpZiAodGlja0VudHJ5LmNhbGxiYWNrKSB7XG5cdFx0ICAgICAgICB0aWNrRW50cnkuY2FsbGJhY2suY2FsbCh0aWNrRW50cnkuY2FsbGJhY2tbJ3RoaXMnXSk7XG5cdCAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvL0NsZWFyIHRoZW0gb25jZSBleGVjdXRlZFxuICAgICAgICBjYWxsTGFzdEVudHJpZXMgPSBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2soKXtcblx0b25UaWNrKCk7XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjayk7XG59XG5cbmNsYXNzIFRpY2tNYW5hZ2VyIHtcblx0Y29uc3RydWN0b3IoKXtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQgPSAwOyAvLyBmb3IgV2luZG93cyBFbnZcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuXHR9XG59XG5cblxuVGlja01hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0aWNrRW50cnksIGNhbGxMYXN0KSB7XG5cdGlmIChjYWxsTGFzdCkge1xuICAgICAgICBpZighY2FsbExhc3RFbnRyaWVzKXtcbiAgICAgICAgICAgIGNhbGxMYXN0RW50cmllcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGNhbGxMYXN0RW50cmllcy5wdXNoKHRpY2tFbnRyeSk7IC8vIHRvZG86IFN0YWNrIG9yIFF1ZXVlXG5cdH0gZWxzZSB7XG4gICAgICAgIGlmKCF0aWNrRW50cmllcyl7XG4gICAgICAgICAgICB0aWNrRW50cmllcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRpY2tFbnRyaWVzLnB1c2godGlja0VudHJ5KTsgLy8gdG9kbzogU3RhY2sgb3IgUXVldWVcblx0fVxuXG59O1xuXG5cbi8vIFRvZG86IFN1cHBvcnQgZm9yIE5vZGVKUyBcblRpY2tNYW5hZ2VyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0aWYod2luZG93KXtcblx0XHQvLyB3aWxsIHJlY2VpdmVzIHRpbWVzdGFtcCBhcyBhcmd1bWVudFxuXHRcdC8vdG9kbzogTGVhcm46ICB0aGUgcHVycG9zZSBvZiB0aW1lc3RhbXBcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2spO1xuXHR9XG59O1xuXG5cblRpY2tNYW5hZ2VyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuXHRpZih3aW5kb3cpe1xuXHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCk7XG5cdH1cbn07XG5cbmNvbnN0IHNpbmdsZXRvbkluc3RhbmNlID0gbmV3IFRpY2tNYW5hZ2VyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHNpbmdsZXRvbkluc3RhbmNlO1xuXG5cblxuXG5cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvTWFuYWdlci5qcyJdLCJzb3VyY2VSb290IjoiIn0=