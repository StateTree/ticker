
/*
* Chainable Class
* */
export default class Notifier {
	constructor(){
		this.progressCallback;
		this.doneCallback;
		this.errorCallback;
	}
}

Notifier.prototype.onError = function(func){
	this.errorCallback = func;
	return this;
}

Notifier.prototype.onProgress = function (func){
	this.progressCallback = func;
	return this;
}

Notifier.prototype.onDone = function (func){
	this.doneCallback = func;
	return this;
}