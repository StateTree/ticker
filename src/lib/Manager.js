
let requestAnimationFrameId = NaN;
let priorityEntries = [null, null, null, null];

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
	tickEntries.map( (tickEntry , index )=> {
		tickEntry.listener.call(tickEntry.context || tickEntry.listener['this']);
		if (tickEntry.callback) {
			tickEntry.callback.call(tickEntry.callback['this']);
		}
	});
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
	const { priority } = tickEntry;
	if(!priorityEntries[priority]){
		priorityEntries[priority] = [];
	}
	const tickEntries = priorityEntries[priority];
	tickEntries.push(tickEntry); // todo: Stack or Queue
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

const singletonInstance = new TickManager();

export default singletonInstance;







