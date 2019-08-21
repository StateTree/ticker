# How?

## API
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