'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _TickEntry = require('./TickEntry');

var _TickEntry2 = _interopRequireDefault(_TickEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;
var requestAnimationFrameId = NaN;
var tickEntries = null;

function onTick(entries) {
	if (entries.length > 0) {
		entries.map(function (tickEntry) {
			tickEntry.listener.call(tickEntry.context);
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
		tickEntries = [];

		// gets updated 
		requestAnimationFrameId = 0; // for Windows Env

		this.start();
	}
	return instance;
};

exports.default = TickManager;


TickManager.prototype.requestDisposableCallLater = function (context, listener) {
	var tickEntry = new _TickEntry2.default(context, listener);
	tickEntries.push(tickEntry); // todo: Stack or Queue
	return tickEntry.disposableCallLater;
};

// Todo: Support for NodeJS 
TickManager.prototype.start = function () {
	if (window) {
		// will receives timestamp as argument
		//todo: Learn:  the purpose of timestamp
		var requestAnimationFrameCallback = function requestAnimationFrameCallback() {
			onTick(tickEntries);
			requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
		};
		requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
};

TickManager.prototype.stop = function () {
	if (window) {
		window.cancelAnimationFrame(requestAnimationFrameId);
	}
};