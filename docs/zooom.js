!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("Zooom",[],r):"object"==typeof exports?exports.Zooom=r():t.Zooom=r()}(window,(function(){return function(t){var r={};function e(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,r){if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var o in t)e.d(n,o,function(r){return t[r]}.bind(null,o));return n},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},e.p="",e(e.s=94)}([function(t,r,e){var n=e(1),o=e(13),i=e(27),u=e(45),c=n.Symbol,a=o("wks");t.exports=function(t){return a[t]||(a[t]=u&&c[t]||(u?c:i)("Symbol."+t))}},function(t,r,e){(function(r){var e=function(t){return t&&t.Math==Math&&t};t.exports=e("object"==typeof globalThis&&globalThis)||e("object"==typeof window&&window)||e("object"==typeof self&&self)||e("object"==typeof r&&r)||Function("return this")()}).call(this,e(62))},function(t,r){var e={}.hasOwnProperty;t.exports=function(t,r){return e.call(t,r)}},function(t,r){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,r){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,r,e){var n=e(8),o=e(7),i=e(11);t.exports=n?function(t,r,e){return o.f(t,r,i(1,e))}:function(t,r,e){return t[r]=e,t}},function(t,r,e){var n=e(4);t.exports=function(t){if(!n(t))throw TypeError(String(t)+" is not an object");return t}},function(t,r,e){var n=e(8),o=e(38),i=e(6),u=e(16),c=Object.defineProperty;r.f=n?c:function(t,r,e){if(i(t),r=u(r,!0),i(e),o)try{return c(t,r,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported");return"value"in e&&(t[r]=e.value),t}},function(t,r,e){var n=e(3);t.exports=!n((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},function(t,r,e){var n=e(37),o=e(25);t.exports=function(t){return n(o(t))}},function(t,r,e){var n=e(1),o=e(23).f,i=e(5),u=e(12),c=e(26),a=e(41),f=e(68);t.exports=function(t,r){var e,s,l,p,y,v=t.target,d=t.global,h=t.stat;if(e=d?n:h?n[v]||c(v,{}):(n[v]||{}).prototype)for(s in r){if(p=r[s],l=t.noTargetGet?(y=o(e,s))&&y.value:e[s],!f(d?s:v+(h?".":"#")+s,t.forced)&&void 0!==l){if(typeof p==typeof l)continue;a(p,l)}(t.sham||l&&l.sham)&&i(p,"sham",!0),u(e,s,p,t)}}},function(t,r){t.exports=function(t,r){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:r}}},function(t,r,e){var n=e(1),o=e(13),i=e(5),u=e(2),c=e(26),a=e(40),f=e(18),s=f.get,l=f.enforce,p=String(a).split("toString");o("inspectSource",(function(t){return a.call(t)})),(t.exports=function(t,r,e,o){var a=!!o&&!!o.unsafe,f=!!o&&!!o.enumerable,s=!!o&&!!o.noTargetGet;"function"==typeof e&&("string"!=typeof r||u(e,"name")||i(e,"name",r),l(e).source=p.join("string"==typeof r?r:"")),t!==n?(a?!s&&t[r]&&(f=!0):delete t[r],f?t[r]=e:i(t,r,e)):f?t[r]=e:c(r,e)})(Function.prototype,"toString",(function(){return"function"==typeof this&&s(this).source||a.call(this)}))},function(t,r,e){var n=e(17),o=e(63);(t.exports=function(t,r){return o[t]||(o[t]=void 0!==r?r:{})})("versions",[]).push({version:"3.4.0",mode:n?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},function(t,r,e){var n=e(25);t.exports=function(t){return Object(n(t))}},function(t,r){t.exports={}},function(t,r,e){var n=e(4);t.exports=function(t,r){if(!n(t))return t;var e,o;if(r&&"function"==typeof(e=t.toString)&&!n(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!n(o=e.call(t)))return o;if(!r&&"function"==typeof(e=t.toString)&&!n(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,r){t.exports=!1},function(t,r,e){var n,o,i,u=e(64),c=e(1),a=e(4),f=e(5),s=e(2),l=e(19),p=e(20),y=c.WeakMap;if(u){var v=new y,d=v.get,h=v.has,g=v.set;n=function(t,r){return g.call(v,t,r),r},o=function(t){return d.call(v,t)||{}},i=function(t){return h.call(v,t)}}else{var m=l("state");p[m]=!0,n=function(t,r){return f(t,m,r),r},o=function(t){return s(t,m)?t[m]:{}},i=function(t){return s(t,m)}}t.exports={set:n,get:o,has:i,enforce:function(t){return i(t)?o(t):n(t,{})},getterFor:function(t){return function(r){var e;if(!a(r)||(e=o(r)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return e}}}},function(t,r,e){var n=e(13),o=e(27),i=n("keys");t.exports=function(t){return i[t]||(i[t]=o(t))}},function(t,r){t.exports={}},function(t,r,e){var n=e(42),o=e(1),i=function(t){return"function"==typeof t?t:void 0};t.exports=function(t,r){return arguments.length<2?i(n[t])||i(o[t]):n[t]&&n[t][r]||o[t]&&o[t][r]}},function(t,r,e){var n=e(29),o=Math.min;t.exports=function(t){return t>0?o(n(t),9007199254740991):0}},function(t,r,e){var n=e(8),o=e(36),i=e(11),u=e(9),c=e(16),a=e(2),f=e(38),s=Object.getOwnPropertyDescriptor;r.f=n?s:function(t,r){if(t=u(t),r=c(r,!0),f)try{return s(t,r)}catch(t){}if(a(t,r))return i(!o.f.call(t,r),t[r])}},function(t,r){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,r){t.exports=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t}},function(t,r,e){var n=e(1),o=e(5);t.exports=function(t,r){try{o(n,t,r)}catch(e){n[t]=r}return r}},function(t,r){var e=0,n=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++e+n).toString(36)}},function(t,r,e){var n=e(43),o=e(30).concat("length","prototype");r.f=Object.getOwnPropertyNames||function(t){return n(t,o)}},function(t,r){var e=Math.ceil,n=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?n:e)(t)}},function(t,r){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},function(t,r,e){var n=e(24);t.exports=Array.isArray||function(t){return"Array"==n(t)}},function(t,r,e){var n=e(6),o=e(69),i=e(30),u=e(20),c=e(70),a=e(39),f=e(19)("IE_PROTO"),s=function(){},l=function(){var t,r=a("iframe"),e=i.length;for(r.style.display="none",c.appendChild(r),r.src=String("javascript:"),(t=r.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),l=t.F;e--;)delete l.prototype[i[e]];return l()};t.exports=Object.create||function(t,r){var e;return null!==t?(s.prototype=n(t),e=new s,s.prototype=null,e[f]=t):e=l(),void 0===r?e:o(e,r)},u[f]=!0},function(t,r,e){var n=e(7).f,o=e(2),i=e(0)("toStringTag");t.exports=function(t,r,e){t&&!o(t=e?t:t.prototype,i)&&n(t,i,{configurable:!0,value:r})}},function(t,r,e){"use strict";var n=e(9),o=e(83),i=e(15),u=e(18),c=e(56),a=u.set,f=u.getterFor("Array Iterator");t.exports=c(Array,"Array",(function(t,r){a(this,{type:"Array Iterator",target:n(t),index:0,kind:r})}),(function(){var t=f(this),r=t.target,e=t.kind,n=t.index++;return!r||n>=r.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==e?{value:n,done:!1}:"values"==e?{value:r[n],done:!1}:{value:[n,r[n]],done:!1}}),"values"),i.Arguments=i.Array,o("keys"),o("values"),o("entries")},function(t,r,e){"use strict";var n=e(10),o=e(1),i=e(21),u=e(17),c=e(8),a=e(45),f=e(3),s=e(2),l=e(31),p=e(4),y=e(6),v=e(14),d=e(9),h=e(16),g=e(11),m=e(32),b=e(46),x=e(28),S=e(71),w=e(44),O=e(23),j=e(7),A=e(36),T=e(5),E=e(12),P=e(13),k=e(19),L=e(20),_=e(27),I=e(0),C=e(47),M=e(48),W=e(33),N=e(18),R=e(72).forEach,F=k("hidden"),D=I("toPrimitive"),Z=N.set,G=N.getterFor("Symbol"),H=Object.prototype,z=o.Symbol,B=i("JSON","stringify"),V=O.f,q=j.f,U=S.f,Y=A.f,J=P("symbols"),$=P("op-symbols"),K=P("string-to-symbol-registry"),Q=P("symbol-to-string-registry"),X=P("wks"),tt=o.QObject,rt=!tt||!tt.prototype||!tt.prototype.findChild,et=c&&f((function(){return 7!=m(q({},"a",{get:function(){return q(this,"a",{value:7}).a}})).a}))?function(t,r,e){var n=V(H,r);n&&delete H[r],q(t,r,e),n&&t!==H&&q(H,r,n)}:q,nt=function(t,r){var e=J[t]=m(z.prototype);return Z(e,{type:"Symbol",tag:t,description:r}),c||(e.description=r),e},ot=a&&"symbol"==typeof z.iterator?function(t){return"symbol"==typeof t}:function(t){return Object(t)instanceof z},it=function(t,r,e){t===H&&it($,r,e),y(t);var n=h(r,!0);return y(e),s(J,n)?(e.enumerable?(s(t,F)&&t[F][n]&&(t[F][n]=!1),e=m(e,{enumerable:g(0,!1)})):(s(t,F)||q(t,F,g(1,{})),t[F][n]=!0),et(t,n,e)):q(t,n,e)},ut=function(t,r){y(t);var e=d(r),n=b(e).concat(st(e));return R(n,(function(r){c&&!ct.call(e,r)||it(t,r,e[r])})),t},ct=function(t){var r=h(t,!0),e=Y.call(this,r);return!(this===H&&s(J,r)&&!s($,r))&&(!(e||!s(this,r)||!s(J,r)||s(this,F)&&this[F][r])||e)},at=function(t,r){var e=d(t),n=h(r,!0);if(e!==H||!s(J,n)||s($,n)){var o=V(e,n);return!o||!s(J,n)||s(e,F)&&e[F][n]||(o.enumerable=!0),o}},ft=function(t){var r=U(d(t)),e=[];return R(r,(function(t){s(J,t)||s(L,t)||e.push(t)})),e},st=function(t){var r=t===H,e=U(r?$:d(t)),n=[];return R(e,(function(t){!s(J,t)||r&&!s(H,t)||n.push(J[t])})),n};(a||(E((z=function(){if(this instanceof z)throw TypeError("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,r=_(t),e=function(t){this===H&&e.call($,t),s(this,F)&&s(this[F],r)&&(this[F][r]=!1),et(this,r,g(1,t))};return c&&rt&&et(H,r,{configurable:!0,set:e}),nt(r,t)}).prototype,"toString",(function(){return G(this).tag})),A.f=ct,j.f=it,O.f=at,x.f=S.f=ft,w.f=st,c&&(q(z.prototype,"description",{configurable:!0,get:function(){return G(this).description}}),u||E(H,"propertyIsEnumerable",ct,{unsafe:!0})),C.f=function(t){return nt(I(t),t)}),n({global:!0,wrap:!0,forced:!a,sham:!a},{Symbol:z}),R(b(X),(function(t){M(t)})),n({target:"Symbol",stat:!0,forced:!a},{for:function(t){var r=String(t);if(s(K,r))return K[r];var e=z(r);return K[r]=e,Q[e]=r,e},keyFor:function(t){if(!ot(t))throw TypeError(t+" is not a symbol");if(s(Q,t))return Q[t]},useSetter:function(){rt=!0},useSimple:function(){rt=!1}}),n({target:"Object",stat:!0,forced:!a,sham:!c},{create:function(t,r){return void 0===r?m(t):ut(m(t),r)},defineProperty:it,defineProperties:ut,getOwnPropertyDescriptor:at}),n({target:"Object",stat:!0,forced:!a},{getOwnPropertyNames:ft,getOwnPropertySymbols:st}),n({target:"Object",stat:!0,forced:f((function(){w.f(1)}))},{getOwnPropertySymbols:function(t){return w.f(v(t))}}),B)&&n({target:"JSON",stat:!0,forced:!a||f((function(){var t=z();return"[null]"!=B([t])||"{}"!=B({a:t})||"{}"!=B(Object(t))}))},{stringify:function(t,r,e){for(var n,o=[t],i=1;arguments.length>i;)o.push(arguments[i++]);if(n=r,(p(r)||void 0!==t)&&!ot(t))return l(r)||(r=function(t,r){if("function"==typeof n&&(r=n.call(this,t,r)),!ot(r))return r}),o[1]=r,B.apply(null,o)}});z.prototype[D]||T(z.prototype,D,z.prototype.valueOf),W(z,"Symbol"),L[F]=!0},function(t,r,e){"use strict";var n={}.propertyIsEnumerable,o=Object.getOwnPropertyDescriptor,i=o&&!n.call({1:2},1);r.f=i?function(t){var r=o(this,t);return!!r&&r.enumerable}:n},function(t,r,e){var n=e(3),o=e(24),i="".split;t.exports=n((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==o(t)?i.call(t,""):Object(t)}:Object},function(t,r,e){var n=e(8),o=e(3),i=e(39);t.exports=!n&&!o((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},function(t,r,e){var n=e(1),o=e(4),i=n.document,u=o(i)&&o(i.createElement);t.exports=function(t){return u?i.createElement(t):{}}},function(t,r,e){var n=e(13);t.exports=n("native-function-to-string",Function.toString)},function(t,r,e){var n=e(2),o=e(65),i=e(23),u=e(7);t.exports=function(t,r){for(var e=o(r),c=u.f,a=i.f,f=0;f<e.length;f++){var s=e[f];n(t,s)||c(t,s,a(r,s))}}},function(t,r,e){t.exports=e(1)},function(t,r,e){var n=e(2),o=e(9),i=e(66).indexOf,u=e(20);t.exports=function(t,r){var e,c=o(t),a=0,f=[];for(e in c)!n(u,e)&&n(c,e)&&f.push(e);for(;r.length>a;)n(c,e=r[a++])&&(~i(f,e)||f.push(e));return f}},function(t,r){r.f=Object.getOwnPropertySymbols},function(t,r,e){var n=e(3);t.exports=!!Object.getOwnPropertySymbols&&!n((function(){return!String(Symbol())}))},function(t,r,e){var n=e(43),o=e(30);t.exports=Object.keys||function(t){return n(t,o)}},function(t,r,e){r.f=e(0)},function(t,r,e){var n=e(42),o=e(2),i=e(47),u=e(7).f;t.exports=function(t){var r=n.Symbol||(n.Symbol={});o(r,t)||u(r,t,{value:i.f(t)})}},function(t,r,e){var n=e(73);t.exports=function(t,r,e){if(n(t),void 0===r)return t;switch(e){case 0:return function(){return t.call(r)};case 1:return function(e){return t.call(r,e)};case 2:return function(e,n){return t.call(r,e,n)};case 3:return function(e,n,o){return t.call(r,e,n,o)}}return function(){return t.apply(r,arguments)}}},function(t,r,e){var n=e(4),o=e(31),i=e(0)("species");t.exports=function(t,r){var e;return o(t)&&("function"!=typeof(e=t.constructor)||e!==Array&&!o(e.prototype)?n(e)&&null===(e=e[i])&&(e=void 0):e=void 0),new(void 0===e?Array:e)(0===r?0:r)}},function(t,r,e){"use strict";var n=e(10),o=e(8),i=e(1),u=e(2),c=e(4),a=e(7).f,f=e(41),s=i.Symbol;if(o&&"function"==typeof s&&(!("description"in s.prototype)||void 0!==s().description)){var l={},p=function(){var t=arguments.length<1||void 0===arguments[0]?void 0:String(arguments[0]),r=this instanceof p?new s(t):void 0===t?s():s(t);return""===t&&(l[r]=!0),r};f(p,s);var y=p.prototype=s.prototype;y.constructor=p;var v=y.toString,d="Symbol(test)"==String(s("test")),h=/^Symbol\((.*)\)[^)]+$/;a(y,"description",{configurable:!0,get:function(){var t=c(this)?this.valueOf():this,r=v.call(t);if(u(l,t))return"";var e=d?r.slice(7,-1):r.replace(h,"$1");return""===e?void 0:e}}),n({global:!0,forced:!0},{Symbol:p})}},function(t,r,e){e(48)("iterator")},function(t,r,e){"use strict";var n=e(16),o=e(7),i=e(11);t.exports=function(t,r,e){var u=n(r);u in t?o.f(t,u,i(0,e)):t[u]=e}},function(t,r,e){var n,o,i=e(1),u=e(76),c=i.process,a=c&&c.versions,f=a&&a.v8;f?o=(n=f.split("."))[0]+n[1]:u&&(!(n=u.match(/Edge\/(\d+)/))||n[1]>=74)&&(n=u.match(/Chrome\/(\d+)/))&&(o=n[1]),t.exports=o&&+o},function(t,r,e){var n=e(24),o=e(0)("toStringTag"),i="Arguments"==n(function(){return arguments}());t.exports=function(t){var r,e,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=function(t,r){try{return t[r]}catch(t){}}(r=Object(t),o))?e:i?n(r):"Object"==(u=n(r))&&"function"==typeof r.callee?"Arguments":u}},function(t,r,e){"use strict";var n=e(10),o=e(84),i=e(58),u=e(86),c=e(33),a=e(5),f=e(12),s=e(0),l=e(17),p=e(15),y=e(57),v=y.IteratorPrototype,d=y.BUGGY_SAFARI_ITERATORS,h=s("iterator"),g=function(){return this};t.exports=function(t,r,e,s,y,m,b){o(e,r,s);var x,S,w,O=function(t){if(t===y&&P)return P;if(!d&&t in T)return T[t];switch(t){case"keys":case"values":case"entries":return function(){return new e(this,t)}}return function(){return new e(this)}},j=r+" Iterator",A=!1,T=t.prototype,E=T[h]||T["@@iterator"]||y&&T[y],P=!d&&E||O(y),k="Array"==r&&T.entries||E;if(k&&(x=i(k.call(new t)),v!==Object.prototype&&x.next&&(l||i(x)===v||(u?u(x,v):"function"!=typeof x[h]&&a(x,h,g)),c(x,j,!0,!0),l&&(p[j]=g))),"values"==y&&E&&"values"!==E.name&&(A=!0,P=function(){return E.call(this)}),l&&!b||T[h]===P||a(T,h,P),p[r]=P,y)if(S={values:O("values"),keys:m?P:O("keys"),entries:O("entries")},b)for(w in S)!d&&!A&&w in T||f(T,w,S[w]);else n({target:r,proto:!0,forced:d||A},S);return S}},function(t,r,e){"use strict";var n,o,i,u=e(58),c=e(5),a=e(2),f=e(0),s=e(17),l=f("iterator"),p=!1;[].keys&&("next"in(i=[].keys())?(o=u(u(i)))!==Object.prototype&&(n=o):p=!0),null==n&&(n={}),s||a(n,l)||c(n,l,(function(){return this})),t.exports={IteratorPrototype:n,BUGGY_SAFARI_ITERATORS:p}},function(t,r,e){var n=e(2),o=e(14),i=e(19),u=e(85),c=i("IE_PROTO"),a=Object.prototype;t.exports=u?Object.getPrototypeOf:function(t){return t=o(t),n(t,c)?t[c]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}},function(t,r,e){var n=e(12),o=e(88),i=Object.prototype;o!==i.toString&&n(i,"toString",o,{unsafe:!0})},function(t,r,e){"use strict";var n=e(91).charAt,o=e(18),i=e(56),u=o.set,c=o.getterFor("String Iterator");i(String,"String",(function(t){u(this,{type:"String Iterator",string:String(t),index:0})}),(function(){var t,r=c(this),e=r.string,o=r.index;return o>=e.length?{value:void 0,done:!0}:(t=n(e,o),r.index+=t.length,{value:t,done:!1})}))},function(t,r,e){var n=e(1),o=e(92),i=e(34),u=e(5),c=e(0),a=c("iterator"),f=c("toStringTag"),s=i.values;for(var l in o){var p=n[l],y=p&&p.prototype;if(y){if(y[a]!==s)try{u(y,a,s)}catch(t){y[a]=s}if(y[f]||u(y,f,l),o[l])for(var v in i)if(y[v]!==i[v])try{u(y,v,i[v])}catch(t){y[v]=i[v]}}}},function(t,r){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(t){"object"==typeof window&&(e=window)}t.exports=e},function(t,r,e){var n=e(1),o=e(26),i=n["__core-js_shared__"]||o("__core-js_shared__",{});t.exports=i},function(t,r,e){var n=e(1),o=e(40),i=n.WeakMap;t.exports="function"==typeof i&&/native code/.test(o.call(i))},function(t,r,e){var n=e(21),o=e(28),i=e(44),u=e(6);t.exports=n("Reflect","ownKeys")||function(t){var r=o.f(u(t)),e=i.f;return e?r.concat(e(t)):r}},function(t,r,e){var n=e(9),o=e(22),i=e(67),u=function(t){return function(r,e,u){var c,a=n(r),f=o(a.length),s=i(u,f);if(t&&e!=e){for(;f>s;)if((c=a[s++])!=c)return!0}else for(;f>s;s++)if((t||s in a)&&a[s]===e)return t||s||0;return!t&&-1}};t.exports={includes:u(!0),indexOf:u(!1)}},function(t,r,e){var n=e(29),o=Math.max,i=Math.min;t.exports=function(t,r){var e=n(t);return e<0?o(e+r,0):i(e,r)}},function(t,r,e){var n=e(3),o=/#|\.prototype\./,i=function(t,r){var e=c[u(t)];return e==f||e!=a&&("function"==typeof r?n(r):!!r)},u=i.normalize=function(t){return String(t).replace(o,".").toLowerCase()},c=i.data={},a=i.NATIVE="N",f=i.POLYFILL="P";t.exports=i},function(t,r,e){var n=e(8),o=e(7),i=e(6),u=e(46);t.exports=n?Object.defineProperties:function(t,r){i(t);for(var e,n=u(r),c=n.length,a=0;c>a;)o.f(t,e=n[a++],r[e]);return t}},function(t,r,e){var n=e(21);t.exports=n("document","documentElement")},function(t,r,e){var n=e(9),o=e(28).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return u&&"[object Window]"==i.call(t)?function(t){try{return o(t)}catch(t){return u.slice()}}(t):o(n(t))}},function(t,r,e){var n=e(49),o=e(37),i=e(14),u=e(22),c=e(50),a=[].push,f=function(t){var r=1==t,e=2==t,f=3==t,s=4==t,l=6==t,p=5==t||l;return function(y,v,d,h){for(var g,m,b=i(y),x=o(b),S=n(v,d,3),w=u(x.length),O=0,j=h||c,A=r?j(y,w):e?j(y,0):void 0;w>O;O++)if((p||O in x)&&(m=S(g=x[O],O,b),t))if(r)A[O]=m;else if(m)switch(t){case 3:return!0;case 5:return g;case 6:return O;case 2:a.call(A,g)}else if(s)return!1;return l?-1:f||s?s:A}};t.exports={forEach:f(0),map:f(1),filter:f(2),some:f(3),every:f(4),find:f(5),findIndex:f(6)}},function(t,r){t.exports=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}},function(t,r,e){"use strict";var n=e(10),o=e(3),i=e(31),u=e(4),c=e(14),a=e(22),f=e(53),s=e(50),l=e(75),p=e(0),y=e(54),v=p("isConcatSpreadable"),d=y>=51||!o((function(){var t=[];return t[v]=!1,t.concat()[0]!==t})),h=l("concat"),g=function(t){if(!u(t))return!1;var r=t[v];return void 0!==r?!!r:i(t)};n({target:"Array",proto:!0,forced:!d||!h},{concat:function(t){var r,e,n,o,i,u=c(this),l=s(u,0),p=0;for(r=-1,n=arguments.length;r<n;r++)if(i=-1===r?u:arguments[r],g(i)){if(p+(o=a(i.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(e=0;e<o;e++,p++)e in i&&f(l,p,i[e])}else{if(p>=9007199254740991)throw TypeError("Maximum allowed index exceeded");f(l,p++,i)}return l.length=p,l}})},function(t,r,e){var n=e(3),o=e(0),i=e(54),u=o("species");t.exports=function(t){return i>=51||!n((function(){var r=[];return(r.constructor={})[u]=function(){return{foo:1}},1!==r[t](Boolean).foo}))}},function(t,r,e){var n=e(21);t.exports=n("navigator","userAgent")||""},function(t,r,e){var n=e(10),o=e(78);n({target:"Array",stat:!0,forced:!e(82)((function(t){Array.from(t)}))},{from:o})},function(t,r,e){"use strict";var n=e(49),o=e(14),i=e(79),u=e(80),c=e(22),a=e(53),f=e(81);t.exports=function(t){var r,e,s,l,p,y=o(t),v="function"==typeof this?this:Array,d=arguments.length,h=d>1?arguments[1]:void 0,g=void 0!==h,m=0,b=f(y);if(g&&(h=n(h,d>2?arguments[2]:void 0,2)),null==b||v==Array&&u(b))for(e=new v(r=c(y.length));r>m;m++)a(e,m,g?h(y[m],m):y[m]);else for(p=(l=b.call(y)).next,e=new v;!(s=p.call(l)).done;m++)a(e,m,g?i(l,h,[s.value,m],!0):s.value);return e.length=m,e}},function(t,r,e){var n=e(6);t.exports=function(t,r,e,o){try{return o?r(n(e)[0],e[1]):r(e)}catch(r){var i=t.return;throw void 0!==i&&n(i.call(t)),r}}},function(t,r,e){var n=e(0),o=e(15),i=n("iterator"),u=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||u[i]===t)}},function(t,r,e){var n=e(55),o=e(15),i=e(0)("iterator");t.exports=function(t){if(null!=t)return t[i]||t["@@iterator"]||o[n(t)]}},function(t,r,e){var n=e(0)("iterator"),o=!1;try{var i=0,u={next:function(){return{done:!!i++}},return:function(){o=!0}};u[n]=function(){return this},Array.from(u,(function(){throw 2}))}catch(t){}t.exports=function(t,r){if(!r&&!o)return!1;var e=!1;try{var i={};i[n]=function(){return{next:function(){return{done:e=!0}}}},t(i)}catch(t){}return e}},function(t,r,e){var n=e(0),o=e(32),i=e(5),u=n("unscopables"),c=Array.prototype;null==c[u]&&i(c,u,o(null)),t.exports=function(t){c[u][t]=!0}},function(t,r,e){"use strict";var n=e(57).IteratorPrototype,o=e(32),i=e(11),u=e(33),c=e(15),a=function(){return this};t.exports=function(t,r,e){var f=r+" Iterator";return t.prototype=o(n,{next:i(1,e)}),u(t,f,!1,!0),c[f]=a,t}},function(t,r,e){var n=e(3);t.exports=!n((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}))},function(t,r,e){var n=e(6),o=e(87);t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var t,r=!1,e={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(e,[]),r=e instanceof Array}catch(t){}return function(e,i){return n(e),o(i),r?t.call(e,i):e.__proto__=i,e}}():void 0)},function(t,r,e){var n=e(4);t.exports=function(t){if(!n(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype");return t}},function(t,r,e){"use strict";var n=e(55),o={};o[e(0)("toStringTag")]="z",t.exports="[object z]"!==String(o)?function(){return"[object "+n(this)+"]"}:o.toString},function(t,r,e){"use strict";var n=e(12),o=e(6),i=e(3),u=e(90),c=RegExp.prototype,a=c.toString,f=i((function(){return"/a/b"!=a.call({source:"a",flags:"b"})})),s="toString"!=a.name;(f||s)&&n(RegExp.prototype,"toString",(function(){var t=o(this),r=String(t.source),e=t.flags;return"/"+r+"/"+String(void 0===e&&t instanceof RegExp&&!("flags"in c)?u.call(t):e)}),{unsafe:!0})},function(t,r,e){"use strict";var n=e(6);t.exports=function(){var t=n(this),r="";return t.global&&(r+="g"),t.ignoreCase&&(r+="i"),t.multiline&&(r+="m"),t.dotAll&&(r+="s"),t.unicode&&(r+="u"),t.sticky&&(r+="y"),r}},function(t,r,e){var n=e(29),o=e(25),i=function(t){return function(r,e){var i,u,c=String(o(r)),a=n(e),f=c.length;return a<0||a>=f?t?"":void 0:(i=c.charCodeAt(a))<55296||i>56319||a+1===f||(u=c.charCodeAt(a+1))<56320||u>57343?t?c.charAt(a):i:t?c.slice(a,a+2):u-56320+(i-55296<<10)+65536}};t.exports={codeAt:i(!1),charAt:i(!0)}},function(t,r){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},function(t,r,e){},function(t,r,e){"use strict";e.r(r);e(35),e(51),e(52),e(74),e(77),e(34),e(59),e(89),e(60),e(61),e(93);function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(){var t,r=this.parentNode,e=arguments.length;if(r)for(e||r.removeChild(this);e--;)"object"!==n(t=arguments[e])?t=this.ownerDocument.createTextNode(t):t.parentNode&&t.parentNode.removeChild(t),e?r.insertBefore(this.previousSibling,t):r.replaceChild(t,this)}function i(t){return function(t){if(Array.isArray(t)){for(var r=0,e=new Array(t.length);r<t.length;r++)e[r]=t[r];return e}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function u(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}Element.prototype.replaceWith||(Element.prototype.replaceWith=o),CharacterData.prototype.replaceWith||(CharacterData.prototype.replaceWith=o),DocumentType.prototype.replaceWith||(DocumentType.prototype.replaceWith=o);var c=function(){function t(r){var e=this;if(function(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}(this,t),this.element=r.element,this.padding=r.padding||80,this.wrap="zooom-wrap",this.img="zooom-img",this.overlay="zooom-overlay",void 0===r.overlay)this.color="#fff",this.opacity="1";else{var n=r.overlay,o=n.color,i=n.opacity;this.color=o,this.opacity=i}this.addEventImage(),window.addEventListener("scroll",(function(){e.removeWrapper()}))}var r,e,n;return r=t,(e=[{key:"addEventImage",value:function(){var t=this,r=document.querySelectorAll(this.element),e=!0,n=!1,o=void 0;try{for(var i,u=r[Symbol.iterator]();!(e=(i=u.next()).done);e=!0)i.value.addEventListener("click",(function(r){r.stopPropagation(),t.imageZooom=r.currentTarget,t.zooomInit()}))}catch(t){n=!0,o=t}finally{try{e||null==u.return||u.return()}finally{if(n)throw o}}}},{key:"createWrapper",value:function(){this.wrapper=document.createElement("div"),this.wrapper.classList.add(this.wrap),this.wrapImage(this.imageZooom,this.wrapper),this.imageZooom.classList.add(this.img),this.overlayAdd()}},{key:"removeWrapper",value:function(){var t=this,r=document.querySelector(".".concat(this.wrap)),e=this.transitionEvent();if(r){var n=document.querySelector(".".concat(this.img));n.removeAttribute("style"),r.removeAttribute("style"),r.addEventListener(e,(function(){r.replaceWith.apply(r,i(r.childNodes)),n.classList.remove(t.img),t.overlayRemove()}))}}},{key:"zooomInit",value:function(){var t=this;null===document.querySelector(".".concat(this.wrap))?(this.createWrapper(),this.imageTranslate(this.imageProperty()),this.imageScale(this.imageProperty())):this.removeWrapper(),document.body.addEventListener("click",(function(){t.removeWrapper()}))}},{key:"overlayAdd",value:function(){var t=document.createElement("div");t.id=this.overlay,t.setAttribute("style","background-color: ".concat(this.color,"; opacity: ").concat(this.opacity)),document.body.appendChild(t)}},{key:"overlayRemove",value:function(){var t=document.getElementById(this.overlay);t&&t.parentNode.removeChild(t)}},{key:"transitionEvent",value:function(){var t=document.createElement("fakeelement"),r={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",transition:"transitionend"};for(var e in r)if(void 0!==t.style[e])return r[e]}},{key:"wrapImage",value:function(t,r){t.parentNode.insertBefore(r,t),r.appendChild(t)}},{key:"imageProperty",value:function(){return{targetWidth:this.imageZooom.clientWidth,targetHeight:this.imageZooom.clientHeight,imageWidth:this.imageZooom.naturalWidth,imageHeight:this.imageZooom.naturalHeight}}},{key:"imageScale",value:function(t){var r=t.imageWidth,e=t.imageHeight,n=r/t.targetWidth,o=window.innerHeight-this.padding,i=document.documentElement.clientWidth-this.padding,u=1;u=r<i&&e<o?n:r/e<i/o?o/e*n:i/r*n,u<=1&&(u=1),this.imageZooom.setAttribute("style","transform: scale(".concat(u,") translateZ(0);"))}},{key:"imageTranslate",value:function(t){var r=t.targetWidth,e=t.targetHeight,n=this.imageZooom.getBoundingClientRect(),o=window.innerHeight/2,i=document.documentElement.clientWidth/2,u=o-(n.top+e/2),c=i-(n.left+r/2);this.wrapper.setAttribute("style","transform: translate(".concat(c,"px, ").concat(u,"px) translateZ(0px);"))}}])&&u(r.prototype,e),n&&u(r,n),t}();r.default=c}]).default}));