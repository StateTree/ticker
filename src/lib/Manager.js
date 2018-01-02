
let requestAnimationFrameId = NaN;
const priorityEntries = [null, null, null, null];

function onTick(){
	for(let index = 0 ; index < priorityEntries.length; index++){
		let tickEntries = priorityEntries[index];
		if(tickEntries && tickEntries.length > 0) {
			executeTickEntries(tickEntries);
			//Clear them once executed
			priorityEntries[index] = null;
		}
	}
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
	}
}

function isAddedAlready(entry,tickEntries){
	// important to use for-loop
	// tickEntries grows dynamically by one of its entry
	// for example: let say we have one entry, and executing that entry might adds another entry
	// with map function we cant execute dynamically growing entries.
	for(let i = 0; i < tickEntries.length; i++){
		const tickEntry = tickEntries[i];
		if(entry.context === tickEntry.context && entry.listener === tickEntry.listener){
			return true;
		}
	}
	return false;
}

function requestAnimationFrameCallback(){
	onTick();
	requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
}

class TickManager {
	constructor(){
        requestAnimationFrameId = 0; // for Windows Env
        this.start();
	}
}


TickManager.prototype.add = function (tickEntry) {
	const { priority, callback, ignoreIfAdded } = tickEntry;
	if(!priorityEntries[priority]){
		priorityEntries[priority] = [];
		const tickEntries = priorityEntries[priority];
		tickEntries.push(tickEntry);
		return;
	}
	const tickEntries = priorityEntries[priority];
	if(ignoreIfAdded && isAddedAlready(tickEntry,tickEntries)){
		callback && callback(true);
	} else {
		tickEntries.push(tickEntry);
	}
};


// Todo: Support for NodeJS 
TickManager.prototype.start = function () {
	if(window){
		// will receives timestamp as argument
		//todo: Learn:  the purpose of timestamp
		requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
};


TickManager.prototype.stop = function () {
	if(window){
		window.cancelAnimationFrame(requestAnimationFrameId);
	}
};

TickManager.prototype.getMaxPriority = function () {
	return priorityEntries.length - 1;
};

const singletonInstance = new TickManager();

export default singletonInstance;







