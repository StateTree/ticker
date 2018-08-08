# Ticker

### What?
* Executes Functions later in animation frame / event cycle callback
* call later: wrapper to request animation frame callback or event cycle, perks are being adding priorty order

### Why?
* Cost effective Function can be broken into smaller functions and executed later
* Loops can be broken down to smaller loops with out holding execution resources.

### How?
```
import Ticker from 'ticker';

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
### Core Algorithm
 * Entry added to priority Stack
    1. If first Entry starts the semi-infinite loop
    2. if priority order stack entries are executing, entry added to wait stack
 * Executes the entries in the priority order
 * Added wait entries are moved to priority entries for execution
 * If there are no entries in priority, semi-infinite loop is stopped
 * and return boolean flag to remove the callback from animation frame or event cycle.

