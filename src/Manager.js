import TickEntry from './TickEntry';

let instance = null;
let requestAnimationFrameId = NaN;
let tickEntries = null;

function onTick(entries){
	if(entries.length > 0) {
		entries.map( (tickEntry )=> {
			tickEntry.listener.call(tickEntry.context);
		});
		//Clear them once executed
		entries = [];
	}
}

function requestAnimationFrameCallback(){
	onTick(tickEntries);
	requestAnimationFrameId = window.requestAnimationFrame(requestAnimationFrameCallback);
}

export default class TickManager{
	constructor(){
		if(!instance){
			instance = this;
			//callLater entries
			tickEntries = [];

			// gets updated 
			requestAnimationFrameId = 0; // for Windows Env

			this.start();
		}
		return instance;
	}
}


TickManager.prototype.requestDisposableCallLater = function (context,listener) {
	var tickEntry = new TickEntry(context,listener);
	tickEntries.push(tickEntry); // todo: Stack or Queue
	return tickEntry.disposableCallLater;
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







