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
	}

}

/*---- Public|Prototype Methods ---*/

TickEntry.prototype.dispose = function(){
	this.context = null;
	this.listener = null;
	this.callback = null;
	this.priority = null;
};

TickEntry.prototype.execute = function(){
	manager.add(this);
};

TickEntry.prototype.getMaxPriority = function(){
	return manager.getMaxPriority();
};


TickEntry.HIGH = 0;
TickEntry.NORMAL = 1;
TickEntry.LOW = 2;
TickEntry.WAIT = 3;
