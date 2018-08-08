import Ticker from "./../lib";


/*function firstFunction (){
    console.log("first Function");
}

function secondFunction (){
	console.log("Second Function");
}

function thirdFunction (){
	console.log("Third Function");
	ticker4.executeInCycle();
}

function fourthFunction (){
	console.log("Fourth Function");
	ticker5.executeInCycle();

}
function fifthFunction (){
	console.log("Fifth Function");
	ticker4.executeInCycle();// to test infinite loop detection
}

function callBackFunction (){
	console.log("I am called once per frame last as callback");
}

var ticker1 = new Ticker(window, firstFunction, 0, callBackFunction);
var ticker2 = new Ticker(window, secondFunction, 1, callBackFunction );
var ticker3 = new Ticker(window, thirdFunction, 2, callBackFunction);
var ticker4 = new Ticker(window, fourthFunction, 2);
var ticker5 = new Ticker(window, fifthFunction, 1);

ticker3.executeInCycle();
ticker2.executeInCycle();
ticker1.executeInCycle();*/


const array = [];
for(let i= 0 ; i < 100; i++){
	array[i] = i;
};

function forLoopCode (index){
	console.log("forLoopCode: ", array[index]);
}

function forLoopCodeCallback(executedIndex){
	console.log("Executed Index: ", executedIndex);
}

let loopTicker = new Ticker(window, forLoopCode, 0, forLoopCodeCallback);
loopTicker.executeAsSmallLoopsInCycle(10, 100);