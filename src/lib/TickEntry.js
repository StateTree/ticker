import addToSemiInfiniteLoop from './semiInfiniteLoop';

/**
 * @private
 * @param {Object} tickEntry
 * @return {void}
 */
function checkError(tickEntry){
	if(!tickEntry instanceof TickEntry){
		const className = tickEntry.constructor ? tickEntry.constructor.name : typeof tickEntry;
		throw new Error(`Ticker: Expecting instance of TickEntry got ${className}`);
	}
	if(!tickEntry.func){
		throw new Error("Ticker: function can't be undefined");
	}
}
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
	 * @param {Function} func
	 * @param {number} priority
	 * @param {Function} callback
	 */
	constructor(context, func, priority = 0, callback = null)
	{
		/**
		 * @type {Object}
		 */
		this.context = context;
		/**
		 * @type {Function}
		 */
		this.func = func;
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
		checkError(this);
	}


	/**
	 * This function dispose the tickEntry references for garbage collection
	 *
	 * @return {void}
	 */
	dispose(){
		this.context = null;
		this.func = null;
		this.callback = null;
		this.priority = null;
		this.executionCount = NaN;
	}

	/**
	 * This function adds the func to event cycle / request animation frame for execution
	 *
	 * @return {void}
	 */
	executeInCycle(){
		checkError(this);
		addToSemiInfiniteLoop(this);
	};

	/**
	 * This function adds the loop function to event cycle / request animation frame for execution
	 *
	 * @param {number} maxLoopCount indicates loop length that needs to be executed.
	 * @param {number} endIndex indicates loop end value
	 * @param {number} startIndex indicates loop begining value
	 * @return {void}
	 */
	executeAsSmallLoopsInCycle(maxLoopCount, endIndex, startIndex = 0){
		checkError(this);
		let loopLimit = maxLoopCount;
		let i = startIndex;
		let allowedTickCount = TickEntry.allowedTickCount;
		TickEntry.allowedTickCount = undefined;

		let loopFunction = this.func;
		let loopFnContext = this.context;
		let loopFnCallback = this.callback;

		this.context = this;
		if(loopFnCallback){
			this.callback = function() {
				loopFnCallback.call(loopFnContext || loopFnCallback['this'], i)
			};
		}

		this.func = function(){
			if(i < loopLimit) {
				loopFunction.call(loopFnContext || loopFunction['this'], i);
				i = i + 1;
				this.executeInCycle();
			} else if(loopLimit < endIndex){
				loopLimit = loopLimit + maxLoopCount;
				this.executeInCycle()
			} else {
				this.dispose();
				loopFunction = null;
				loopFnContext = null;
				TickEntry.allowedTickCount = allowedTickCount;
			}
		};

		this.executeInCycle();
	};

}

TickEntry.HIGH = 0;
TickEntry.NORMAL = 1;
TickEntry.LOW = 2;

TickEntry.allowedTickCount = 100;
