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
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

function onTick(entries) {
	if (entries.length > 0) {
		entries.map(function (tickEntry) {
			tickEntry.listener.call(tickEntry.context);
			tickEntry.dispose();
			//todo: Investigate setting tickEntry = null
		});
		//Clear them once executed
		entries = [];
	}
}

var TickManager = function TickManager() {
	_classCallCheck(this, TickManager);

	if (!instance) {
		instance = this;
		//callLater entries
		this._entries = [];

		// gets updated 
		this._tickId = 0; // for Windows Env

		this.start();
	}
	return instance;
};

exports.default = TickManager;


TickManager.prototype.addEntry = function (tickEntry) {
	//todo add a util function to avoid duplicate addition
	this._entries.push(tickEntry);
};

// Todo: Support for NodeJS 
TickManager.prototype.start = function () {
	var _this = this;

	if (window) {
		var requestAnimationFrameCallback = function requestAnimationFrameCallback(timeStamp) {
			onTick(_this._entries);
			_this._tickId = window.requestAnimationFrame(requestAnimationFrameCallback);
		};
		this._tickId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
};

TickManager.prototype.stop = function () {
	if (window) {
		window.cancelAnimationFrame(this._tickId);
	}
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Manager = __webpack_require__(0);

var _Manager2 = _interopRequireDefault(_Manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TickEntry =
/**
 * @param {object} context - The "this" argument for the listener function.
 * @param {function} listener.
 */
function TickEntry(context, listener) {
	_classCallCheck(this, TickEntry);

	this.context = context;
	this.listener = listener;
};

exports.default = TickEntry;


TickEntry.prototype.callLater = function () {
	var manager = new _Manager2.default();
	manager.addEntry(this);
};

/**
 * Call this when the listener item is no longer needed.
 */
TickEntry.prototype.dispose = function () {
	this.context = null;
	this.listener = null;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TickEntry = exports.TickManager = undefined;

var _Manager = __webpack_require__(0);

var _Manager2 = _interopRequireDefault(_Manager);

var _TickEntry = __webpack_require__(1);

var _TickEntry2 = _interopRequireDefault(_TickEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.TickManager = _Manager2.default;
exports.TickEntry = _TickEntry2.default;

/***/ })
/******/ ]);
});
//# sourceMappingURL=ticker.js.map