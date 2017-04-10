import TickManager from './Manager'

export default class TickEntry
{
	/**
	 * @param {object} context - The "this" argument for the listener function.
	 * @param {function} listener.
	 */
	constructor(context, listener)
	{
		this.context = context;
		this.listener = listener;
	};

}

TickEntry.prototype.callLater = function(){
	var manager = new TickManager();
	manager.addEntry(this);
};


/**
 * Call this when the listener item is no longer needed.
 */
TickEntry.prototype.dispose = function(){
	this.context = null;
	this.listener = null;
};