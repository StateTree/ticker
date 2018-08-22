import addToSemiInfiniteLoop from './semiInfiniteLoop';
import Notifier from "./Notifier";

/**
 * @private
 * @param {Object} tickEntry
 * @return {void}
 */
function _checkError(tickEntry){
	if(!tickEntry instanceof TickEntry){
		const className = tickEntry.constructor ? tickEntry.constructor.name : typeof tickEntry;
		throw new Error(`Ticker: Expecting instance of TickEntry got ${className}`);
	}
	if(!tickEntry.func){
		throw new Error("Ticker: function can't be undefined");
	}
}

function _callNotifiers(tickEntry, context, currentIndex, endIndex, callback , error){
	if(tickEntry.notifier){
		const {progressCallback, doneCallback , errorCallback } = tickEntry.notifier;
		if(error){
			errorCallback.call(context || errorCallback['this'], error, currentIndex)
		} else if(currentIndex === endIndex){
			if(doneCallback){
				doneCallback.call(context || doneCallback['this'])
			}
			if(callback){
				callback.call(context || callback['this'])
			}
		} else if(progressCallback){
			progressCallback.call(context || progressCallback['this'], currentIndex)
		}
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
		this.notifier;
		_checkError(this);
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
		this.notifier = null;
	}

	/**
	 * This function adds the func to event cycle / request animation frame for execution
	 *
	 * @return {void}
	 */
	executeInCycle(){
		this.notifier = new Notifier();
		_checkError(this);
		addToSemiInfiniteLoop(this);
		return this.notifier;
	};

	/**
	 * This function adds the loop function to event cycle / request animation frame for execution
	 *
	 * @param {number} maxLoopPerFrame indicates loop length that needs to be executed in single frame or tick.
	 * @param {number} endIndex indicates loop end value
	 * @param {number} startIndex indicates loop begining value , default value is 0
	 * @return {void}
	 */
	executeAsSmallLoopsInCycle(maxLoopPerFrame, endIndex, startIndex = 0){
		_checkError(this);
		let loopLimit = maxLoopPerFrame;
		let i = startIndex;
		let allowedTickCount = TickEntry.allowedTickCount;
		TickEntry.allowedTickCount = undefined;

		let loopFunction = this.func;
		let loopFnContext = this.context;
		let loopFnCallback = this.callback;

		this.context = this;

		this.callback = function() {
			_callNotifiers(this,loopFnContext,i, endIndex, loopFnCallback);
			if(i === endIndex){
				this.dispose();
				TickEntry.allowedTickCount = allowedTickCount;
			}
		};

		this.func = function(){
			for(;i < loopLimit; i++){
				try {
					loopFunction.call(loopFnContext || loopFunction['this'], i);
				} catch (error){
					_callNotifiers(this,loopFnContext,i, endIndex, loopFnCallback, error);
					this.dispose();
				}

			}
			if(loopLimit < endIndex){
				loopLimit = loopLimit + maxLoopPerFrame;
				addToSemiInfiniteLoop(this)
			}
		};

		return this.executeInCycle();
	};

}

TickEntry.HIGH = 0;
TickEntry.NORMAL = 1;
TickEntry.LOW = 2;

TickEntry.allowedTickCount = 100;
