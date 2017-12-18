import Ticker from "./../lib";

function callLaterFunction (){
    console.log("I am called once per frame");
}

function callBackFunction (){
	console.log("I am callback called after");
}

function callLaterLastFunction (){
	console.log("I cam called once per frame last");
}

var ticker1 = new Ticker(window, callLaterFunction, callBackFunction);
var ticker2 = new Ticker(window, callLaterLastFunction, callBackFunction);

ticker2.executeLast();
ticker1.execute();