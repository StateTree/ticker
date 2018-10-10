# Ticker
[![NPM version](https://img.shields.io/npm/v/ticker.svg?style=flat-square)](https://www.npmjs.com/package/ticker)
[![Build](https://travis-ci.com/StateTree/ticker.svg?branch=master)](https://travis-ci.org/StateTree/ticker)
[![codecov.io](https://codecov.io/github/StateTree/ticker/coverage.svg?branch=master)](https://codecov.io/github/StateTree/ticker?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Download

### npm
```
npm install --save @statetree/ticker
```


## What?
* Executes Functions later in animation frame / event cycle callback
* call later: wrapper to request animation frame callback or event cycle, perks are being adding priorty order

## Why?
* Cost effective Function can be broken into smaller functions and executed later
* Loops can be broken down to smaller loops with out holding execution resources.


## How?

### executeInCycle

```
import Ticker from '@statetree/ticker';

// function to execute later
function callMeLater() {
    return "called later";
}

// excutes right after call me later function (optional)
function callback(result) {
    // consumer of this library can decide what they want to do
}

// create the ticker object
var ticker1 = new Ticker(callMeLater);

// add to execute later in animation frame callback or Event cycle callback
ticker1.executeInCycle().onDone(callback);
or
ticker1..onDone(callback);
ticker1.executeInCycle()

```

### executeAsSmallLoopsInCycle

```
import Ticker from '@statetree/ticker';

const array = [];
for(let i= 0 ; i < 100; i++){
	array[i] = i;
};

function forLoopCode (index, result = 0){
	const sum = result + array[index];
	return sum;
}
let loopTicker = new Ticker( forLoopCode);
loopTicker.executeAsSmallLoopsInCycle(10, 100)
.onProgress(function (executedIndex, result){
    //
 })
 .onDone(function (result){
    //
 })
 .onError(function (error){
     console.log(error);
  })

```
### dispose

```
import Ticker from '@statetree/ticker';

ticker.dispose();
```

### Core Algorithm
 * Entry added to priority Stack
    1. If first Entry starts the semi-infinite loop
    2. if priority order stack entries are executing, entry added to wait stack
 * Executes the entries in the priority order
 * Added wait entries are moved to priority entries for execution
 * If there are no entries in priority, semi-infinite loop is stopped
 * and return boolean flag to remove the callback from animation frame or event cycle.

