//[0-HIGH, 1-NORMAL, 2-LOW]
let priorityEntries = [null, null, null];
let waitEntries = null;

export function isMemoryEmpty(){
	const levels = priorityEntries.length;
	for(let i = 0 ; i < levels; i++){
		let entries = priorityEntries[i];
		if(entries && entries.length > 0) {
			return false;
		}
	}
	return true;
}

function readLevel(execute,level){
	let entries = priorityEntries[level];
	if(entries && entries.length > 0) {
		execute(entries);
		//Clear them once executed
		priorityEntries[level] = null;
	}
}
export function readPrimaryMemory(execute){
	const levels = priorityEntries.length;
	for(let level = 0 ; level < levels; level++){
		readLevel(execute,level);
	}
}

export function resetMemory(){
	priorityEntries = [null, null, null];
	waitEntries = [];
}

export function addToPrimaryMemory(func, level){
	if(!priorityEntries[level]){
		priorityEntries[level] = [];
	}
	const functions = priorityEntries[level];
	functions.push(func);
}

export function addToSecondaryMemory(func, level){
  if(!waitEntries){
    waitEntries = [];
  }
	waitEntries.push({
		func,
		level
	});
}

export function moveFromSecondaryToPrimary(){
	const entriesCount = waitEntries ? waitEntries.length : 0;
	if(waitEntries && entriesCount > 0) {
		for(let index = 0 ; index < entriesCount; index++){
			let waitEntry = waitEntries[index];
			const {func, level} = waitEntry;
			addToPrimaryMemory(func, level);
		}
	}
	waitEntries = null;
}