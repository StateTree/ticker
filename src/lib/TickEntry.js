import addToSemiInfiniteLoop from './semiInfiniteLoop';

/**
 * Tick Entry is a wrapper to the function we want to execute later in request animation frame or event cycle
 * @example
 * import Ticker from 'ticker'
 * let tickEntry = new TickEntry(context,listener,callback,priority);
 */
export default class TickEntry
{
	/**
	 * @param {Object} context The "this" argument for the listener function.
	 * @param {Function} listener
	 * @param {Function} callback
	 * @param {number} priority
	 */
	constructor(context, listener, callback = null, priority = 0)
	{
		/**
		 * @type {Object}
		 */
		this.context = context;
		/**
		 * @type {Function}
		 */
		this.listener = listener;
		/**
		 * @type {Function}
		 */
		this.callback = callback;
		/**
		 * @type {number}
		 */
		this.priority = priority;
		/**
		 * @type {number}
		 */
		this.executionCount = 0;
	}


	/**
	 * This function dispose the tickEntry references for garbage collection
	 *
	 * @return {void}
	 */
	dispose(){
		this.context = null;
		this.listener = null;
		this.callback = null;
		this.priority = null;
		this.executionCount = NaN;
	}

	/**
	 * This function adds the Listener to event cycle / request animation frame for execution
	 *
	 * @return {void}
	 */
	execute(){
		addToSemiInfiniteLoop(this);
	};

}

TickEntry.HIGH = 0;
TickEntry.NORMAL = 1;
TickEntry.LOW = 2;

TickEntry.allowedTickCount = 100;
