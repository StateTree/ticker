
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
	}

}

/*---- Public|Prototype Methods ---*/

TickEntry.prototype.disposableCallLater = function(){
	this.context = null;
	this.listener = null;
};

