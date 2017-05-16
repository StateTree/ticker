'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Manager = require('./Manager');

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

/*---- Public|Prototype Methods ---*/

exports.default = TickEntry;
TickEntry.prototype.disposableCallLater = function (dispose) {
	if (dispose) {
		this.context = null;
		this.listener = null;
	} else {
		var manager = new _Manager2.default();
		manager.addEntry(this);
	}
};