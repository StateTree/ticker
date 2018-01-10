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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmNzVlMjQ3ZGI3YzBkZGM5Nzk5ZCIsIndlYnBhY2s6Ly8vLi9saWIvVGlja0VudHJ5LmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJUaWNrRW50cnkiLCJjb250ZXh0IiwibGlzdGVuZXIiLCJjYWxsYmFjayIsInByaW9yaXR5IiwiZXhlY3V0aW9uQ291bnQiLCJwcm90b3R5cGUiLCJkaXNwb3NlIiwiTmFOIiwiZXhlY3V0ZSIsImFkZCIsIkhJR0giLCJOT1JNQUwiLCJMT1ciLCJhbGxvd2VkVGlja0NvdW50IiwiZGVidWciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCIsInByaW9yaXR5RW50cmllcyIsIndhaXRFbnRyaWVzIiwidGlja0NvdW50IiwiaXNFeGVjdXRpbmciLCJvblRpY2siLCJjb25zb2xlIiwibG9nIiwiZXhlY3V0ZVByaW9yaXR5RW50cmllcyIsIm1vdmVXYWl0aW5nRW50cmllc0ZvckV4ZWN1dGlvbiIsImFyZVByaW9yaXR5RW50cmllc0VtcHR5Iiwic3RvcCIsIndhcm4iLCJyZXNldCIsInRpY2tNYW5hZ2VyIiwiZW50cmllc0NvdW50IiwibGVuZ3RoIiwiaW5kZXgiLCJ0aWNrRW50cnkiLCJ0aWNrRW50cmllcyIsInB1c2giLCJleGVjdXRlVGlja0VudHJpZXMiLCJpIiwiY2FsbCIsInJlcXVlc3RBbmltYXRpb25GcmFtZUNhbGxiYWNrIiwic2hvdWxkQ29udGludWUiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJUaWNrTWFuYWdlciIsInN0YXJ0IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBOzs7Ozs7OztBQUVBO0lBQ3FCQSxTO0FBRXBCOzs7O0FBSUEsbUJBQVlDLE9BQVosRUFBcUJDLFFBQXJCLEVBQ0E7QUFBQSxLQUQrQkMsUUFDL0IsdUVBRDBDLElBQzFDO0FBQUEsS0FEZ0RDLFFBQ2hELHVFQUQyRCxDQUMzRDs7QUFBQTs7QUFDQyxNQUFLSCxPQUFMLEdBQWVBLE9BQWY7QUFDQSxNQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLE1BQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsTUFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxNQUFLQyxjQUFMLEdBQXNCLENBQXRCO0FBQ0EsQzs7QUFJRjs7a0JBakJxQkwsUztBQW1CckJBLFVBQVVNLFNBQVYsQ0FBb0JDLE9BQXBCLEdBQThCLFlBQVU7QUFDdkMsTUFBS04sT0FBTCxHQUFlLElBQWY7QUFDQSxNQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsTUFBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLE1BQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxNQUFLQyxjQUFMLEdBQXNCRyxHQUF0QjtBQUNBLENBTkQ7O0FBUUFSLFVBQVVNLFNBQVYsQ0FBb0JHLE9BQXBCLEdBQThCLFlBQVU7QUFDdkMsbUJBQVFDLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsQ0FGRDs7QUFLQVYsVUFBVVcsSUFBVixHQUFpQixDQUFqQjtBQUNBWCxVQUFVWSxNQUFWLEdBQW1CLENBQW5CO0FBQ0FaLFVBQVVhLEdBQVYsR0FBZ0IsQ0FBaEI7O0FBRUFiLFVBQVVjLGdCQUFWLEdBQTZCLEdBQTdCO0FBQ0FkLFVBQVVlLEtBQVYsR0FBa0IsS0FBbEIsQzs7Ozs7Ozs7Ozs7OztBQ3hDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztBQUNBLElBQUlDLDBCQUEwQixDQUE5QixDLENBQWdDOztBQUVoQztBQUNBLElBQUlDLGtCQUFrQixDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUF0QjtBQUNBLElBQUlDLGNBQWMsSUFBbEI7O0FBRUEsSUFBSUMsWUFBWSxDQUFoQjtBQUNBLElBQUlDLGNBQWMsS0FBbEI7O0FBRUEsU0FBU0MsTUFBVCxHQUFpQjtBQUNoQkY7QUFDQSxLQUFHLG9CQUFVSixLQUFiLEVBQW1CO0FBQ2xCTyxVQUFRQyxHQUFSLENBQVksY0FBWixFQUE0QkosU0FBNUI7QUFDQTtBQUNELEtBQUdBLFlBQVksb0JBQVVMLGdCQUF6QixFQUEwQztBQUN6Q1U7QUFDQUM7QUFDQSxNQUFHQyx5QkFBSCxFQUE2QjtBQUM1QkM7QUFDQSxVQUFPLEtBQVA7QUFDQTtBQUNELEVBUEQsTUFPTztBQUNOTCxVQUFRTSxJQUFSLENBQWEsa0RBQWIsRUFBaUUsb0JBQVVkLGdCQUEzRTtBQUNBLE1BQUcsb0JBQVVDLEtBQWIsRUFBbUI7QUFDbEJPLFdBQVFDLEdBQVIsQ0FBWSxXQUFaLEVBQXlCTixnQkFBZ0IsQ0FBaEIsQ0FBekIsRUFBNENBLGdCQUFnQixDQUFoQixDQUE1QyxFQUErREEsZ0JBQWdCLENBQWhCLENBQS9ELEVBQWtGQyxXQUFsRjtBQUNBO0FBQ0RXO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRCxRQUFPLElBQVA7QUFFQTs7QUFHRCxTQUFTRixJQUFULEdBQWU7QUFDZFIsYUFBWSxDQUFaO0FBQ0FDLGVBQWMsS0FBZDtBQUNBVSxhQUFZSCxJQUFaO0FBQ0E7O0FBRUQsU0FBU0UsS0FBVCxHQUFnQjtBQUNmRjtBQUNBVixtQkFBa0IsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsQ0FBbEI7QUFDQUMsZUFBYyxJQUFkO0FBQ0E7O0FBR0QsU0FBU08sOEJBQVQsR0FBeUM7QUFDeEMsS0FBTU0sZUFBZWIsY0FBZUEsWUFBWWMsTUFBM0IsR0FBb0MsQ0FBekQ7QUFDQSxLQUFHZCxlQUFlYSxlQUFlLENBQWpDLEVBQW9DO0FBQ25DLE9BQUksSUFBSUUsUUFBUSxDQUFoQixFQUFvQkEsUUFBUUYsWUFBNUIsRUFBMENFLE9BQTFDLEVBQWtEO0FBQ2pELE9BQUlDLFlBQVloQixZQUFZZSxLQUFaLENBQWhCO0FBRGlELE9BRXpDN0IsUUFGeUMsR0FFNUI4QixTQUY0QixDQUV6QzlCLFFBRnlDOztBQUdqRCxPQUFHLENBQUNhLGdCQUFnQmIsUUFBaEIsQ0FBSixFQUE4QjtBQUM3QmEsb0JBQWdCYixRQUFoQixJQUE0QixFQUE1QjtBQUNBO0FBQ0QsT0FBTStCLGNBQWNsQixnQkFBZ0JiLFFBQWhCLENBQXBCO0FBQ0ErQixlQUFZQyxJQUFaLENBQWlCRixTQUFqQjtBQUNBO0FBQ0Q7QUFDRGhCLGVBQWMsSUFBZDtBQUNBOztBQUVELFNBQVNNLHNCQUFULEdBQWlDO0FBQ2hDSixlQUFjLElBQWQ7QUFDQSxNQUFJLElBQUlhLFFBQVEsQ0FBaEIsRUFBb0JBLFFBQVFoQixnQkFBZ0JlLE1BQTVDLEVBQW9EQyxPQUFwRCxFQUE0RDtBQUMzRCxNQUFJRSxjQUFjbEIsZ0JBQWdCZ0IsS0FBaEIsQ0FBbEI7QUFDQSxNQUFHRSxlQUFlQSxZQUFZSCxNQUFaLEdBQXFCLENBQXZDLEVBQTBDO0FBQ3pDSyxzQkFBbUJGLFdBQW5CO0FBQ0E7QUFDQWxCLG1CQUFnQmdCLEtBQWhCLElBQXlCLElBQXpCO0FBQ0E7QUFDRDtBQUNEYixlQUFjLEtBQWQ7QUFDQTs7QUFFRCxTQUFTaUIsa0JBQVQsQ0FBNEJGLFdBQTVCLEVBQXdDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSSxJQUFJRyxJQUFJLENBQVosRUFBZUEsSUFBSUgsWUFBWUgsTUFBL0IsRUFBdUNNLEdBQXZDLEVBQTJDO0FBQzFDLE1BQU1KLFlBQVlDLFlBQVlHLENBQVosQ0FBbEI7QUFDQUosWUFBVWhDLFFBQVYsQ0FBbUJxQyxJQUFuQixDQUF3QkwsVUFBVWpDLE9BQVYsSUFBcUJpQyxVQUFVaEMsUUFBVixDQUFtQixNQUFuQixDQUE3QztBQUNBLE1BQUlnQyxVQUFVL0IsUUFBZCxFQUF3QjtBQUN2QitCLGFBQVUvQixRQUFWLENBQW1Cb0MsSUFBbkIsQ0FBd0JMLFVBQVUvQixRQUFWLENBQW1CLE1BQW5CLENBQXhCO0FBQ0E7QUFDRCtCLFlBQVU3QixjQUFWO0FBQ0EsTUFBRyxvQkFBVVUsS0FBVixJQUFtQm1CLFVBQVU3QixjQUFWLEdBQTJCLENBQWpELEVBQW1EO0FBQ2xEaUIsV0FBUUMsR0FBUixDQUFZLDJCQUFaLEVBQXlDVyxTQUF6QztBQUNBO0FBQ0Q7QUFDRDs7QUFFRCxTQUFTUix1QkFBVCxHQUFrQztBQUNqQyxNQUFJLElBQUlPLFFBQVEsQ0FBaEIsRUFBb0JBLFFBQVFoQixnQkFBZ0JlLE1BQTVDLEVBQW9EQyxPQUFwRCxFQUE0RDtBQUMzRCxNQUFJRSxjQUFjbEIsZ0JBQWdCZ0IsS0FBaEIsQ0FBbEI7QUFDQSxNQUFHRSxlQUFlQSxZQUFZSCxNQUFaLEdBQXFCLENBQXZDLEVBQTBDO0FBQ3pDLFVBQU8sS0FBUDtBQUNBO0FBQ0Q7QUFDRCxRQUFPLElBQVA7QUFDQTs7QUFFRCxTQUFTUSw2QkFBVCxHQUF3QztBQUN2QyxLQUFNQyxpQkFBaUJwQixRQUF2QjtBQUNBLEtBQUdvQixjQUFILEVBQWtCO0FBQ2pCekIsNEJBQTBCMEIsT0FBT0MscUJBQVAsQ0FBNkJILDZCQUE3QixDQUExQjtBQUNBO0FBQ0Q7O0lBRUtJLFcsR0FDTCx1QkFBYTtBQUFBO0FBQ1osQzs7QUFHRkEsWUFBWXRDLFNBQVosQ0FBc0JJLEdBQXRCLEdBQTRCLFVBQVV3QixTQUFWLEVBQXFCO0FBQ2hELEtBQUdSLHlCQUFILEVBQTZCO0FBQzVCLE9BQUttQixLQUFMO0FBQ0E7QUFDRCxLQUFHekIsV0FBSCxFQUFlO0FBQ2RFLFVBQVFDLEdBQVIsQ0FBWSx1QkFBWjtBQUNBLE1BQUcsQ0FBQ0wsV0FBSixFQUFnQjtBQUNmQSxpQkFBYyxFQUFkO0FBQ0E7QUFDREEsY0FBWWtCLElBQVosQ0FBaUJGLFNBQWpCO0FBQ0EsRUFORCxNQU1PO0FBQUEsTUFDRTlCLFFBREYsR0FDZThCLFNBRGYsQ0FDRTlCLFFBREY7O0FBRU4sTUFBRyxDQUFDYSxnQkFBZ0JiLFFBQWhCLENBQUosRUFBOEI7QUFDN0JhLG1CQUFnQmIsUUFBaEIsSUFBNEIsRUFBNUI7QUFDQTtBQUNELE1BQU0rQixjQUFjbEIsZ0JBQWdCYixRQUFoQixDQUFwQjtBQUNBK0IsY0FBWUMsSUFBWixDQUFpQkYsU0FBakI7QUFDQTtBQUVELENBbkJEOztBQXNCQTtBQUNBVSxZQUFZdEMsU0FBWixDQUFzQnVDLEtBQXRCLEdBQThCLFlBQVk7QUFDekMsS0FBR0gsTUFBSCxFQUFVO0FBQ1Q7QUFDQTFCLDRCQUEwQjBCLE9BQU9DLHFCQUFQLENBQTZCSCw2QkFBN0IsQ0FBMUI7QUFDQTtBQUNELENBTEQ7O0FBUUFJLFlBQVl0QyxTQUFaLENBQXNCcUIsSUFBdEIsR0FBNkIsWUFBWTtBQUN4QyxLQUFHZSxNQUFILEVBQVU7QUFDVEEsU0FBT0ksb0JBQVAsQ0FBNEI5Qix1QkFBNUI7QUFDQTtBQUNELENBSkQ7O0FBTUEsSUFBTWMsY0FBYyxJQUFJYyxXQUFKLEVBQXBCOztBQUVBO2tCQUNlZCxXIiwiZmlsZSI6ImxpYi90aWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcInRpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJ0aWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1widGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY3NWUyNDdkYjdjMGRkYzk3OTlkIiwiaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9NYW5hZ2VyJztcblxuLy8gdG9Ebzogc3VwcG9ydCBib3RoIGNhbGxiYWNrIGFuZCBwcm9taXNlXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrRW50cnlcbntcblx0LyoqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IC0gVGhlIFwidGhpc1wiIGFyZ3VtZW50IGZvciB0aGUgbGlzdGVuZXIgZnVuY3Rpb24uXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoY29udGV4dCwgbGlzdGVuZXIsIGNhbGxiYWNrID0gbnVsbCwgcHJpb3JpdHkgPSAwKVxuXHR7XG5cdFx0dGhpcy5jb250ZXh0ID0gY29udGV4dDtcblx0XHR0aGlzLmxpc3RlbmVyID0gbGlzdGVuZXI7XG5cdFx0dGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcblx0XHR0aGlzLmV4ZWN1dGlvbkNvdW50ID0gMDtcblx0fVxuXG59XG5cbi8qLS0tLSBQdWJsaWN8UHJvdG90eXBlIE1ldGhvZHMgLS0tKi9cblxuVGlja0VudHJ5LnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKXtcblx0dGhpcy5jb250ZXh0ID0gbnVsbDtcblx0dGhpcy5saXN0ZW5lciA9IG51bGw7XG5cdHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuXHR0aGlzLnByaW9yaXR5ID0gbnVsbDtcblx0dGhpcy5leGVjdXRpb25Db3VudCA9IE5hTjtcbn07XG5cblRpY2tFbnRyeS5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKCl7XG5cdG1hbmFnZXIuYWRkKHRoaXMpO1xufTtcblxuXG5UaWNrRW50cnkuSElHSCA9IDA7XG5UaWNrRW50cnkuTk9STUFMID0gMTtcblRpY2tFbnRyeS5MT1cgPSAyO1xuXG5UaWNrRW50cnkuYWxsb3dlZFRpY2tDb3VudCA9IDEwMDtcblRpY2tFbnRyeS5kZWJ1ZyA9IGZhbHNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL1RpY2tFbnRyeS5qcyIsImltcG9ydCBUaWNrZXIgZnJvbSAnLi9UaWNrRW50cnknO1xuXG5leHBvcnQgZGVmYXVsdCBUaWNrZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvaW5kZXguanMiLCJpbXBvcnQgVGlja0VudHJ5IGZyb20gJy4vVGlja0VudHJ5JztcbmxldCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCA9IDA7Ly8gZm9yIFdpbmRvd3MgRW52XG5cbi8vWzAtSElHSCwgMS1OT1JNQUwsIDItTE9XXVxubGV0IHByaW9yaXR5RW50cmllcyA9IFtudWxsLCBudWxsLCBudWxsXTtcbmxldCB3YWl0RW50cmllcyA9IG51bGw7XG5cbmxldCB0aWNrQ291bnQgPSAwO1xubGV0IGlzRXhlY3V0aW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIG9uVGljaygpe1xuXHR0aWNrQ291bnQrKztcblx0aWYoVGlja0VudHJ5LmRlYnVnKXtcblx0XHRjb25zb2xlLmxvZyhcIlRpY2sgY291bnQ6IFwiLCB0aWNrQ291bnQpO1xuXHR9XG5cdGlmKHRpY2tDb3VudCA8IFRpY2tFbnRyeS5hbGxvd2VkVGlja0NvdW50KXtcblx0XHRleGVjdXRlUHJpb3JpdHlFbnRyaWVzKCk7XG5cdFx0bW92ZVdhaXRpbmdFbnRyaWVzRm9yRXhlY3V0aW9uKCk7XG5cdFx0aWYoYXJlUHJpb3JpdHlFbnRyaWVzRW1wdHkoKSl7XG5cdFx0XHRzdG9wKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnNvbGUud2FybihcIkFuaW1hdGlvbiBmcmFtZSBsb29wIGV4ZWN1dGVkIHRvIGl0cyBzZXQgbGltaXQ6IFwiLCBUaWNrRW50cnkuYWxsb3dlZFRpY2tDb3VudCk7XG5cdFx0aWYoVGlja0VudHJ5LmRlYnVnKXtcblx0XHRcdGNvbnNvbGUubG9nKFwiRW50cmllczogXCIsIHByaW9yaXR5RW50cmllc1swXSxwcmlvcml0eUVudHJpZXNbMV0scHJpb3JpdHlFbnRyaWVzWzJdLHdhaXRFbnRyaWVzKTtcblx0XHR9XG5cdFx0cmVzZXQoKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuIHRydWU7XG5cbn1cblxuXG5mdW5jdGlvbiBzdG9wKCl7XG5cdHRpY2tDb3VudCA9IDA7XG5cdGlzRXhlY3V0aW5nID0gZmFsc2U7XG5cdHRpY2tNYW5hZ2VyLnN0b3AoKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoKXtcblx0c3RvcCgpO1xuXHRwcmlvcml0eUVudHJpZXMgPSBbbnVsbCwgbnVsbCwgbnVsbF07XG5cdHdhaXRFbnRyaWVzID0gbnVsbDtcbn1cblxuXG5mdW5jdGlvbiBtb3ZlV2FpdGluZ0VudHJpZXNGb3JFeGVjdXRpb24oKXtcblx0Y29uc3QgZW50cmllc0NvdW50ID0gd2FpdEVudHJpZXMgPyAgd2FpdEVudHJpZXMubGVuZ3RoIDogMDtcblx0aWYod2FpdEVudHJpZXMgJiYgZW50cmllc0NvdW50ID4gMCkge1xuXHRcdGZvcihsZXQgaW5kZXggPSAwIDsgaW5kZXggPCBlbnRyaWVzQ291bnQ7IGluZGV4Kyspe1xuXHRcdFx0bGV0IHRpY2tFbnRyeSA9IHdhaXRFbnRyaWVzW2luZGV4XTtcblx0XHRcdGNvbnN0IHsgcHJpb3JpdHkgfSA9IHRpY2tFbnRyeTtcblx0XHRcdGlmKCFwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldKXtcblx0XHRcdFx0cHJpb3JpdHlFbnRyaWVzW3ByaW9yaXR5XSA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgdGlja0VudHJpZXMgPSBwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldO1xuXHRcdFx0dGlja0VudHJpZXMucHVzaCh0aWNrRW50cnkpO1xuXHRcdH1cblx0fVxuXHR3YWl0RW50cmllcyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVQcmlvcml0eUVudHJpZXMoKXtcblx0aXNFeGVjdXRpbmcgPSB0cnVlO1xuXHRmb3IobGV0IGluZGV4ID0gMCA7IGluZGV4IDwgcHJpb3JpdHlFbnRyaWVzLmxlbmd0aDsgaW5kZXgrKyl7XG5cdFx0bGV0IHRpY2tFbnRyaWVzID0gcHJpb3JpdHlFbnRyaWVzW2luZGV4XTtcblx0XHRpZih0aWNrRW50cmllcyAmJiB0aWNrRW50cmllcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRleGVjdXRlVGlja0VudHJpZXModGlja0VudHJpZXMpO1xuXHRcdFx0Ly9DbGVhciB0aGVtIG9uY2UgZXhlY3V0ZWRcblx0XHRcdHByaW9yaXR5RW50cmllc1tpbmRleF0gPSBudWxsO1xuXHRcdH1cblx0fVxuXHRpc0V4ZWN1dGluZyA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBleGVjdXRlVGlja0VudHJpZXModGlja0VudHJpZXMpe1xuXHQvLyBpbXBvcnRhbnQgdG8gdXNlIGZvci1sb29wXG5cdC8vIHRpY2tFbnRyaWVzIGdyb3dzIGR5bmFtaWNhbGx5IGJ5IG9uZSBvZiBpdHMgZW50cnlcblx0Ly8gZm9yIGV4YW1wbGU6IGxldCBzYXkgd2UgaGF2ZSBvbmUgZW50cnksIGFuZCBleGVjdXRpbmcgdGhhdCBlbnRyeSBtaWdodCBhZGRzIGFub3RoZXIgZW50cnlcblx0Ly8gd2l0aCBtYXAgZnVuY3Rpb24gd2UgY2FudCBleGVjdXRlIGR5bmFtaWNhbGx5IGdyb3dpbmcgZW50cmllcy5cblx0Zm9yKGxldCBpID0gMDsgaSA8IHRpY2tFbnRyaWVzLmxlbmd0aDsgaSsrKXtcblx0XHRjb25zdCB0aWNrRW50cnkgPSB0aWNrRW50cmllc1tpXTtcblx0XHR0aWNrRW50cnkubGlzdGVuZXIuY2FsbCh0aWNrRW50cnkuY29udGV4dCB8fCB0aWNrRW50cnkubGlzdGVuZXJbJ3RoaXMnXSk7XG5cdFx0aWYgKHRpY2tFbnRyeS5jYWxsYmFjaykge1xuXHRcdFx0dGlja0VudHJ5LmNhbGxiYWNrLmNhbGwodGlja0VudHJ5LmNhbGxiYWNrWyd0aGlzJ10pO1xuXHRcdH1cblx0XHR0aWNrRW50cnkuZXhlY3V0aW9uQ291bnQrKztcblx0XHRpZihUaWNrRW50cnkuZGVidWcgJiYgdGlja0VudHJ5LmV4ZWN1dGlvbkNvdW50ID4gMSl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkV4ZWN1dGVkIG1vcmUgdGhhbiBvbmNlOiBcIiwgdGlja0VudHJ5KTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXJlUHJpb3JpdHlFbnRyaWVzRW1wdHkoKXtcblx0Zm9yKGxldCBpbmRleCA9IDAgOyBpbmRleCA8IHByaW9yaXR5RW50cmllcy5sZW5ndGg7IGluZGV4Kyspe1xuXHRcdGxldCB0aWNrRW50cmllcyA9IHByaW9yaXR5RW50cmllc1tpbmRleF07XG5cdFx0aWYodGlja0VudHJpZXMgJiYgdGlja0VudHJpZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjaygpe1xuXHRjb25zdCBzaG91bGRDb250aW51ZSA9IG9uVGljaygpO1xuXHRpZihzaG91bGRDb250aW51ZSl7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RBbmltYXRpb25GcmFtZUNhbGxiYWNrKTtcblx0fVxufVxuXG5jbGFzcyBUaWNrTWFuYWdlciB7XG5cdGNvbnN0cnVjdG9yKCl7XG5cdH1cbn1cblxuVGlja01hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0aWNrRW50cnkpIHtcblx0aWYoYXJlUHJpb3JpdHlFbnRyaWVzRW1wdHkoKSl7XG5cdFx0dGhpcy5zdGFydCgpXG5cdH1cblx0aWYoaXNFeGVjdXRpbmcpe1xuXHRcdGNvbnNvbGUubG9nKFwiQWRkZWQgdG8gV2FpdCBlbnRyaWVzXCIpO1xuXHRcdGlmKCF3YWl0RW50cmllcyl7XG5cdFx0XHR3YWl0RW50cmllcyA9IFtdO1xuXHRcdH1cblx0XHR3YWl0RW50cmllcy5wdXNoKHRpY2tFbnRyeSk7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgeyBwcmlvcml0eSB9ID0gdGlja0VudHJ5O1xuXHRcdGlmKCFwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldKXtcblx0XHRcdHByaW9yaXR5RW50cmllc1twcmlvcml0eV0gPSBbXTtcblx0XHR9XG5cdFx0Y29uc3QgdGlja0VudHJpZXMgPSBwcmlvcml0eUVudHJpZXNbcHJpb3JpdHldO1xuXHRcdHRpY2tFbnRyaWVzLnB1c2godGlja0VudHJ5KTtcblx0fVxuXG59O1xuXG5cbi8vIFRvZG86IFN1cHBvcnQgZm9yIE5vZGVKUyBcblRpY2tNYW5hZ2VyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0aWYod2luZG93KXtcblx0XHQvLyB3aWxsIHJlY2VpdmVzIHRpbWVzdGFtcCBhcyBhcmd1bWVudFxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZXF1ZXN0QW5pbWF0aW9uRnJhbWVDYWxsYmFjayk7XG5cdH1cbn07XG5cblxuVGlja01hbmFnZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cdGlmKHdpbmRvdyl7XG5cdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RBbmltYXRpb25GcmFtZUlkKTtcblx0fVxufTtcblxuY29uc3QgdGlja01hbmFnZXIgPSBuZXcgVGlja01hbmFnZXIoKTtcblxuLy8gc2luZ2xldG9uSW5zdGFuYWNlXG5leHBvcnQgZGVmYXVsdCB0aWNrTWFuYWdlcjtcblxuXG5cblxuXG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL01hbmFnZXIuanMiXSwic291cmNlUm9vdCI6IiJ9