import Ticker from "./../lib";
Ticker.debug = true;
function firstFunction (){
    console.log("first Function");
}

function secondFunction (){
	console.log("Second Function");
}

function thirdFunction (){
	console.log("Third Function");
	ticker4.execute();
}

function fourthFunction (){
	console.log("Fourth Function");
	ticker5.execute();

}
function fifthFunction (){
	console.log("Fifth Function");
	ticker4.execute();// to test infinite loop detection
}

function callBackFunction (){
	console.log("I am called once per frame last as callback");
}

var ticker1 = new Ticker(window, firstFunction, callBackFunction);
var ticker2 = new Ticker(window, secondFunction, callBackFunction , 1);
var ticker3 = new Ticker(window, thirdFunction, callBackFunction , 2);
var ticker4 = new Ticker(window, fourthFunction, null, 2);
var ticker5 = new Ticker(window, fifthFunction, null, 1);

ticker3.execute();
ticker2.execute();
ticker1.execute();