import manager from './Manager';

// toDo: support both callback and promise
export default class TickEntry
{
	/**
	 * @param {object} context - The "this" argument for the listener function.
	 * @param {function} listener.
	 */
	constructor(context, listener, callback = null, priority = 0)
	{
		this.context = context;
		this.listener = listener;
		this.callback = callback;
		this.priority = priority;
		this.executionCount = 0;
	}

}

/*---- Public|Prototype Methods ---*/

TickEntry.prototype.dispose = function(){
	TickEntry.stackDebug && console.log("TickEntry dispose:", this);
	this.context = null;
	this.listener = null;
	this.callback = null;
	this.priority = null;
	this.executionCount = NaN;
};

TickEntry.prototype.execute = function(){
	TickEntry.stackDebug && console.log("manager.add: ", this);
	manager.add(this);
};


TickEntry.HIGH = 0;
TickEntry.NORMAL = 1;
TickEntry.LOW = 2;

TickEntry.allowedTickCount = 100;
TickEntry.debug = false;
TickEntry.stackDebug = false;
