!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Zooom=e():t.Zooom=e()}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=28)}([function(t,e,n){(function(e){var n=function(t){return t&&t.Math==Math&&t};t.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof e&&e)||Function("return this")()}).call(this,n(31))},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var o=n(1);t.exports=!o((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},function(t,e,n){var o=n(4),r=n(9),i=n(6);t.exports=o?function(t,e,n){return r.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){var o=n(33),r=n(14);t.exports=function(t){return o(r(t))}},function(t,e,n){var o=n(2);t.exports=function(t,e){if(!o(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!o(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!o(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!o(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){var o=n(4),r=n(15),i=n(16),c=n(8),u=Object.defineProperty;e.f=o?u:function(t,e,n){if(i(t),e=c(e,!0),i(n),r)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var o=n(0),r=n(5);t.exports=function(t,e){try{r(o,t,e)}catch(n){o[t]=e}return e}},function(t,e,n){var o=n(0),r=n(19),i=n(3),c=n(20),u=n(26),a=n(53),f=r("wks"),s=o.Symbol,l=a?s:s&&s.withoutSetter||c;t.exports=function(t){return i(f,t)||(u&&i(s,t)?f[t]=s[t]:f[t]=l("Symbol."+t)),f[t]}},function(t,e,n){var o=n(4),r=n(32),i=n(6),c=n(7),u=n(8),a=n(3),f=n(15),s=Object.getOwnPropertyDescriptor;e.f=o?s:function(t,e){if(t=c(t),e=u(e,!0),f)try{return s(t,e)}catch(t){}if(a(t,e))return i(!r.f.call(t,e),t[e])}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){t.exports=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t}},function(t,e,n){var o=n(4),r=n(1),i=n(34);t.exports=!o&&!r((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},function(t,e,n){var o=n(2);t.exports=function(t){if(!o(t))throw TypeError(String(t)+" is not an object");return t}},function(t,e,n){var o=n(18),r=Function.toString;"function"!=typeof o.inspectSource&&(o.inspectSource=function(t){return r.call(t)}),t.exports=o.inspectSource},function(t,e,n){var o=n(0),r=n(10),i=o["__core-js_shared__"]||r("__core-js_shared__",{});t.exports=i},function(t,e,n){var o=n(39),r=n(18);(t.exports=function(t,e){return r[t]||(r[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.6.5",mode:o?"pure":"global",copyright:"© 2020 Denis Pushkarev (zloirock.ru)"})},function(t,e){var n=0,o=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++n+o).toString(36)}},function(t,e){t.exports={}},function(t,e,n){var o=n(42),r=n(0),i=function(t){return"function"==typeof t?t:void 0};t.exports=function(t,e){return arguments.length<2?i(o[t])||i(r[t]):o[t]&&o[t][e]||r[t]&&r[t][e]}},function(t,e,n){var o=n(24),r=Math.min;t.exports=function(t){return t>0?r(o(t),9007199254740991):0}},function(t,e){var n=Math.ceil,o=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?o:n)(t)}},function(t,e,n){var o=n(13);t.exports=Array.isArray||function(t){return"Array"==o(t)}},function(t,e,n){var o=n(1);t.exports=!!Object.getOwnPropertySymbols&&!o((function(){return!String(Symbol())}))},function(t,e,n){var o,r,i=n(0),c=n(55),u=i.process,a=u&&u.versions,f=a&&a.v8;f?r=(o=f.split("."))[0]+o[1]:c&&(!(o=c.match(/Edge\/(\d+)/))||o[1]>=74)&&(o=c.match(/Chrome\/(\d+)/))&&(r=o[1]),t.exports=r&&+r},function(t,e,n){"use strict";n.r(e);n(29);function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var r=function(){function t(e){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.element=e.element,this.padding=e.padding||80,this.img="zooom-img",this.overlay="zooom-overlay",this.animationTiem=e.animationTiem||300,void 0===e.overlay)this.color="#fff",this.opacity="1";else{var n=e.overlay,o=n.color,r=n.opacity;this.color=o,this.opacity=r}this.createZoomStyle(),this.overlayAdd(),this.addEventImageInit()}var e,n,r;return e=t,(n=[{key:"addEventImageInit",value:function(){for(var t=this,e=document.getElementById(this.overlay),n=document.querySelectorAll(".".concat(this.element)),o=0;o<n.length;o++)n[o].addEventListener("click",(function(n){n.preventDefault(),t.imageZooom=n.currentTarget,t.zooomInit(e)}));e.addEventListener("click",(function(){var e=document.querySelector(".".concat(t.img));t.removeImageStyle(e)}))}},{key:"createZoomStyle",value:function(){var t=document.createElement("style");t.innerHTML=".".concat(this.element,"{cursor:zoom-in};@-webkit-keyframes zooom-fade{0% {opacity:0}} @keyframes zooom-fade{0%{opacity:0}}.zooom-img{position:relative;z-index: 2;cursor: zoom-out;transition: all ").concat(this.animationTiem,"ms}#zooom-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:1;cursor:zoom-out;}"),document.getElementsByTagName("head")[0].appendChild(t)}},{key:"removeImageStyle",value:function(t){var e=this;t.removeAttribute("style"),setTimeout((function(){t.classList.remove(e.img)}),this.animationTiem),this.fadeOut(t)}},{key:"zooomInit",value:function(t){var e=this,n=document.querySelector(".".concat(this.img));null===n?(this.imageZooom.classList.add(this.img),this.imageScale(this.imageProperty()),this.fadeIn(t)):this.removeImageStyle(n),window.addEventListener("scroll",(function(){var t=document.querySelector(".".concat(e.img));null!==t&&e.removeImageStyle(t)}))}},{key:"overlayAdd",value:function(){var t=document.createElement("div");t.id=this.overlay,t.setAttribute("style","background-color: ".concat(this.color,"; display: none;")),document.body.appendChild(t)}},{key:"fadeIn",value:function(t){var e=0,n=this.opacity;requestAnimationFrame((function o(){e<n&&(e+=.1),t.style.opacity=e,t.style.display="block",e<n?requestAnimationFrame(o):cancelAnimationFrame(o)}))}},{key:"fadeOut",value:function(){var t=document.getElementById("".concat(this.overlay)),e=this.opacity;requestAnimationFrame((function n(){e>.1&&(e-=.1),t.style.opacity=e,e>.1?requestAnimationFrame(n):(t.style.opacity=0,t.style.display="none",cancelAnimationFrame(n))}))}},{key:"imageProperty",value:function(){return{targetWidth:this.imageZooom.clientWidth,targetHeight:this.imageZooom.clientHeight,imageWidth:this.imageZooom.naturalWidth,imageHeight:this.imageZooom.naturalHeight}}},{key:"imageScale",value:function(t){var e=t.imageWidth,n=t.imageHeight,o=t.targetWidth,r=t.targetHeight,i=this.imageZooom.getBoundingClientRect(),c=e/o,u=window.innerHeight,a=document.documentElement.clientWidth,f=u-this.padding,s=a-this.padding,l=e/n,p=s/f,m={x:a/2-(i.left+o/2),y:u/2-(i.top+r/2)},y=1;y=e<s&&n<f?c:l<p?f/n*c:s/e*c,y<=1&&(y=1),this.imageZooom.setAttribute("style","transform: translate(".concat(m.x,"px, ").concat(m.y,"px) scale(").concat(y,") translateZ(0);"))}}])&&o(e.prototype,n),r&&o(e,r),t}();e.default=r},function(t,e,n){"use strict";var o=n(30),r=n(1),i=n(25),c=n(2),u=n(50),a=n(23),f=n(51),s=n(52),l=n(54),p=n(11),m=n(27),y=p("isConcatSpreadable"),v=m>=51||!r((function(){var t=[];return t[y]=!1,t.concat()[0]!==t})),d=l("concat"),h=function(t){if(!c(t))return!1;var e=t[y];return void 0!==e?!!e:i(t)};o({target:"Array",proto:!0,forced:!v||!d},{concat:function(t){var e,n,o,r,i,c=u(this),l=s(c,0),p=0;for(e=-1,o=arguments.length;e<o;e++)if(i=-1===e?c:arguments[e],h(i)){if(p+(r=a(i.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(n=0;n<r;n++,p++)n in i&&f(l,p,i[n])}else{if(p>=9007199254740991)throw TypeError("Maximum allowed index exceeded");f(l,p++,i)}return l.length=p,l}})},function(t,e,n){var o=n(0),r=n(12).f,i=n(5),c=n(35),u=n(10),a=n(40),f=n(49);t.exports=function(t,e){var n,s,l,p,m,y=t.target,v=t.global,d=t.stat;if(n=v?o:d?o[y]||u(y,{}):(o[y]||{}).prototype)for(s in e){if(p=e[s],l=t.noTargetGet?(m=r(n,s))&&m.value:n[s],!f(v?s:y+(d?".":"#")+s,t.forced)&&void 0!==l){if(typeof p==typeof l)continue;a(p,l)}(t.sham||l&&l.sham)&&i(p,"sham",!0),c(n,s,p,t)}}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";var o={}.propertyIsEnumerable,r=Object.getOwnPropertyDescriptor,i=r&&!o.call({1:2},1);e.f=i?function(t){var e=r(this,t);return!!e&&e.enumerable}:o},function(t,e,n){var o=n(1),r=n(13),i="".split;t.exports=o((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==r(t)?i.call(t,""):Object(t)}:Object},function(t,e,n){var o=n(0),r=n(2),i=o.document,c=r(i)&&r(i.createElement);t.exports=function(t){return c?i.createElement(t):{}}},function(t,e,n){var o=n(0),r=n(5),i=n(3),c=n(10),u=n(17),a=n(36),f=a.get,s=a.enforce,l=String(String).split("String");(t.exports=function(t,e,n,u){var a=!!u&&!!u.unsafe,f=!!u&&!!u.enumerable,p=!!u&&!!u.noTargetGet;"function"==typeof n&&("string"!=typeof e||i(n,"name")||r(n,"name",e),s(n).source=l.join("string"==typeof e?e:"")),t!==o?(a?!p&&t[e]&&(f=!0):delete t[e],f?t[e]=n:r(t,e,n)):f?t[e]=n:c(e,n)})(Function.prototype,"toString",(function(){return"function"==typeof this&&f(this).source||u(this)}))},function(t,e,n){var o,r,i,c=n(37),u=n(0),a=n(2),f=n(5),s=n(3),l=n(38),p=n(21),m=u.WeakMap;if(c){var y=new m,v=y.get,d=y.has,h=y.set;o=function(t,e){return h.call(y,t,e),e},r=function(t){return v.call(y,t)||{}},i=function(t){return d.call(y,t)}}else{var g=l("state");p[g]=!0,o=function(t,e){return f(t,g,e),e},r=function(t){return s(t,g)?t[g]:{}},i=function(t){return s(t,g)}}t.exports={set:o,get:r,has:i,enforce:function(t){return i(t)?r(t):o(t,{})},getterFor:function(t){return function(e){var n;if(!a(e)||(n=r(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return n}}}},function(t,e,n){var o=n(0),r=n(17),i=o.WeakMap;t.exports="function"==typeof i&&/native code/.test(r(i))},function(t,e,n){var o=n(19),r=n(20),i=o("keys");t.exports=function(t){return i[t]||(i[t]=r(t))}},function(t,e){t.exports=!1},function(t,e,n){var o=n(3),r=n(41),i=n(12),c=n(9);t.exports=function(t,e){for(var n=r(e),u=c.f,a=i.f,f=0;f<n.length;f++){var s=n[f];o(t,s)||u(t,s,a(e,s))}}},function(t,e,n){var o=n(22),r=n(43),i=n(48),c=n(16);t.exports=o("Reflect","ownKeys")||function(t){var e=r.f(c(t)),n=i.f;return n?e.concat(n(t)):e}},function(t,e,n){var o=n(0);t.exports=o},function(t,e,n){var o=n(44),r=n(47).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return o(t,r)}},function(t,e,n){var o=n(3),r=n(7),i=n(45).indexOf,c=n(21);t.exports=function(t,e){var n,u=r(t),a=0,f=[];for(n in u)!o(c,n)&&o(u,n)&&f.push(n);for(;e.length>a;)o(u,n=e[a++])&&(~i(f,n)||f.push(n));return f}},function(t,e,n){var o=n(7),r=n(23),i=n(46),c=function(t){return function(e,n,c){var u,a=o(e),f=r(a.length),s=i(c,f);if(t&&n!=n){for(;f>s;)if((u=a[s++])!=u)return!0}else for(;f>s;s++)if((t||s in a)&&a[s]===n)return t||s||0;return!t&&-1}};t.exports={includes:c(!0),indexOf:c(!1)}},function(t,e,n){var o=n(24),r=Math.max,i=Math.min;t.exports=function(t,e){var n=o(t);return n<0?r(n+e,0):i(n,e)}},function(t,e){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,n){var o=n(1),r=/#|\.prototype\./,i=function(t,e){var n=u[c(t)];return n==f||n!=a&&("function"==typeof e?o(e):!!e)},c=i.normalize=function(t){return String(t).replace(r,".").toLowerCase()},u=i.data={},a=i.NATIVE="N",f=i.POLYFILL="P";t.exports=i},function(t,e,n){var o=n(14);t.exports=function(t){return Object(o(t))}},function(t,e,n){"use strict";var o=n(8),r=n(9),i=n(6);t.exports=function(t,e,n){var c=o(e);c in t?r.f(t,c,i(0,n)):t[c]=n}},function(t,e,n){var o=n(2),r=n(25),i=n(11)("species");t.exports=function(t,e){var n;return r(t)&&("function"!=typeof(n=t.constructor)||n!==Array&&!r(n.prototype)?o(n)&&null===(n=n[i])&&(n=void 0):n=void 0),new(void 0===n?Array:n)(0===e?0:e)}},function(t,e,n){var o=n(26);t.exports=o&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},function(t,e,n){var o=n(1),r=n(11),i=n(27),c=r("species");t.exports=function(t){return i>=51||!o((function(){var e=[];return(e.constructor={})[c]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},function(t,e,n){var o=n(22);t.exports=o("navigator","userAgent")||""}]).default}));