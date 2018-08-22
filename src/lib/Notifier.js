export default class Notifier {
	constructor(){
		this.progressCallback;
		this.doneCallback;
		this.errorCallback;
	}

	error(func){
		this.errorCallback = func;
		return this;
	}

	progress(func){
		this.progressCallback = func;
		return this;
	}
	done(func){
		this.doneCallback = func;
	}
}