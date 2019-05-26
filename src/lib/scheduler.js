import TickEntry from './TickEntry';
import {
	readPrimaryMemory,
	moveFromSecondaryToPrimary,
	resetMemory,
	isMemoryEmpty,
	addToSecondaryMemory, addToPrimaryMemory
} from './memory';

let tickID = 0;// for Browser Env
let tickCount = 0; // to avoid infinite loop issue, we need to count
let isExecuting = false;

/**
 * @private (Core algorithm)
 * caller: Animation Frame | event cycle Callback
 *
 * Executes entries in animation frame / event cycle callback
 * First execute the entries in the priority order
 * Entries which are added to Wait queue while executing priority entries are moved for execution
 * If there are no entries in priority, semi-infinite loop is stopped
 * and return boolean flag to remove the callback from animation frame or event cycle.
 *
 * @return {boolean} notifies whether to continue or remove the callback
 */
function onTick(){
	tickCount++;

	if(tickCount < TickEntry.allowedTickCount){
		return coreAlgorithm();
	} else {
		console.warn('Animation frame loop executed to its set limit: ', TickEntry.allowedTickCount);
		stop();
		return false;
	}
}

function coreAlgorithm(){
	isExecuting = true;
	readPrimaryMemory(executeEntries);
	isExecuting = false;
	moveFromSecondaryToPrimary();
	if(isMemoryEmpty()){
		stop();
		return false;
	}
	return true;
}


/**
 * @private
 * function that executes all the entries in particular priority
 *
 * @return {void}
 */
function executeEntries(funcs){
	// important to use for-loop
	// tickEntries grows dynamically by one of its entry
	// for example: let say we have one entry, and executing that entry might adds another entry
	// with map function we cant execute dynamically growing entries.
	for(let i = 0; i < funcs.length; i++){
		const func = funcs[i];
		func.call(func['this']);
	}
}


/**
 * @private
 * Animation frame callback function which execute the entries
 *
 * @return {void}
 */
function tickCallback(){
	const shouldContinue = onTick();
	if(shouldContinue){
		tickID = window.requestAnimationFrame(tickCallback);
	}
}

/**
 * @private
 * Starts the Semi-infinite loop to execute the functions
 * Executed when first entry is added.
 *
 * @return {void}
 */
function start() {
	if(window){
		// will receives timestamp as argument
		tickID = window.requestAnimationFrame(tickCallback);
	} else{
		tickID = setTimeout(tickCallback);
	}
}

/**
 * @private
 * Stops the Semi-infinite loop.
 * Executed after executing all the entries both in priority and wait
 *
 * @return {void}
 */
function stop() {
	tickCount = 0;
	isExecuting = false;
	resetMemory();
	if(window){
		window.cancelAnimationFrame(tickID);
	} else {
		clearTimeout(tickID);
	}
}

/**
 * @private
 * only visible to TickEntry and not accessible
 * adds the tickEntry to queue in priority order
 * if entries are empty starts the semi-infinite loop in event cycle or Animation frame
 * if execution of entries are in progress, the entry is added to waiting queue
 * thus functions are executed in the order they are added to the semi-infinite loop
 * @param {Function} func
 * @param {number} level
 * @return {void}
 */
export default function addToSemiInfiniteLoop(func, level) {
	if(isMemoryEmpty()){
		start();
	}
	if(isExecuting){
		addToSecondaryMemory(func, level);
	} else {
		addToPrimaryMemory(func, level);
	}
}
