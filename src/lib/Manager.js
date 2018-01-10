import TickEntry from './TickEntry';
let requestAnimationFrameId = 0;// for Windows Env

//[0-HIGH, 1-NORMAL, 2-LOW]
let priorityEntries = [null, null, null];
let waitEntries = null;

let tickCount = 0;
let isExecuting = false;

function onTick(){
	tickCount++;
	if(TickEntry.debug){
		console.log("Tick count: ", tickCount);
	}
	if(tickCount < TickEntry.allowedTickCount){
		executePriorityEntries();
		moveWaitingEntriesForExecution();
		if(arePriorityEntriesEmpty()){
			stop();
			return false;
		}
	} else {
		console.warn("Animation frame loop executed to its set limit: ", TickEntry.allowedTickCount);
		if(TickEntry.debug){
			console.log("Entries: ", priorityEntries[0],priorityEntries[1],priorityEntries[2],waitEntries);
		}
		reset();
		return false;
	}
	return true;

}


function stop(){
	tickCount = 0;
	isExecuting = false;
	tickManager.stop();
}

function reset(){
	stop();
	priorityEntries = [null, null, null];
	waitEntries = null;
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

function executeTickEntries(tickEntries){
	// important to use for-loop
	// tickEntries grows dynamically by one of its entry
	// for example: let say we have one entry, and executing that entry might adds another entry
	// with map function we cant execute dynamically growing entries.
	for(let i = 0; i < tickEntries.length; i++){
		const tickEntry = tickEntries[i];
		tickEntry.recursionCount++;
		tickEntry.listener.call(tickEntry.context || tickEntry.listener['this']);
		tickEntry.recursionCount--;
		if (tickEntry.callback) {
			tickEntry.callback.call(tickEntry.callback['this']);
		}
		tickEntry.executionCount++;
		if(TickEntry.debug && tickEntry.executionCount > 1){
			console.log("Executed more than once: ", tickEntry);
		}
	}
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

function requestAnimationFrameCallback(){
	const shouldContinue = onTick();
	if(shouldContinue){
		requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
}

class TickManager {
	constructor(){
	}
}

TickManager.prototype.add = function (tickEntry) {
	if(arePriorityEntriesEmpty()){
		this.start()
	}
	if(isExecuting){
		console.log("Added to Wait entries");
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


// Todo: Support for NodeJS 
TickManager.prototype.start = function () {
	if(window){
		// will receives timestamp as argument
		requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
};


TickManager.prototype.stop = function () {
	if(window){
		console.log('cancelAnimationFrame', requestAnimationFrameId);
	}
};

const tickManager = new TickManager();

// singletonInstanace
export default tickManager;







