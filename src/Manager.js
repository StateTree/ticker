let instance = null;

function onTick(entries){
	if(entries.length > 0) {
		entries.map( (tickEntry )=> {
			tickEntry.listener.call(tickEntry.context);
			tickEntry.dispose();
			//todo: Investigate setting tickEntry = null
		});
		//Clear them once executed
		entries = [];
	}
}

export default class TickManager{
	constructor(){
		if(!instance){
			instance = this;
			//callLater entries
			this._entries= [];

			// gets updated 
			this._tickId = 0; // for Windows Env

			this.start();
		}
		return instance;
	}
}

TickManager.prototype.addEntry = function (tickEntry) {
	//todo add a util function to avoid duplicate addition
	this._entries.push(tickEntry);
};


// Todo: Support for NodeJS 
TickManager.prototype.start = function () {
	if(window){
		var requestAnimationFrameCallback = (timeStamp) => {
			onTick(this._entries);
			this._tickId = window.requestAnimationFrame(requestAnimationFrameCallback)
		};
		this._tickId = window.requestAnimationFrame(requestAnimationFrameCallback);
	}
};


TickManager.prototype.stop = function () {
	if(window){
		window.cancelAnimationFrame(this._tickId);
	}
};







