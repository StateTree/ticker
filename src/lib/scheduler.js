import memory from './memory';


function scheduler(maxLoop){
	let tickID = 0;// for Browser Env
	let tickCount = 0; // to avoid infinite loop issue, we need to count
	let allowedTickCount = maxLoop ? maxLoop : 100;

	function executeEntries(funcs){
		// important to use for-loop
		// tickEntries grows dynamically by one of its entry
		// for example: let say we have one entry, and executing that entry might adds another entry
		// with map function we cant execute dynamically growing entries.
		for(let i = 0; i < funcs.length; i++){
			const func = funcs[i];
			func.call(func['this']);
		}
	}


	/**
	* @private (Core algorithm)
  * caller: Animation Frame | event cycle Callback
	*
	* Executes entries in animation frame / event cycle callback
	* First execute the entries in the priority order
	* Entries which are added to Wait queue while executing priority entries are moved for execution in next animation frame
  * If there are no entries in priority, semi-infinite loop is stopped
	*
	* @return {void}
	*/
	function tickCallback(){
		tickCount++;
		if(tickCount < allowedTickCount){
			const isCompleted = memory.readAndExecute(executeEntries);
			if(!isCompleted){
				start() // will execute in next animation Frame
			} else {
				stop()
			}
		} else {
			console.warn('Animation frame loop executed to its set limit: ', allowedTickCount);
			stop()
		}
	}

	/**
	* @private
	* Starts the Semi-infinite loop to execute the functions
	* get started when first entry is added.
	*
	* @return {void}
	*/
	function start() {
		if(window){
			// will receives timestamp as argument
			tickID = window.requestAnimationFrame(tickCallback);
		} else{
			tickID = setTimeout(tickCallback);
		}
	}

	/**
	* @private
	* Stops the Semi-infinite loop.
	* Get stopped after executing all the entries both in priority and wait
	* Also get stopped when executed more in animation loop
	* @return {void}
	*/
	function stop() {
		tickCount = 0;
		memory.reset();
		if(window){
			window.cancelAnimationFrame(tickID);
		} else {
			clearTimeout(tickID);
		}
	}

	/**
	* @private
	* only visible to TickEntry and not accessible
	* adds the tickEntry to queue in priority order
	* if entries are empty starts the semi-infinite loop in event cycle or Animation frame
	* if execution of entries are in progress, the entry is added to waiting queue
	* thus functions are executed in the order they are added to the semi-infinite loop
	* @param {Function} func
	* @param {number} level
	* @return {void}
	*/
	return function (func, level) {
		if(memory.isMemoryEmpty()){
			start();
		}
		memory.add(func, level);
	}
}

export const addToSemiInfiniteLoop = scheduler();
