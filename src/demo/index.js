import Ticker from './../lib';


function firstFunction (){
	console.log('first Function');
}

function secondFunction (){
	console.log('Second Function');
}

function thirdFunction (){
	console.log('Third Function');
	ticker4.executeInCycle();
}

function fourthFunction (){
	console.log('Fourth Function');

}
function fifthFunction (){
	console.log('Fifth Function');
}

function callBackFunction (){
	console.log('I am called once per frame last as callback');
}

var ticker1 = new Ticker(firstFunction, null,2);
var ticker2 = new Ticker(secondFunction);
var ticker3 = new Ticker(thirdFunction, null,1);
var ticker4 = new Ticker(fourthFunction);
var ticker5 = new Ticker(fifthFunction);


ticker3.executeInCycle();
ticker2.executeInCycle();
ticker1.executeInCycle();
ticker4.executeInCycle();
ticker5.executeInCycle();
ticker5.onDone(callBackFunction);


const array = [];
for(let i= 0 ; i < 1000; i++){
	array[i] = i;
}

let total = 0;
function forLoopCode (index){
	total = total + index;
	document.getElementById('indexLogger').innerHTML = document.getElementById('indexLogger').innerHTML +',' +index;
	document.getElementById('logger').innerHTML = total;
	return total;
}

var cbCount = 0;
function forLoopCodeCallback(executedIndex, result){
	cbCount = cbCount + 1;
	document.getElementById('loopLogger').innerHTML =  executedIndex + ' - ' + cbCount + '-' + result;
}

function doneCallback(){
	document.getElementById('loopLogger').innerHTML =  document.getElementById('loopLogger').innerHTML  + ' - ' + 'Done';
}

let loopTicker = new Ticker(forLoopCode);
loopTicker.executeAsSmallLoopsInCycle(1, 98)
	.onProgress(forLoopCodeCallback)
	.onDone(doneCallback);