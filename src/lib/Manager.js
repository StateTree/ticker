
let requestAnimationFrameId = NaN;
let tickEntries = null;
let callLastEntries = null;


function onTick(){
	if(tickEntries && tickEntries.length > 0) {
        tickEntries.map( (tickEntry )=> {
			tickEntry.listener.call(tickEntry.context || tickEntry.listener['this']);
		});

		//Clear them once executed
        tickEntries = null;
	}

    if(callLastEntries && callLastEntries.length > 0) {
        callLastEntries.map( (tickEntry )=> {
            tickEntry.listener.call(tickEntry.context || tickEntry.listener['this']);
        });

        //Clear them once executed
        callLastEntries = null;
    }
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


TickManager.prototype.add = function (tickEntry, callLast) {
	if (callLast) {
        if(!callLastEntries){
            callLastEntries = [];
        }
        callLastEntries.push(tickEntry); // todo: Stack or Queue
	} else {
        if(!tickEntries){
            tickEntries = [];
        }
        tickEntries.push(tickEntry); // todo: Stack or Queue
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

const singletonInstance = new TickManager();

export default singletonInstance;







