!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("ticker",[],n):"object"==typeof exports?exports.ticker=n():e.ticker=n()}(window,function(){return function(e){var n={};function t(o){if(n[o])return n[o].exports;var u=n[o]={i:o,l:!1,exports:{}};return e[o].call(u.exports,u,u.exports,t),u.l=!0,u.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var u in e)t.d(o,u,function(n){return e[n]}.bind(null,u));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=3)}([function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),u=function(e){return e&&e.__esModule?e:{default:e}}(t(2));var r=function(){function e(n,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.context=n,this.listener=t,this.callback=o,this.priority=u,this.executionCount=0}return o(e,[{key:"dispose",value:function(){this.context=null,this.listener=null,this.callback=null,this.priority=null,this.executionCount=NaN}},{key:"execute",value:function(){(0,u.default)(this)}}]),e}();n.default=r,r.HIGH=0,r.NORMAL=1,r.LOW=2,r.allowedTickCount=100},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=function(e){return e&&e.__esModule?e:{default:e}}(t(0));n.default=o.default},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){d()&&window&&(u=window.requestAnimationFrame(s));if(c)l||(l=[]),l.push(e);else{var n=e.priority;r[n]||(r[n]=[]);var t=r[n];t.push(e)}};var o=function(e){return e&&e.__esModule?e:{default:e}}(t(0));var u=0,r=[null,null,null],l=null,i=0,c=!1;function a(){return++i<o.default.allowedTickCount?(function(){c=!0;for(var e=0;e<r.length;e++){var n=r[e];n&&n.length>0&&(f(n),r[e]=null)}c=!1}(),function(){var e=l?l.length:0;if(l&&e>0)for(var n=0;n<e;n++){var t=l[n],o=t.priority;r[o]||(r[o]=[]);var u=r[o];u.push(t)}l=null}(),!d()||(p(),!1)):(console.warn("Animation frame loop executed to its set limit: ",o.default.allowedTickCount),p(),!1)}function f(e){for(var n=0;n<e.length;n++){var t=e[n];t.listener.call(t.context||t.listener.this),t.callback&&t.callback.call(t.callback.this),t.executionCount++}}function d(){for(var e=0;e<r.length;e++){var n=r[e];if(n&&n.length>0)return!1}return!0}function s(){a()&&(u=window.requestAnimationFrame(s))}function p(){i=0,c=!1,r=[null,null,null],l=null,window&&window.cancelAnimationFrame(u)}},function(e,n,t){"use strict";var o=function(e){return e&&e.__esModule?e:{default:e}}(t(1));function u(){console.log("I am called once per frame last as callback")}o.default.debug=!0;var r=new o.default(window,function(){console.log("first Function")},u),l=new o.default(window,function(){console.log("Second Function")},u,1),i=new o.default(window,function(){console.log("Third Function"),c.execute()},u,2),c=new o.default(window,function(){console.log("Fourth Function"),a.execute()},null,2),a=new o.default(window,function(){console.log("Fifth Function"),c.execute()},null,1);i.execute(),l.execute(),r.execute()}])});