import TickEntry from './TickEntry';

let tickID = 0;// for Windows Env
//[0-HIGH, 1-NORMAL, 2-LOW]
let priorityEntries = [null, null, null];
let waitEntries = null;

let tickCount = 0;
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

	if(TickEntry.allowedTickCount !== undefined){
		if(tickCount < TickEntry.allowedTickCount){
			return coreAlogorithm();
		 } else {
			console.warn("Animation frame loop executed to its set limit: ", TickEntry.allowedTickCount);
			stopSemiInfiniteLoop();
			return false;
		}
	} else {
		return coreAlogorithm();
	}
	return true;
}

function coreAlogorithm(){
	executePriorityEntries();
	moveWaitingEntriesForExecution();
	if(arePriorityEntriesEmpty()){
		stopSemiInfiniteLoop();
		return false;
	}
	return true;
}

/**
 * @private
 * function that executes the entries in each priority
 *
 * @return {void}
 */
function executePriorityEntries(){
	isExecuting = true;
	for(let index = 0 ; index < priorityEntries.length; index++){
		let tickEntries = priorityEntries[index];
		if(tickEntries && tickEntries.length > 0) {
			executeTickEntries(tickEntries);
			//Clear them once executed
			priorityEntries[index] = null;
		}
	}
	isExecuting = false;
}

/**
 * @private
 * function that executes all the entries in particular priority
 *
 * @return {void}
 */
function executeTickEntries(tickEntries){
	// important to use for-loop
	// tickEntries grows dynamically by one of its entry
	// for example: let say we have one entry, and executing that entry might adds another entry
	// with map function we cant execute dynamically growing entries.
	for(let i = 0; i < tickEntries.length; i++){
		const tickEntry = tickEntries[i];
		tickEntry.func.call(tickEntry.context || tickEntry.func['this']);
		tickEntry.executionCount++;
		if (tickEntry.callback) {
			tickEntry.callback.call(tickEntry.context || tickEntry.callback['this']);
		}

	}
}

function moveWaitingEntriesForExecution(){
	const entriesCount = waitEntries ?  waitEntries.length : 0;
	if(waitEntries && entriesCount > 0) {
		for(let index = 0 ; index < entriesCount; index++){
			let tickEntry = waitEntries[index];
			const { priority } = tickEntry;
			if(!priorityEntries[priority]){
				priorityEntries[priority] = [];
			}
			const tickEntries = priorityEntries[priority];
			tickEntries.push(tickEntry);
		}
	}
	waitEntries = null;
}

function arePriorityEntriesEmpty(){
	for(let index = 0 ; index < priorityEntries.length; index++){
		let tickEntries = priorityEntries[index];
		if(tickEntries && tickEntries.length > 0) {
			return false
		}
	}
	return true;
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
function startSemiInfiniteLoop() {
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
function stopSemiInfiniteLoop() {
	tickCount = 0;
	isExecuting = false;
	priorityEntries = [null, null, null];
	waitEntries = null;
	if(window){
		window.cancelAnimationFrame(tickID);
	} else {
		clearTimeout(tickID);
	}
};

/**
 * @private
 * only visible to TickEntry and not accessible
 * adds the tickEntry to queue in priority order
 * if entries are empty starts the semi-infinite loop in event cycle or Animation frame
 * if execution of entries are in progress, the entry is added to waiting queue
 * thus functions are executed in the order they are added to the semi-infinite loop
 * @param {Object} tickEntry
 * @return {void}
 */
export default function addToSemiInfiniteLoop(tickEntry) {
	if(arePriorityEntriesEmpty()){
		startSemiInfiniteLoop()
	}
	if(isExecuting){
		if(!waitEntries){
			waitEntries = [];
		}
		waitEntries.push(tickEntry);
	} else {
		const { priority } = tickEntry;
		if(!priorityEntries[priority]){
			priorityEntries[priority] = [];
		}
		const tickEntries = priorityEntries[priority];
		tickEntries.push(tickEntry);
	}

};







