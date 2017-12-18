import Ticker from "./../lib";

function firstFunction (){
    console.log("first Function");
}

function secondFunction (){
	console.log("Second Function");
}

function thirdFunction (){
	console.log("Third Function");
}

function fourthFunction (){
	console.log("Fourth Function");
}

function callBackFunction (){
	console.log("I am called once per frame last as callback");
}

var ticker1 = new Ticker(window, firstFunction, callBackFunction);
var ticker2 = new Ticker(window, secondFunction, callBackFunction , 1);
var ticker3 = new Ticker(window, thirdFunction, callBackFunction , 2);
var ticker4 = new Ticker(window, fourthFunction, callBackFunction , 3);

ticker4.execute();
ticker3.execute();
ticker2.execute();
ticker1.execute();