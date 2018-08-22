# Ticker
[![Build Status](https://travis-ci.com/StateTree/ticker.svg?branch=master)](https://travis-ci.com/StateTree/ticker)
[![Code Coverage](https://codecov.io/gh/StateTree/ticker/branch/master/graph/badge.svg)](https://codecov.io/gh/StateTree/ticker/branch/master/graph/badge.svg)


### What?
* Executes Functions later in animation frame / event cycle callback
* call later: wrapper to request animation frame callback or event cycle, perks are being adding priorty order

### Why?
* Cost effective Function can be broken into smaller functions and executed later
* Loops can be broken down to smaller loops with out holding execution resources.

### How?

##### executeInCycle

```
import Ticker from '@statetree/ticker';

// function to execute later
function callMeLater() {
    return "called later";
}

// excutes right after call me later function (optional)
function callback() {
    // consumer of this library can decide what they want to do
    ticker2.dispose();
}

// create the ticker object
var ticker1 = new Ticker(this, callMeLater, 1);
var ticker2 = new Ticker(this, callMeLater, 0 , callback);

// add to execute later in animation frame callback or Event cycle callback
ticker1.executeInCycle()
```

##### executeAsSmallLoopsInCycle

```
import Ticker from '@statetree/ticker';

const array = [];
for(let i= 0 ; i < 100; i++){
	array[i] = i;
};

function forLoopCode (index){
	console.log("forLoopCode: ", array[index]);
}
```
##### Way 1:
```
let loopTicker = new Ticker(window, forLoopCode, 0);
loopTicker.executeAsSmallLoopsInCycle(10, 100)
.progress(function (executedIndex){
    console.log("called 9 times ", executedIndex);
 })
 .done(function (){
    console.log("Called 1 time last ");
 })
 .error(function (error){
     console.log(error);
  })

```

##### Way 2:
```
function forLoopCodeDoneCallback(){
	console.log("Called once last ");
}

let loopTicker = new Ticker(window, forLoopCode, 0, forLoopCodeDoneCallback);
loopTicker.executeAsSmallLoopsInCycle(10, 100);
```

##### dispose

```
import Ticker from '@statetree/ticker';

// function to execute later
function callMeLater() {
    return "called later";
}

function callback() {
    ticker.dispose();
}

// create the ticker object
var ticker = new Ticker(this, callMeLater, 0 , callback);

// add to execute later in animation frame callback or Event cycle callback
ticker.executeInCycle()
```

### Core Algorithm
 * Entry added to priority Stack
    1. If first Entry starts the semi-infinite loop
    2. if priority order stack entries are executing, entry added to wait stack
 * Executes the entries in the priority order
 * Added wait entries are moved to priority entries for execution
 * If there are no entries in priority, semi-infinite loop is stopped
 * and return boolean flag to remove the callback from animation frame or event cycle.

