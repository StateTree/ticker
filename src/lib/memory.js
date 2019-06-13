function Memory(){
	//[0-HIGH, 1-NORMAL, 2-LOW]
	let priorityEntries = [null, null, null];
	let waitEntries = null;
	let isBusy = false;

	function reset(){
		isBusy = false;
		priorityEntries = [null, null, null];
		waitEntries = [];
	}

	function isMemoryEmpty() {
		const levels = priorityEntries.length;
		for (let i = 0; i < levels; i++) {
			let entries = priorityEntries[i];
			if (entries && entries.length > 0) {
				return false;
			}
		}
		return true;
	}

	function addToPrimary(func, level){
		if(!priorityEntries[level]){
			priorityEntries[level] = [];
		}
		const functions = priorityEntries[level];
		functions.push(func);
	}

	function addToSecondary(func, level){
		if(!waitEntries){
			waitEntries = [];
		}
		waitEntries.push({
			func,
			level
		});
	}

	function readInLevel(execute,level){
		let entries = priorityEntries[level];
		if(entries && entries.length > 0) {
			execute(entries);
			//Clear them once executed
			priorityEntries[level] = null;
		}
	}


	function read(execute){
		const levels = priorityEntries.length;
		for(let level = 0 ; level < levels; level++){
			readInLevel(execute,level);
		}
	}

	function move(){
		const entriesCount = waitEntries ? waitEntries.length : 0;
		if(entriesCount > 0) {
			for(let index = 0 ; index < entriesCount; index++){
				let waitEntry = waitEntries[index];
				const {func, level} = waitEntry;
				addToPrimary(func, level);
			}
		}
		waitEntries = null;
		return entriesCount == 0;

	}

	function readAndExecute(execute){
		isBusy = true;
		read(execute); // execute and wipes primary memory
		isBusy = false;
		return move(); // move from sec to pri for next round and returns false, if entries are left in pri after move
	}

	function add(func,level){
		if(isBusy){
			addToSecondary(func, level);
		} else {
			addToPrimary(func, level);
		}
	}

	return {
		readAndExecute,
		reset,
		add,
		isMemoryEmpty
	}
};

// Singleton Instance
const memory = Memory();

export default memory;
