!function(n,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("ticker",[],e):"object"==typeof exports?exports.ticker=e():n.ticker=e()}(window,function(){return function(n){var e={};function t(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return n[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=n,t.c=e,t.d=function(n,e,o){t.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:o})},t.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},t.t=function(n,e){if(1&e&&(n=t(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var r in n)t.d(o,r,function(e){return n[e]}.bind(null,r));return o},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},t.p="",t(t.s=1)}([function(n,e,t){"use strict";t.r(e);var o=function(){var n=[null,null,null],e=null,t=!1;function o(e,t){n[t]||(n[t]=[]),n[t].push(e)}function r(e,t){var o=n[t];o&&o.length>0&&(e(o),n[t]=null)}return{readAndExecute:function(i){return t=!0,function(e){for(var t=n.length,o=0;o<t;o++)r(e,o)}(i),t=!1,function(){var n=e?e.length:0;if(n>0)for(var t=0;t<n;t++){var r=e[t];o(r.func,r.level)}return e=null,0==n}()},reset:function(){t=!1,n=[null,null,null],e=[]},add:function(n,r){t?function(n,t){e||(e=[]),e.push({func:n,level:t})}(n,r):o(n,r)},isMemoryEmpty:function(){for(var e=n.length,t=0;t<e;t++){var o=n[t];if(o&&o.length>0)return!1}return!0}}}();var r=function(n){var e=0,t=0,r=n||100;function i(n){for(var e=0;e<n.length;e++){var t=n[e];t.call(t.this)}}function u(){++t<r?o.readAndExecute(i)?l():c():(console.warn("Animation frame loop executed to its set limit: ",r),l())}function c(){e=window?window.requestAnimationFrame(u):setTimeout(u)}function l(){t=0,o.reset(),window?window.cancelAnimationFrame(e):clearTimeout(e)}return function(n,e){o.isMemoryEmpty()&&c(),o.add(n,e)}}();var i=function n(){!function(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),this.progressCallback,this.doneCallback,this.errorCallback};i.prototype.onError=function(n){return this.errorCallback=n,this},i.prototype.onProgress=function(n){return this.progressCallback=n,this},i.prototype.onDone=function(n){return this.doneCallback=n,this};var u="Maximum Loop Per Frame has to be a number",c="Start Index has to be a number",l="End Index has to be a number";function a(n,e){for(var t=0;t<e.length;t++){var o=e[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(n,o.key,o)}}function f(n){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}function s(n){if(!n)throw new Error("Ticker: instance can't be null");if(!(n instanceof d)){var e=n.constructor?n.constructor.name:f(n);throw new Error("Ticker: Expecting instance of TickEntry got ".concat(e))}if(!n.func)throw new Error("Ticker: function can't be undefined")}var d=function(){function n(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;!function(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),this.context=t,this.func=e,this.priority=o,this.executionCount=0,this.notifier=new i,s(this)}var e,t,o;return e=n,(t=[{key:"onDone",value:function(n){return this.notifier.doneCallback=n,this.notifier}},{key:"onError",value:function(n){return this.notifier.errorCallback=n,this.notifier}},{key:"dispose",value:function(){this.context=null,this.func=null,this.priority=null,this.executionCount=NaN,this.notifier=null}},{key:"executeInCycle",value:function(){s(this);var n=this,e=n.func,t=n.context,o=n.priority;return r(function(){var o=n.notifier,r=o.doneCallback,i=o.errorCallback;try{var u=e.call(t||e.this);n.executionCount++,r&&r.call(t||r.this,u)}catch(e){i&&i.call(t||i.this,e),n.dispose()}},o),this.notifier.onProgress=void 0,this.notifier}},{key:"executeAsSmallLoopsInCycle",value:function(n,e){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if(void 0===n||"number"!=typeof n)throw new Error(u);if(void 0===e||"number"!=typeof e)throw new Error(l);if("number"!=typeof t)throw new Error(c);s(this);var o=this,i=o.func,a=o.context,f=o.priority,d=n,y=t;return r(function t(){for(var u,c=o.notifier,l=c.doneCallback,s=c.errorCallback,h=c.progressCallback;y<d;y++)try{u=i.call(a||i.this,y)}catch(n){return s&&s.call(a||s.this,n),void o.dispose()}d<e?(d+=n,h&&h.call(a||h.this,y,u),r(t,f)):y===e&&(o.executionCount++,l&&l.call(a||l.this,u))},f),this.notifier}}])&&a(e.prototype,t),o&&a(e,o),n}();d.HIGH=0,d.NORMAL=1,d.LOW=2,d.allowedTickCount=100;e.default=d},function(n,e,t){"use strict";t.r(e);var o=t(0);var r=new o.default(function(){console.log("first Function")},null,2),i=new o.default(function(){console.log("Second Function")}),u=new o.default(function(){console.log("Third Function"),c.executeInCycle()},null,1),c=new o.default(function(){console.log("Fourth Function")}),l=new o.default(function(){console.log("Fifth Function")});u.executeInCycle(),i.executeInCycle(),r.executeInCycle(),c.executeInCycle(),l.executeInCycle(),l.onDone(function(){console.log("I am called once per frame last as callback")});for(var a=[],f=0;f<1e3;f++)a[f]=f;var s=0;var d=0;new o.default(function(n){return s+=n,document.getElementById("indexLogger").innerHTML=document.getElementById("indexLogger").innerHTML+","+n,document.getElementById("logger").innerHTML=s,s}).executeAsSmallLoopsInCycle(1,98).onProgress(function(n,e){d+=1,document.getElementById("loopLogger").innerHTML=n+" - "+d+"-"+e}).onDone(function(){document.getElementById("loopLogger").innerHTML=document.getElementById("loopLogger").innerHTML+" - Done"})}])});