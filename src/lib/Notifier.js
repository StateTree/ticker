
/*
* Chainable Class
* */
export default class Notifier {
	constructor(){
		this.progressCallback;
		this.doneCallback;
		this.errorCallback;
	}

	onError(func){
		this.errorCallback = func;
		return this;
	}

	onProgress(func){
		this.progressCallback = func;
		return this;
	}

	onDone(func){
		this.doneCallback = func;
		return this;
	}
}