import manager from './Manager';

export default class TickEntry
{
	/**
	 * @param {object} context - The "this" argument for the listener function.
	 * @param {function} listener.
	 */
	constructor(context, listener, callback)
	{
		this.context = context;
		this.listener = listener;
		this.callback = callback;
	}

}

/*---- Public|Prototype Methods ---*/

TickEntry.prototype.dispose = function(){
	this.context = null;
	this.listener = null;
};

TickEntry.prototype.execute = function(){
	manager.add(this,false);
};

TickEntry.prototype.executeLast = function(){
    manager.add(this,true);
};


