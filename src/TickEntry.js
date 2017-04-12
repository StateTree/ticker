import TickManager from './Manager';


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

TickEntry.prototype.disposableCallLater = function(dispose){
	if(dispose){
		this.context = null;
		this.listener = null;
	}else{
		var manager = new TickManager();
		manager.addEntry(this);
	}
};

