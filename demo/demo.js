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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lib = __webpack_require__(0);

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function callLaterFunction() {
	console.log("I am called once per frame");
}

function callBackFunction() {
	console.log("I am callback called after");
}

function callLaterLastFunction() {
	console.log("I cam called once per frame last");
}

var ticker1 = new _lib2.default(window, callLaterFunction, callBackFunction);
var ticker2 = new _lib2.default(window, callLaterLastFunction, callBackFunction);

ticker2.executeLast();
ticker1.execute();

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxZmZlZjEzZmZjMmYyYmFlMjY4YyIsIndlYnBhY2s6Ly8vLi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1RpY2tFbnRyeS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9kZW1vL2luZGV4LmpzIl0sIm5hbWVzIjpbIlRpY2tFbnRyeSIsImNvbnRleHQiLCJsaXN0ZW5lciIsImNhbGxiYWNrIiwicHJvdG90eXBlIiwiZGlzcG9zZSIsImV4ZWN1dGUiLCJhZGQiLCJleGVjdXRlTGFzdCIsInJlcXVlc3RBbmltYXRpb25GcmFtZUlkIiwiTmFOIiwidGlja0VudHJpZXMiLCJjYWxsTGFzdEVudHJpZXMiLCJvblRpY2siLCJsZW5ndGgiLCJtYXAiLCJ0aWNrRW50cnkiLCJjYWxsIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2siLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJUaWNrTWFuYWdlciIsInN0YXJ0IiwiY2FsbExhc3QiLCJwdXNoIiwic3RvcCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwic2luZ2xldG9uSW5zdGFuY2UiLCJjYWxsTGF0ZXJGdW5jdGlvbiIsImNvbnNvbGUiLCJsb2ciLCJjYWxsQmFja0Z1bmN0aW9uIiwiY2FsbExhdGVyTGFzdEZ1bmN0aW9uIiwidGlja2VyMSIsInRpY2tlcjIiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7O0lBRXFCQSxTO0FBRXBCOzs7O0FBSUEsbUJBQVlDLE9BQVosRUFBcUJDLFFBQXJCLEVBQStCQyxRQUEvQixFQUNBO0FBQUE7O0FBQ0MsTUFBS0YsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsTUFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxNQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLEM7O0FBSUY7O2tCQWZxQkgsUztBQWlCckJBLFVBQVVJLFNBQVYsQ0FBb0JDLE9BQXBCLEdBQThCLFlBQVU7QUFDdkMsTUFBS0osT0FBTCxHQUFlLElBQWY7QUFDQSxNQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsQ0FIRDs7QUFLQUYsVUFBVUksU0FBVixDQUFvQkUsT0FBcEIsR0FBOEIsWUFBVTtBQUN2QyxtQkFBUUMsR0FBUixDQUFZLElBQVosRUFBaUIsS0FBakI7QUFDQSxDQUZEOztBQUlBUCxVQUFVSSxTQUFWLENBQW9CSSxXQUFwQixHQUFrQyxZQUFVO0FBQ3hDLG1CQUFRRCxHQUFSLENBQVksSUFBWixFQUFpQixJQUFqQjtBQUNILENBRkQsQzs7Ozs7Ozs7Ozs7Ozs7O0FDM0JBLElBQUlFLDBCQUEwQkMsR0FBOUI7QUFDQSxJQUFJQyxjQUFjLElBQWxCO0FBQ0EsSUFBSUMsa0JBQWtCLElBQXRCOztBQUdBLFNBQVNDLE1BQVQsR0FBaUI7QUFDaEIsS0FBR0YsZUFBZUEsWUFBWUcsTUFBWixHQUFxQixDQUF2QyxFQUEwQztBQUNuQ0gsY0FBWUksR0FBWixDQUFpQixVQUFDQyxTQUFELEVBQWU7QUFDckNBLGFBQVVkLFFBQVYsQ0FBbUJlLElBQW5CLENBQXdCRCxVQUFVZixPQUFWLElBQXFCZSxVQUFVZCxRQUFWLENBQW1CLE1BQW5CLENBQTdDO0FBQ0EsT0FBSWMsVUFBVWIsUUFBZCxFQUF3QjtBQUN2QmEsY0FBVWIsUUFBVixDQUFtQmMsSUFBbkIsQ0FBd0JELFVBQVViLFFBQVYsQ0FBbUIsTUFBbkIsQ0FBeEI7QUFDQTtBQUNELEdBTEs7O0FBT047QUFDTVEsZ0JBQWMsSUFBZDtBQUNOOztBQUVFLEtBQUdDLG1CQUFtQkEsZ0JBQWdCRSxNQUFoQixHQUF5QixDQUEvQyxFQUFrRDtBQUM5Q0Ysa0JBQWdCRyxHQUFoQixDQUFxQixVQUFDQyxTQUFELEVBQWU7QUFDaENBLGFBQVVkLFFBQVYsQ0FBbUJlLElBQW5CLENBQXdCRCxVQUFVZixPQUFWLElBQXFCZSxVQUFVZCxRQUFWLENBQW1CLE1BQW5CLENBQTdDO0FBQ0gsT0FBSWMsVUFBVWIsUUFBZCxFQUF3QjtBQUN2QmEsY0FBVWIsUUFBVixDQUFtQmMsSUFBbkIsQ0FBd0JELFVBQVViLFFBQVYsQ0FBbUIsTUFBbkIsQ0FBeEI7QUFDQTtBQUNELEdBTEQ7O0FBT0E7QUFDQVMsb0JBQWtCLElBQWxCO0FBQ0g7QUFDSjs7QUFFRCxTQUFTTSw2QkFBVCxHQUF3QztBQUN2Q0w7QUFDQUosMkJBQTBCVSxPQUFPQyxxQkFBUCxDQUE2QkYsNkJBQTdCLENBQTFCO0FBQ0E7O0lBRUtHLFcsR0FDTCx1QkFBYTtBQUFBOztBQUNOWiwyQkFBMEIsQ0FBMUIsQ0FETSxDQUN1QjtBQUM3QixNQUFLYSxLQUFMO0FBQ04sQzs7QUFJRkQsWUFBWWpCLFNBQVosQ0FBc0JHLEdBQXRCLEdBQTRCLFVBQVVTLFNBQVYsRUFBcUJPLFFBQXJCLEVBQStCO0FBQzFELEtBQUlBLFFBQUosRUFBYztBQUNQLE1BQUcsQ0FBQ1gsZUFBSixFQUFvQjtBQUNoQkEscUJBQWtCLEVBQWxCO0FBQ0g7QUFDREEsa0JBQWdCWSxJQUFoQixDQUFxQlIsU0FBckIsRUFKTyxDQUkwQjtBQUN2QyxFQUxELE1BS087QUFDQSxNQUFHLENBQUNMLFdBQUosRUFBZ0I7QUFDWkEsaUJBQWMsRUFBZDtBQUNIO0FBQ0RBLGNBQVlhLElBQVosQ0FBaUJSLFNBQWpCLEVBSkEsQ0FJNkI7QUFDbkM7QUFFRCxDQWJEOztBQWdCQTtBQUNBSyxZQUFZakIsU0FBWixDQUFzQmtCLEtBQXRCLEdBQThCLFlBQVk7QUFDekMsS0FBR0gsTUFBSCxFQUFVO0FBQ1Q7QUFDQTtBQUNBViw0QkFBMEJVLE9BQU9DLHFCQUFQLENBQTZCRiw2QkFBN0IsQ0FBMUI7QUFDQTtBQUNELENBTkQ7O0FBU0FHLFlBQVlqQixTQUFaLENBQXNCcUIsSUFBdEIsR0FBNkIsWUFBWTtBQUN4QyxLQUFHTixNQUFILEVBQVU7QUFDVEEsU0FBT08sb0JBQVAsQ0FBNEJqQix1QkFBNUI7QUFDQTtBQUNELENBSkQ7O0FBTUEsSUFBTWtCLG9CQUFvQixJQUFJTixXQUFKLEVBQTFCOztrQkFFZU0saUI7Ozs7Ozs7OztBQy9FZjs7Ozs7O0FBRUEsU0FBU0MsaUJBQVQsR0FBNkI7QUFDekJDLFNBQVFDLEdBQVIsQ0FBWSw0QkFBWjtBQUNIOztBQUVELFNBQVNDLGdCQUFULEdBQTRCO0FBQzNCRixTQUFRQyxHQUFSLENBQVksNEJBQVo7QUFDQTs7QUFFRCxTQUFTRSxxQkFBVCxHQUFpQztBQUNoQ0gsU0FBUUMsR0FBUixDQUFZLGtDQUFaO0FBQ0E7O0FBRUQsSUFBSUcsVUFBVSxrQkFBV2QsTUFBWCxFQUFtQlMsaUJBQW5CLEVBQXNDRyxnQkFBdEMsQ0FBZDtBQUNBLElBQUlHLFVBQVUsa0JBQVdmLE1BQVgsRUFBbUJhLHFCQUFuQixFQUEwQ0QsZ0JBQTFDLENBQWQ7O0FBRUFHLFFBQVExQixXQUFSO0FBQ0F5QixRQUFRM0IsT0FBUixHIiwiZmlsZSI6ImRlbW8vZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwidGlja2VyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInRpY2tlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJ0aWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWZmZWYxM2ZmYzJmMmJhZTI2OGMiLCJpbXBvcnQgVGlja2VyIGZyb20gJy4vVGlja0VudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQgVGlja2VyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2luZGV4LmpzIiwiaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9NYW5hZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja0VudHJ5XG57XG5cdC8qKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCAtIFRoZSBcInRoaXNcIiBhcmd1bWVudCBmb3IgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lci5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGNvbnRleHQsIGxpc3RlbmVyLCBjYWxsYmFjaylcblx0e1xuXHRcdHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cdFx0dGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuXHRcdHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcblx0fVxuXG59XG5cbi8qLS0tLSBQdWJsaWN8UHJvdG90eXBlIE1ldGhvZHMgLS0tKi9cblxuVGlja0VudHJ5LnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKXtcblx0dGhpcy5jb250ZXh0ID0gbnVsbDtcblx0dGhpcy5saXN0ZW5lciA9IG51bGw7XG59O1xuXG5UaWNrRW50cnkucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbigpe1xuXHRtYW5hZ2VyLmFkZCh0aGlzLGZhbHNlKTtcbn07XG5cblRpY2tFbnRyeS5wcm90b3R5cGUuZXhlY3V0ZUxhc3QgPSBmdW5jdGlvbigpe1xuICAgIG1hbmFnZXIuYWRkKHRoaXMsdHJ1ZSk7XG59O1xuXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9UaWNrRW50cnkuanMiLCJcbmxldCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IE5hTjtcbmxldCB0aWNrRW50cmllcyA9IG51bGw7XG5sZXQgY2FsbExhc3RFbnRyaWVzID0gbnVsbDtcblxuXG5mdW5jdGlvbiBvblRpY2soKXtcblx0aWYodGlja0VudHJpZXMgJiYgdGlja0VudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0aWNrRW50cmllcy5tYXAoICh0aWNrRW50cnkgKT0+IHtcblx0XHRcdHRpY2tFbnRyeS5saXN0ZW5lci5jYWxsKHRpY2tFbnRyeS5jb250ZXh0IHx8IHRpY2tFbnRyeS5saXN0ZW5lclsndGhpcyddKTtcblx0XHRcdGlmICh0aWNrRW50cnkuY2FsbGJhY2spIHtcblx0XHRcdFx0dGlja0VudHJ5LmNhbGxiYWNrLmNhbGwodGlja0VudHJ5LmNhbGxiYWNrWyd0aGlzJ10pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly9DbGVhciB0aGVtIG9uY2UgZXhlY3V0ZWRcbiAgICAgICAgdGlja0VudHJpZXMgPSBudWxsO1xuXHR9XG5cbiAgICBpZihjYWxsTGFzdEVudHJpZXMgJiYgY2FsbExhc3RFbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2FsbExhc3RFbnRyaWVzLm1hcCggKHRpY2tFbnRyeSApPT4ge1xuICAgICAgICAgICAgdGlja0VudHJ5Lmxpc3RlbmVyLmNhbGwodGlja0VudHJ5LmNvbnRleHQgfHwgdGlja0VudHJ5Lmxpc3RlbmVyWyd0aGlzJ10pO1xuXHQgICAgICAgIGlmICh0aWNrRW50cnkuY2FsbGJhY2spIHtcblx0XHQgICAgICAgIHRpY2tFbnRyeS5jYWxsYmFjay5jYWxsKHRpY2tFbnRyeS5jYWxsYmFja1sndGhpcyddKTtcblx0ICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vQ2xlYXIgdGhlbSBvbmNlIGV4ZWN1dGVkXG4gICAgICAgIGNhbGxMYXN0RW50cmllcyA9IG51bGw7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjaygpe1xuXHRvblRpY2soKTtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RBbmltYXRpb25GcmFtZUNhbGxiYWNrKTtcbn1cblxuY2xhc3MgVGlja01hbmFnZXIge1xuXHRjb25zdHJ1Y3Rvcigpe1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IDA7IC8vIGZvciBXaW5kb3dzIEVudlxuICAgICAgICB0aGlzLnN0YXJ0KCk7XG5cdH1cbn1cblxuXG5UaWNrTWFuYWdlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHRpY2tFbnRyeSwgY2FsbExhc3QpIHtcblx0aWYgKGNhbGxMYXN0KSB7XG4gICAgICAgIGlmKCFjYWxsTGFzdEVudHJpZXMpe1xuICAgICAgICAgICAgY2FsbExhc3RFbnRyaWVzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgY2FsbExhc3RFbnRyaWVzLnB1c2godGlja0VudHJ5KTsgLy8gdG9kbzogU3RhY2sgb3IgUXVldWVcblx0fSBlbHNlIHtcbiAgICAgICAgaWYoIXRpY2tFbnRyaWVzKXtcbiAgICAgICAgICAgIHRpY2tFbnRyaWVzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGlja0VudHJpZXMucHVzaCh0aWNrRW50cnkpOyAvLyB0b2RvOiBTdGFjayBvciBRdWV1ZVxuXHR9XG5cbn07XG5cblxuLy8gVG9kbzogU3VwcG9ydCBmb3IgTm9kZUpTIFxuVGlja01hbmFnZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRpZih3aW5kb3cpe1xuXHRcdC8vIHdpbGwgcmVjZWl2ZXMgdGltZXN0YW1wIGFzIGFyZ3VtZW50XG5cdFx0Ly90b2RvOiBMZWFybjogIHRoZSBwdXJwb3NlIG9mIHRpbWVzdGFtcFxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjayk7XG5cdH1cbn07XG5cblxuVGlja01hbmFnZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cdGlmKHdpbmRvdyl7XG5cdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RBbmltYXRpb25GcmFtZUlkKTtcblx0fVxufTtcblxuY29uc3Qgc2luZ2xldG9uSW5zdGFuY2UgPSBuZXcgVGlja01hbmFnZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgc2luZ2xldG9uSW5zdGFuY2U7XG5cblxuXG5cblxuXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9NYW5hZ2VyLmpzIiwiaW1wb3J0IFRpY2tlciBmcm9tIFwiLi8uLi9saWJcIjtcblxuZnVuY3Rpb24gY2FsbExhdGVyRnVuY3Rpb24gKCl7XG4gICAgY29uc29sZS5sb2coXCJJIGFtIGNhbGxlZCBvbmNlIHBlciBmcmFtZVwiKTtcbn1cblxuZnVuY3Rpb24gY2FsbEJhY2tGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJJIGFtIGNhbGxiYWNrIGNhbGxlZCBhZnRlclwiKTtcbn1cblxuZnVuY3Rpb24gY2FsbExhdGVyTGFzdEZ1bmN0aW9uICgpe1xuXHRjb25zb2xlLmxvZyhcIkkgY2FtIGNhbGxlZCBvbmNlIHBlciBmcmFtZSBsYXN0XCIpO1xufVxuXG52YXIgdGlja2VyMSA9IG5ldyBUaWNrZXIod2luZG93LCBjYWxsTGF0ZXJGdW5jdGlvbiwgY2FsbEJhY2tGdW5jdGlvbik7XG52YXIgdGlja2VyMiA9IG5ldyBUaWNrZXIod2luZG93LCBjYWxsTGF0ZXJMYXN0RnVuY3Rpb24sIGNhbGxCYWNrRnVuY3Rpb24pO1xuXG50aWNrZXIyLmV4ZWN1dGVMYXN0KCk7XG50aWNrZXIxLmV4ZWN1dGUoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kZW1vL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==