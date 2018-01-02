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
	}
}

function isAddedAlready(entry, tickEntries) {
	// important to use for-loop
	// tickEntries grows dynamically by one of its entry
	// for example: let say we have one entry, and executing that entry might adds another entry
	// with map function we cant execute dynamically growing entries.
	for (var i = 0; i < tickEntries.length; i++) {
		var tickEntry = tickEntries[i];
		if (entry.context === tickEntry.context && entry.listener === tickEntry.listener) {
			return true;
		}
	}
	return false;
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
	var priority = tickEntry.priority,
	    callback = tickEntry.callback;

	if (!priorityEntries[priority]) {
		priorityEntries[priority] = [];
		var _tickEntries = priorityEntries[priority];
		_tickEntries.push(tickEntry);
		return;
	}
	var tickEntries = priorityEntries[priority];
	if (isAddedAlready(tickEntry, tickEntries)) {
		callback && callback(true);
	} else {
		tickEntries.push(tickEntry);
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
	var ticker5 = new _lib2.default(window, fifthFunction, null, 3);
	ticker5.execute();
}

function fifthFunction() {
	console.log("Fifth Function");
	var ticker6 = new _lib2.default(window, sixthFunction, null, 1);
	ticker6.execute();
}
function sixthFunction() {
	console.log("Six Function");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwZWM5MDlmZDFjZmUzMTlmZjU1NSIsIndlYnBhY2s6Ly8vLi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1RpY2tFbnRyeS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9kZW1vL2luZGV4LmpzIl0sIm5hbWVzIjpbIlRpY2tFbnRyeSIsImNvbnRleHQiLCJsaXN0ZW5lciIsImNhbGxiYWNrIiwicHJpb3JpdHkiLCJwcm90b3R5cGUiLCJkaXNwb3NlIiwiZXhlY3V0ZSIsImFkZCIsImdldE1heFByaW9yaXR5IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQiLCJOYU4iLCJwcmlvcml0eUVudHJpZXMiLCJvblRpY2siLCJpbmRleCIsImxlbmd0aCIsInRpY2tFbnRyaWVzIiwiZXhlY3V0ZVRpY2tFbnRyaWVzIiwiaSIsInRpY2tFbnRyeSIsImNhbGwiLCJpc0FkZGVkQWxyZWFkeSIsImVudHJ5IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2siLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJUaWNrTWFuYWdlciIsInN0YXJ0IiwicHVzaCIsInN0b3AiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInNpbmdsZXRvbkluc3RhbmNlIiwiZmlyc3RGdW5jdGlvbiIsImNvbnNvbGUiLCJsb2ciLCJzZWNvbmRGdW5jdGlvbiIsInRoaXJkRnVuY3Rpb24iLCJmb3VydGhGdW5jdGlvbiIsInRpY2tlcjUiLCJmaWZ0aEZ1bmN0aW9uIiwidGlja2VyNiIsInNpeHRoRnVuY3Rpb24iLCJjYWxsQmFja0Z1bmN0aW9uIiwidGlja2VyMSIsInRpY2tlcjIiLCJ0aWNrZXIzIiwidGlja2VyNCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUM3REE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7QUFFQTtJQUNxQkEsUztBQUVwQjs7OztBQUlBLG1CQUFZQyxPQUFaLEVBQXFCQyxRQUFyQixFQUNBO0FBQUEsS0FEK0JDLFFBQy9CLHVFQUQwQyxJQUMxQztBQUFBLEtBRGdEQyxRQUNoRCx1RUFEMkQsQ0FDM0Q7O0FBQUE7O0FBQ0MsTUFBS0gsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsTUFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxNQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLE1BQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsQzs7QUFJRjs7a0JBaEJxQkosUztBQWtCckJBLFVBQVVLLFNBQVYsQ0FBb0JDLE9BQXBCLEdBQThCLFlBQVU7QUFDdkMsTUFBS0wsT0FBTCxHQUFlLElBQWY7QUFDQSxNQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsTUFBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLE1BQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxDQUxEOztBQU9BSixVQUFVSyxTQUFWLENBQW9CRSxPQUFwQixHQUE4QixZQUFVO0FBQ3ZDLG1CQUFRQyxHQUFSLENBQVksSUFBWjtBQUNBLENBRkQ7O0FBSUFSLFVBQVVLLFNBQVYsQ0FBb0JJLGNBQXBCLEdBQXFDLFlBQVU7QUFDOUMsUUFBTyxrQkFBUUEsY0FBUixFQUFQO0FBQ0EsQ0FGRCxDOzs7Ozs7Ozs7Ozs7Ozs7QUMvQkEsSUFBSUMsMEJBQTBCQyxHQUE5QjtBQUNBLElBQU1DLGtCQUFrQixDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUF4Qjs7QUFFQSxTQUFTQyxNQUFULEdBQWlCO0FBQ2hCLE1BQUksSUFBSUMsUUFBUSxDQUFoQixFQUFvQkEsUUFBUUYsZ0JBQWdCRyxNQUE1QyxFQUFvREQsT0FBcEQsRUFBNEQ7QUFDM0QsTUFBSUUsY0FBY0osZ0JBQWdCRSxLQUFoQixDQUFsQjtBQUNBLE1BQUdFLGVBQWVBLFlBQVlELE1BQVosR0FBcUIsQ0FBdkMsRUFBMEM7QUFDekNFLHNCQUFtQkQsV0FBbkI7QUFDQTtBQUNBSixtQkFBZ0JFLEtBQWhCLElBQXlCLElBQXpCO0FBQ0E7QUFDRDtBQUNEOztBQUVELFNBQVNHLGtCQUFULENBQTRCRCxXQUE1QixFQUF3QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUksSUFBSUUsSUFBSSxDQUFaLEVBQWVBLElBQUlGLFlBQVlELE1BQS9CLEVBQXVDRyxHQUF2QyxFQUEyQztBQUMxQyxNQUFNQyxZQUFZSCxZQUFZRSxDQUFaLENBQWxCO0FBQ0FDLFlBQVVqQixRQUFWLENBQW1Ca0IsSUFBbkIsQ0FBd0JELFVBQVVsQixPQUFWLElBQXFCa0IsVUFBVWpCLFFBQVYsQ0FBbUIsTUFBbkIsQ0FBN0M7QUFDQSxNQUFJaUIsVUFBVWhCLFFBQWQsRUFBd0I7QUFDdkJnQixhQUFVaEIsUUFBVixDQUFtQmlCLElBQW5CLENBQXdCRCxVQUFVaEIsUUFBVixDQUFtQixNQUFuQixDQUF4QjtBQUNBO0FBQ0Q7QUFDRDs7QUFFRCxTQUFTa0IsY0FBVCxDQUF3QkMsS0FBeEIsRUFBOEJOLFdBQTlCLEVBQTBDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSSxJQUFJRSxJQUFJLENBQVosRUFBZUEsSUFBSUYsWUFBWUQsTUFBL0IsRUFBdUNHLEdBQXZDLEVBQTJDO0FBQzFDLE1BQU1DLFlBQVlILFlBQVlFLENBQVosQ0FBbEI7QUFDQSxNQUFHSSxNQUFNckIsT0FBTixLQUFrQmtCLFVBQVVsQixPQUE1QixJQUF1Q3FCLE1BQU1wQixRQUFOLEtBQW1CaUIsVUFBVWpCLFFBQXZFLEVBQWdGO0FBQy9FLFVBQU8sSUFBUDtBQUNBO0FBQ0Q7QUFDRCxRQUFPLEtBQVA7QUFDQTs7QUFFRCxTQUFTcUIsNkJBQVQsR0FBd0M7QUFDdkNWO0FBQ0FILDJCQUEwQmMsT0FBT0MscUJBQVAsQ0FBNkJGLDZCQUE3QixDQUExQjtBQUNBOztJQUVLRyxXLEdBQ0wsdUJBQWE7QUFBQTs7QUFDTmhCLDJCQUEwQixDQUExQixDQURNLENBQ3VCO0FBQzdCLE1BQUtpQixLQUFMO0FBQ04sQzs7QUFJRkQsWUFBWXJCLFNBQVosQ0FBc0JHLEdBQXRCLEdBQTRCLFVBQVVXLFNBQVYsRUFBcUI7QUFBQSxLQUN4Q2YsUUFEd0MsR0FDakJlLFNBRGlCLENBQ3hDZixRQUR3QztBQUFBLEtBQzlCRCxRQUQ4QixHQUNqQmdCLFNBRGlCLENBQzlCaEIsUUFEOEI7O0FBRWhELEtBQUcsQ0FBQ1MsZ0JBQWdCUixRQUFoQixDQUFKLEVBQThCO0FBQzdCUSxrQkFBZ0JSLFFBQWhCLElBQTRCLEVBQTVCO0FBQ0EsTUFBTVksZUFBY0osZ0JBQWdCUixRQUFoQixDQUFwQjtBQUNBWSxlQUFZWSxJQUFaLENBQWlCVCxTQUFqQjtBQUNBO0FBQ0E7QUFDRCxLQUFNSCxjQUFjSixnQkFBZ0JSLFFBQWhCLENBQXBCO0FBQ0EsS0FBR2lCLGVBQWVGLFNBQWYsRUFBeUJILFdBQXpCLENBQUgsRUFBeUM7QUFDeENiLGNBQVlBLFNBQVMsSUFBVCxDQUFaO0FBQ0EsRUFGRCxNQUVPO0FBQ05hLGNBQVlZLElBQVosQ0FBaUJULFNBQWpCO0FBQ0E7QUFDRCxDQWREOztBQWlCQTtBQUNBTyxZQUFZckIsU0FBWixDQUFzQnNCLEtBQXRCLEdBQThCLFlBQVk7QUFDekMsS0FBR0gsTUFBSCxFQUFVO0FBQ1Q7QUFDQTtBQUNBZCw0QkFBMEJjLE9BQU9DLHFCQUFQLENBQTZCRiw2QkFBN0IsQ0FBMUI7QUFDQTtBQUNELENBTkQ7O0FBU0FHLFlBQVlyQixTQUFaLENBQXNCd0IsSUFBdEIsR0FBNkIsWUFBWTtBQUN4QyxLQUFHTCxNQUFILEVBQVU7QUFDVEEsU0FBT00sb0JBQVAsQ0FBNEJwQix1QkFBNUI7QUFDQTtBQUNELENBSkQ7O0FBTUFnQixZQUFZckIsU0FBWixDQUFzQkksY0FBdEIsR0FBdUMsWUFBWTtBQUNsRCxRQUFPRyxnQkFBZ0JHLE1BQWhCLEdBQXlCLENBQWhDO0FBQ0EsQ0FGRDs7QUFJQSxJQUFNZ0Isb0JBQW9CLElBQUlMLFdBQUosRUFBMUI7O2tCQUVlSyxpQjs7Ozs7Ozs7O0FDL0ZmOzs7Ozs7QUFFQSxTQUFTQyxhQUFULEdBQXlCO0FBQ3JCQyxTQUFRQyxHQUFSLENBQVksZ0JBQVo7QUFDSDs7QUFFRCxTQUFTQyxjQUFULEdBQTBCO0FBQ3pCRixTQUFRQyxHQUFSLENBQVksaUJBQVo7QUFDQTs7QUFFRCxTQUFTRSxhQUFULEdBQXlCO0FBQ3hCSCxTQUFRQyxHQUFSLENBQVksZ0JBQVo7QUFDQTs7QUFHRCxTQUFTRyxjQUFULEdBQTBCO0FBQ3pCSixTQUFRQyxHQUFSLENBQVksaUJBQVo7QUFDQSxLQUFJSSxVQUFVLGtCQUFXZCxNQUFYLEVBQW1CZSxhQUFuQixFQUFrQyxJQUFsQyxFQUF3QyxDQUF4QyxDQUFkO0FBQ0FELFNBQVEvQixPQUFSO0FBQ0E7O0FBRUQsU0FBU2dDLGFBQVQsR0FBeUI7QUFDeEJOLFNBQVFDLEdBQVIsQ0FBWSxnQkFBWjtBQUNBLEtBQUlNLFVBQVUsa0JBQVdoQixNQUFYLEVBQW1CaUIsYUFBbkIsRUFBa0MsSUFBbEMsRUFBd0MsQ0FBeEMsQ0FBZDtBQUNBRCxTQUFRakMsT0FBUjtBQUVBO0FBQ0QsU0FBU2tDLGFBQVQsR0FBeUI7QUFDeEJSLFNBQVFDLEdBQVIsQ0FBWSxjQUFaO0FBQ0E7O0FBRUQsU0FBU1EsZ0JBQVQsR0FBNEI7QUFDM0JULFNBQVFDLEdBQVIsQ0FBWSw2Q0FBWjtBQUNBOztBQUVELElBQUlTLFVBQVUsa0JBQVduQixNQUFYLEVBQW1CUSxhQUFuQixFQUFrQ1UsZ0JBQWxDLENBQWQ7QUFDQSxJQUFJRSxVQUFVLGtCQUFXcEIsTUFBWCxFQUFtQlcsY0FBbkIsRUFBbUNPLGdCQUFuQyxFQUFzRCxDQUF0RCxDQUFkO0FBQ0EsSUFBSUcsVUFBVSxrQkFBV3JCLE1BQVgsRUFBbUJZLGFBQW5CLEVBQWtDTSxnQkFBbEMsRUFBcUQsQ0FBckQsQ0FBZDtBQUNBLElBQUlJLFVBQVUsa0JBQVd0QixNQUFYLEVBQW1CYSxjQUFuQixFQUFtQ0ssZ0JBQW5DLEVBQXNELENBQXRELENBQWQ7O0FBRUFJLFFBQVF2QyxPQUFSO0FBQ0FzQyxRQUFRdEMsT0FBUjtBQUNBcUMsUUFBUXJDLE9BQVI7QUFDQW9DLFFBQVFwQyxPQUFSLEciLCJmaWxlIjoiZGVtby9kZW1vLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJ0aWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1widGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInRpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwZWM5MDlmZDFjZmUzMTlmZjU1NSIsImltcG9ydCBUaWNrZXIgZnJvbSAnLi9UaWNrRW50cnknO1xuXG5leHBvcnQgZGVmYXVsdCBUaWNrZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvaW5kZXguanMiLCJpbXBvcnQgbWFuYWdlciBmcm9tICcuL01hbmFnZXInO1xuXG4vLyB0b0RvOiBzdXBwb3J0IGJvdGggY2FsbGJhY2sgYW5kIHByb21pc2VcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY2tFbnRyeVxue1xuXHQvKipcblx0ICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgLSBUaGUgXCJ0aGlzXCIgYXJndW1lbnQgZm9yIHRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihjb250ZXh0LCBsaXN0ZW5lciwgY2FsbGJhY2sgPSBudWxsLCBwcmlvcml0eSA9IDApXG5cdHtcblx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuXHRcdHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0XHR0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0dGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuXHR9XG5cbn1cblxuLyotLS0tIFB1YmxpY3xQcm90b3R5cGUgTWV0aG9kcyAtLS0qL1xuXG5UaWNrRW50cnkucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpe1xuXHR0aGlzLmNvbnRleHQgPSBudWxsO1xuXHR0aGlzLmxpc3RlbmVyID0gbnVsbDtcblx0dGhpcy5jYWxsYmFjayA9IG51bGw7XG5cdHRoaXMucHJpb3JpdHkgPSBudWxsO1xufTtcblxuVGlja0VudHJ5LnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oKXtcblx0bWFuYWdlci5hZGQodGhpcyk7XG59O1xuXG5UaWNrRW50cnkucHJvdG90eXBlLmdldE1heFByaW9yaXR5ID0gZnVuY3Rpb24oKXtcblx0cmV0dXJuIG1hbmFnZXIuZ2V0TWF4UHJpb3JpdHkoKTtcbn07XG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL1RpY2tFbnRyeS5qcyIsIlxubGV0IHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gTmFOO1xuY29uc3QgcHJpb3JpdHlFbnRyaWVzID0gW251bGwsIG51bGwsIG51bGwsIG51bGxdO1xuXG5mdW5jdGlvbiBvblRpY2soKXtcblx0Zm9yKGxldCBpbmRleCA9IDAgOyBpbmRleCA8IHByaW9yaXR5RW50cmllcy5sZW5ndGg7IGluZGV4Kyspe1xuXHRcdGxldCB0aWNrRW50cmllcyA9IHByaW9yaXR5RW50cmllc1tpbmRleF07XG5cdFx0aWYodGlja0VudHJpZXMgJiYgdGlja0VudHJpZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0ZXhlY3V0ZVRpY2tFbnRyaWVzKHRpY2tFbnRyaWVzKTtcblx0XHRcdC8vQ2xlYXIgdGhlbSBvbmNlIGV4ZWN1dGVkXG5cdFx0XHRwcmlvcml0eUVudHJpZXNbaW5kZXhdID0gbnVsbDtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZXhlY3V0ZVRpY2tFbnRyaWVzKHRpY2tFbnRyaWVzKXtcblx0Ly8gaW1wb3J0YW50IHRvIHVzZSBmb3ItbG9vcFxuXHQvLyB0aWNrRW50cmllcyBncm93cyBkeW5hbWljYWxseSBieSBvbmUgb2YgaXRzIGVudHJ5XG5cdC8vIGZvciBleGFtcGxlOiBsZXQgc2F5IHdlIGhhdmUgb25lIGVudHJ5LCBhbmQgZXhlY3V0aW5nIHRoYXQgZW50cnkgbWlnaHQgYWRkcyBhbm90aGVyIGVudHJ5XG5cdC8vIHdpdGggbWFwIGZ1bmN0aW9uIHdlIGNhbnQgZXhlY3V0ZSBkeW5hbWljYWxseSBncm93aW5nIGVudHJpZXMuXG5cdGZvcihsZXQgaSA9IDA7IGkgPCB0aWNrRW50cmllcy5sZW5ndGg7IGkrKyl7XG5cdFx0Y29uc3QgdGlja0VudHJ5ID0gdGlja0VudHJpZXNbaV07XG5cdFx0dGlja0VudHJ5Lmxpc3RlbmVyLmNhbGwodGlja0VudHJ5LmNvbnRleHQgfHwgdGlja0VudHJ5Lmxpc3RlbmVyWyd0aGlzJ10pO1xuXHRcdGlmICh0aWNrRW50cnkuY2FsbGJhY2spIHtcblx0XHRcdHRpY2tFbnRyeS5jYWxsYmFjay5jYWxsKHRpY2tFbnRyeS5jYWxsYmFja1sndGhpcyddKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaXNBZGRlZEFscmVhZHkoZW50cnksdGlja0VudHJpZXMpe1xuXHQvLyBpbXBvcnRhbnQgdG8gdXNlIGZvci1sb29wXG5cdC8vIHRpY2tFbnRyaWVzIGdyb3dzIGR5bmFtaWNhbGx5IGJ5IG9uZSBvZiBpdHMgZW50cnlcblx0Ly8gZm9yIGV4YW1wbGU6IGxldCBzYXkgd2UgaGF2ZSBvbmUgZW50cnksIGFuZCBleGVjdXRpbmcgdGhhdCBlbnRyeSBtaWdodCBhZGRzIGFub3RoZXIgZW50cnlcblx0Ly8gd2l0aCBtYXAgZnVuY3Rpb24gd2UgY2FudCBleGVjdXRlIGR5bmFtaWNhbGx5IGdyb3dpbmcgZW50cmllcy5cblx0Zm9yKGxldCBpID0gMDsgaSA8IHRpY2tFbnRyaWVzLmxlbmd0aDsgaSsrKXtcblx0XHRjb25zdCB0aWNrRW50cnkgPSB0aWNrRW50cmllc1tpXTtcblx0XHRpZihlbnRyeS5jb250ZXh0ID09PSB0aWNrRW50cnkuY29udGV4dCAmJiBlbnRyeS5saXN0ZW5lciA9PT0gdGlja0VudHJ5Lmxpc3RlbmVyKXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZUNhbGxiYWNrKCl7XG5cdG9uVGljaygpO1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVxdWVzdEFuaW1hdGlvbkZyYW1lQ2FsbGJhY2spO1xufVxuXG5jbGFzcyBUaWNrTWFuYWdlciB7XG5cdGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gMDsgLy8gZm9yIFdpbmRvd3MgRW52XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcblx0fVxufVxuXG5cblRpY2tNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodGlja0VudHJ5KSB7XG5cdGNvbnN0IHsgcHJpb3JpdHksIGNhbGxiYWNrIH0gPSB0aWNrRW50cnk7XG5cdGlmKCFwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldKXtcblx0XHRwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldID0gW107XG5cdFx0Y29uc3QgdGlja0VudHJpZXMgPSBwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldO1xuXHRcdHRpY2tFbnRyaWVzLnB1c2godGlja0VudHJ5KTtcblx0XHRyZXR1cm47XG5cdH1cblx0Y29uc3QgdGlja0VudHJpZXMgPSBwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldO1xuXHRpZihpc0FkZGVkQWxyZWFkeSh0aWNrRW50cnksdGlja0VudHJpZXMpKXtcblx0XHRjYWxsYmFjayAmJiBjYWxsYmFjayh0cnVlKTtcblx0fSBlbHNlIHtcblx0XHR0aWNrRW50cmllcy5wdXNoKHRpY2tFbnRyeSk7XG5cdH1cbn07XG5cblxuLy8gVG9kbzogU3VwcG9ydCBmb3IgTm9kZUpTIFxuVGlja01hbmFnZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRpZih3aW5kb3cpe1xuXHRcdC8vIHdpbGwgcmVjZWl2ZXMgdGltZXN0YW1wIGFzIGFyZ3VtZW50XG5cdFx0Ly90b2RvOiBMZWFybjogIHRoZSBwdXJwb3NlIG9mIHRpbWVzdGFtcFxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjayk7XG5cdH1cbn07XG5cblxuVGlja01hbmFnZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cdGlmKHdpbmRvdyl7XG5cdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RBbmltYXRpb25GcmFtZUlkKTtcblx0fVxufTtcblxuVGlja01hbmFnZXIucHJvdG90eXBlLmdldE1heFByaW9yaXR5ID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gcHJpb3JpdHlFbnRyaWVzLmxlbmd0aCAtIDE7XG59O1xuXG5jb25zdCBzaW5nbGV0b25JbnN0YW5jZSA9IG5ldyBUaWNrTWFuYWdlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBzaW5nbGV0b25JbnN0YW5jZTtcblxuXG5cblxuXG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL01hbmFnZXIuanMiLCJpbXBvcnQgVGlja2VyIGZyb20gXCIuLy4uL2xpYlwiO1xuXG5mdW5jdGlvbiBmaXJzdEZ1bmN0aW9uICgpe1xuICAgIGNvbnNvbGUubG9nKFwiZmlyc3QgRnVuY3Rpb25cIik7XG59XG5cbmZ1bmN0aW9uIHNlY29uZEZ1bmN0aW9uICgpe1xuXHRjb25zb2xlLmxvZyhcIlNlY29uZCBGdW5jdGlvblwiKTtcbn1cblxuZnVuY3Rpb24gdGhpcmRGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJUaGlyZCBGdW5jdGlvblwiKTtcbn1cblxuXG5mdW5jdGlvbiBmb3VydGhGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJGb3VydGggRnVuY3Rpb25cIik7XG5cdHZhciB0aWNrZXI1ID0gbmV3IFRpY2tlcih3aW5kb3csIGZpZnRoRnVuY3Rpb24sIG51bGwsIDMpO1xuXHR0aWNrZXI1LmV4ZWN1dGUoKTtcbn1cblxuZnVuY3Rpb24gZmlmdGhGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJGaWZ0aCBGdW5jdGlvblwiKTtcblx0dmFyIHRpY2tlcjYgPSBuZXcgVGlja2VyKHdpbmRvdywgc2l4dGhGdW5jdGlvbiwgbnVsbCwgMSk7XG5cdHRpY2tlcjYuZXhlY3V0ZSgpO1xuXG59XG5mdW5jdGlvbiBzaXh0aEZ1bmN0aW9uICgpe1xuXHRjb25zb2xlLmxvZyhcIlNpeCBGdW5jdGlvblwiKTtcbn1cblxuZnVuY3Rpb24gY2FsbEJhY2tGdW5jdGlvbiAoKXtcblx0Y29uc29sZS5sb2coXCJJIGFtIGNhbGxlZCBvbmNlIHBlciBmcmFtZSBsYXN0IGFzIGNhbGxiYWNrXCIpO1xufVxuXG52YXIgdGlja2VyMSA9IG5ldyBUaWNrZXIod2luZG93LCBmaXJzdEZ1bmN0aW9uLCBjYWxsQmFja0Z1bmN0aW9uKTtcbnZhciB0aWNrZXIyID0gbmV3IFRpY2tlcih3aW5kb3csIHNlY29uZEZ1bmN0aW9uLCBjYWxsQmFja0Z1bmN0aW9uICwgMSk7XG52YXIgdGlja2VyMyA9IG5ldyBUaWNrZXIod2luZG93LCB0aGlyZEZ1bmN0aW9uLCBjYWxsQmFja0Z1bmN0aW9uICwgMik7XG52YXIgdGlja2VyNCA9IG5ldyBUaWNrZXIod2luZG93LCBmb3VydGhGdW5jdGlvbiwgY2FsbEJhY2tGdW5jdGlvbiAsIDMpO1xuXG50aWNrZXI0LmV4ZWN1dGUoKTtcbnRpY2tlcjMuZXhlY3V0ZSgpO1xudGlja2VyMi5leGVjdXRlKCk7XG50aWNrZXIxLmV4ZWN1dGUoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kZW1vL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==