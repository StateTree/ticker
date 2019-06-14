import {addToSemiInfiniteLoop} from './scheduler';
import Notifier from './Notifier';
import {ErrorMsg} from './contants';

/**
 * @private
 * @param {Object} tickEntry
 * @return {void}
 */
function _checkError(tickEntry){
	if(!tickEntry){
		throw new Error('Ticker: instance can\'t be null');
	} else if(!(tickEntry instanceof TickEntry)){
		const className = tickEntry.constructor ? tickEntry.constructor.name : typeof tickEntry;
		throw new Error(`Ticker: Expecting instance of TickEntry got ${className}`);
	} else if(!tickEntry.func){
		throw new Error('Ticker: function can\'t be undefined');
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
	 * @param {Function} func
	 * @param {Object} context The "this" argument for the func.
	 * @param {number} priority
	 */
	constructor(func, context = null, priority = 0)
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
		 * @type {number}
		 */
		this.priority = priority;
		/**
		 * @type {number}
		 */
		this.executionCount = 0;
		this.notifier = new Notifier();
		_checkError(this);
	}

	onDone(doneCallback){
		this.notifier.doneCallback = doneCallback;
		return this.notifier;
	}

	onError(errorCallback){
		this.notifier.errorCallback = errorCallback;
		return this.notifier;
	}


	/**
	 * This function dispose the tickEntry references for garbage collection
	 *
	 * @return {void}
	 */
	dispose(){
		this.context = null;
		this.func = null;
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
		_checkError(this);

		const tickEntryInstance = this;
		const {func, context, priority} = tickEntryInstance;

		function loopFunction(){
			const notifier = tickEntryInstance.notifier;
			const {doneCallback, errorCallback} = notifier;
			try{
				const result = func.call(context);
				tickEntryInstance.executionCount++;
				doneCallback && doneCallback(result);
			} catch (error){
				errorCallback && errorCallback(error);
				tickEntryInstance.dispose();
			}
		}

		addToSemiInfiniteLoop(loopFunction,priority);

		this.notifier.onProgress = undefined;
		return this.notifier;
	}

	/**
	 * This function adds the loop function to event cycle / request animation frame for execution
	 *
	 * @param {number} maxLoopPerFrame indicates loop length that needs to be executed in single frame or tick.
	 * @param {number} endIndex indicates loop end value
	 * @param {number} startIndex indicates loop begining value , default value is 0
	 * @return {void}
	 */
	executeAsSmallLoopsInCycle(maxLoopPerFrame, endIndex, startIndex = 0){
		if(maxLoopPerFrame === undefined || typeof maxLoopPerFrame !== 'number'){
			throw new Error(ErrorMsg.MAX_LOOP_PER_FRAME);
		}

		if(endIndex === undefined || typeof endIndex !== 'number'){
			throw new Error(ErrorMsg.END_INDEX);
		}

		if(typeof startIndex !== 'number'){
			throw new Error(ErrorMsg.START_INDEX);
		}
		_checkError(this);

		const tickEntryInstance = this;
		const {func, context, priority} = tickEntryInstance;

		let loopLimit = maxLoopPerFrame;
		let i = startIndex;

		function loopFunction(){
			const notifier = tickEntryInstance.notifier;
			const {doneCallback, errorCallback, progressCallback} = notifier;
			let result;
			for(;i < loopLimit; i++){
				try {
					result = func.call(context, i);
				} catch(error) {
					errorCallback && errorCallback(error);
					tickEntryInstance.dispose();
					return;
				}
			}
			if(loopLimit < endIndex){
				loopLimit = loopLimit + maxLoopPerFrame;
				progressCallback && progressCallback(i, result);
				addToSemiInfiniteLoop(loopFunction,priority);
			} else if( i === endIndex){
				tickEntryInstance.executionCount++;
				doneCallback && doneCallback(result);
			}
		}

		addToSemiInfiniteLoop(loopFunction, priority);
		return this.notifier;
	}

}

TickEntry.HIGH = 0;
TickEntry.NORMAL = 1;
TickEntry.LOW = 2;

TickEntry.allowedTickCount = 100;
