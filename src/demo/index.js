import Ticker from "./../lib";

function callLaterFunction (){
    console.log("I cam called once per frame");
}
var ticker = new Ticker(window,callLaterFunction);

ticker.callLater();