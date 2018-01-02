import manager from './Manager';

// toDo: support both callback and promise
export default class TickEntry
{
	/**
	 * @param {object} context - The "this" argument for the listener function.
	 * @param {function} listener.
	 */
	constructor(context, listener, callback = null, priority = 0, ignoreIfAdded = false)
	{
		this.context = context;
		this.listener = listener;
		this.callback = callback;
		this.priority = priority;
		this.ignoreIfAdded = ignoreIfAdded;
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
	if(this.recursionCount === 0){
		manager.add(this);
	} else {
		if (this.callback) {
			this.callback.call(tickEntry.callback['this'], true);
		}
	}
};

TickEntry.prototype.getMaxPriority = function(){
	return manager.getMaxPriority();
};


