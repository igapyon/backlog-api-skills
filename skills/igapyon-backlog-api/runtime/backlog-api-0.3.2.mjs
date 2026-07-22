#!/usr/bin/env node
import { createRequire as __backlogApiCreateRequire } from 'node:module'; const require = __backlogApiCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/es-errors/type.js
var require_type = __commonJS({
  "node_modules/es-errors/type.js"(exports, module) {
    "use strict";
    module.exports = TypeError;
  }
});

// node_modules/object-inspect/util.inspect.js
var require_util_inspect = __commonJS({
  "node_modules/object-inspect/util.inspect.js"(exports, module) {
    module.exports = __require("util").inspect;
  }
});

// node_modules/object-inspect/index.js
var require_object_inspect = __commonJS({
  "node_modules/object-inspect/index.js"(exports, module) {
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
      return O.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    var utilInspect = require_util_inspect();
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    module.exports = function inspect_(obj, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj === "undefined") {
        return "undefined";
      }
      if (obj === null) {
        return "null";
      }
      if (typeof obj === "boolean") {
        return obj ? "true" : "false";
      }
      if (typeof obj === "string") {
        return inspectString(obj, opts);
      }
      if (typeof obj === "number") {
        if (obj === 0) {
          return Infinity / obj > 0 ? "0" : "-0";
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
      }
      if (typeof obj === "bigint") {
        var bigIntStr = String(obj) + "n";
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
        return isArray(obj) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj) >= 0) {
        return "[Circular]";
      }
      function inspect(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      if (typeof obj === "function" && !isRegExp(obj)) {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
        return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj)) {
        var s = "<" + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
          s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
        }
        s += ">";
        if (obj.childNodes && obj.childNodes.length) {
          s += "...";
        }
        s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
        return s;
      }
      if (isArray(obj)) {
        if (obj.length === 0) {
          return "[]";
        }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
          return "[" + indentedJoin(xs, indent) + "]";
        }
        return "[ " + $join.call(xs, ", ") + " ]";
      }
      if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
          return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj) + "]";
        }
        return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj === "object" && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
          return obj.inspect();
        }
      }
      if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj, function(value, key) {
            mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
          });
        }
        return collectionOf("Map", mapSize.call(obj), mapParts, indent);
      }
      if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj, function(value) {
            setParts.push(inspect(value, obj));
          });
        }
        return collectionOf("Set", setSize.call(obj), setParts, indent);
      }
      if (isWeakMap(obj)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
      }
      if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
      }
      if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
      }
      if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
      }
      if (typeof window !== "undefined" && obj === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) {
        return "{ [object globalThis] }";
      }
      if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys, indent) + "}";
        }
        return tag + "{ " + $join.call(ys, ", ") + " }";
      }
      return String(obj);
    };
    function wrapQuotes(s, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s + quoteChar;
    }
    function quote(s) {
      return $replace.call(String(s), /"/g, "&quot;");
    }
    function canTrustToString(obj) {
      return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
    }
    function isArray(obj) {
      return toStr(obj) === "[object Array]" && canTrustToString(obj);
    }
    function isDate(obj) {
      return toStr(obj) === "[object Date]" && canTrustToString(obj);
    }
    function isRegExp(obj) {
      return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
    }
    function isError(obj) {
      return toStr(obj) === "[object Error]" && canTrustToString(obj);
    }
    function isString(obj) {
      return toStr(obj) === "[object String]" && canTrustToString(obj);
    }
    function isNumber(obj) {
      return toStr(obj) === "[object Number]" && canTrustToString(obj);
    }
    function isBoolean(obj) {
      return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
    }
    function isSymbol(obj) {
      if (hasShammedSymbols) {
        return obj && typeof obj === "object" && obj instanceof Symbol;
      }
      if (typeof obj === "symbol") {
        return true;
      }
      if (!obj || typeof obj !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isBigInt(obj) {
      if (!obj || typeof obj !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    var hasOwn = Object.prototype.hasOwnProperty || function(key) {
      return key in this;
    };
    function has(obj, key) {
      return hasOwn.call(obj, key);
    }
    function toStr(obj) {
      return objectToString.call(obj);
    }
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m) {
        return m[1];
      }
      return null;
    }
    function indexOf(xs, x) {
      if (xs.indexOf) {
        return xs.indexOf(x);
      }
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) {
          return i;
        }
      }
      return -1;
    }
    function isMap(x) {
      if (!mapSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        mapSize.call(x);
        try {
          setSize.call(x);
        } catch (s) {
          return true;
        }
        return x instanceof Map;
      } catch (e) {
      }
      return false;
    }
    function isWeakMap(x) {
      if (!weakMapHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x, weakMapHas);
        try {
          weakSetHas.call(x, weakSetHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    function isWeakRef(x) {
      if (!weakRefDeref || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isSet(x) {
      if (!setSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        setSize.call(x);
        try {
          mapSize.call(x);
        } catch (m) {
          return true;
        }
        return x instanceof Set;
      } catch (e) {
      }
      return false;
    }
    function isWeakSet(x) {
      if (!weakSetHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x, weakSetHas);
        try {
          weakMapHas.call(x, weakMapHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    function isElement(x) {
      if (!x || typeof x !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
        return true;
      }
      return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
    }
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s, "single", opts);
    }
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x) {
        return "\\" + x;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    function weakCollectionOf(type) {
      return type + " { ? }";
    }
    function collectionOf(type, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type + " (" + size + ") {" + joinedEntries + "}";
    }
    function singleLineValues(xs) {
      for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    function indentedJoin(xs, indent) {
      if (xs.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
    }
    function arrObjKeys(obj, inspect) {
      var isArr = isArray(obj);
      var xs = [];
      if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
          xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key in obj) {
        if (!has(obj, key)) {
          continue;
        }
        if (isArr && String(Number(key)) === key && key < obj.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key)) {
          xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
        } else {
          xs.push(key + ": " + inspect(obj[key], obj));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj, syms[j])) {
            xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
          }
        }
      }
      return xs;
    }
  }
});

// node_modules/side-channel-list/index.js
var require_side_channel_list = __commonJS({
  "node_modules/side-channel-list/index.js"(exports, module) {
    "use strict";
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var listGetNode = function(list, key, isDelete) {
      var prev = list;
      var curr;
      for (; (curr = prev.next) != null; prev = curr) {
        if (curr.key === key) {
          prev.next = curr.next;
          if (!isDelete) {
            curr.next = /** @type {NonNullable<typeof list.next>} */
            list.next;
            list.next = curr;
          }
          return curr;
        }
      }
    };
    var listGet = function(objects, key) {
      if (!objects) {
        return void 0;
      }
      var node = listGetNode(objects, key);
      return node && node.value;
    };
    var listSet = function(objects, key, value) {
      var node = listGetNode(objects, key);
      if (node) {
        node.value = value;
      } else {
        objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
        {
          // eslint-disable-line no-param-reassign, no-extra-parens
          key,
          next: objects.next,
          value
        };
      }
    };
    var listHas = function(objects, key) {
      if (!objects) {
        return false;
      }
      return !!listGetNode(objects, key);
    };
    var listDelete = function(objects, key) {
      if (objects) {
        return listGetNode(objects, key, true);
      }
    };
    module.exports = function getSideChannelList() {
      var $o;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          var deletedNode = listDelete($o, key);
          if (deletedNode && $o && !$o.next) {
            $o = void 0;
          }
          return !!deletedNode;
        },
        get: function(key) {
          return listGet($o, key);
        },
        has: function(key) {
          return listHas($o, key);
        },
        set: function(key, value) {
          if (!$o) {
            $o = {
              next: void 0
            };
          }
          listSet(
            /** @type {NonNullable<typeof $o>} */
            $o,
            key,
            value
          );
        }
      };
      return channel;
    };
  }
});

// node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "node_modules/es-object-atoms/index.js"(exports, module) {
    "use strict";
    module.exports = Object;
  }
});

// node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "node_modules/es-errors/index.js"(exports, module) {
    "use strict";
    module.exports = Error;
  }
});

// node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "node_modules/es-errors/eval.js"(exports, module) {
    "use strict";
    module.exports = EvalError;
  }
});

// node_modules/es-errors/range.js
var require_range = __commonJS({
  "node_modules/es-errors/range.js"(exports, module) {
    "use strict";
    module.exports = RangeError;
  }
});

// node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "node_modules/es-errors/ref.js"(exports, module) {
    "use strict";
    module.exports = ReferenceError;
  }
});

// node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "node_modules/es-errors/syntax.js"(exports, module) {
    "use strict";
    module.exports = SyntaxError;
  }
});

// node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "node_modules/es-errors/uri.js"(exports, module) {
    "use strict";
    module.exports = URIError;
  }
});

// node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "node_modules/math-intrinsics/abs.js"(exports, module) {
    "use strict";
    module.exports = Math.abs;
  }
});

// node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "node_modules/math-intrinsics/floor.js"(exports, module) {
    "use strict";
    module.exports = Math.floor;
  }
});

// node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "node_modules/math-intrinsics/max.js"(exports, module) {
    "use strict";
    module.exports = Math.max;
  }
});

// node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "node_modules/math-intrinsics/min.js"(exports, module) {
    "use strict";
    module.exports = Math.min;
  }
});

// node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "node_modules/math-intrinsics/pow.js"(exports, module) {
    "use strict";
    module.exports = Math.pow;
  }
});

// node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  "node_modules/math-intrinsics/round.js"(exports, module) {
    "use strict";
    module.exports = Math.round;
  }
});

// node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  "node_modules/math-intrinsics/isNaN.js"(exports, module) {
    "use strict";
    module.exports = Number.isNaN || function isNaN2(a) {
      return a !== a;
    };
  }
});

// node_modules/math-intrinsics/sign.js
var require_sign = __commonJS({
  "node_modules/math-intrinsics/sign.js"(exports, module) {
    "use strict";
    var $isNaN = require_isNaN();
    module.exports = function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    };
  }
});

// node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "node_modules/gopd/gOPD.js"(exports, module) {
    "use strict";
    module.exports = Object.getOwnPropertyDescriptor;
  }
});

// node_modules/gopd/index.js
var require_gopd = __commonJS({
  "node_modules/gopd/index.js"(exports, module) {
    "use strict";
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module.exports = $gOPD;
  }
});

// node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "node_modules/es-define-property/index.js"(exports, module) {
    "use strict";
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module.exports = $defineProperty;
  }
});

// node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "node_modules/has-symbols/shams.js"(exports, module) {
    "use strict";
    module.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = /* @__PURE__ */ Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _ in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  }
});

// node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "node_modules/has-symbols/index.js"(exports, module) {
    "use strict";
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof /* @__PURE__ */ Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  }
});

// node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
    "use strict";
    module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  }
});

// node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  "node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
    "use strict";
    var $Object = require_es_object_atoms();
    module.exports = $Object.getPrototypeOf || null;
  }
});

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "node_modules/function-bind/implementation.js"(exports, module) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "node_modules/function-bind/index.js"(exports, module) {
    "use strict";
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  }
});

// node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
    "use strict";
    module.exports = Function.prototype.call;
  }
});

// node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
    "use strict";
    module.exports = Function.prototype.apply;
  }
});

// node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
    "use strict";
    module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
    "use strict";
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module.exports = $reflectApply || bind.call($call, $apply);
  }
});

// node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "node_modules/call-bind-apply-helpers/index.js"(exports, module) {
    "use strict";
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module.exports = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind, $call, args);
    };
  }
});

// node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "node_modules/dunder-proto/get.js"(exports, module) {
    "use strict";
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD && gOPD(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }
    ) : false;
  }
});

// node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  "node_modules/get-proto/index.js"(exports, module) {
    "use strict";
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module.exports = reflectGetProto ? function getProto(O) {
      return reflectGetProto(O);
    } : originalGetProto ? function getProto(O) {
      if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O);
    } : getDunderProto ? function getProto(O) {
      return getDunderProto(O);
    } : null;
  }
});

// node_modules/hasown/index.js
var require_hasown = __commonJS({
  "node_modules/hasown/index.js"(exports, module) {
    "use strict";
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module.exports = bind.call(call, $hasOwn);
  }
});

// node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "node_modules/get-intrinsic/index.js"(exports, module) {
    "use strict";
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? (function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    })() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max,
      "%Math.min%": min,
      "%Math.pow%": pow,
      "%Math.round%": round,
      "%Math.sign%": sign,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void undefined2;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  }
});

// node_modules/call-bound/index.js
var require_call_bound = __commonJS({
  "node_modules/call-bound/index.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBindBasic = require_call_bind_apply_helpers();
    var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
    module.exports = function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = (
        /** @type {(this: unknown, ...args: unknown[]) => unknown} */
        GetIntrinsic(name, !!allowMissing)
      );
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBindBasic(
          /** @type {const} */
          [intrinsic]
        );
      }
      return intrinsic;
    };
  }
});

// node_modules/side-channel-map/index.js
var require_side_channel_map = __commonJS({
  "node_modules/side-channel-map/index.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var $Map = GetIntrinsic("%Map%", true);
    var $mapGet = callBound("Map.prototype.get", true);
    var $mapSet = callBound("Map.prototype.set", true);
    var $mapHas = callBound("Map.prototype.has", true);
    var $mapDelete = callBound("Map.prototype.delete", true);
    var $mapSize = callBound("Map.prototype.size", true);
    module.exports = !!$Map && /** @type {Exclude<import('.'), false>} */
    function getSideChannelMap() {
      var $m;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          if ($m) {
            var result = $mapDelete($m, key);
            if ($mapSize($m) === 0) {
              $m = void 0;
            }
            return result;
          }
          return false;
        },
        get: function(key) {
          if ($m) {
            return $mapGet($m, key);
          }
        },
        has: function(key) {
          if ($m) {
            return $mapHas($m, key);
          }
          return false;
        },
        set: function(key, value) {
          if (!$m) {
            $m = new $Map();
          }
          $mapSet($m, key, value);
        }
      };
      return channel;
    };
  }
});

// node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = __commonJS({
  "node_modules/side-channel-weakmap/index.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var getSideChannelMap = require_side_channel_map();
    var $TypeError = require_type();
    var $WeakMap = GetIntrinsic("%WeakMap%", true);
    var $weakMapGet = callBound("WeakMap.prototype.get", true);
    var $weakMapSet = callBound("WeakMap.prototype.set", true);
    var $weakMapHas = callBound("WeakMap.prototype.has", true);
    var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
    module.exports = $WeakMap ? (
      /** @type {Exclude<import('.'), false>} */
      function getSideChannelWeakMap() {
        var $wm;
        var $m;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapDelete($wm, key);
              }
            } else if (getSideChannelMap) {
              if ($m) {
                return $m["delete"](key);
              }
            }
            return false;
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            }
            return $m && $m.get(key);
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            }
            return !!$m && $m.has(key);
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if (getSideChannelMap) {
              if (!$m) {
                $m = getSideChannelMap();
              }
              $m.set(key, value);
            }
          }
        };
        return channel;
      }
    ) : getSideChannelMap;
  }
});

// node_modules/side-channel/index.js
var require_side_channel = __commonJS({
  "node_modules/side-channel/index.js"(exports, module) {
    "use strict";
    var $TypeError = require_type();
    var inspect = require_object_inspect();
    var getSideChannelList = require_side_channel_list();
    var getSideChannelMap = require_side_channel_map();
    var getSideChannelWeakMap = require_side_channel_weakmap();
    var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
    module.exports = function getSideChannel() {
      var $channelData;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            var keyDesc = key && Object(key) === key ? "the given object key" : inspect(key);
            throw new $TypeError("Side channel does not contain " + keyDesc);
          }
        },
        "delete": function(key) {
          return !!$channelData && $channelData["delete"](key);
        },
        get: function(key) {
          return $channelData && $channelData.get(key);
        },
        has: function(key) {
          return !!$channelData && $channelData.has(key);
        },
        set: function(key, value) {
          if (!$channelData) {
            $channelData = makeChannel();
          }
          $channelData.set(key, value);
        }
      };
      return channel;
    };
  }
});

// node_modules/qs/lib/formats.js
var require_formats = __commonJS({
  "node_modules/qs/lib/formats.js"(exports, module) {
    "use strict";
    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;
    var Format = {
      RFC1738: "RFC1738",
      RFC3986: "RFC3986"
    };
    module.exports = {
      "default": Format.RFC3986,
      formatters: {
        RFC1738: function(value) {
          return replace.call(value, percentTwenties, "+");
        },
        RFC3986: function(value) {
          return String(value);
        }
      },
      RFC1738: Format.RFC1738,
      RFC3986: Format.RFC3986
    };
  }
});

// node_modules/qs/lib/utils.js
var require_utils = __commonJS({
  "node_modules/qs/lib/utils.js"(exports, module) {
    "use strict";
    var formats = require_formats();
    var getSideChannel = require_side_channel();
    var defineProperty = require_es_define_property();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var overflowChannel = getSideChannel();
    var markOverflow = function markOverflow2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
      return obj;
    };
    var isOverflow = function isOverflow2(obj) {
      return overflowChannel.has(obj);
    };
    var getMaxIndex = function getMaxIndex2(obj) {
      return overflowChannel.get(obj);
    };
    var setMaxIndex = function setMaxIndex2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
    };
    var hexTable = (function() {
      var array = [];
      for (var i = 0; i < 256; ++i) {
        array[array.length] = "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase();
      }
      return array;
    })();
    var compactQueue = function compactQueue2(queue) {
      while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];
        if (isArray(obj)) {
          var compacted = [];
          for (var j = 0; j < obj.length; ++j) {
            if (typeof obj[j] !== "undefined") {
              compacted[compacted.length] = obj[j];
            }
          }
          item.obj[item.prop] = compacted;
        }
      }
    };
    var arrayToObject = function arrayToObject2(source, options) {
      var obj = options && options.plainObjects ? { __proto__: null } : {};
      for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== "undefined") {
          obj[i] = source[i];
        }
      }
      return obj;
    };
    var setProperty = function setProperty2(obj, key, value) {
      if (key === "__proto__" && defineProperty) {
        defineProperty(obj, key, {
          configurable: true,
          enumerable: true,
          value,
          writable: true
        });
      } else {
        obj[key] = value;
      }
    };
    var merge = function merge2(target, source, options) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object" && typeof source !== "function") {
        if (isArray(target)) {
          var nextIndex = target.length;
          if (options && typeof options.arrayLimit === "number" && nextIndex >= options.arrayLimit) {
            if (options.throwOnLimitExceeded) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            }
            return markOverflow(arrayToObject(target.concat(source), options), nextIndex);
          }
          target[nextIndex] = source;
        } else if (target && typeof target === "object") {
          if (isOverflow(target)) {
            var newIndex = getMaxIndex(target) + 1;
            target[newIndex] = source;
            setMaxIndex(target, newIndex);
          } else if (options && options.strictMerge) {
            return [target, source];
          } else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return [target, source];
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        if (isOverflow(source)) {
          var sourceKeys = Object.keys(source);
          var result = options && options.plainObjects ? { __proto__: null, 0: target } : { 0: target };
          for (var m = 0; m < sourceKeys.length; m++) {
            var oldKey = parseInt(sourceKeys[m], 10);
            result[oldKey + 1] = source[sourceKeys[m]];
          }
          return markOverflow(result, getMaxIndex(source) + 1);
        }
        var combined = [target].concat(source);
        if (options && typeof options.arrayLimit === "number" && combined.length > options.arrayLimit) {
          if (options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          }
          return markOverflow(arrayToObject(combined, options), combined.length - 1);
        }
        return combined;
      }
      var mergeTarget = target;
      if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
      }
      if (isArray(target) && isArray(source)) {
        source.forEach(function(item, i) {
          if (has.call(target, i)) {
            var targetItem = target[i];
            if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
              target[i] = merge2(targetItem, item, options);
            } else {
              target[target.length] = item;
            }
          } else {
            target[i] = item;
          }
        });
        if (options && typeof options.arrayLimit === "number" && target.length > options.arrayLimit) {
          if (options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          }
          return markOverflow(arrayToObject(target, options), target.length - 1);
        }
        return target;
      }
      return Object.keys(source).reduce(function(acc, key) {
        var value = source[key];
        if (has.call(acc, key)) {
          setProperty(acc, key, merge2(acc[key], value, options));
        } else {
          setProperty(acc, key, value);
        }
        if (isOverflow(source) && !isOverflow(acc)) {
          markOverflow(acc, getMaxIndex(source));
        }
        if (isOverflow(acc)) {
          var keyNum = parseInt(key, 10);
          if (String(keyNum) === key && keyNum >= 0 && keyNum > getMaxIndex(acc)) {
            setMaxIndex(acc, keyNum);
          }
        }
        return acc;
      }, mergeTarget);
    };
    var assign = function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function(acc, key) {
        setProperty(acc, key, source[key]);
        return acc;
      }, target);
    };
    var decode = function(str, defaultDecoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    };
    var limit = 1024;
    var encode = function encode2(str, defaultEncoder, charset, kind, format) {
      if (str.length === 0) {
        return str;
      }
      var string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(str);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      var out = "";
      for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        if (j + limit < string.length) {
          var last = segment.charCodeAt(segment.length - 1);
          if (last >= 55296 && last <= 56319) {
            segment = segment.slice(0, -1);
            j -= 1;
          }
        }
        var arr = [];
        for (var i = 0; i < segment.length; ++i) {
          var c = segment.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hexTable[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    };
    var compact = function compact2(value) {
      var queue = [{ obj: { o: value }, prop: "o" }];
      var refs = getSideChannel();
      for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];
        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
          var key = keys[j];
          var val = obj[key];
          if (typeof val === "object" && val !== null && !refs.has(val)) {
            queue[queue.length] = { obj, prop: key };
            refs.set(val, true);
          }
        }
      }
      compactQueue(queue);
      return value;
    };
    var isRegExp = function isRegExp2(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    };
    var isBuffer = function isBuffer2(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    };
    var combine = function combine2(a, b, arrayLimit, plainObjects, throwOnLimitExceeded) {
      if (isOverflow(a)) {
        if (throwOnLimitExceeded) {
          throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
        }
        var newIndex = getMaxIndex(a) + 1;
        a[newIndex] = b;
        setMaxIndex(a, newIndex);
        return a;
      }
      var result = [].concat(a, b);
      if (result.length > arrayLimit) {
        if (throwOnLimitExceeded) {
          throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
        }
        return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
      }
      return result;
    };
    var maybeMap = function maybeMap2(val, fn) {
      if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
          mapped[mapped.length] = fn(val[i]);
        }
        return mapped;
      }
      return fn(val);
    };
    module.exports = {
      arrayToObject,
      assign,
      combine,
      compact,
      decode,
      encode,
      isBuffer,
      isOverflow,
      isRegExp,
      markOverflow,
      maybeMap,
      merge
    };
  }
});

// node_modules/qs/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/qs/lib/stringify.js"(exports, module) {
    "use strict";
    var getSideChannel = require_side_channel();
    var utils = require_utils();
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var arrayPrefixGenerators = {
      brackets: function brackets(prefix) {
        return prefix + "[]";
      },
      comma: "comma",
      indices: function indices(prefix, key) {
        return prefix + "[" + key + "]";
      },
      repeat: function repeat(prefix) {
        return prefix;
      }
    };
    var isArray = Array.isArray;
    var push = Array.prototype.push;
    var pushToArray = function(arr, valueOrArray) {
      push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
    };
    var toISO = Date.prototype.toISOString;
    var defaultFormat = formats["default"];
    var defaults = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      commaRoundTrip: false,
      delimiter: "&",
      encode: true,
      encodeDotInKeys: false,
      encoder: utils.encode,
      encodeValuesOnly: false,
      filter: void 0,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: function serializeDate(date) {
        return toISO.call(date);
      },
      skipNulls: false,
      strictNullHandling: false
    };
    var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
    };
    var sentinel = {};
    var stringify2 = function stringify3(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
      var obj = object;
      var tmpSc = sideChannel;
      var step = 0;
      var findFlag = false;
      while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            findFlag = true;
          }
        }
        if (typeof tmpSc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      if (typeof filter === "function") {
        obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
        obj = serializeDate(obj);
      } else if (generateArrayPrefix === "comma" && isArray(obj)) {
        obj = utils.maybeMap(obj, function(value2) {
          if (value2 instanceof Date) {
            return serializeDate(value2);
          }
          return value2;
        });
      }
      if (obj === null) {
        if (strictNullHandling) {
          return formatter(encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix);
        }
        obj = "";
      }
      if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
          var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
          return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
        }
        return [formatter(prefix) + "=" + formatter(String(obj))];
      }
      var values = [];
      if (typeof obj === "undefined") {
        return values;
      }
      var objKeys;
      if (generateArrayPrefix === "comma" && isArray(obj)) {
        if (encodeValuesOnly && encoder) {
          obj = utils.maybeMap(obj, function(v) {
            return v == null ? v : encoder(v);
          });
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
      } else if (isArray(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
      }
      var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
      var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
      if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
        return adjustedPrefix + "[]";
      }
      for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
        if (skipNulls && value === null) {
          continue;
        }
        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify3(
          value,
          keyPrefix,
          generateArrayPrefix,
          commaRoundTrip,
          allowEmptyArrays,
          strictNullHandling,
          skipNulls,
          encodeDotInKeys,
          generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
          filter,
          sort,
          allowDots,
          serializeDate,
          format,
          formatter,
          encodeValuesOnly,
          charset,
          valueSideChannel
        ));
      }
      return values;
    };
    var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      var charset = opts.charset || defaults.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      var format = formats["default"];
      if (typeof opts.format !== "undefined") {
        if (!has.call(formats.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format = opts.format;
      }
      var formatter = formats.formatters[format];
      var filter = defaults.filter;
      if (typeof opts.filter === "function" || isArray(opts.filter)) {
        filter = opts.filter;
      }
      var arrayFormat;
      if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter,
        format,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
      };
    };
    module.exports = function(object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);
      var objKeys;
      var filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj = filter("", obj);
      } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }
      var keys = [];
      if (typeof obj !== "object" || obj === null) {
        return "";
      }
      var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
      var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!objKeys) {
        objKeys = Object.keys(obj);
      }
      if (options.sort) {
        objKeys.sort(options.sort);
      }
      var sideChannel = getSideChannel();
      for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        if (typeof key === "undefined" || key === null) {
          continue;
        }
        var value = obj[key];
        if (options.skipNulls && value === null) {
          continue;
        }
        pushToArray(keys, stringify2(
          value,
          key,
          generateArrayPrefix,
          commaRoundTrip,
          options.allowEmptyArrays,
          options.strictNullHandling,
          options.skipNulls,
          options.encodeDotInKeys,
          options.encode ? options.encoder : null,
          options.filter,
          options.sort,
          options.allowDots,
          options.serializeDate,
          options.format,
          options.formatter,
          options.encodeValuesOnly,
          options.charset,
          sideChannel
        ));
      }
      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B" + options.delimiter;
        } else {
          prefix += "utf8=%E2%9C%93" + options.delimiter;
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    };
  }
});

// node_modules/qs/lib/parse.js
var require_parse = __commonJS({
  "node_modules/qs/lib/parse.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var defaults = {
      allowDots: false,
      allowEmptyArrays: false,
      allowPrototypes: false,
      allowSparse: false,
      arrayLimit: 20,
      charset: "utf-8",
      charsetSentinel: false,
      comma: false,
      decodeDotInKeys: false,
      decoder: utils.decode,
      delimiter: "&",
      depth: 5,
      duplicates: "combine",
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1e3,
      parseArrays: true,
      plainObjects: false,
      strictDepth: false,
      strictMerge: true,
      strictNullHandling: false,
      throwOnLimitExceeded: false
    };
    var interpretNumericEntities = function(str) {
      return str.replace(/&#(\d+);/g, function($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
      });
    };
    var parseArrayValue = function(val, options, currentArrayLength, isFlatArrayValue) {
      if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
        if (isFlatArrayValue && options.throwOnLimitExceeded) {
          var commaCount = 0;
          var commaIndex = val.indexOf(",");
          while (commaIndex > -1) {
            commaCount += 1;
            if (commaCount >= options.arrayLimit) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            }
            commaIndex = val.indexOf(",", commaIndex + 1);
          }
        }
        return val.split(",");
      }
      if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
      }
      return val;
    };
    var isoSentinel = "utf8=%26%2310003%3B";
    var charsetSentinel = "utf8=%E2%9C%93";
    var parseValues = function parseQueryStringValues(str, options) {
      var obj = { __proto__: null };
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
      cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
      var parts = cleanStr.split(
        options.delimiter,
        options.throwOnLimitExceeded && typeof limit !== "undefined" ? limit + 1 : limit
      );
      if (options.throwOnLimitExceeded && typeof limit !== "undefined" && parts.length > limit) {
        throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
      }
      var skipIndex = -1;
      var i;
      var charset = options.charset;
      if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
          if (parts[i].indexOf("utf8=") === 0) {
            if (parts[i] === charsetSentinel) {
              charset = "utf-8";
            } else if (parts[i] === isoSentinel) {
              charset = "iso-8859-1";
            }
            skipIndex = i;
            i = parts.length;
          }
        }
      }
      for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
          continue;
        }
        var part = parts[i];
        var bracketEqualsPos = part.indexOf("]=");
        var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
        var key;
        var val;
        if (pos === -1) {
          key = options.decoder(part, defaults.decoder, charset, "key");
          val = options.strictNullHandling ? null : "";
        } else {
          key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
          if (key !== null) {
            val = utils.maybeMap(
              parseArrayValue(
                part.slice(pos + 1),
                options,
                isArray(obj[key]) ? obj[key].length : 0,
                part.indexOf("[]=") === -1
              ),
              function(encodedVal) {
                return options.decoder(encodedVal, defaults.decoder, charset, "value");
              }
            );
          }
        }
        if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
          val = interpretNumericEntities(String(val));
        }
        if (part.indexOf("[]=") > -1) {
          val = isArray(val) ? [val] : val;
        }
        if (options.comma && isArray(val) && val.length > options.arrayLimit) {
          val = utils.combine([], val, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
        }
        if (key !== null) {
          var existing = has.call(obj, key);
          if (existing && (options.duplicates === "combine" || part.indexOf("[]=") > -1)) {
            obj[key] = utils.combine(
              obj[key],
              val,
              options.arrayLimit,
              options.plainObjects,
              options.throwOnLimitExceeded
            );
          } else if (!existing || options.duplicates === "last") {
            obj[key] = val;
          }
        }
      }
      return obj;
    };
    var parseObject = function(chain, val, options, valuesParsed) {
      var currentArrayLength = 0;
      if (chain.length > 0 && chain[chain.length - 1] === "[]") {
        var parentKey = chain.slice(0, -1).join("");
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
      }
      var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
      for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];
        if (root === "[]" && options.parseArrays) {
          if (utils.isOverflow(leaf)) {
            obj = leaf;
          } else {
            obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine(
              [],
              leaf,
              options.arrayLimit,
              options.plainObjects,
              options.throwOnLimitExceeded
            );
          }
        } else {
          obj = options.plainObjects ? { __proto__: null } : {};
          var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
          var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
          var index = parseInt(decodedRoot, 10);
          var isValidArrayIndex = !isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays;
          if (!options.parseArrays && decodedRoot === "") {
            obj = { 0: leaf };
          } else if (isValidArrayIndex && index < options.arrayLimit) {
            obj = [];
            obj[index] = leaf;
          } else if (isValidArrayIndex && options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          } else if (isValidArrayIndex) {
            obj[index] = leaf;
            utils.markOverflow(obj, index);
          } else if (decodedRoot !== "__proto__") {
            obj[decodedRoot] = leaf;
          }
        }
        leaf = obj;
      }
      return leaf;
    };
    var splitKeyIntoSegments = function splitKeyIntoSegments2(originalKey, options) {
      var key = options.allowDots ? originalKey.replace(/\.([^.[]+)/g, "[$1]") : originalKey;
      if (options.depth <= 0) {
        if (!options.plainObjects && has.call(Object.prototype, key)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        return [key];
      }
      var segments = [];
      var first = key.indexOf("[");
      var parent = first >= 0 ? key.slice(0, first) : key;
      if (parent) {
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        segments[segments.length] = parent;
      }
      var n = key.length;
      var open = first;
      var collected = 0;
      while (open >= 0 && collected < options.depth) {
        var level = 1;
        var i = open + 1;
        var close = -1;
        while (i < n && close < 0) {
          var cu = key.charCodeAt(i);
          if (cu === 91) {
            level += 1;
          } else if (cu === 93) {
            level -= 1;
            if (level === 0) {
              close = i;
            }
          }
          i += 1;
        }
        if (close < 0) {
          segments[segments.length] = "[" + key.slice(open) + "]";
          return segments;
        }
        var seg = key.slice(open, close + 1);
        var content = seg.slice(1, -1);
        if (!options.plainObjects && has.call(Object.prototype, content) && !options.allowPrototypes) {
          return;
        }
        segments[segments.length] = seg;
        collected += 1;
        open = key.indexOf("[", close + 1);
      }
      if (open >= 0) {
        if (options.strictDepth === true) {
          throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
        }
        segments[segments.length] = "[" + key.slice(open) + "]";
      }
      return segments;
    };
    var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
        return;
      }
      var keys = splitKeyIntoSegments(givenKey, options);
      if (!keys) {
        return;
      }
      return parseObject(keys, val, options, valuesParsed);
    };
    var normalizeParseOptions = function normalizeParseOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
        throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
        throw new TypeError("Decoder has to be a function.");
      }
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
        throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
      }
      var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
      var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
      if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
        throw new TypeError("The duplicates option must be either combine, first, or last");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
        duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
        strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
        strictMerge: typeof opts.strictMerge === "boolean" ? !!opts.strictMerge : defaults.strictMerge,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
      };
    };
    module.exports = function(str, opts) {
      var options = normalizeParseOptions(opts);
      if (str === "" || str === null || typeof str === "undefined") {
        return options.plainObjects ? { __proto__: null } : {};
      }
      var tempObj = typeof str === "string" ? parseValues(str, options) : str;
      var obj = options.plainObjects ? { __proto__: null } : {};
      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
        obj = utils.merge(obj, newObj, options);
      }
      if (options.allowSparse === true) {
        return obj;
      }
      return utils.compact(obj);
    };
  }
});

// node_modules/qs/lib/index.js
var require_lib = __commonJS({
  "node_modules/qs/lib/index.js"(exports, module) {
    "use strict";
    var stringify2 = require_stringify();
    var parse = require_parse();
    var formats = require_formats();
    module.exports = {
      formats,
      parse,
      stringify: stringify2
    };
  }
});

// src/cli.mjs
import fs from "node:fs";

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage2 = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage2 = map(fullIssue, { data, defaultError: errorMessage2 }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage2
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// node_modules/backlog-mcp-server/build/types/zod/backlogOutputDefinition.js
var TextFormattingRuleSchema = external_exports.enum(["backlog", "markdown"]);
var RoleTypeSchema = external_exports.union([
  external_exports.nativeEnum({
    Admin: 1,
    User: 2,
    Reporter: 3,
    Viewer: 4,
    GuestReporter: 5,
    GuestViewer: 6
  }),
  external_exports.nativeEnum({
    Admin: 1,
    MemberOrGuest: 2,
    MemberOrGuestForAddIssues: 3,
    MemberOrGuestForViewIssues: 4
  })
]);
var LanguageSchema = external_exports.union([
  external_exports.literal("en"),
  external_exports.literal("ja"),
  external_exports.null()
]);
var ActivityTypeSchema = external_exports.nativeEnum({
  Undefined: -1,
  IssueCreated: 1,
  IssueUpdated: 2,
  IssueCommented: 3,
  IssueDeleted: 4,
  WikiCreated: 5,
  WikiUpdated: 6,
  WikiDeleted: 7,
  FileAdded: 8,
  FileUpdated: 9,
  FileDeleted: 10,
  SvnCommitted: 11,
  GitPushed: 12,
  GitRepositoryCreated: 13,
  IssueMultiUpdated: 14,
  ProjectUserAdded: 15,
  ProjectUserRemoved: 16,
  NotifyAdded: 17,
  PullRequestAdded: 18,
  PullRequestUpdated: 19,
  PullRequestCommented: 20,
  PullRequestMerged: 21,
  MilestoneCreated: 22,
  MilestoneUpdated: 23,
  MilestoneDeleted: 24,
  ProjectGroupAdded: 25,
  ProjectGroupDeleted: 26
});
var IssueTypeColorSchema = external_exports.enum([
  "#e30000",
  "#990000",
  "#934981",
  "#814fbc",
  "#2779ca",
  "#007e9a",
  "#7ea800",
  "#ff9200",
  "#ff3265",
  "#666665"
]);
var ProjectStatusColorSchema = external_exports.enum([
  "#ea2c00",
  "#e87758",
  "#e07b9a",
  "#868cb7",
  "#3b9dbd",
  "#4caf93",
  "#b0be3c",
  "#eda62a",
  "#f42858",
  "#393939"
]);
var CustomFieldTypeSchema = external_exports.nativeEnum({
  Text: 1,
  TextArea: 2,
  Numeric: 3,
  Date: 4,
  SingleList: 5,
  MultipleList: 6,
  CheckBox: 7,
  Radio: 8
});
var WebhookActivityIdSchema = external_exports.number();
var UserSchema = external_exports.object({
  id: external_exports.number(),
  userId: external_exports.string(),
  name: external_exports.string(),
  roleType: RoleTypeSchema,
  lang: LanguageSchema,
  mailAddress: external_exports.string(),
  lastLoginTime: external_exports.string()
});
var ProjectStatusSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  name: external_exports.string(),
  color: ProjectStatusColorSchema,
  displayOrder: external_exports.number()
});
var CategorySchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  name: external_exports.string(),
  displayOrder: external_exports.number()
});
var IssueFileInfoSchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string(),
  size: external_exports.number(),
  createdUser: UserSchema,
  created: external_exports.string()
});
var StarSchema = external_exports.object({
  id: external_exports.number(),
  comment: external_exports.string().optional(),
  url: external_exports.string(),
  title: external_exports.string(),
  presenter: UserSchema,
  created: external_exports.string()
});
var IssueTypeSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  name: external_exports.string(),
  color: IssueTypeColorSchema,
  displayOrder: external_exports.number(),
  templateSummary: external_exports.string().optional(),
  templateDescription: external_exports.string().optional()
});
var ResolutionSchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string()
});
var PrioritySchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string()
});
var VersionSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  name: external_exports.string(),
  description: external_exports.string().optional(),
  startDate: external_exports.string().optional(),
  releaseDueDate: external_exports.string().optional(),
  archived: external_exports.boolean(),
  displayOrder: external_exports.number()
});
var CustomFieldSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  typeId: CustomFieldTypeSchema,
  name: external_exports.string(),
  description: external_exports.string(),
  required: external_exports.boolean(),
  applicableIssueTypes: external_exports.array(external_exports.number())
});
var CustomFieldValueSchema = external_exports.object({
  id: external_exports.number(),
  fieldTypeId: CustomFieldTypeSchema,
  name: external_exports.string(),
  value: external_exports.unknown(),
  // Present on "checkbox" / "radio" fields that allow free-text input for an
  // "other" option; holds whatever the user typed there (null when unused).
  otherValue: external_exports.string().nullable().optional()
});
var SharedFileSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  type: external_exports.string(),
  dir: external_exports.string(),
  name: external_exports.string(),
  size: external_exports.number(),
  createdUser: UserSchema,
  created: external_exports.string(),
  updatedUser: UserSchema,
  updated: external_exports.string()
});
var IssueSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  issueKey: external_exports.string(),
  keyId: external_exports.number(),
  issueType: IssueTypeSchema,
  summary: external_exports.string(),
  description: external_exports.string(),
  resolution: ResolutionSchema.optional(),
  priority: PrioritySchema,
  status: ProjectStatusSchema,
  assignee: UserSchema.optional(),
  category: external_exports.array(CategorySchema),
  versions: external_exports.array(VersionSchema),
  milestone: external_exports.array(VersionSchema),
  startDate: external_exports.string().optional(),
  dueDate: external_exports.string().optional(),
  estimatedHours: external_exports.number().optional(),
  actualHours: external_exports.number().optional(),
  parentIssueId: external_exports.number().optional(),
  createdUser: UserSchema,
  created: external_exports.string(),
  updatedUser: UserSchema,
  updated: external_exports.string(),
  customFields: external_exports.array(CustomFieldValueSchema),
  attachments: external_exports.array(IssueFileInfoSchema),
  sharedFiles: external_exports.array(SharedFileSchema),
  stars: external_exports.array(StarSchema)
});
var ProjectSchema = external_exports.object({
  id: external_exports.number(),
  projectKey: external_exports.string(),
  name: external_exports.string(),
  chartEnabled: external_exports.boolean(),
  useResolvedForChart: external_exports.boolean(),
  subtaskingEnabled: external_exports.boolean(),
  projectLeaderCanEditProjectLeader: external_exports.boolean(),
  useWiki: external_exports.boolean(),
  useFileSharing: external_exports.boolean(),
  useWikiTreeView: external_exports.boolean(),
  useOriginalImageSizeAtWiki: external_exports.boolean(),
  useSubversion: external_exports.boolean(),
  useGit: external_exports.boolean(),
  textFormattingRule: TextFormattingRuleSchema,
  archived: external_exports.boolean(),
  displayOrder: external_exports.number(),
  useDevAttributes: external_exports.boolean()
});
var AttachmentInfoSchema = external_exports.object({
  id: external_exports.number(),
  type: external_exports.string()
});
var AttributeInfoSchema = external_exports.object({
  id: external_exports.number(),
  typeId: external_exports.number()
});
var NotificationInfoSchema = external_exports.object({
  type: external_exports.string()
});
var IssueChangeLogSchema = external_exports.object({
  field: external_exports.string(),
  newValue: external_exports.string(),
  originalValue: external_exports.string(),
  attachmentInfo: AttachmentInfoSchema,
  attributeInfo: AttributeInfoSchema,
  notificationInfo: NotificationInfoSchema
});
var CommentNotificationSchema = external_exports.object({
  id: external_exports.number(),
  alreadyRead: external_exports.boolean(),
  reason: external_exports.number(),
  user: UserSchema,
  resourceAlreadyRead: external_exports.boolean()
});
var IssueCommentSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  issueId: external_exports.number(),
  content: external_exports.string(),
  changeLog: external_exports.array(IssueChangeLogSchema),
  createdUser: UserSchema,
  created: external_exports.string(),
  updated: external_exports.string(),
  stars: external_exports.array(StarSchema),
  notifications: external_exports.array(CommentNotificationSchema)
});
var PullRequestStatusSchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string()
});
var PullRequestFileInfoSchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string(),
  size: external_exports.number(),
  createdUser: UserSchema,
  created: external_exports.string()
});
var ChangeLogSchema = external_exports.object({
  field: external_exports.string(),
  newValue: external_exports.string(),
  originalValue: external_exports.string()
});
var PullRequestChangeLogSchema = ChangeLogSchema;
var PullRequestSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  repositoryId: external_exports.number(),
  number: external_exports.number(),
  summary: external_exports.string(),
  description: external_exports.string(),
  base: external_exports.string(),
  branch: external_exports.string(),
  status: PullRequestStatusSchema,
  assignee: UserSchema.optional(),
  issue: IssueSchema,
  baseCommit: external_exports.string().optional(),
  branchCommit: external_exports.string().optional(),
  mergeCommit: external_exports.string().optional(),
  closeAt: external_exports.string().optional(),
  mergeAt: external_exports.string().optional(),
  createdUser: UserSchema,
  created: external_exports.string(),
  updatedUser: UserSchema,
  updated: external_exports.string(),
  attachments: external_exports.array(PullRequestFileInfoSchema),
  stars: external_exports.array(StarSchema)
});
var PullRequestCommentSchema = external_exports.object({
  id: external_exports.number(),
  content: external_exports.string(),
  changeLog: external_exports.array(PullRequestChangeLogSchema),
  createdUser: UserSchema,
  created: external_exports.string(),
  updated: external_exports.string(),
  stars: external_exports.array(StarSchema),
  notifications: external_exports.array(CommentNotificationSchema)
});
var WikiFileInfoSchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string(),
  size: external_exports.number(),
  createdUser: UserSchema,
  created: external_exports.string()
});
var TagSchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string()
});
var WikiSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  name: external_exports.string(),
  content: external_exports.string(),
  tags: external_exports.array(TagSchema),
  attachments: external_exports.array(WikiFileInfoSchema),
  sharedFiles: external_exports.array(SharedFileSchema),
  stars: external_exports.array(StarSchema),
  createdUser: UserSchema,
  created: external_exports.string(),
  updatedUser: UserSchema,
  updated: external_exports.string()
});
var IssueCountSchema = external_exports.object({
  count: external_exports.number()
});
var WatchingListItemSchema = external_exports.object({
  id: external_exports.number(),
  resourceAlreadyRead: external_exports.boolean(),
  note: external_exports.string(),
  type: external_exports.string(),
  issue: IssueSchema,
  lastContentUpdated: external_exports.string(),
  created: external_exports.string(),
  updated: external_exports.string()
});
var GitRepositorySchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  name: external_exports.string(),
  description: external_exports.string(),
  hookUrl: external_exports.string().optional(),
  httpUrl: external_exports.string(),
  sshUrl: external_exports.string(),
  displayOrder: external_exports.number(),
  pushedAt: external_exports.string().optional(),
  createdUser: UserSchema,
  created: external_exports.string(),
  updatedUser: UserSchema,
  updated: external_exports.string()
});
var NotificationSchema = external_exports.object({
  id: external_exports.number(),
  alreadyRead: external_exports.boolean(),
  reason: external_exports.number(),
  resourceAlreadyRead: external_exports.boolean(),
  project: ProjectSchema.optional(),
  issue: IssueSchema.optional(),
  comment: IssueCommentSchema.optional(),
  pullRequest: PullRequestSchema.optional(),
  pullRequestComment: PullRequestCommentSchema.optional(),
  sender: UserSchema,
  created: external_exports.string()
});
var ActivitySchema = external_exports.object({
  id: external_exports.number(),
  project: ProjectSchema,
  type: ActivityTypeSchema,
  content: external_exports.any(),
  notifications: external_exports.array(external_exports.any()),
  createdUser: UserSchema,
  created: external_exports.string()
});
var NotificationCountSchema = external_exports.object({
  count: external_exports.number()
});
var PullRequestCountSchema = external_exports.object({
  count: external_exports.number()
});
var SpaceSchema = external_exports.object({
  spaceKey: external_exports.string(),
  name: external_exports.string(),
  ownerId: external_exports.number(),
  lang: external_exports.string(),
  timezone: external_exports.string(),
  reportSendTime: external_exports.string(),
  textFormattingRule: TextFormattingRuleSchema,
  created: external_exports.string(),
  updated: external_exports.string()
});
var WatchingListCountSchema = external_exports.object({
  count: external_exports.number()
});
var StarCountSchema = external_exports.object({
  count: external_exports.number()
});
var WikiListItemSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  name: external_exports.string(),
  tags: external_exports.array(TagSchema),
  createdUser: UserSchema,
  created: external_exports.string(),
  updatedUser: UserSchema,
  updated: external_exports.string()
});
var WikiCountSchema = external_exports.object({
  count: external_exports.number()
});
var DocumentSchema = external_exports.object({
  id: external_exports.number(),
  projectId: external_exports.number(),
  name: external_exports.string(),
  content: external_exports.string(),
  createdUser: UserSchema,
  created: external_exports.string(),
  updatedUser: UserSchema,
  updated: external_exports.string()
});
var DocumentAttachmentSchema = external_exports.object({
  filename: external_exports.string(),
  body: external_exports.any(),
  url: external_exports.string()
});
var DocumentTagSchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string()
});
var DocumentFileInfoSchema = external_exports.object({
  id: external_exports.number(),
  name: external_exports.string(),
  size: external_exports.number(),
  createdUser: UserSchema,
  created: external_exports.string()
});
var DocumentItemSchema = external_exports.object({
  id: external_exports.string(),
  projectId: external_exports.number(),
  title: external_exports.string(),
  plain: external_exports.string(),
  json: external_exports.string(),
  statusId: external_exports.number(),
  emoji: external_exports.string().nullable(),
  attachments: external_exports.array(DocumentFileInfoSchema),
  tags: external_exports.array(DocumentTagSchema),
  createdUser: UserSchema,
  created: external_exports.string(),
  updatedUser: UserSchema,
  updated: external_exports.string()
});
var DocumentTreeNodeSchema = external_exports.lazy(() => external_exports.object({
  id: external_exports.string(),
  name: external_exports.string().optional(),
  children: external_exports.array(DocumentTreeNodeSchema),
  statusId: external_exports.number().optional(),
  emoji: external_exports.string().optional(),
  emojiType: external_exports.string().optional(),
  updated: external_exports.string().optional()
}));
var ActiveTrashTreeSchema = external_exports.object({
  id: external_exports.string(),
  children: external_exports.array(DocumentTreeNodeSchema)
});
var DocumentTreeFullSchema = {
  projectId: external_exports.number(),
  activeTree: ActiveTrashTreeSchema.optional(),
  trashTree: ActiveTrashTreeSchema.optional()
};
var DocumentTreeFullSchemaZ = external_exports.object(DocumentTreeFullSchema);

// node_modules/backlog-mcp-server/build/types/tool.js
var buildToolSchema = (fn) => fn;

// node_modules/backlog-mcp-server/build/backlog/customFields.js
function customFieldsToPayload(customFields) {
  if (customFields == null) {
    return {};
  }
  const result = {};
  for (const field of customFields) {
    if (field.value !== void 0) {
      result[`customField_${field.id}`] = field.value;
    }
    if (field.otherValue !== void 0) {
      result[`customField_${field.id}_otherValue`] = field.otherValue;
    }
  }
  return result;
}
function customFieldFiltersToPayload(customFields) {
  if (!customFields || customFields.length === 0) {
    return {};
  }
  const result = {};
  for (const field of customFields) {
    const baseKey = `customField_${field.id}`;
    switch (field.type) {
      case "text": {
        if (field.value.trim().length > 0) {
          result[baseKey] = field.value;
        }
        break;
      }
      case "numeric": {
        if (field.min !== void 0) {
          result[`${baseKey}_min`] = field.min;
        }
        if (field.max !== void 0) {
          result[`${baseKey}_max`] = field.max;
        }
        break;
      }
      case "date": {
        if (field.min) {
          result[`${baseKey}_min`] = field.min;
        }
        if (field.max) {
          result[`${baseKey}_max`] = field.max;
        }
        break;
      }
      case "list": {
        if (Array.isArray(field.value)) {
          const values = field.value.filter((value) => Number.isFinite(value));
          if (values.length > 0) {
            result[`${baseKey}[]`] = values;
          }
        } else if (Number.isFinite(field.value)) {
          result[baseKey] = field.value;
        }
        break;
      }
      default: {
        const exhaustiveCheck = field;
        throw new Error(`Unsupported custom field filter type: ${exhaustiveCheck}`);
      }
    }
  }
  return result;
}

// node_modules/backlog-mcp-server/build/tools/addIssue.js
var addIssueSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().describe(t("TOOL_ADD_ISSUE_PROJECT_ID", "Project ID")),
  summary: external_exports.string().describe(t("TOOL_ADD_ISSUE_SUMMARY", "Summary of the issue")),
  issueTypeId: external_exports.number().describe(t("TOOL_ADD_ISSUE_ISSUE_TYPE_ID", "Issue type ID")),
  priorityId: external_exports.number().describe(t("TOOL_ADD_ISSUE_PRIORITY_ID", "Priority ID")),
  description: external_exports.string().optional().describe(t("TOOL_ADD_ISSUE_DESCRIPTION", "Detailed description of the issue")),
  startDate: external_exports.string().optional().describe(t("TOOL_ADD_ISSUE_START_DATE", "Scheduled start date (yyyy-MM-dd)")),
  dueDate: external_exports.string().optional().describe(t("TOOL_ADD_ISSUE_DUE_DATE", "Scheduled due date (yyyy-MM-dd)")),
  estimatedHours: external_exports.number().optional().describe(t("TOOL_ADD_ISSUE_ESTIMATED_HOURS", "Estimated work hours")),
  actualHours: external_exports.number().optional().describe(t("TOOL_ADD_ISSUE_ACTUAL_HOURS", "Actual work hours")),
  categoryId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_ISSUE_CATEGORY_ID", "Category IDs")),
  versionId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_ISSUE_VERSION_ID", "Version IDs")),
  milestoneId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_ISSUE_MILESTONE_ID", "Milestone IDs")),
  assigneeId: external_exports.number().optional().describe(t("TOOL_ADD_ISSUE_ASSIGNEE_ID", "User ID of the assignee")),
  notifiedUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_ISSUE_NOTIFIED_USER_ID", "User IDs to notify")),
  attachmentId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_ISSUE_ATTACHMENT_ID", "Attachment IDs")),
  parentIssueId: external_exports.number().optional().describe(t("TOOL_ADD_ISSUE_PARENT_ISSUE_ID", "Parent issue ID")),
  customFields: external_exports.array(external_exports.object({
    id: external_exports.number().describe(t("TOOL_ADD_ISSUE_CUSTOM_FIELD_ID", "The ID of the custom field (e.g., 12345)")),
    value: external_exports.union([
      external_exports.string(),
      external_exports.number(),
      external_exports.array(external_exports.string()),
      external_exports.array(external_exports.number())
    ]).optional().describe(t("TOOL_ADD_ISSUE_CUSTOM_FIELD_VALUE", "Value of the custom field. For text/date fields, provide a string. For numeric fields, provide a number. For list fields, provide an array of strings or numbers.")),
    otherValue: external_exports.string().optional().describe(t("TOOL_ADD_ISSUE_CUSTOM_FIELD_OTHER_VALUE", "Other value for list type fields"))
  })).optional().describe(t("TOOL_ADD_ISSUE_CUSTOM_FIELDS", "List of custom fields to set on the issue"))
}));
var addIssueTool = (backlog, { t }) => {
  return {
    name: "add_issue",
    description: t("TOOL_ADD_ISSUE_DESCRIPTION", "Creates a new issue in the specified project."),
    schema: external_exports.object(addIssueSchema(t)),
    outputSchema: IssueSchema,
    importantFields: ["summary", "issueKey", "description", "createdUser"],
    handler: async ({ customFields, ...params }) => {
      const customFieldPayload = customFieldsToPayload(customFields);
      const finalPayload = {
        ...params,
        ...customFieldPayload
      };
      return backlog.postIssue(finalPayload);
    }
  };
};

// node_modules/backlog-mcp-server/build/utils/resolveIdOrKey.js
function resolveIdOrField(entity, fieldName, values, t) {
  const value = tryResolveIdOrField(fieldName, values);
  if (value === void 0) {
    return {
      ok: false,
      error: new Error(t(`${entity.toUpperCase()}_ID_OR_${fieldName.toUpperCase()}_REQUIRED`, `${capitalize(entity)} ID or ${fieldName} is required`))
    };
  }
  return { ok: true, value };
}
function tryResolveIdOrField(fieldName, values) {
  return values.id !== void 0 ? values.id : values[fieldName];
}
var resolveIdOrKey = (entity, values, t) => resolveIdOrField(entity, "key", values, t);
var resolveIdOrName = (entity, values, t) => resolveIdOrField(entity, "name", values, t);
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// node_modules/backlog-mcp-server/build/tools/addIssueComment.js
var addIssueCommentSchema = buildToolSchema((t) => ({
  issueId: external_exports.number().optional().describe(t("TOOL_ADD_ISSUE_COMMENT_ID", "The numeric ID of the issue (e.g., 12345)")),
  issueKey: external_exports.string().optional().describe(t("TOOL_ADD_ISSUE_COMMENT_KEY", "The key of the issue (e.g., 'PROJ-123')")),
  content: external_exports.string().describe(t("TOOL_ADD_ISSUE_COMMENT_CONTENT", "Comment content")),
  notifiedUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_ISSUE_COMMENT_NOTIFIED_USER_ID", "User IDs to notify")),
  attachmentId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_ISSUE_COMMENT_ATTACHMENT_ID", "Attachment IDs"))
}));
var addIssueCommentTool = (backlog, { t }) => {
  return {
    name: "add_issue_comment",
    description: t("TOOL_ADD_ISSUE_COMMENT_DESCRIPTION", "Adds a comment to an issue"),
    schema: external_exports.object(addIssueCommentSchema(t)),
    outputSchema: IssueCommentSchema,
    handler: async ({ issueId, issueKey, content, notifiedUserId, attachmentId }) => {
      const result = resolveIdOrKey("issue", { id: issueId, key: issueKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.postIssueComments(result.value, {
        content,
        notifiedUserId,
        attachmentId
      });
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/addProject.js
var addProjectSchema = buildToolSchema((t) => ({
  name: external_exports.string().describe(t("TOOL_ADD_PROJECT_NAME", "Project name")),
  key: external_exports.string().describe(t("TOOL_ADD_PROJECT_KEY", "Project key")),
  chartEnabled: external_exports.boolean().optional().describe(t("TOOL_ADD_PROJECT_CHART_ENABLED", "Whether to enable chart (default: false)")),
  subtaskingEnabled: external_exports.boolean().optional().describe(t("TOOL_ADD_PROJECT_SUBTASKING_ENABLED", "Whether to enable subtasking (default: false)")),
  projectLeaderCanEditProjectLeader: external_exports.boolean().optional().describe(t("TOOL_ADD_PROJECT_LEADER_CAN_EDIT", "Whether project leaders can edit other project leaders (default: false)")),
  textFormattingRule: external_exports.enum(["backlog", "markdown"]).optional().describe(t("TOOL_ADD_PROJECT_TEXT_FORMATTING", "Text formatting rule (default: 'backlog')"))
}));
var addProjectTool = (backlog, { t }) => {
  return {
    name: "add_project",
    description: t("TOOL_ADD_PROJECT_DESCRIPTION", "Creates a new project"),
    schema: external_exports.object(addProjectSchema(t)),
    outputSchema: ProjectSchema,
    handler: async ({ name, key, chartEnabled, subtaskingEnabled, projectLeaderCanEditProjectLeader, textFormattingRule }) => backlog.postProject({
      name,
      key,
      chartEnabled: chartEnabled ?? false,
      subtaskingEnabled: subtaskingEnabled ?? false,
      projectLeaderCanEditProjectLeader: projectLeaderCanEditProjectLeader ?? false,
      textFormattingRule: textFormattingRule ?? "backlog"
    })
  };
};

// node_modules/backlog-mcp-server/build/tools/addPullRequest.js
var addPullRequestSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_ADD_PULL_REQUEST_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_ADD_PULL_REQUEST_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_ADD_PULL_REQUEST_REPO_ID", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_ADD_PULL_REQUEST_REPO_NAME", "Repository name")),
  summary: external_exports.string().describe(t("TOOL_ADD_PULL_REQUEST_SUMMARY", "Summary of the pull request")),
  description: external_exports.string().describe(t("TOOL_ADD_PULL_REQUEST_DESCRIPTION", "Description of the pull request")),
  base: external_exports.string().describe(t("TOOL_ADD_PULL_REQUEST_BASE", "Base branch name")),
  branch: external_exports.string().describe(t("TOOL_ADD_PULL_REQUEST_BRANCH", "Branch name to merge")),
  issueId: external_exports.number().optional().describe(t("TOOL_ADD_PULL_REQUEST_ISSUE_ID", "Issue ID to link")),
  assigneeId: external_exports.number().optional().describe(t("TOOL_ADD_PULL_REQUEST_ASSIGNEE_ID", "User ID of the assignee")),
  notifiedUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_PULL_REQUEST_NOTIFIED_USER_ID", "User IDs to notify"))
}));
var addPullRequestTool = (backlog, { t }) => {
  return {
    name: "add_pull_request",
    description: t("TOOL_ADD_PULL_REQUEST_DESCRIPTION", "Creates a new pull request"),
    schema: external_exports.object(addPullRequestSchema(t)),
    outputSchema: PullRequestSchema,
    handler: async ({ projectId, projectKey, repoId, repoName, ...params }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const repoRes = resolveIdOrName("repository", { id: repoId, name: repoName }, t);
      if (!repoRes.ok) {
        throw repoRes.error;
      }
      return backlog.postPullRequest(result.value, String(repoRes.value), params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/addPullRequestComment.js
var addPullRequestCommentSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_ADD_PULL_REQUEST_COMMENT_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_ADD_PULL_REQUEST_COMMENT_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_ADD_PULL_REQUEST_REPO_ID", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_ADD_PULL_REQUEST_REPO_NAME", "Repository name")),
  number: external_exports.number().describe(t("TOOL_ADD_PULL_REQUEST_COMMENT_NUMBER", "Pull request number")),
  content: external_exports.string().describe(t("TOOL_ADD_PULL_REQUEST_COMMENT_CONTENT", "Comment content")),
  notifiedUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_ADD_PULL_REQUEST_COMMENT_NOTIFIED_USER_ID", "User IDs to notify"))
}));
var addPullRequestCommentTool = (backlog, { t }) => {
  return {
    name: "add_pull_request_comment",
    description: t("TOOL_ADD_PULL_REQUEST_COMMENT_DESCRIPTION", "Adds a comment to a pull request"),
    schema: external_exports.object(addPullRequestCommentSchema(t)),
    outputSchema: PullRequestCommentSchema,
    importantFields: ["id", "content", "createdUser"],
    handler: async ({ projectId, projectKey, repoId, repoName, number, ...params }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const repoRes = resolveIdOrName("repository", { id: repoId, name: repoName }, t);
      if (!repoRes.ok) {
        throw repoRes.error;
      }
      return backlog.postPullRequestComments(result.value, String(repoRes.value), number, params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/addWiki.js
var addWikiSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().describe(t("TOOL_ADD_WIKI_PROJECT_ID", "Project ID")),
  name: external_exports.string().describe(t("TOOL_ADD_WIKI_NAME", "Name of the wiki page")),
  content: external_exports.string().describe(t("TOOL_ADD_WIKI_CONTENT", "Content of the wiki page")),
  mailNotify: external_exports.boolean().optional().describe(t("TOOL_ADD_WIKI_MAIL_NOTIFY", "Whether to send notification emails (default: false)"))
}));
var addWikiTool = (backlog, { t }) => {
  return {
    name: "add_wiki",
    description: t("TOOL_ADD_WIKI_DESCRIPTION", "Creates a new wiki page"),
    schema: external_exports.object(addWikiSchema(t)),
    outputSchema: WikiSchema,
    importantFields: ["id", "name", "content", "createdUser"],
    handler: async ({ projectId, name, content, mailNotify }) => backlog.postWiki({
      projectId,
      name,
      content,
      mailNotify
    })
  };
};

// node_modules/backlog-mcp-server/build/tools/updateWiki.js
var updateWikiSchema = buildToolSchema((t) => ({
  wikiId: external_exports.union([external_exports.string(), external_exports.number()]).describe(t("TOOL_UPDATE_WIKI_ID", "Wiki ID")),
  name: external_exports.string().optional().describe(t("TOOL_UPDATE_WIKI_NAME", "Name of the wiki page")),
  content: external_exports.string().optional().describe(t("TOOL_UPDATE_WIKI_CONTENT", "Content of the wiki page")),
  mailNotify: external_exports.boolean().optional().describe(t("TOOL_UPDATE_WIKI_MAIL_NOTIFY", "Whether to send notification emails (default: false)"))
}));
var updateWikiTool = (backlog, { t }) => {
  return {
    name: "update_wiki",
    description: t("TOOL_UPDATE_WIKI_DESCRIPTION", "Updates an existing wiki page"),
    schema: external_exports.object(updateWikiSchema(t)),
    outputSchema: WikiSchema,
    importantFields: ["id", "name", "content", "updatedUser"],
    handler: async ({ wikiId, name, content, mailNotify }) => {
      const wikiIdNumber = typeof wikiId === "string" ? parseInt(wikiId, 10) : wikiId;
      return backlog.patchWiki(wikiIdNumber, {
        name,
        content,
        mailNotify
      });
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/shared/customFieldFiltersSchema.js
var buildCustomFieldFilterSchema = (t) => {
  const schema = external_exports.discriminatedUnion("type", [
    external_exports.object({
      type: external_exports.literal("text"),
      id: external_exports.number().describe(t("TOOL_CUSTOM_FIELD_FILTER_ID", "Custom field ID (e.g., 12345)")),
      value: external_exports.string().min(1).describe(t("TOOL_CUSTOM_FIELD_FILTER_TEXT_VALUE", "Keyword to match for the custom field"))
    }).describe(t("TOOL_CUSTOM_FIELD_FILTER_TEXT", "Text custom field filter")),
    external_exports.object({
      type: external_exports.literal("numeric"),
      id: external_exports.number().describe(t("TOOL_CUSTOM_FIELD_FILTER_ID", "Custom field ID (e.g., 12345)")),
      min: external_exports.number().optional().describe(t("TOOL_CUSTOM_FIELD_FILTER_NUMERIC_MIN", "Minimum numeric value (inclusive)")),
      max: external_exports.number().optional().describe(t("TOOL_CUSTOM_FIELD_FILTER_NUMERIC_MAX", "Maximum numeric value (inclusive)"))
    }).describe(t("TOOL_CUSTOM_FIELD_FILTER_NUMERIC", "Numeric custom field filter")),
    external_exports.object({
      type: external_exports.literal("date"),
      id: external_exports.number().describe(t("TOOL_CUSTOM_FIELD_FILTER_ID", "Custom field ID (e.g., 12345)")),
      min: external_exports.string().optional().describe(t("TOOL_CUSTOM_FIELD_FILTER_DATE_MIN", "Start date (yyyy-MM-dd)")),
      max: external_exports.string().optional().describe(t("TOOL_CUSTOM_FIELD_FILTER_DATE_MAX", "End date (yyyy-MM-dd)"))
    }).describe(t("TOOL_CUSTOM_FIELD_FILTER_DATE", "Date custom field filter")),
    external_exports.object({
      type: external_exports.literal("list"),
      id: external_exports.number().describe(t("TOOL_CUSTOM_FIELD_FILTER_ID", "Custom field ID (e.g., 12345)")),
      value: external_exports.union([external_exports.number(), external_exports.array(external_exports.number()).min(1)]).describe(t("TOOL_CUSTOM_FIELD_FILTER_LIST_VALUE", "Value ID(s) to match for list-type custom field"))
    }).describe(t("TOOL_CUSTOM_FIELD_FILTER_LIST", "List custom field filter"))
  ]);
  return schema.superRefine((data, ctx) => {
    if (data.type === "numeric" && data.min === void 0 && data.max === void 0) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: t("TOOL_CUSTOM_FIELD_FILTER_NUMERIC_REQUIRED", "Provide at least one of min or max for numeric filters"),
        path: ["min"]
      });
    }
    if (data.type === "date" && !data.min && !data.max) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: t("TOOL_CUSTOM_FIELD_FILTER_DATE_REQUIRED", "Provide at least one of min or max for date filters"),
        path: ["min"]
      });
    }
  });
};

// node_modules/backlog-mcp-server/build/tools/countIssues.js
var countIssuesSchema = buildToolSchema((t) => ({
  projectId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_PROJECT_ID", "Project IDs")),
  issueTypeId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_ISSUE_TYPE_ID", "Issue type IDs")),
  categoryId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_CATEGORY_ID", "Category IDs")),
  versionId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_VERSION_ID", "Version IDs")),
  milestoneId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_MILESTONE_ID", "Milestone IDs")),
  statusId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_STATUS_ID", "Status IDs")),
  priorityId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_PRIORITY_ID", "Priority IDs")),
  assigneeId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_ASSIGNEE_ID", "Assignee user IDs")),
  createdUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_CREATED_USER_ID", "Created user IDs")),
  resolutionId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_RESOLUTION_ID", "Resolution IDs")),
  parentIssueId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_COUNT_ISSUES_PARENT_ISSUE_ID", "Parent issue IDs")),
  keyword: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_KEYWORD", "Keyword to search for in issues")),
  startDateSince: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_START_DATE_SINCE", "Start date since (yyyy-MM-dd)")),
  startDateUntil: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_START_DATE_UNTIL", "Start date until (yyyy-MM-dd)")),
  dueDateSince: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_DUE_DATE_SINCE", "Due date since (yyyy-MM-dd)")),
  dueDateUntil: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_DUE_DATE_UNTIL", "Due date until (yyyy-MM-dd)")),
  createdSince: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_CREATED_SINCE", "Created since (yyyy-MM-dd)")),
  createdUntil: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_CREATED_UNTIL", "Created until (yyyy-MM-dd)")),
  updatedSince: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_UPDATED_SINCE", "Updated since (yyyy-MM-dd)")),
  updatedUntil: external_exports.string().optional().describe(t("TOOL_COUNT_ISSUES_UPDATED_UNTIL", "Updated until (yyyy-MM-dd)")),
  customFields: external_exports.array(buildCustomFieldFilterSchema(t)).optional().describe(t("TOOL_COUNT_ISSUES_CUSTOM_FIELDS", "Custom field filters (text, numeric, date, or list)"))
}));
var countIssuesTool = (backlog, { t }) => {
  return {
    name: "count_issues",
    description: t("TOOL_COUNT_ISSUES_DESCRIPTION", "Returns count of issues"),
    schema: external_exports.object(countIssuesSchema(t)),
    outputSchema: IssueCountSchema,
    handler: async ({ customFields, ...rest }) => {
      return backlog.getIssuesCount({
        ...rest,
        ...customFieldFiltersToPayload(customFields)
      });
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/deleteIssue.js
var deleteIssueSchema = buildToolSchema((t) => ({
  issueId: external_exports.number().optional().describe(t("TOOL_DELETE_ISSUE_ISSUE_ID", "The numeric ID of the issue (e.g., 12345)")),
  issueKey: external_exports.string().optional().describe(t("TOOL_GET_ISSUE_ISSUE_KEY", "The key of the issue (e.g., 'PROJ-123')"))
}));
var deleteIssueTool = (backlog, { t }) => {
  return {
    name: "delete_issue",
    description: t("TOOL_DELETE_ISSUE_DESCRIPTION", "Deletes an issue"),
    schema: external_exports.object(deleteIssueSchema(t)),
    outputSchema: IssueSchema,
    handler: async ({ issueId, issueKey }) => {
      const result = resolveIdOrKey("issue", { id: issueId, key: issueKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.deleteIssue(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/deleteProject.js
var deleteProjectSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_DELETE_PROJECT_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_DELETE_PROJECT_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')"))
}));
var deleteProjectTool = (backlog, { t }) => {
  return {
    name: "delete_project",
    description: t("TOOL_DELETE_PROJECT_DESCRIPTION", "Deletes a project"),
    schema: external_exports.object(deleteProjectSchema(t)),
    outputSchema: ProjectSchema,
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.deleteProject(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getCategories.js
var getCategoriesSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_CATEGORIES_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_CATEGORIES_PROJECT_ID", "The key of the project (e.g., 'PROJECT')"))
}));
var getCategoriesTool = (backlog, { t }) => {
  return {
    name: "get_categories",
    description: t("TOOL_GET_CATEGORIES_DESCRIPTION", "Returns list of categories for a project"),
    schema: external_exports.object(getCategoriesSchema(t)),
    importantFields: ["id", "projectId", "name"],
    outputSchema: CategorySchema,
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getCategories(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getCustomFields.js
var getCustomFieldsInputSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_CUSTOM_FIELDS_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_CUSTOM_FIELDS_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')"))
}));
var getCustomFieldsTool = (backlog, { t }) => {
  const inputSchemaObject = external_exports.object(getCustomFieldsInputSchema(t));
  return {
    name: "get_custom_fields",
    description: t("TOOL_GET_CUSTOM_FIELDS_DESCRIPTION", "Returns list of custom fields for a project"),
    schema: inputSchemaObject,
    outputSchema: CustomFieldSchema,
    importantFields: [
      "id",
      "name",
      "typeId",
      "required",
      "applicableIssueTypes"
    ],
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getCustomFields(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getGitRepositories.js
var getGitRepositoriesSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_GIT_REPOSITORIES_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_GIT_REPOSITORIES_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')"))
}));
var getGitRepositoriesTool = (backlog, { t }) => {
  return {
    name: "get_git_repositories",
    description: t("TOOL_GET_GIT_REPOSITORIES_DESCRIPTION", "Returns list of Git repositories for a project"),
    schema: external_exports.object(getGitRepositoriesSchema(t)),
    outputSchema: GitRepositorySchema,
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getGitRepositories(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getGitRepository.js
var getGitRepositorySchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_GIT_REPOSITORY_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_GIT_REPOSITORY_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_GET_GIT_REPOSITORY_REPO_ID", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_GET_GIT_REPOSITORY_REPO_NAME", "Repository name"))
}));
var getGitRepositoryTool = (backlog, { t }) => {
  return {
    name: "get_git_repository",
    description: t("TOOL_GET_GIT_REPOSITORY_DESCRIPTION", "Returns information about a specific Git repository"),
    schema: external_exports.object(getGitRepositorySchema(t)),
    outputSchema: GitRepositorySchema,
    handler: async ({ projectId, projectKey, repoId, repoName }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const repoResult = resolveIdOrName("repository", { id: repoId, name: repoName }, t);
      if (!repoResult.ok) {
        throw repoResult.error;
      }
      return backlog.getGitRepository(result.value, String(repoResult.value));
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getIssue.js
var getIssueSchema = buildToolSchema((t) => ({
  issueId: external_exports.number().optional().describe(t("TOOL_GET_ISSUE_ISSUE_ID", "The numeric ID of the issue (e.g., 12345)")),
  issueKey: external_exports.string().optional().describe(t("TOOL_GET_ISSUE_ISSUE_KEY", "The key of the issue (e.g., 'PROJ-123')"))
}));
var getIssueTool = (backlog, { t }) => {
  return {
    name: "get_issue",
    description: t("TOOL_GET_ISSUE_DESCRIPTION", "Returns information about a specific issue"),
    outputSchema: IssueSchema,
    schema: external_exports.object(getIssueSchema(t)),
    handler: async ({ issueId, issueKey }) => {
      const result = resolveIdOrKey("issue", { id: issueId, key: issueKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getIssue(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getIssueComments.js
var getIssueCommentsSchema = buildToolSchema((t) => ({
  issueId: external_exports.number().optional().describe(t("TOOL_GET_ISSUE_COMMENTS_ISSUE_ID", "The numeric ID of the issue (e.g., 12345)")),
  issueKey: external_exports.string().optional().describe(t("TOOL_GET_ISSUE_COMMENTS_ISSUE_KEY", "The key of the issue (e.g., 'PROJ-123')")),
  minId: external_exports.number().optional().describe(t("TOOL_GET_ISSUE_COMMENTS_MIN_ID", "Minimum comment ID")),
  maxId: external_exports.number().optional().describe(t("TOOL_GET_ISSUE_COMMENTS_MAX_ID", "Maximum comment ID")),
  count: external_exports.number().optional().describe(t("TOOL_GET_ISSUE_COMMENTS_COUNT", "Number of comments to retrieve")),
  order: external_exports.enum(["asc", "desc"]).optional().describe(t("TOOL_GET_ISSUE_COMMENTS_ORDER", "Sort order"))
}));
var getIssueCommentsTool = (backlog, { t }) => {
  return {
    name: "get_issue_comments",
    description: t("TOOL_GET_ISSUE_COMMENTS_DESCRIPTION", "Returns list of comments for an issue"),
    schema: external_exports.object(getIssueCommentsSchema(t)),
    outputSchema: IssueCommentSchema,
    handler: async ({ issueId, issueKey, ...params }) => {
      const result = resolveIdOrKey("issue", { id: issueId, key: issueKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getIssueComments(result.value, params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getIssues.js
var getIssuesSchema = buildToolSchema((t) => ({
  projectId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_PROJECT_ID", "Project IDs")),
  issueTypeId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_ISSUE_TYPE_ID", "Issue type IDs")),
  categoryId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_CATEGORY_ID", "Category IDs")),
  versionId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_VERSION_ID", "Version IDs")),
  milestoneId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_MILESTONE_ID", "Milestone IDs")),
  statusId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_STATUS_ID", "Status IDs")),
  priorityId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_PRIORITY_ID", "Priority IDs")),
  assigneeId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_ASSIGNEE_ID", "Assignee user IDs")),
  createdUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_CREATED_USER_ID", "Created user IDs")),
  resolutionId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_RESOLUTION_ID", "Resolution IDs")),
  parentIssueId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_ISSUES_PARENT_ISSUE_ID", "Parent issue IDs")),
  keyword: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_KEYWORD", "Keyword to search for in issues")),
  startDateSince: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_START_DATE_SINCE", "Start date since (yyyy-MM-dd)")),
  startDateUntil: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_START_DATE_UNTIL", "Start date until (yyyy-MM-dd)")),
  dueDateSince: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_DUE_DATE_SINCE", "Due date since (yyyy-MM-dd)")),
  dueDateUntil: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_DUE_DATE_UNTIL", "Due date until (yyyy-MM-dd)")),
  createdSince: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_CREATED_SINCE", "Created since (yyyy-MM-dd)")),
  createdUntil: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_CREATED_UNTIL", "Created until (yyyy-MM-dd)")),
  updatedSince: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_UPDATED_SINCE", "Updated since (yyyy-MM-dd)")),
  updatedUntil: external_exports.string().optional().describe(t("TOOL_GET_ISSUES_UPDATED_UNTIL", "Updated until (yyyy-MM-dd)")),
  sort: external_exports.enum([
    "issueType",
    "category",
    "version",
    "milestone",
    "summary",
    "status",
    "priority",
    "attachment",
    "sharedFile",
    "created",
    "createdUser",
    "updated",
    "updatedUser",
    "assignee",
    "startDate",
    "dueDate",
    "estimatedHours",
    "actualHours",
    "childIssue"
  ]).optional().describe(t("TOOL_GET_ISSUES_SORT", "Sort field")),
  order: external_exports.enum(["asc", "desc"]).optional().describe(t("TOOL_GET_ISSUES_ORDER", "Sort order")),
  offset: external_exports.number().optional().describe(t("TOOL_GET_ISSUES_OFFSET", "Offset for pagination")),
  count: external_exports.number().optional().describe(t("TOOL_GET_ISSUES_COUNT", "Number of issues to retrieve")),
  customFields: external_exports.array(buildCustomFieldFilterSchema(t)).optional().describe(t("TOOL_GET_ISSUES_CUSTOM_FIELDS", "Custom field filters (text, numeric, date, or list)"))
}));
var getIssuesTool = (backlog, { t }) => {
  return {
    name: "get_issues",
    description: t("TOOL_GET_ISSUES_DESCRIPTION", "Returns list of issues"),
    schema: external_exports.object(getIssuesSchema(t)),
    importantFields: [
      "projectId",
      "issueKey",
      "keyId",
      "summary",
      "description",
      "issueType"
    ],
    outputSchema: IssueSchema,
    handler: async ({ customFields, ...rest }) => {
      return backlog.getIssues({
        ...rest,
        ...customFieldFiltersToPayload(customFields)
      });
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getIssueTypes.js
var getIssueTypesSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_GIT_REPOSITORIES_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_GIT_REPOSITORIES_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')"))
}));
var getIssueTypesTool = (backlog, { t }) => {
  return {
    name: "get_issue_types",
    description: t("TOOL_GET_ISSUE_TYPES_DESCRIPTION", "Returns list of issue types for a project"),
    schema: external_exports.object(getIssueTypesSchema(t)),
    outputSchema: IssueTypeSchema,
    importantFields: ["id", "name"],
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getIssueTypes(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getMyself.js
var getMyselfSchema = buildToolSchema((_t) => ({}));
var getMyselfTool = (backlog, { t }) => {
  return {
    name: "get_myself",
    description: t("TOOL_GET_MYSELF_DESCRIPTION", "Returns information about the authenticated user"),
    schema: external_exports.object(getMyselfSchema(t)),
    outputSchema: UserSchema,
    importantFields: ["id", "userId", "name", "roleType"],
    handler: async () => backlog.getMyself()
  };
};

// node_modules/backlog-mcp-server/build/tools/getNotifications.js
var getNotificationsSchema = buildToolSchema((t) => ({
  minId: external_exports.number().optional().describe(t("TOOL_GET_NOTIFICATIONS_MIN_ID", "Minimum notification ID")),
  maxId: external_exports.number().optional().describe(t("TOOL_GET_NOTIFICATIONS_MAX_ID", "Maximum notification ID")),
  count: external_exports.number().optional().describe(t("TOOL_GET_NOTIFICATIONS_COUNT", "Number of notifications to retrieve")),
  order: external_exports.enum(["asc", "desc"]).optional().describe(t("TOOL_GET_NOTIFICATIONS_ORDER", "Sort order"))
}));
var getNotificationsTool = (backlog, { t }) => {
  return {
    name: "get_notifications",
    description: t("TOOL_GET_NOTIFICATIONS_DESCRIPTION", "Returns list of notifications"),
    schema: external_exports.object(getNotificationsSchema(t)),
    outputSchema: NotificationSchema,
    handler: async ({ minId, maxId, count, order }) => backlog.getNotifications({
      minId,
      maxId,
      count,
      order
    })
  };
};

// node_modules/backlog-mcp-server/build/tools/getNotificationsCount.js
var getNotificationsCountSchema = buildToolSchema((t) => ({
  alreadyRead: external_exports.boolean().describe(t("TOOL_GET_NOTIFICATIONS_COUNT_ALREADY_READ", "Whether to include already read notifications")),
  resourceAlreadyRead: external_exports.boolean().describe(t("TOOL_GET_NOTIFICATIONS_COUNT_RESOURCE_ALREADY_READ", "Whether to include notifications for already read resources"))
}));
var getNotificationsCountTool = (backlog, { t }) => {
  return {
    name: "count_notifications",
    description: t("TOOL_COUNT_NOTIFICATIONS_DESCRIPTION", "Returns count of notifications"),
    schema: external_exports.object(getNotificationsCountSchema(t)),
    outputSchema: NotificationCountSchema,
    handler: async (params) => backlog.getNotificationsCount(params)
  };
};

// node_modules/backlog-mcp-server/build/tools/getPriorities.js
var getPrioritiesSchema = buildToolSchema((_t) => ({}));
var getPrioritiesTool = (backlog, { t }) => {
  return {
    name: "get_priorities",
    description: t("TOOL_GET_PRIORITIES_DESCRIPTION", "Returns list of priorities"),
    schema: external_exports.object(getPrioritiesSchema(t)),
    outputSchema: PrioritySchema,
    handler: async () => backlog.getPriorities()
  };
};

// node_modules/backlog-mcp-server/build/tools/getProject.js
var getProjectSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_PROJECT_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_PROJECT_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')"))
}));
var getProjectTool = (backlog, { t }) => {
  return {
    name: "get_project",
    description: t("TOOL_GET_PROJECT_DESCRIPTION", "Returns information about a specific project"),
    schema: external_exports.object(getProjectSchema(t)),
    outputSchema: ProjectSchema,
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getProject(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getProjectList.js
var getProjectListSchema = buildToolSchema((t) => ({
  archived: external_exports.boolean().optional().describe(t("TOOL_GET_PROJECT_LIST_ARCHIVED", "For unspecified parameters, this form returns all projects. For \u2018false\u2019 parameters, it returns unarchived projects. For \u2018true\u2019 parameters, it returns archived projects.")),
  all: external_exports.boolean().optional().describe(t("TOOL_GET_PROJECT_LIST_ALL", "Only applies to administrators. If \u2018true,\u2019 it returns all projects. If \u2018false,\u2019 it returns only projects they have joined."))
}));
var getProjectListTool = (backlog, { t }) => {
  return {
    name: "get_project_list",
    description: t("TOOL_GET_PROJECT_LIST_DESCRIPTION", "Returns list of projects"),
    schema: external_exports.object(getProjectListSchema(t)),
    outputSchema: ProjectSchema,
    importantFields: ["id", "projectKey", "name"],
    handler: async ({ archived, all }) => backlog.getProjects({ archived, all })
  };
};

// node_modules/backlog-mcp-server/build/tools/getProjectUsers.js
var getProjectUsersSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_PROJECT_USERS_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_PROJECT_USERS_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')"))
}));
var getProjectUsersTool = (backlog, { t }) => {
  return {
    name: "get_project_users",
    description: t("TOOL_GET_PROJECT_USERS_DESCRIPTION", "Returns list of users in a specific project"),
    schema: external_exports.object(getProjectUsersSchema(t)),
    outputSchema: UserSchema,
    importantFields: ["userId", "name", "roleType", "lang"],
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getProjectUsers(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getPullRequest.js
var getPullRequestSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUEST_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_PULL_REQUEST_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUEST_REPO_ID", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_GET_PULL_REQUEST_REPO_NAME", "Repository name")),
  number: external_exports.number().describe(t("TOOL_GET_PULL_REQUEST_NUMBER", "Pull request number"))
}));
var getPullRequestTool = (backlog, { t }) => {
  return {
    name: "get_pull_request",
    description: t("TOOL_GET_PULL_REQUEST_DESCRIPTION", "Returns information about a specific pull request"),
    schema: external_exports.object(getPullRequestSchema(t)),
    outputSchema: PullRequestSchema,
    handler: async ({ projectId, projectKey, repoId, repoName, number }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const repoRes = resolveIdOrName("repository", { id: repoId, name: repoName }, t);
      if (!repoRes.ok) {
        throw repoRes.error;
      }
      return backlog.getPullRequest(result.value, String(repoRes.value), number);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getPullRequestComments.js
var getPullRequestCommentsSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_PROJECT_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_PROJECT_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUEST_COMMENTS_REPO_ID_OR_NAME", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_GET_PULL_REQUEST_COMMENTS_REPO_ID_OR_NAME", "Repository name")),
  number: external_exports.number().describe(t("TOOL_GET_PULL_REQUEST_COMMENTS_NUMBER", "Pull request number")),
  minId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUEST_COMMENTS_MIN_ID", "Minimum comment ID")),
  maxId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUEST_COMMENTS_MAX_ID", "Maximum comment ID")),
  count: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUEST_COMMENTS_COUNT", "Number of comments to retrieve")),
  order: external_exports.enum(["asc", "desc"]).optional().describe(t("TOOL_GET_PULL_REQUEST_COMMENTS_ORDER", "Sort order"))
}));
var getPullRequestCommentsTool = (backlog, { t }) => {
  return {
    name: "get_pull_request_comments",
    description: t("TOOL_GET_PULL_REQUEST_COMMENTS_DESCRIPTION", "Returns list of comments for a pull request"),
    schema: external_exports.object(getPullRequestCommentsSchema(t)),
    outputSchema: PullRequestCommentSchema,
    handler: async ({ projectId, projectKey, repoId, repoName, number, ...params }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const repoResult = resolveIdOrName("repository", { id: repoId, name: repoName }, t);
      if (!repoResult.ok) {
        throw repoResult.error;
      }
      return backlog.getPullRequestComments(result.value, String(repoResult.value), number, params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getPullRequests.js
var getPullRequestsSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUESTS_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_PULL_REQUESTS_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUESTS_REPO_ID", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_GET_PULL_REQUESTS_REPO_NAME", "Repository name")),
  statusId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_PULL_REQUESTS_STATUS_ID", "Status IDs")),
  assigneeId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_PULL_REQUESTS_ASSIGNEE_ID", "Assignee user IDs")),
  issueId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_PULL_REQUESTS_ISSUE_ID", "Issue IDs")),
  createdUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_PULL_REQUESTS_CREATED_USER_ID", "Created user IDs")),
  offset: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUESTS_OFFSET", "Offset for pagination")),
  count: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT", "Number of pull requests to retrieve"))
}));
var getPullRequestsTool = (backlog, { t }) => {
  return {
    name: "get_pull_requests",
    description: t("TOOL_GET_PULL_REQUESTS_DESCRIPTION", "Returns list of pull requests for a repository"),
    schema: external_exports.object(getPullRequestsSchema(t)),
    outputSchema: PullRequestSchema,
    handler: async ({ projectId, projectKey, repoId, repoName, ...params }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const repoResult = resolveIdOrName("repository", { id: repoId, name: repoName }, t);
      if (!repoResult.ok) {
        throw repoResult.error;
      }
      return backlog.getPullRequests(result.value, String(repoResult.value), params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getPullRequestsCount.js
var getPullRequestsCountSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT_REPO_ID", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT_REPO_NAME", "Repository name")),
  statusId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT_STATUS_ID", "Status IDs")),
  assigneeId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT_ASSIGNEE_ID", "Assignee user IDs")),
  issueId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT_ISSUE_ID", "Issue IDs")),
  createdUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_GET_PULL_REQUESTS_COUNT_CREATED_USER_ID", "Created user IDs"))
}));
var getPullRequestsCountTool = (backlog, { t }) => {
  return {
    name: "get_pull_requests_count",
    description: t("TOOL_GET_PULL_REQUESTS_COUNT_DESCRIPTION", "Returns count of pull requests for a repository"),
    schema: external_exports.object(getPullRequestsCountSchema(t)),
    outputSchema: PullRequestCountSchema,
    handler: async ({ projectId, projectKey, repoId, repoName, ...params }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const repoResult = resolveIdOrName("repository", { id: repoId, name: repoName }, t);
      if (!repoResult.ok) {
        throw repoResult.error;
      }
      return backlog.getPullRequestsCount(result.value, String(repoResult.value), params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getResolutions.js
var getResolutionsSchema = buildToolSchema((_t) => ({}));
var getResolutionsTool = (backlog, { t }) => {
  return {
    name: "get_resolutions",
    description: t("TOOL_GET_RESOLUTIONS_DESCRIPTION", "Returns list of issue resolutions"),
    schema: external_exports.object(getResolutionsSchema(t)),
    outputSchema: ResolutionSchema,
    handler: async () => backlog.getResolutions()
  };
};

// node_modules/backlog-mcp-server/build/tools/getSpace.js
var getSpaceSchema = buildToolSchema((_t) => ({}));
var getSpaceTool = (backlog, { t }) => {
  return {
    name: "get_space",
    description: t("TOOL_GET_SPACE_DESCRIPTION", "Returns information about the Backlog space"),
    schema: external_exports.object(getSpaceSchema(t)),
    outputSchema: SpaceSchema,
    importantFields: ["spaceKey", "name", "lang", "timezone"],
    handler: async () => backlog.getSpace()
  };
};

// node_modules/backlog-mcp-server/build/tools/getSpaceActivities.js
var getSpaceActivitiesSchema = buildToolSchema((t) => ({
  activityTypeId: external_exports.array(ActivityTypeSchema).optional().describe(t("TOOL_GET_SPACE_ACTIVITIES_ACTIVITY_TYPE_ID", "Activity type IDs")),
  minId: external_exports.number().optional().describe(t("TOOL_GET_SPACE_ACTIVITIES_MIN_ID", "Minimum activity ID")),
  maxId: external_exports.number().optional().describe(t("TOOL_GET_SPACE_ACTIVITIES_MAX_ID", "Maximum activity ID")),
  count: external_exports.number().min(1).max(100).optional().describe(t("TOOL_GET_SPACE_ACTIVITIES_COUNT", "Number of activities to retrieve")),
  order: external_exports.enum(["asc", "desc"]).optional().describe(t("TOOL_GET_SPACE_ACTIVITIES_ORDER", "Sort order"))
}));
var getSpaceActivitiesTool = (backlog, { t }) => {
  return {
    name: "get_space_activities",
    description: t("TOOL_GET_SPACE_ACTIVITIES_DESCRIPTION", "Returns list of space activities"),
    schema: external_exports.object(getSpaceActivitiesSchema(t)),
    outputSchema: ActivitySchema,
    handler: async ({ activityTypeId, minId, maxId, count, order }) => backlog.getSpaceActivities({
      activityTypeId,
      minId,
      maxId,
      count,
      order
    })
  };
};

// node_modules/backlog-mcp-server/build/tools/getUserStarsCount.js
var getUserStarsCountSchema = buildToolSchema((t) => ({
  userId: external_exports.number().describe(t("TOOL_GET_USER_STARS_COUNT_USER_ID", "User ID")),
  since: external_exports.string().optional().describe(t("TOOL_GET_USER_STARS_COUNT_SINCE", "Count stars received after this date (yyyy-MM-dd)")),
  until: external_exports.string().optional().describe(t("TOOL_GET_USER_STARS_COUNT_UNTIL", "Count stars received before this date (yyyy-MM-dd)"))
}));
var getUserStarsCountTool = (backlog, { t }) => {
  return {
    name: "get_user_stars_count",
    description: t("TOOL_GET_USER_STARS_COUNT_DESCRIPTION", "Returns the count of stars received by a user"),
    schema: external_exports.object(getUserStarsCountSchema(t)),
    outputSchema: StarCountSchema,
    handler: async ({ userId, since, until }) => backlog.getUserStarsCount(userId, { since, until })
  };
};

// node_modules/backlog-mcp-server/build/tools/getUsers.js
var getUsersSchema = buildToolSchema((_t) => ({}));
var getUsersTool = (backlog, { t }) => {
  return {
    name: "get_users",
    description: t("TOOL_GET_USERS_DESCRIPTION", "Returns list of users in the Backlog space"),
    schema: external_exports.object(getUsersSchema(t)),
    outputSchema: UserSchema,
    importantFields: ["userId", "name", "roleType", "lang"],
    handler: async () => backlog.getUsers()
  };
};

// node_modules/backlog-mcp-server/build/tools/getUserRecentUpdates.js
var getUserRecentUpdatesSchema = buildToolSchema((t) => ({
  userId: external_exports.number().describe(t("TOOL_GET_USER_RECENT_UPDATES_USER_ID", "ID of the user to retrieve activities for")),
  activityTypeId: external_exports.array(ActivityTypeSchema).optional().describe(t("TOOL_GET_USER_RECENT_UPDATES_ACTIVITY_TYPE_ID", "Activity type IDs to filter by")),
  minId: external_exports.number().optional().describe(t("TOOL_GET_USER_RECENT_UPDATES_MIN_ID", "Minimum activity ID")),
  maxId: external_exports.number().optional().describe(t("TOOL_GET_USER_RECENT_UPDATES_MAX_ID", "Maximum activity ID")),
  count: external_exports.number().min(1).max(100).default(20).optional().describe(t("TOOL_GET_USER_RECENT_UPDATES_COUNT", "Number of activities to retrieve (1-100, default: 20)")),
  order: external_exports.enum(["asc", "desc"]).default("desc").optional().describe(t("TOOL_GET_USER_RECENT_UPDATES_ORDER", 'Sort order ("asc" or "desc", default: "desc")'))
}));
var getUserRecentUpdatesTool = (backlog, { t }) => {
  return {
    name: "get_user_recent_updates",
    description: t("TOOL_GET_USER_RECENT_UPDATES_DESCRIPTION", "Returns recent updates (activities) for a specific user"),
    schema: external_exports.object(getUserRecentUpdatesSchema(t)),
    outputSchema: ActivitySchema,
    importantFields: ["id", "type", "content", "created"],
    handler: async ({ userId, activityTypeId, minId, maxId, count, order }) => backlog.getUserActivities(userId, {
      activityTypeId,
      minId,
      maxId,
      count,
      order
    })
  };
};

// node_modules/backlog-mcp-server/build/tools/getWatchingListCount.js
var getWatchingListCountSchema = buildToolSchema((t) => ({
  userId: external_exports.number().describe(t("TOOL_GET_WATCHING_LIST_COUNT_USER_ID", "User ID"))
}));
var getWatchingListCountTool = (backlog, { t }) => {
  return {
    name: "get_watching_list_count",
    description: t("TOOL_GET_WATCHING_LIST_COUNT_DESCRIPTION", "Returns count of watching items for a user"),
    schema: external_exports.object(getWatchingListCountSchema(t)),
    outputSchema: WatchingListCountSchema,
    handler: async ({ userId }) => backlog.getWatchingListCount(userId)
  };
};

// node_modules/backlog-mcp-server/build/tools/getWatchingListItems.js
var getWatchingListItemsSchema = buildToolSchema((t) => ({
  userId: external_exports.number().describe(t("TOOL_GET_WATCHING_LIST_ITEMS_USER_ID", "User ID"))
}));
var getWatchingListItemsTool = (backlog, { t }) => {
  return {
    name: "get_watching_list_items",
    description: t("TOOL_GET_WATCHING_LIST_ITEMS_DESCRIPTION", "Returns list of watching items for a user"),
    schema: external_exports.object(getWatchingListItemsSchema(t)),
    outputSchema: WatchingListItemSchema,
    handler: async ({ userId }) => backlog.getWatchingListItems(userId)
  };
};

// node_modules/backlog-mcp-server/build/tools/addWatching.js
var addWatchingSchema = buildToolSchema((t) => ({
  issueIdOrKey: external_exports.union([external_exports.number(), external_exports.string()]).describe(t("TOOL_ADD_WATCHING_ISSUE_ID_OR_KEY", 'Issue ID or issue key (e.g., 1234 or "PROJECT-123")')),
  note: external_exports.string().describe(t("TOOL_ADD_WATCHING_NOTE", "Optional note for the watch")).optional().default("")
}));
var addWatchingTool = (backlog, { t }) => {
  return {
    name: "add_watching",
    description: t("TOOL_ADD_WATCHING_DESCRIPTION", "Adds a new watch to an issue"),
    schema: external_exports.object(addWatchingSchema(t)),
    outputSchema: WatchingListItemSchema,
    handler: async ({ issueIdOrKey, note }) => backlog.postWatchingListItem({
      issueIdOrKey,
      note
    })
  };
};

// node_modules/backlog-mcp-server/build/tools/updateWatching.js
var updateWatchingSchema = buildToolSchema((t) => ({
  watchId: external_exports.number().describe(t("TOOL_UPDATE_WATCHING_WATCH_ID", "Watch ID")),
  note: external_exports.string().describe(t("TOOL_UPDATE_WATCHING_NOTE", "Updated note for the watch"))
}));
var updateWatchingTool = (backlog, { t }) => {
  return {
    name: "update_watching",
    description: t("TOOL_UPDATE_WATCHING_DESCRIPTION", "Updates an existing watch note"),
    schema: external_exports.object(updateWatchingSchema(t)),
    outputSchema: WatchingListItemSchema,
    handler: async ({ watchId, note }) => backlog.patchWatchingListItem(watchId, note)
  };
};

// node_modules/backlog-mcp-server/build/tools/deleteWatching.js
var deleteWatchingSchema = buildToolSchema((t) => ({
  watchId: external_exports.number().describe(t("TOOL_DELETE_WATCHING_WATCH_ID", "Watch ID to delete"))
}));
var deleteWatchingTool = (backlog, { t }) => {
  return {
    name: "delete_watching",
    description: t("TOOL_DELETE_WATCHING_DESCRIPTION", "Deletes a watch from an issue"),
    schema: external_exports.object(deleteWatchingSchema(t)),
    outputSchema: WatchingListItemSchema,
    handler: async ({ watchId }) => backlog.deletehWatchingListItem(watchId)
  };
};

// node_modules/backlog-mcp-server/build/tools/markWatchingAsRead.js
var markWatchingAsReadSchema = buildToolSchema((t) => ({
  watchId: external_exports.number().describe(t("TOOL_MARK_WATCHING_AS_READ_WATCH_ID", "Watch ID to mark as read"))
}));
var MarkWatchingAsReadResultSchema = external_exports.object({
  success: external_exports.boolean(),
  message: external_exports.string()
});
var markWatchingAsReadTool = (backlog, { t }) => {
  return {
    name: "mark_watching_as_read",
    description: t("TOOL_MARK_WATCHING_AS_READ_DESCRIPTION", "Mark a watch as read"),
    schema: external_exports.object(markWatchingAsReadSchema(t)),
    outputSchema: MarkWatchingAsReadResultSchema,
    handler: async ({ watchId }) => {
      await backlog.resetWatchingListItemAsRead(watchId);
      return {
        success: true,
        message: `Watch ${watchId} marked as read`
      };
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getWiki.js
var getWikiSchema = buildToolSchema((t) => ({
  wikiId: external_exports.union([external_exports.string(), external_exports.number()]).describe(t("TOOL_GET_WIKI_ID", "Wiki ID"))
}));
var getWikiTool = (backlog, { t }) => {
  return {
    name: "get_wiki",
    description: t("TOOL_GET_WIKI_DESCRIPTION", "Returns information about a specific wiki page"),
    schema: external_exports.object(getWikiSchema(t)),
    outputSchema: WikiSchema,
    importantFields: ["id", "projectId", "name", "content"],
    handler: async ({ wikiId }) => {
      const wikiIdNumber = typeof wikiId === "string" ? parseInt(wikiId, 10) : wikiId;
      return backlog.getWiki(wikiIdNumber);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getWikiPages.js
var getWikiPagesSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_WIKI_PAGES_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_WIKI_PAGES_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  keyword: external_exports.string().optional().describe(t("TOOL_GET_WIKI_PAGES_KEYWORD", "Keyword to search for in Wiki pages"))
}));
var getWikiPagesTool = (backlog, { t }) => {
  return {
    name: "get_wiki_pages",
    description: t("TOOL_GET_WIKI_PAGES_DESCRIPTION", "Returns list of Wiki pages"),
    schema: external_exports.object(getWikiPagesSchema(t)),
    outputSchema: WikiListItemSchema,
    importantFields: ["projectId", "name", "tags"],
    handler: async ({ projectId, projectKey, keyword }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getWikis({
        projectIdOrKey: result.value,
        keyword
      });
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getWikisCount.js
var getWikisCountSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_WIKIS_COUNT_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_WIKIS_COUNT_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')"))
}));
var getWikisCountTool = (backlog, { t }) => {
  return {
    name: "get_wikis_count",
    description: t("TOOL_GET_WIKIS_COUNT_DESCRIPTION", "Returns count of wiki pages in a project"),
    schema: external_exports.object(getWikisCountSchema(t)),
    outputSchema: WikiCountSchema,
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getWikisCount(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/markNotificationAsRead.js
var markNotificationAsReadSchema = buildToolSchema((t) => ({
  id: external_exports.number().describe(t("TOOL_MARK_NOTIFICATION_AS_READ_ID", "Notification ID to mark as read"))
}));
var MarkNotificationAsReadResultSchema = external_exports.object({
  success: external_exports.boolean(),
  message: external_exports.string()
});
var markNotificationAsReadTool = (backlog, { t }) => {
  return {
    name: "mark_notification_as_read",
    description: t("TOOL_MARK_NOTIFICATION_AS_READ_DESCRIPTION", "Mark a notification as read"),
    schema: external_exports.object(markNotificationAsReadSchema(t)),
    outputSchema: MarkNotificationAsReadResultSchema,
    handler: async ({ id }) => {
      await backlog.markAsReadNotification(id);
      return {
        success: true,
        message: `Notification ${id} marked as read`
      };
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/resetUnreadNotificationCount.js
var resetUnreadNotificationCountSchema = buildToolSchema((_t) => ({}));
var resetUnreadNotificationCountTool = (backlog, { t }) => {
  return {
    name: "reset_unread_notification_count",
    description: t("TOOL_RESET_UNREAD_NOTIFICATION_COUNT_DESCRIPTION", "Reset unread notification count"),
    schema: external_exports.object(resetUnreadNotificationCountSchema(t)),
    outputSchema: NotificationCountSchema,
    handler: async () => backlog.resetNotificationsMarkAsRead()
  };
};

// node_modules/backlog-mcp-server/build/tools/updateIssue.js
var updateIssueSchema = buildToolSchema((t) => ({
  issueId: external_exports.number().optional().describe(t("TOOL_UPDATE_ISSUE_ISSUE_ID", "The numeric ID of the issue (e.g., 12345)")),
  issueKey: external_exports.string().optional().describe(t("TOOL_UPDATE_ISSUE_ISSUE_KEY", "The key of the issue (e.g., 'PROJ-123')")),
  summary: external_exports.string().optional().describe(t("TOOL_UPDATE_ISSUE_SUMMARY", "Summary of the issue")),
  issueTypeId: external_exports.number().optional().describe(t("TOOL_UPDATE_ISSUE_ISSUE_TYPE_ID", "Issue type ID")),
  priorityId: external_exports.number().optional().describe(t("TOOL_UPDATE_ISSUE_PRIORITY_ID", "Priority ID")),
  description: external_exports.string().optional().describe(t("TOOL_UPDATE_ISSUE_DESCRIPTION", "Detailed description of the issue")),
  startDate: external_exports.string().optional().describe(t("TOOL_UPDATE_ISSUE_START_DATE", "Scheduled start date (yyyy-MM-dd)")),
  dueDate: external_exports.string().optional().describe(t("TOOL_UPDATE_ISSUE_DUE_DATE", "Scheduled due date (yyyy-MM-dd)")),
  estimatedHours: external_exports.number().optional().describe(t("TOOL_UPDATE_ISSUE_ESTIMATED_HOURS", "Estimated work hours")),
  actualHours: external_exports.number().optional().describe(t("TOOL_UPDATE_ISSUE_ACTUAL_HOURS", "Actual work hours")),
  categoryId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_UPDATE_ISSUE_CATEGORY_ID", "Category IDs")),
  versionId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_UPDATE_ISSUE_VERSION_ID", "Version IDs")),
  milestoneId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_UPDATE_ISSUE_MILESTONE_ID", "Milestone IDs")),
  statusId: external_exports.number().optional().describe(t("TOOL_UPDATE_ISSUE_STATUS_ID", "Status ID")),
  resolutionId: external_exports.number().optional().describe(t("TOOL_UPDATE_ISSUE_RESOLUTION_ID", "Resolution ID")),
  assigneeId: external_exports.number().optional().describe(t("TOOL_UPDATE_ISSUE_ASSIGNEE_ID", "User ID of the assignee")),
  notifiedUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_UPDATE_ISSUE_NOTIFIED_USER_ID", "User IDs to notify")),
  attachmentId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_UPDATE_ISSUE_ATTACHMENT_ID", "Attachment IDs")),
  comment: external_exports.string().optional().describe(t("TOOL_UPDATE_ISSUE_COMMENT", "Comment to add when updating the issue")),
  customFields: external_exports.array(external_exports.object({
    id: external_exports.number().describe(t("TOOL_UPDATE_ISSUE_CUSTOM_FIELD_ID", "The ID of the custom field (e.g., 12345)")),
    value: external_exports.union([
      external_exports.string(),
      external_exports.number(),
      external_exports.array(external_exports.string()),
      external_exports.array(external_exports.number())
    ]).optional().describe(t("TOOL_UPDATE_ISSUE_CUSTOM_FIELD_VALUE", "Value of the custom field. For text/date fields, provide a string. For numeric fields, provide a number. For list fields, provide an array of strings or numbers.")),
    otherValue: external_exports.string().optional().describe(t("TOOL_UPDATE_ISSUE_CUSTOM_FIELD_OTHER_VALUE", "Other value for list type fields"))
  })).optional().describe(t("TOOL_UPDATE_ISSUE_CUSTOM_FIELDS", "List of custom fields to set on the issue"))
}));
var updateIssueTool = (backlog, { t }) => {
  return {
    name: "update_issue",
    description: t("TOOL_UPDATE_ISSUE_DESCRIPTION", "Updates an existing issue"),
    schema: external_exports.object(updateIssueSchema(t)),
    outputSchema: IssueSchema,
    handler: async ({ issueId, issueKey, customFields, ...params }) => {
      const result = resolveIdOrKey("issue", { id: issueId, key: issueKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const customFieldPayload = customFieldsToPayload(customFields);
      const finalPayload = {
        ...params,
        ...customFieldPayload
      };
      return backlog.patchIssue(result.value, finalPayload);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/updateProject.js
var updateProjectSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_UPDATE_PROJECT_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_UPDATE_PROJECT_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  name: external_exports.string().optional().describe(t("TOOL_UPDATE_PROJECT_NAME", "Project name")),
  key: external_exports.string().optional().describe(t("TOOL_UPDATE_PROJECT_KEY", "Project key")),
  chartEnabled: external_exports.boolean().optional().describe(t("TOOL_UPDATE_PROJECT_CHART_ENABLED", "Whether to enable chart")),
  subtaskingEnabled: external_exports.boolean().optional().describe(t("TOOL_UPDATE_PROJECT_SUBTASKING_ENABLED", "Whether to enable subtasking")),
  projectLeaderCanEditProjectLeader: external_exports.boolean().optional().describe(t("TOOL_UPDATE_PROJECT_LEADER_CAN_EDIT", "Whether project leaders can edit other project leaders")),
  textFormattingRule: external_exports.enum(["backlog", "markdown"]).optional().describe(t("TOOL_UPDATE_PROJECT_TEXT_FORMATTING", "Text formatting rule")),
  archived: external_exports.boolean().optional().describe(t("TOOL_UPDATE_PROJECT_ARCHIVED", "Whether to archive the project"))
}));
var updateProjectTool = (backlog, { t }) => {
  return {
    name: "update_project",
    description: t("TOOL_UPDATE_PROJECT_DESCRIPTION", "Updates an existing project"),
    schema: external_exports.object(updateProjectSchema(t)),
    outputSchema: ProjectSchema,
    handler: async ({ projectId, projectKey, ...param }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.patchProject(result.value, param);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/updatePullRequest.js
var updatePullRequestSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_REPO_ID", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_REPO_NAME", "Repository name")),
  number: external_exports.number().describe(t("TOOL_UPDATE_PULL_REQUEST_NUMBER", "Pull request number")),
  summary: external_exports.string().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_SUMMARY", "Summary of the pull request")),
  description: external_exports.string().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_DESCRIPTION", "Description of the pull request")),
  issueId: external_exports.number().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_ISSUE_ID", "Issue ID to link")),
  assigneeId: external_exports.number().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_ASSIGNEE_ID", "User ID of the assignee")),
  notifiedUserId: external_exports.array(external_exports.number()).optional().describe(t("TOOL_UPDATE_PULL_REQUEST_NOTIFIED_USER_ID", "User IDs to notify")),
  statusId: external_exports.number().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_STATUS_ID", "Status ID"))
}));
var updatePullRequestTool = (backlog, { t }) => {
  return {
    name: "update_pull_request",
    description: t("TOOL_UPDATE_PULL_REQUEST_DESCRIPTION", "Updates an existing pull request"),
    schema: external_exports.object(updatePullRequestSchema(t)),
    outputSchema: PullRequestSchema,
    handler: async ({ projectId, projectKey, repoId, repoName, number, ...params }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const resultRepo = resolveIdOrKey("repository", { id: repoId, key: repoName }, t);
      if (!resultRepo.ok) {
        throw resultRepo.error;
      }
      return backlog.patchPullRequest(result.value, String(resultRepo.value), number, params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/updatePullRequestComment.js
var updatePullRequestCommentSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_COMMENT_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_COMMENT_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  repoId: external_exports.number().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_COMMENT_REPO_ID", "Repository ID")),
  repoName: external_exports.string().optional().describe(t("TOOL_UPDATE_PULL_REQUEST_COMMENT_REPO_NAME", "Repository name")),
  number: external_exports.number().describe(t("TOOL_UPDATE_PULL_REQUEST_COMMENT_NUMBER", "Pull request number")),
  commentId: external_exports.number().describe(t("TOOL_UPDATE_PULL_REQUEST_COMMENT_COMMENT_ID", "Comment ID")),
  content: external_exports.string().describe(t("TOOL_UPDATE_PULL_REQUEST_COMMENT_CONTENT", "Comment content"))
}));
var updatePullRequestCommentTool = (backlog, { t }) => {
  return {
    name: "update_pull_request_comment",
    description: t("TOOL_UPDATE_PULL_REQUEST_COMMENT_DESCRIPTION", "Updates a comment on a pull request"),
    schema: external_exports.object(updatePullRequestCommentSchema(t)),
    outputSchema: PullRequestCommentSchema,
    importantFields: ["id", "content", "createdUser", "updated"],
    handler: async ({ projectId, projectKey, repoId, repoName, number, commentId, content }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      const repoResult = resolveIdOrName("repository", { id: repoId, name: repoName }, t);
      if (!repoResult.ok) {
        throw repoResult.error;
      }
      return backlog.patchPullRequestComments(result.value, String(repoResult.value), number, commentId, { content });
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getDocument.js
var getDocumentSchema = buildToolSchema((t) => ({
  documentId: external_exports.string().describe(t("TOOL_GET_DOCUMENT_DOCUMENT_ID", "Document ID"))
}));
var getDocumentTool = (backlog, { t }) => {
  return {
    name: "get_document",
    description: t("TOOL_GET_DOCUMENT_DESCRIPTION", "Gets information about a document."),
    schema: external_exports.object(getDocumentSchema(t)),
    outputSchema: DocumentItemSchema,
    importantFields: ["id", "title", "createdUser"],
    handler: async ({ documentId }) => {
      return backlog.getDocument(documentId);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getDocuments.js
var getDocumentsSchema = buildToolSchema((t) => ({
  projectIds: external_exports.array(external_exports.number()).describe(t("TOOL_GET_DOCUMENTS_PROJECT_ID_LIST", "Project ID List")),
  offset: external_exports.number().optional().default(0).describe(t("TOOL_GET_DOCUMENTS_OFFSET", "Offset for pagination (default is 0)"))
}));
var getDocumentsTool = (backlog, { t }) => {
  return {
    name: "get_documents",
    description: t("TOOL_GET_DOCUMENTS_DESCRIPTION", "Gets a list of documents in a project."),
    schema: external_exports.object(getDocumentsSchema(t)),
    outputSchema: DocumentItemSchema,
    importantFields: ["id", "projectId", "title", "plain"],
    handler: async ({ projectIds, offset }) => {
      return backlog.getDocuments({ projectId: projectIds, offset });
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getDocumentTree.js
var getDocumentTreeSchema = buildToolSchema((t) => ({
  projectIdOrKey: external_exports.union([external_exports.string(), external_exports.number()]).describe(t("TOOL_GET_DOCUMENT_TREE_PROJECT_ID_OR_KEY", "Project ID or Key"))
}));
var getDocumentTreeTool = (backlog, { t }) => {
  return {
    name: "get_document_tree",
    description: t("TOOL_GET_DOCUMENT_TREE_DESCRIPTION", "Gets the document tree of a project."),
    schema: external_exports.object(getDocumentTreeSchema(t)),
    outputSchema: DocumentTreeFullSchemaZ,
    importantFields: ["projectId", "activeTree", "trashTree"],
    handler: async ({ projectIdOrKey }) => {
      return backlog.getDocumentTree(projectIdOrKey);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/getVersionMilestoneList.js
var getVersionMilestoneListSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_GET_VERSION_MILESTONE_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_GET_VERSION_MILESTONE_PROJECT_KEY", "The key of the project (e.g., TEST_PROJECT)"))
}));
var getVersionMilestoneListTool = (backlog, { t }) => {
  return {
    name: "get_version_milestone_list",
    description: t("TOOL_GET_VERSION_MILESTONE_LIST_DESCRIPTION", "Returns list of versions/milestones in the Backlog space"),
    schema: external_exports.object(getVersionMilestoneListSchema(t)),
    outputSchema: VersionSchema,
    importantFields: [
      "id",
      "name",
      "description",
      "startDate",
      "releaseDueDate",
      "archived"
    ],
    handler: async ({ projectId, projectKey }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.getVersions(result.value);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/addVersionMilestone.js
var addVersionMilestoneSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_ADD_VERSION_MILESTONE_PROJECT_ID", "Project ID")),
  projectKey: external_exports.string().optional().describe(t("TOOL_ADD_VERSION_MILESTONE_PROJECT_KEY", "Project key")),
  name: external_exports.string().describe(t("TOOL_ADD_VERSION_MILESTONE_NAME", "Version name")),
  description: external_exports.string().optional().describe(t("TOOL_ADD_VERSION_MILESTONE_DESCRIPTION", "Version description")),
  startDate: external_exports.string().optional().describe(t("TOOL_ADD_VERSION_MILESTONE_START_DATE", "Start date of the version")),
  releaseDueDate: external_exports.string().optional().describe(t("TOOL_ADD_VERSION_MILESTONE_RELEASE_DUE_DATE", "Release due date of the version"))
}));
var addVersionMilestoneTool = (backlog, { t }) => {
  return {
    name: "add_version_milestone",
    description: t("TOOL_ADD_VERSION_MILESTONE_DESCRIPTION", "Creates a new version milestone"),
    schema: external_exports.object(addVersionMilestoneSchema(t)),
    outputSchema: VersionSchema,
    importantFields: [
      "id",
      "name",
      "description",
      "startDate",
      "releaseDueDate"
    ],
    handler: async ({ projectId, projectKey, ...params }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.postVersions(result.value, params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/updateVersionMilestone.js
var updateVersionMilestoneSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_UPDATE_VERSION_MILESTONE_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_UPDATE_VERSION_MILESTONE_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  id: external_exports.number().describe(t("TOOL_UPDATE_VERSION_MILESTONE_ID", "Version ID")),
  name: external_exports.string().describe(t("TOOL_UPDATE_VERSION_MILESTONE_NAME", "Version name")),
  description: external_exports.string().optional().describe(t("TOOL_UPDATE_VERSION_MILESTONE_DESCRIPTION", "Version description")),
  startDate: external_exports.string().optional().describe(t("TOOL_UPDATE_VERSION_MILESTONE_START_DATE", "Start date")),
  releaseDueDate: external_exports.string().optional().describe(t("TOOL_UPDATE_VERSION_MILESTONE_RELEASE_DUE_DATE", "Release due date")),
  archived: external_exports.boolean().optional().describe(t("TOOL_UPDATE_VERSION_MILESTONE_ARCHIVED", "Archive status of the version"))
}));
var updateVersionMilestoneTool = (backlog, { t }) => {
  return {
    name: "update_version_milestone",
    description: t("TOOL_UPDATE_VERSION_MILESTONE_DESCRIPTION", "Updates an existing version milestone"),
    schema: external_exports.object(updateVersionMilestoneSchema(t)),
    outputSchema: VersionSchema,
    importantFields: [
      "id",
      "name",
      "description",
      "startDate",
      "releaseDueDate",
      "archived"
    ],
    handler: async ({ projectId, projectKey, id, ...params }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      return backlog.patchVersions(result.value, id, params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/deleteVersion.js
var deleteVersionSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().optional().describe(t("TOOL_DELETE_VERSION_PROJECT_ID", "The numeric ID of the project (e.g., 12345)")),
  projectKey: external_exports.string().optional().describe(t("TOOL_DELETE_VERSION_PROJECT_KEY", "The key of the project (e.g., 'PROJECT')")),
  id: external_exports.number().describe(t("TOOL_DELETE_VERSION_ID", "The numeric ID of the version to delete (e.g., 67890)"))
}));
var deleteVersionTool = (backlog, { t }) => {
  return {
    name: "delete_version",
    description: t("TOOL_DELETE_VERSION_DESCRIPTION", "Deletes a version from a project"),
    schema: external_exports.object(deleteVersionSchema(t)),
    outputSchema: VersionSchema,
    handler: async ({ projectId, projectKey, id }) => {
      const result = resolveIdOrKey("project", { id: projectId, key: projectKey }, t);
      if (!result.ok) {
        throw result.error;
      }
      if (!id) {
        throw new Error(t("TOOL_DELETE_VERSION_MISSING_ID", "Version ID is required"));
      }
      return backlog.deleteVersions(result.value, id);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/addDocument.js
var addDocumentSchema = buildToolSchema((t) => ({
  projectId: external_exports.number().describe(t("TOOL_ADD_DOCUMENT_PROJECT_ID", "Project ID")),
  title: external_exports.string().optional().describe(t("TOOL_ADD_DOCUMENT_TITLE", "Title of the document")),
  content: external_exports.string().optional().describe(t("TOOL_ADD_DOCUMENT_CONTENT", "Content of the document")),
  emoji: external_exports.string().optional().describe(t("TOOL_ADD_DOCUMENT_EMOJI", "Emoji for the document")),
  parentId: external_exports.string().optional().describe(t("TOOL_ADD_DOCUMENT_PARENT_ID", "Parent document ID")),
  addLast: external_exports.boolean().optional().describe(t("TOOL_ADD_DOCUMENT_ADD_LAST", "Add to the end of the list"))
}));
var addDocumentTool = (backlog, { t }) => {
  return {
    name: "addDocument",
    description: t("TOOL_ADD_DOCUMENT_DESCRIPTION", "Adds a new document to the specified project."),
    schema: external_exports.object(addDocumentSchema(t)),
    outputSchema: DocumentItemSchema,
    importantFields: ["id", "projectId", "title", "plain", "createdUser"],
    handler: async (params) => {
      return backlog.addDocument(params);
    }
  };
};

// node_modules/backlog-mcp-server/build/tools/tools.js
var allTools = (backlog, helper) => {
  return {
    toolsets: [
      {
        name: "space",
        description: "Tools for managing Backlog space settings and general information.",
        enabled: false,
        tools: [
          getSpaceTool(backlog, helper),
          getSpaceActivitiesTool(backlog, helper),
          getUsersTool(backlog, helper),
          getUserStarsCountTool(backlog, helper),
          getMyselfTool(backlog, helper),
          getUserRecentUpdatesTool(backlog, helper)
        ]
      },
      {
        name: "project",
        description: "Tools for managing projects, categories, custom fields, and issue types.",
        enabled: false,
        tools: [
          getProjectListTool(backlog, helper),
          addProjectTool(backlog, helper),
          getProjectTool(backlog, helper),
          getProjectUsersTool(backlog, helper),
          updateProjectTool(backlog, helper),
          deleteProjectTool(backlog, helper)
        ]
      },
      {
        name: "issue",
        description: "Tools for managing issues and their comments.",
        enabled: false,
        tools: [
          getIssueTool(backlog, helper),
          getIssuesTool(backlog, helper),
          countIssuesTool(backlog, helper),
          addIssueTool(backlog, helper),
          updateIssueTool(backlog, helper),
          deleteIssueTool(backlog, helper),
          getIssueCommentsTool(backlog, helper),
          addIssueCommentTool(backlog, helper),
          getPrioritiesTool(backlog, helper),
          getCategoriesTool(backlog, helper),
          getCustomFieldsTool(backlog, helper),
          getIssueTypesTool(backlog, helper),
          getResolutionsTool(backlog, helper),
          getWatchingListItemsTool(backlog, helper),
          getWatchingListCountTool(backlog, helper),
          addWatchingTool(backlog, helper),
          updateWatchingTool(backlog, helper),
          deleteWatchingTool(backlog, helper),
          markWatchingAsReadTool(backlog, helper),
          getVersionMilestoneListTool(backlog, helper),
          addVersionMilestoneTool(backlog, helper),
          updateVersionMilestoneTool(backlog, helper),
          deleteVersionTool(backlog, helper)
        ]
      },
      {
        name: "wiki",
        description: "Tools for managing wiki pages.",
        enabled: false,
        tools: [
          getWikiPagesTool(backlog, helper),
          getWikisCountTool(backlog, helper),
          getWikiTool(backlog, helper),
          addWikiTool(backlog, helper),
          updateWikiTool(backlog, helper)
        ]
      },
      {
        name: "git",
        description: "Tools for managing Git repositories and pull requests.",
        enabled: false,
        tools: [
          getGitRepositoriesTool(backlog, helper),
          getGitRepositoryTool(backlog, helper),
          getPullRequestsTool(backlog, helper),
          getPullRequestsCountTool(backlog, helper),
          getPullRequestTool(backlog, helper),
          addPullRequestTool(backlog, helper),
          updatePullRequestTool(backlog, helper),
          getPullRequestCommentsTool(backlog, helper),
          addPullRequestCommentTool(backlog, helper),
          updatePullRequestCommentTool(backlog, helper)
        ]
      },
      {
        name: "document",
        description: "Tools for managing documents.",
        enabled: false,
        tools: [
          getDocumentsTool(backlog, helper),
          getDocumentTreeTool(backlog, helper),
          getDocumentTool(backlog, helper),
          addDocumentTool(backlog, helper)
        ]
      },
      {
        name: "notifications",
        description: "Tools for managing user notifications.",
        enabled: false,
        tools: [
          getNotificationsTool(backlog, helper),
          getNotificationsCountTool(backlog, helper),
          resetUnreadNotificationCountTool(backlog, helper),
          markNotificationAsReadTool(backlog, helper)
        ]
      }
    ]
  };
};

// src/core/catalog.mjs
var fallbackTranslation = {
  t(_key, fallback) {
    return fallback;
  },
  dump() {
    return {};
  }
};
var metadataOnlyClient = new Proxy({}, {
  get(_target, property) {
    return async () => {
      throw new Error(
        `Backlog client method ${String(property)} cannot run during metadata discovery.`
      );
    };
  }
});
function createToolsets(backlog = metadataOnlyClient) {
  return allTools(backlog, fallbackTranslation).toolsets;
}
function listOperations() {
  return createToolsets().flatMap((toolset) => toolset.tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    toolset: toolset.name,
    mutationClass: classifyMutation(tool.name),
    requiredPermission: requiredPermission(tool.name)
  }))).sort((left, right) => compareUtf16(left.name, right.name));
}
function resolveTool(backlog, operationName) {
  for (const toolset of createToolsets(backlog)) {
    const tool = toolset.tools.find((candidate) => candidate.name === operationName);
    if (tool) {
      return { tool, toolset: toolset.name };
    }
  }
  return void 0;
}
function classifyMutation(operationName) {
  if (operationName.startsWith("delete_")) {
    return "destructive";
  }
  if (operationName === "reset_unread_notification_count") {
    return "broad-mutation";
  }
  if (operationName.startsWith("add_") || operationName === "addDocument" || operationName.startsWith("update_") || operationName.startsWith("mark_")) {
    return "mutation";
  }
  return "read";
}
function requiredPermission(operationName) {
  const mutationClass = classifyMutation(operationName);
  if (mutationClass === "read") {
    return "READ";
  }
  if (mutationClass === "destructive") {
    return "DELETE";
  }
  if (operationName.startsWith("add_") || operationName === "addDocument") {
    return "CREATE";
  }
  return "UPDATE";
}
function compareUtf16(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

// docs/traceability/upstream-tool-mapping.json
var upstream_tool_mapping_default = {
  schemaVersion: 1,
  upstream: {
    repository: "https://github.com/nulab/backlog-mcp-server",
    version: "0.13.2",
    tag: "v0.13.2",
    commit: "d12f010de976af11bcd43f1d3497dc7043d26e62",
    checked: "2026-07-22"
  },
  target: {
    repository: "backlog-api",
    product: "backlog-api",
    version: "0.3.2",
    strategy: "published-handler-direct-invocation"
  },
  operations: [
    {
      operation: "addDocument",
      toolset: "document",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addDocument.ts",
      upstreamTest: "src/tools/addDocument.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "add_issue",
      toolset: "issue",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addIssue.ts",
      upstreamTest: "src/tools/addIssue.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "add_issue_comment",
      toolset: "issue",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addIssueComment.ts",
      upstreamTest: "src/tools/addIssueComment.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "add_project",
      toolset: "project",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addProject.ts",
      upstreamTest: "src/tools/addProject.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "add_pull_request",
      toolset: "git",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addPullRequest.ts",
      upstreamTest: "src/tools/addPullRequest.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "add_pull_request_comment",
      toolset: "git",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addPullRequestComment.ts",
      upstreamTest: "src/tools/addPullRequestComment.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "add_version_milestone",
      toolset: "issue",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addVersionMilestone.ts",
      upstreamTest: "src/tools/addVersionMilestone.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "add_watching",
      toolset: "issue",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addWatching.ts",
      upstreamTest: "src/tools/addWatching.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "add_wiki",
      toolset: "wiki",
      mutationClass: "mutation",
      upstreamSource: "src/tools/addWiki.ts",
      upstreamTest: "src/tools/addWiki.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "count_issues",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/countIssues.ts",
      upstreamTest: "src/tools/countIssues.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "count_notifications",
      toolset: "notifications",
      mutationClass: "read",
      upstreamSource: "src/tools/getNotificationsCount.ts",
      upstreamTest: "src/tools/getNotificationsCount.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "delete_issue",
      toolset: "issue",
      mutationClass: "destructive",
      upstreamSource: "src/tools/deleteIssue.ts",
      upstreamTest: "src/tools/deleteIssue.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "delete_project",
      toolset: "project",
      mutationClass: "destructive",
      upstreamSource: "src/tools/deleteProject.ts",
      upstreamTest: "src/tools/deleteProject.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "delete_version",
      toolset: "issue",
      mutationClass: "destructive",
      upstreamSource: "src/tools/deleteVersion.ts",
      upstreamTest: "src/tools/deleteVersion.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "delete_watching",
      toolset: "issue",
      mutationClass: "destructive",
      upstreamSource: "src/tools/deleteWatching.ts",
      upstreamTest: "src/tools/deleteWatching.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_categories",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getCategories.ts",
      upstreamTest: "src/tools/getCategories.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_custom_fields",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getCustomFields.ts",
      upstreamTest: "src/tools/getCustomFields.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_document",
      toolset: "document",
      mutationClass: "read",
      upstreamSource: "src/tools/getDocument.ts",
      upstreamTest: "src/tools/getDocument.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_document_tree",
      toolset: "document",
      mutationClass: "read",
      upstreamSource: "src/tools/getDocumentTree.ts",
      upstreamTest: "src/tools/getDocumentTree.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_documents",
      toolset: "document",
      mutationClass: "read",
      upstreamSource: "src/tools/getDocuments.ts",
      upstreamTest: "src/tools/getDocuments.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_git_repositories",
      toolset: "git",
      mutationClass: "read",
      upstreamSource: "src/tools/getGitRepositories.ts",
      upstreamTest: "src/tools/getGitRepositories.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_git_repository",
      toolset: "git",
      mutationClass: "read",
      upstreamSource: "src/tools/getGitRepository.ts",
      upstreamTest: "src/tools/getGitRepository.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_issue",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getIssue.ts",
      upstreamTest: "src/tools/getIssue.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_issue_comments",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getIssueComments.ts",
      upstreamTest: "src/tools/getIssueComments.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_issue_types",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getIssueTypes.ts",
      upstreamTest: "src/tools/getIssueTypes.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_issues",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getIssues.ts",
      upstreamTest: "src/tools/getIssues.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_myself",
      toolset: "space",
      mutationClass: "read",
      upstreamSource: "src/tools/getMyself.ts",
      upstreamTest: "src/tools/getMyself.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_notifications",
      toolset: "notifications",
      mutationClass: "read",
      upstreamSource: "src/tools/getNotifications.ts",
      upstreamTest: "src/tools/getNotifications.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_priorities",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getPriorities.ts",
      upstreamTest: "src/tools/getPriorities.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_project",
      toolset: "project",
      mutationClass: "read",
      upstreamSource: "src/tools/getProject.ts",
      upstreamTest: "src/tools/getProject.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_project_list",
      toolset: "project",
      mutationClass: "read",
      upstreamSource: "src/tools/getProjectList.ts",
      upstreamTest: "src/tools/getProjectList.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_project_users",
      toolset: "project",
      mutationClass: "read",
      upstreamSource: "src/tools/getProjectUsers.ts",
      upstreamTest: "src/tools/getProjectUsers.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_pull_request",
      toolset: "git",
      mutationClass: "read",
      upstreamSource: "src/tools/getPullRequest.ts",
      upstreamTest: "src/tools/getPullRequest.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_pull_request_comments",
      toolset: "git",
      mutationClass: "read",
      upstreamSource: "src/tools/getPullRequestComments.ts",
      upstreamTest: "src/tools/getPullRequestComments.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_pull_requests",
      toolset: "git",
      mutationClass: "read",
      upstreamSource: "src/tools/getPullRequests.ts",
      upstreamTest: "src/tools/getPullRequests.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_pull_requests_count",
      toolset: "git",
      mutationClass: "read",
      upstreamSource: "src/tools/getPullRequestsCount.ts",
      upstreamTest: "src/tools/getPullRequestsCount.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_resolutions",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getResolutions.ts",
      upstreamTest: "src/tools/getResolutions.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_space",
      toolset: "space",
      mutationClass: "read",
      upstreamSource: "src/tools/getSpace.ts",
      upstreamTest: "src/tools/getSpace.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_space_activities",
      toolset: "space",
      mutationClass: "read",
      upstreamSource: "src/tools/getSpaceActivities.ts",
      upstreamTest: "src/tools/getSpaceActivities.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_user_recent_updates",
      toolset: "space",
      mutationClass: "read",
      upstreamSource: "src/tools/getUserRecentUpdates.ts",
      upstreamTest: "src/tools/getUserRecentUpdates.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_user_stars_count",
      toolset: "space",
      mutationClass: "read",
      upstreamSource: "src/tools/getUserStarsCount.ts",
      upstreamTest: "src/tools/getUserStarsCount.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_users",
      toolset: "space",
      mutationClass: "read",
      upstreamSource: "src/tools/getUsers.ts",
      upstreamTest: "src/tools/getUsers.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_version_milestone_list",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getVersionMilestoneList.ts",
      upstreamTest: "src/tools/getVersionMilestoneList.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_watching_list_count",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getWatchingListCount.ts",
      upstreamTest: "src/tools/getWatchingListCount.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_watching_list_items",
      toolset: "issue",
      mutationClass: "read",
      upstreamSource: "src/tools/getWatchingListItems.ts",
      upstreamTest: "src/tools/getWatchingListItems.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_wiki",
      toolset: "wiki",
      mutationClass: "read",
      upstreamSource: "src/tools/getWiki.ts",
      upstreamTest: "src/tools/getWiki.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_wiki_pages",
      toolset: "wiki",
      mutationClass: "read",
      upstreamSource: "src/tools/getWikiPages.ts",
      upstreamTest: "src/tools/getWikiPages.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "get_wikis_count",
      toolset: "wiki",
      mutationClass: "read",
      upstreamSource: "src/tools/getWikisCount.ts",
      upstreamTest: "src/tools/getWikisCount.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "mark_notification_as_read",
      toolset: "notifications",
      mutationClass: "mutation",
      upstreamSource: "src/tools/markNotificationAsRead.ts",
      upstreamTest: "src/tools/markNotificationAsRead.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "mark_watching_as_read",
      toolset: "issue",
      mutationClass: "mutation",
      upstreamSource: "src/tools/markWatchingAsRead.ts",
      upstreamTest: "src/tools/markWatchingAsRead.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "reset_unread_notification_count",
      toolset: "notifications",
      mutationClass: "broad-mutation",
      upstreamSource: "src/tools/resetUnreadNotificationCount.ts",
      upstreamTest: "src/tools/resetUnreadNotificationCount.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "update_issue",
      toolset: "issue",
      mutationClass: "mutation",
      upstreamSource: "src/tools/updateIssue.ts",
      upstreamTest: "src/tools/updateIssue.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "update_project",
      toolset: "project",
      mutationClass: "mutation",
      upstreamSource: "src/tools/updateProject.ts",
      upstreamTest: "src/tools/updateProject.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "update_pull_request",
      toolset: "git",
      mutationClass: "mutation",
      upstreamSource: "src/tools/updatePullRequest.ts",
      upstreamTest: "src/tools/updatePullRequest.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "update_pull_request_comment",
      toolset: "git",
      mutationClass: "mutation",
      upstreamSource: "src/tools/updatePullRequestComment.ts",
      upstreamTest: "src/tools/updatePullRequestComment.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "update_version_milestone",
      toolset: "issue",
      mutationClass: "mutation",
      upstreamSource: "src/tools/updateVersionMilestone.ts",
      upstreamTest: "src/tools/updateVersionMilestone.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "update_watching",
      toolset: "issue",
      mutationClass: "mutation",
      upstreamSource: "src/tools/updateWatching.ts",
      upstreamTest: "src/tools/updateWatching.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    },
    {
      operation: "update_wiki",
      toolset: "wiki",
      mutationClass: "mutation",
      upstreamSource: "src/tools/updateWiki.ts",
      upstreamTest: "src/tools/updateWiki.test.ts",
      targetEntry: "src/core/run-operation.mjs"
    }
  ]
};

// src/core/traceability.mjs
var byOperation = new Map(
  upstream_tool_mapping_default.operations.map((entry) => [entry.operation, entry])
);
function getUpstreamTrace(operation) {
  const entry = byOperation.get(operation);
  return {
    repository: upstream_tool_mapping_default.upstream.repository,
    version: upstream_tool_mapping_default.upstream.version,
    commit: upstream_tool_mapping_default.upstream.commit,
    operation,
    source: entry?.upstreamSource,
    test: entry?.upstreamTest
  };
}
function getMapping() {
  return upstream_tool_mapping_default;
}

// node_modules/backlog-mcp-server/build/backlog/parseBacklogAPIError.js
function parseBacklogAPIError(err) {
  const e = err;
  if (e._name && e._status && e._url) {
    const status = e._status;
    const url = e._url;
    const code = e._body?.errors?.[0]?.code;
    const message = e._body?.errors?.[0]?.message ?? "An unknown error occurred.";
    if (e._name === "BacklogAuthError") {
      return {
        type: "BacklogAuthError",
        message: `Authentication failed (HTTP ${status}). Please check your API key or permissions.`,
        status,
        url
      };
    }
    if (e._name === "BacklogApiError") {
      return {
        type: "BacklogApiError",
        message: `Backlog API error (code: ${code}, status: ${status})
${message}`,
        status,
        code,
        url
      };
    }
    if (e._name === "UnexpectedError") {
      return {
        type: "UnexpectedError",
        message: `Unexpected error (HTTP ${status}) while accessing ${url}.`,
        status,
        url
      };
    }
  }
  return {
    type: "UnknownError",
    message: err?.message ?? "An unknown error occurred."
  };
}

// node_modules/backlog-js/dist/index.mjs
var qs = __toESM(require_lib(), 1);
var BacklogError = class extends Error {
  _name;
  _url;
  _status;
  _body;
  _response;
  constructor(name, response, body) {
    super(response.statusText);
    this._name = name;
    this._url = response.url;
    this._status = response.status;
    this._body = body;
    this._response = response;
  }
  get name() {
    return this._name;
  }
  get url() {
    return this._url;
  }
  get status() {
    return this._status;
  }
  get body() {
    return this._body;
  }
  get response() {
    return this._response;
  }
};
var BacklogApiError = class extends BacklogError {
  constructor(response, body) {
    super("BacklogApiError", response, body);
  }
};
var BacklogAuthError = class extends BacklogError {
  constructor(response, body) {
    super("BacklogAuthError", response, body);
  }
};
var UnexpectedError = class extends BacklogError {
  constructor(response) {
    super("UnexpectedError", response);
  }
};
var CONTROL_CHARACTER = /[\x00-\x1f\x7f]/;
var Request = class {
  fetch;
  constructor(configure) {
    this.configure = configure;
    this.fetch = configure.fetch ?? globalThis.fetch;
    if (configure.userAgent !== void 0 && CONTROL_CHARACTER.test(configure.userAgent)) throw new globalThis.Error("Invalid userAgent: control characters (including CR/LF) are not allowed.");
  }
  get(path, params) {
    return this.request({
      method: "GET",
      path,
      params
    }).then(this.parseJSON);
  }
  post(path, params) {
    return this.request({
      method: "POST",
      path,
      params
    }).then(this.parseJSON);
  }
  put(path, params) {
    return this.request({
      method: "PUT",
      path,
      params
    }).then(this.parseJSON);
  }
  patch(path, params) {
    return this.request({
      method: "PATCH",
      path,
      params
    }).then(this.parseJSON);
  }
  delete(path, params) {
    return this.request({
      method: "DELETE",
      path,
      params
    }).then(this.parseJSON);
  }
  request(options) {
    const { method, path, params = {} } = options;
    const { apiKey, accessToken, timeout, userAgent } = this.configure;
    const query = apiKey ? { apiKey } : {};
    const headers = {};
    const init = {
      method,
      headers
    };
    if (timeout) init["timeout"] = timeout;
    if (!apiKey && accessToken) headers["Authorization"] = "Bearer " + accessToken;
    if (userAgent) headers["User-Agent"] = userAgent;
    if (typeof window !== "undefined") init.mode = "cors";
    if (method !== "GET") if (params instanceof FormData) init.body = params;
    else {
      headers["Content-type"] = "application/x-www-form-urlencoded";
      init.body = this.toQueryString(params);
    }
    else Object.keys(params).forEach((key) => query[key] = params[key]);
    const queryStr = this.toQueryString(query);
    const url = `${this.restBaseURL}/${path}` + (queryStr.length > 0 ? `?${queryStr}` : "");
    return this.fetch(url, init).then(this.checkStatus);
  }
  checkStatus(response) {
    return new Promise((resolve, reject) => {
      if (200 <= response.status && response.status < 300) resolve(response);
      else response.json().then((data) => {
        if (response.status === 401) reject(new BacklogAuthError(response, data));
        else reject(new BacklogApiError(response, data));
      }).catch(() => reject(new UnexpectedError(response)));
    });
  }
  parseJSON(response) {
    if (response.status === 204 || response.headers.get("Content-Length") === "0") return Promise.resolve(void 0);
    return response.json();
  }
  toQueryString(params) {
    const formatted = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (key.startsWith("customField_") && Array.isArray(value)) value.forEach((v, i) => {
        formatted[`${key}[${i}]`] = v;
      });
      else formatted[key] = value;
    });
    return qs.stringify(formatted, { arrayFormat: "brackets" });
  }
  get webAppBaseURL() {
    return `https://${this.configure.host}`;
  }
  get restBaseURL() {
    return `${this.webAppBaseURL}/api/v2`;
  }
};
var Backlog = class extends Request {
  constructor(configure) {
    super(configure);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-space/
  */
  getSpace() {
    return this.get("space");
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-recent-updates/
  */
  getSpaceActivities(params) {
    return this.get("space/activities", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-space-logo/
  */
  getSpaceIcon() {
    return this.download("space/image");
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-space-notification/
  */
  getSpaceNotification() {
    return this.get("space/notification");
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-space-notification/
  */
  putSpaceNotification(params) {
    return this.put("space/notification", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-space-disk-usage/
  */
  getSpaceDiskUsage() {
    return this.get("space/diskUsage");
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/post-attachment-file/
  */
  postSpaceAttachment(form) {
    return this.upload("space/attachment", form);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-user-list/
  */
  getUsers() {
    return this.get(`users`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-user/
  */
  getUser(userId) {
    return this.get(`users/${userId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-user/
  */
  postUser(params) {
    return this.post(`users`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-user/
  */
  patchUser(userId, params) {
    return this.patch(`users/${userId}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-user/
  */
  deleteUser(userId) {
    return this.delete(`users/${userId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-own-user/
  */
  getMyself() {
    return this.get("users/myself");
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-user-icon/
  */
  getUserIcon(userId) {
    return this.download(`users/${userId}/icon`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-user-recent-updates/
  */
  getUserActivities(userId, params) {
    return this.get(`users/${userId}/activities`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-received-star-list/
  */
  getUserStars(userId, params) {
    return this.get(`users/${userId}/stars`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/count-user-received-stars/
  */
  getUserStarsCount(userId, params) {
    return this.get(`users/${userId}/stars/count`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-recently-viewed-issues/
  */
  getRecentlyViewedIssues(params) {
    return this.get("users/myself/recentlyViewedIssues", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-recently-viewed-projects/
  */
  getRecentlyViewedProjects(params) {
    return this.get("users/myself/recentlyViewedProjects", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-recently-viewed-wikis/
  */
  getRecentlyViewedWikis(params) {
    return this.get("users/myself/recentlyViewedWikis", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-status-list-of-project/
  */
  getProjectStatuses(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/statuses`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-resolution-list/
  */
  getResolutions() {
    return this.get("resolutions");
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-priority-list/
  */
  getPriorities() {
    return this.get("priorities");
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-project-list/
  */
  getProjects(params) {
    return this.get("projects", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-project/
  */
  postProject(params) {
    return this.post("projects", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-project/
  */
  getProject(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-project/
  */
  patchProject(projectIdOrKey, params) {
    return this.patch(`projects/${projectIdOrKey}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-project/
  */
  deleteProject(projectIdOrKey) {
    return this.delete(`projects/${projectIdOrKey}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-project-icon/
  */
  getProjectIcon(projectIdOrKey) {
    return this.download(`projects/${projectIdOrKey}/image`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-project-recent-updates/
  */
  getProjectActivities(projectIdOrKey, params) {
    return this.get(`projects/${projectIdOrKey}/activities`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-project-user/
  */
  postProjectUser(projectIdOrKey, userId) {
    return this.post(`projects/${projectIdOrKey}/users`, { userId });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-project-user-list/
  */
  getProjectUsers(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/users`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-project-user/
  */
  deleteProjectUsers(projectIdOrKey, params) {
    return this.delete(`projects/${projectIdOrKey}/users`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-project-administrator/
  */
  postProjectAdministrators(projectIdOrKey, params) {
    return this.post(`projects/${projectIdOrKey}/administrators`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-project-administrators/
  */
  getProjectAdministrators(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/administrators`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-project-administrator/
  */
  deleteProjectAdministrators(projectIdOrKey, params) {
    return this.delete(`projects/${projectIdOrKey}/administrators`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-status/
  */
  postProjectStatus(projectIdOrKey, params) {
    return this.post(`projects/${projectIdOrKey}/statuses`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-status/
  */
  patchProjectStatus(projectIdOrKey, id, params) {
    return this.patch(`projects/${projectIdOrKey}/statuses/${id}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-status/
  */
  deleteProjectStatus(projectIdOrKey, id, substituteStatusId) {
    return this.delete(`projects/${projectIdOrKey}/statuses/${id}`, { substituteStatusId });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-order-of-status/
  */
  patchProjectStatusOrder(projectIdOrKey, statusId) {
    return this.patch(`projects/${projectIdOrKey}/statuses/updateDisplayOrder`, { statusId });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-issue-type-list/
  */
  getIssueTypes(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/issueTypes`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-issue-type/
  */
  postIssueType(projectIdOrKey, params) {
    return this.post(`projects/${projectIdOrKey}/issueTypes`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-issue-type/
  */
  patchIssueType(projectIdOrKey, id, params) {
    return this.patch(`projects/${projectIdOrKey}/issueTypes/${id}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-issue-type/
  */
  deleteIssueType(projectIdOrKey, id, params) {
    return this.delete(`projects/${projectIdOrKey}/issueTypes/${id}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-category-list/
  */
  getCategories(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/categories`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-category/
  */
  postCategories(projectIdOrKey, params) {
    return this.post(`projects/${projectIdOrKey}/categories`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-category/
  */
  patchCategories(projectIdOrKey, id, params) {
    return this.patch(`projects/${projectIdOrKey}/categories/${id}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-category/
  */
  deleteCategories(projectIdOrKey, id) {
    return this.delete(`projects/${projectIdOrKey}/categories/${id}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-version-milestone-list/
  */
  getVersions(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/versions`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-version-milestone/
  */
  postVersions(projectIdOrKey, params) {
    return this.post(`projects/${projectIdOrKey}/versions`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-version-milestone/
  */
  patchVersions(projectIdOrKey, id, params) {
    return this.patch(`projects/${projectIdOrKey}/versions/${id}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-version/
  */
  deleteVersions(projectIdOrKey, id) {
    return this.delete(`projects/${projectIdOrKey}/versions/${id}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-custom-field-list/
  */
  getCustomFields(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/customFields`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-custom-field/
  */
  postCustomField(projectIdOrKey, params) {
    return this.post(`projects/${projectIdOrKey}/customFields`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-custom-field/
  */
  patchCustomField(projectIdOrKey, id, params) {
    return this.patch(`projects/${projectIdOrKey}/customFields/${id}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-custom-field/
  */
  deleteCustomField(projectIdOrKey, id) {
    return this.delete(`projects/${projectIdOrKey}/customFields/${id}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-list-item-for-list-type-custom-field/
  */
  postCustomFieldItem(projectIdOrKey, id, params) {
    return this.post(`projects/${projectIdOrKey}/customFields/${id}/items`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-list-item-for-list-type-custom-field/
  */
  patchCustomFieldItem(projectIdOrKey, id, itemId, params) {
    return this.patch(`projects/${projectIdOrKey}/customFields/${id}/items/${itemId}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-list-item-for-list-type-custom-field/
  */
  deleteCustomFieldItem(projectIdOrKey, id, itemId) {
    return this.delete(`projects/${projectIdOrKey}/customFields/${id}/items/${itemId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-shared-files/
  */
  getSharedFiles(projectIdOrKey, path, params) {
    return this.get(`projects/${projectIdOrKey}/files/metadata/${path}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-file/
  */
  getSharedFile(projectIdOrKey, sharedFileId) {
    return this.download(`projects/${projectIdOrKey}/files/${sharedFileId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-project-disk-usage/
  */
  getProjectsDiskUsage(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/diskUsage`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-webhooks/
  */
  getWebhooks(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/webhooks`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-webhook/
  */
  postWebhook(projectIdOrKey, params) {
    return this.post(`projects/${projectIdOrKey}/webhooks`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-webhook/
  */
  getWebhook(projectIdOrKey, webhookId) {
    return this.get(`projects/${projectIdOrKey}/webhooks/${webhookId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-webhook/
  */
  patchWebhook(projectIdOrKey, webhookId, params) {
    return this.patch(`projects/${projectIdOrKey}/webhooks/${webhookId}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-webhook/
  */
  deleteWebhook(projectIdOrKey, webhookId) {
    return this.delete(`projects/${projectIdOrKey}/webhooks/${webhookId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-issue-list/
  */
  getIssues(params) {
    return this.get("issues", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/count-issue/
  */
  getIssuesCount(params) {
    return this.get("issues/count", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-issue/
  */
  postIssue(params) {
    return this.post("issues", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-issue/
  */
  patchIssue(issueIdOrKey, params) {
    return this.patch(`issues/${issueIdOrKey}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-issue/
  */
  getIssue(issueIdOrKey, params) {
    return this.get(`issues/${issueIdOrKey}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-issue/
  */
  deleteIssue(issueIdOrKey) {
    return this.delete(`issues/${issueIdOrKey}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-comment-list/
  */
  getIssueComments(issueIdOrKey, params) {
    return this.get(`issues/${issueIdOrKey}/comments`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-comment/
  */
  postIssueComments(issueIdOrKey, params) {
    return this.post(`issues/${issueIdOrKey}/comments`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/count-comment/
  */
  getIssueCommentsCount(issueIdOrKey) {
    return this.get(`issues/${issueIdOrKey}/comments/count`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-comment/
  */
  getIssueComment(issueIdOrKey, commentId) {
    return this.get(`issues/${issueIdOrKey}/comments/${commentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-comment/
  */
  deleteIssueComment(issueIdOrKey, commentId) {
    return this.delete(`issues/${issueIdOrKey}/comments/${commentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-comment/
  */
  patchIssueComment(issueIdOrKey, commentId, params) {
    return this.patch(`issues/${issueIdOrKey}/comments/${commentId}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-comment-notifications/
  */
  getIssueCommentNotifications(issueIdOrKey, commentId) {
    return this.get(`issues/${issueIdOrKey}/comments/${commentId}/notifications`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-comment-notification/
  */
  postIssueCommentNotifications(issueIdOrKey, commentId, prams) {
    return this.post(`issues/${issueIdOrKey}/comments/${commentId}/notifications`, prams);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-issue-attachments/
  */
  getIssueAttachments(issueIdOrKey) {
    return this.get(`issues/${issueIdOrKey}/attachments`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-issue-attachment/
  */
  getIssueAttachment(issueIdOrKey, attachmentId) {
    return this.download(`issues/${issueIdOrKey}/attachments/${attachmentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-issue-attachment/
  */
  deleteIssueAttachment(issueIdOrKey, attachmentId) {
    return this.delete(`issues/${issueIdOrKey}/attachments/${attachmentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-issue-participant-list/
  */
  getIssueParticipants(issueIdOrKey) {
    return this.get(`issues/${issueIdOrKey}/participants`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-linked-shared-files/
  */
  getIssueSharedFiles(issueIdOrKey) {
    return this.get(`issues/${issueIdOrKey}/sharedFiles`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/link-shared-files-to-issue/
  */
  linkIssueSharedFiles(issueIdOrKey, params) {
    return this.post(`issues/${issueIdOrKey}/sharedFiles`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/remove-link-to-shared-file-from-issue/
  */
  unlinkIssueSharedFile(issueIdOrKey, id) {
    return this.delete(`issues/${issueIdOrKey}/sharedFiles/${id}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-list/
  */
  getWikis(params) {
    return this.get(`wikis`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/count-wiki-page/
  */
  getWikisCount(projectIdOrKey) {
    return this.get(`wikis/count`, { projectIdOrKey });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-tag-list/
  */
  getWikisTags(projectIdOrKey) {
    return this.get(`wikis/tags`, { projectIdOrKey });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-wiki-page/
  */
  postWiki(params) {
    return this.post(`wikis`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page/
  */
  getWiki(wikiId) {
    return this.get(`wikis/${wikiId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-wiki-page/
  */
  patchWiki(wikiId, params) {
    return this.patch(`wikis/${wikiId}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-wiki-page/
  */
  deleteWiki(wikiId, mailNotify) {
    return this.delete(`wikis/${wikiId}`, { mailNotify });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-wiki-attachments/
  */
  getWikisAttachments(wikiId) {
    return this.get(`wikis/${wikiId}/attachments`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/attach-file-to-wiki/
  */
  postWikisAttachments(wikiId, attachmentId) {
    return this.post(`wikis/${wikiId}/attachments`, { attachmentId });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-attachment/
  */
  getWikiAttachment(wikiId, attachmentId) {
    return this.download(`wikis/${wikiId}/attachments/${attachmentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/remove-wiki-attachment/
  */
  deleteWikisAttachments(wikiId, attachmentId) {
    return this.delete(`wikis/${wikiId}/attachments/${attachmentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-shared-files-on-wiki/
  */
  getWikisSharedFiles(wikiId) {
    return this.get(`wikis/${wikiId}/sharedFiles`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/link-shared-files-to-wiki/
  */
  linkWikisSharedFiles(wikiId, fileId) {
    return this.post(`wikis/${wikiId}/sharedFiles`, { fileId });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/remove-link-to-shared-file-from-wiki/
  */
  unlinkWikisSharedFiles(wikiId, id) {
    return this.delete(`wikis/${wikiId}/sharedFiles/${id}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/get-document-list/
  */
  getDocuments(params) {
    return this.get("documents", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/get-document-tree/
  */
  getDocumentTree(projectIdOrKey) {
    return this.get(`documents/tree`, { projectIdOrKey });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/get-document/
  */
  getDocument(documentId) {
    return this.get(`documents/${documentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/get-document-attachments/
  */
  downloadDocumentAttachment(documentId, attachmentId) {
    return this.download(`documents/${documentId}/attachments/${attachmentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-document/
  */
  addDocument(params) {
    return this.post("documents", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-document/
  */
  deleteDocument(documentId) {
    return this.delete(`documents/${documentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-history/
  */
  getWikisHistory(wikiId, params) {
    return this.get(`wikis/${wikiId}/history`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-star/
  */
  getWikisStars(wikiId) {
    return this.get(`wikis/${wikiId}/stars`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-star/
  */
  postStar(params) {
    return this.post("stars", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/remove-star/
  */
  removeStar(starId) {
    const endpoint = `stars/${starId}`;
    return this.delete(endpoint);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-notification/
  */
  getNotifications(params) {
    return this.get("notifications", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/count-notification/
  */
  getNotificationsCount(params) {
    return this.get("notifications/count", params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/reset-unread-notification-count/
  */
  resetNotificationsMarkAsRead() {
    return this.post("notifications/markAsRead");
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/read-notification/
  */
  markAsReadNotification(id) {
    return this.post(`notifications/${id}/markAsRead`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-git-repositories/
  */
  getGitRepositories(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/git/repositories`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-git-repository/
  */
  getGitRepository(projectIdOrKey, repoIdOrName) {
    return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-pull-request-list/
  */
  getPullRequests(projectIdOrKey, repoIdOrName, params) {
    return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-number-of-pull-requests/
  */
  getPullRequestsCount(projectIdOrKey, repoIdOrName, params) {
    return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/count`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-pull-request/
  */
  postPullRequest(projectIdOrKey, repoIdOrName, params) {
    return this.post(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-pull-request/
  */
  getPullRequest(projectIdOrKey, repoIdOrName, number) {
    return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-pull-request/
  */
  patchPullRequest(projectIdOrKey, repoIdOrName, number, params) {
    return this.patch(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-pull-request-comment/
  */
  getPullRequestComments(projectIdOrKey, repoIdOrName, number, params) {
    return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/comments`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-pull-request-comment/
  */
  postPullRequestComments(projectIdOrKey, repoIdOrName, number, params) {
    return this.post(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/comments`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-number-of-pull-request-comments/
  */
  getPullRequestCommentsCount(projectIdOrKey, repoIdOrName, number) {
    return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/comments/count`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-pull-request-comment-information/
  */
  patchPullRequestComments(projectIdOrKey, repoIdOrName, number, commentId, params) {
    return this.patch(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/comments/${commentId}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-pull-request-attachment/
  */
  getPullRequestAttachments(projectIdOrKey, repoIdOrName, number) {
    return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/attachments`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/download-pull-request-attachment/
  */
  getPullRequestAttachment(projectIdOrKey, repoIdOrName, number, attachmentId) {
    return this.download(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/attachments/${attachmentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-pull-request-attachments/
  */
  deletePullRequestAttachment(projectIdOrKey, repoIdOrName, number, attachmentId) {
    return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/attachments/${attachmentId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-watching-list
  */
  getWatchingListItems(userId, params) {
    return this.get(`users/${userId}/watchings`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/count-watching
  */
  getWatchingListCount(userId, params) {
    return this.get(`users/${userId}/watchings/count`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-watching
  */
  getWatchingListItem(watchId) {
    return this.get(`watchings/${watchId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-watching
  */
  postWatchingListItem(params) {
    return this.post(`watchings`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-watching
  */
  patchWatchingListItem(watchId, note) {
    return this.patch(`watchings/${watchId}`, { note });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-watching
  */
  deletehWatchingListItem(watchId) {
    return this.delete(`watchings/${watchId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/mark-watching-as-read
  */
  resetWatchingListItemAsRead(watchId) {
    return this.post(`watchings/${watchId}/markAsRead`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-licence
  */
  getLicence() {
    return this.get(`space/licence`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-list-of-teams/
  */
  getTeams(params) {
    return this.get(`teams`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-team/
  */
  postTeam(params) {
    return this.post(`teams`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-team/
  */
  getTeam(teamId) {
    return this.get(`teams/${teamId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/update-team/
  */
  patchTeam(teamId, params) {
    return this.patch(`teams/${teamId}`, params);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-team/
  */
  deleteTeam(teamId) {
    return this.delete(`teams/${teamId}`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-team-icon/
  */
  getTeamIcon(teamId) {
    return this.download(`teams/${teamId}/icon`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-project-team-list/
  */
  getProjectTeams(projectIdOrKey) {
    return this.get(`projects/${projectIdOrKey}/teams`);
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/add-project-team/
  */
  postProjectTeam(projectIdOrKey, teamId) {
    return this.post(`projects/${projectIdOrKey}/teams`, { teamId });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/delete-project-team/
  */
  deleteProjectTeam(projectIdOrKey, teamId) {
    return this.delete(`projects/${projectIdOrKey}/teams`, { teamId });
  }
  /**
  * https://developer.nulab.com/docs/backlog/api/2/get-rate-limit/
  */
  getRateLimit() {
    return this.get("rateLimit");
  }
  download(path) {
    return this.request({
      method: "GET",
      path
    }).then(this.parseFileData);
  }
  upload(path, params) {
    return this.request({
      method: "POST",
      path,
      params
    }).then(this.parseJSON);
  }
  parseFileData(response) {
    return new Promise((resolve) => {
      if (typeof window !== "undefined") resolve({
        body: response.body,
        url: response.url,
        blob: () => response.blob()
      });
      else {
        const disposition = response.headers.get("Content-Disposition");
        const filename = disposition ? disposition.substring(disposition.indexOf("''") + 2) : "";
        resolve({
          body: response.body,
          url: response.url,
          filename
        });
      }
    });
  }
};
var Issue;
(function(_Issue) {
  _Issue.ParentChildType = /* @__PURE__ */ (function(ParentChildType) {
    ParentChildType[ParentChildType["All"] = 0] = "All";
    ParentChildType[ParentChildType["NotChild"] = 1] = "NotChild";
    ParentChildType[ParentChildType["Child"] = 2] = "Child";
    ParentChildType[ParentChildType["ChildOrGrandchild"] = 2] = "ChildOrGrandchild";
    ParentChildType[ParentChildType["NotChildNotParent"] = 3] = "NotChildNotParent";
    ParentChildType[ParentChildType["Standalone"] = 3] = "Standalone";
    ParentChildType[ParentChildType["Parent"] = 4] = "Parent";
    ParentChildType[ParentChildType["HasChildren"] = 4] = "HasChildren";
    ParentChildType[ParentChildType["GrandchildOnly"] = 5] = "GrandchildOnly";
    ParentChildType[ParentChildType["ChildOnly"] = 6] = "ChildOnly";
    ParentChildType[ParentChildType["TopLevelOnly"] = 7] = "TopLevelOnly";
    ParentChildType[ParentChildType["ExcludeGrandchild"] = 8] = "ExcludeGrandchild";
    ParentChildType[ParentChildType["ExcludeTopLevel"] = 9] = "ExcludeTopLevel";
    ParentChildType[ParentChildType["LeafOnly"] = 10] = "LeafOnly";
    return ParentChildType;
  })({});
})(Issue || (Issue = {}));

// node_modules/backlog-mcp-server/build/auth/backlogAuthContext.js
import { AsyncLocalStorage } from "node:async_hooks";
var accessTokenStorage = new AsyncLocalStorage();

// node_modules/backlog-mcp-server/build/utils/backlogOrganizationContext.js
import { AsyncLocalStorage as AsyncLocalStorage2 } from "node:async_hooks";
var organizationStorage = new AsyncLocalStorage2();
function getCurrentOrganization() {
  return organizationStorage.getStore();
}

// node_modules/backlog-mcp-server/package.json
var package_default = {
  name: "backlog-mcp-server",
  version: "0.13.2",
  type: "module",
  bin: {
    "backlog-mcp-server": "./build/index.js"
  },
  engines: {
    node: ">=22"
  },
  devEngines: {
    runtime: {
      name: "node",
      version: ">=22",
      onFail: "warn"
    }
  },
  license: "MIT",
  repository: {
    type: "git",
    url: "git+https://github.com/nulab/backlog-mcp-server.git"
  },
  files: [
    "build"
  ],
  dependencies: {
    "@hono/node-server": "^2.0.4",
    "@modelcontextprotocol/sdk": "^1.29.0",
    "backlog-js": "^0.18.1",
    cosmiconfig: "^9.0.1",
    "env-var": "^7.5.0",
    graphql: "^16.14.1",
    hono: "^4.12.25",
    pino: "^10.3.1",
    "pino-pretty": "^13.1.3",
    yargs: "^18.0.0",
    zod: "^3.24.3"
  },
  devDependencies: {
    "@eslint/js": "^10.0.1",
    "@types/node": "^25.9.2",
    "@types/yargs": "^17.0.35",
    "@typescript-eslint/eslint-plugin": "^8.60.1",
    "@typescript-eslint/parser": "^8.60.1",
    "@typescript-eslint/utils": "^8.60.1",
    "@vitest/coverage-v8": "^4.1.8",
    eslint: "^10.4.1",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.6",
    prettier: "^3.8.3",
    tsx: "^4.22.4",
    typescript: "^6.0.3",
    vitest: "^4.1.8"
  },
  scripts: {
    preinstall: "npx only-allow pnpm",
    dev: "tsx src/index.ts",
    build: "tsc && chmod 755 build/index.js",
    test: "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    lint: "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    format: 'prettier --check "**/*.{ts,tsx}"',
    "format:fix": 'prettier --write "**/*.{ts,tsx}"',
    typecheck: "tsc --noEmit",
    "typecheck:all": "tsc --noEmit --project tsconfig.test.json"
  }
};

// node_modules/backlog-mcp-server/build/utils/backlogClientRegistry.js
var USER_AGENT = `backlog-mcp-server/${package_default.version}`;
function createBacklogClientRegistry(input = {}) {
  const env = input.env ?? process.env;
  const multiOrgRegistry = createMultiOrganizationRegistryFromEnv(env);
  if (multiOrgRegistry) {
    return multiOrgRegistry;
  }
  const domain = env.BACKLOG_DOMAIN;
  const apiKey = env.BACKLOG_API_KEY;
  if (!domain || !apiKey) {
    throw new Error("Configure either BACKLOG_ORG_<NAME>_DOMAIN and BACKLOG_ORG_<NAME>_API_KEY with BACKLOG_DEFAULT_ORG, or both BACKLOG_DOMAIN and BACKLOG_API_KEY.");
  }
  const defaultName = "default";
  const client = new Backlog({ host: domain, apiKey, userAgent: USER_AGENT });
  const info = {
    name: defaultName,
    domain,
    isDefault: true
  };
  return {
    resolveClient: (organization) => {
      if (organization && organization !== defaultName) {
        throw new Error(`Unknown organization '${organization}'. Use list_organizations to inspect available organizations.`);
      }
      return client;
    },
    createScopedClient: () => createBacklogClientProxy(() => {
      const organization = getCurrentOrganization();
      if (organization && organization !== defaultName) {
        throw new Error(`Unknown organization '${organization}'. Use list_organizations to inspect available organizations.`);
      }
      return client;
    }),
    listOrganizations: () => [info],
    getDefaultOrganization: () => defaultName
  };
}
function createMultiOrganizationRegistryFromEnv(env) {
  const organizations = /* @__PURE__ */ new Map();
  let hasMultiOrgKeys = false;
  for (const [key, value] of Object.entries(env)) {
    const match = /^BACKLOG_ORG_(.+)_(DOMAIN|API_KEY)$/.exec(key);
    if (!match) {
      continue;
    }
    hasMultiOrgKeys = true;
    const [, organization, field] = match;
    const config = organizations.get(organization) ?? {};
    if (field === "DOMAIN") {
      config.domain = value;
    } else {
      config.apiKey = value;
    }
    organizations.set(organization, config);
  }
  if (!hasMultiOrgKeys) {
    return void 0;
  }
  const invalidOrganizations = Array.from(organizations.entries()).filter(([, config]) => !config.domain || !config.apiKey).map(([organization, config]) => {
    const missing = [];
    if (!config.domain)
      missing.push(`BACKLOG_ORG_${organization}_DOMAIN`);
    if (!config.apiKey)
      missing.push(`BACKLOG_ORG_${organization}_API_KEY`);
    return `${organization} (missing: ${missing.join(", ")})`;
  }).sort();
  if (invalidOrganizations.length > 0) {
    throw new Error(`Incomplete multi-organization configuration. ${invalidOrganizations.join("; ")}`);
  }
  if (organizations.size === 0) {
    throw new Error("No valid multi-organization configuration was found. Define BACKLOG_ORG_<NAME>_DOMAIN and BACKLOG_ORG_<NAME>_API_KEY pairs.");
  }
  const defaultOrganization = env.BACKLOG_DEFAULT_ORG;
  if (!defaultOrganization) {
    throw new Error("BACKLOG_DEFAULT_ORG is required when using BACKLOG_ORG_<NAME>_DOMAIN and BACKLOG_ORG_<NAME>_API_KEY.");
  }
  const clients = /* @__PURE__ */ new Map();
  const validatedOrganizations = organizations;
  const organizationInfo = Array.from(validatedOrganizations.entries()).map(([name, config]) => {
    clients.set(name, new Backlog({
      host: config.domain,
      apiKey: config.apiKey,
      userAgent: USER_AGENT
    }));
    return {
      name,
      domain: config.domain,
      isDefault: name === defaultOrganization
    };
  });
  if (!clients.has(defaultOrganization)) {
    throw new Error(`BACKLOG_DEFAULT_ORG '${defaultOrganization}' does not match any configured organization. Use list_organizations to inspect available organizations.`);
  }
  return {
    resolveClient: (organization) => {
      const orgName = organization ?? defaultOrganization;
      return resolveKnownClient(clients, orgName);
    },
    createScopedClient: () => createBacklogClientProxy(() => {
      const organization = getCurrentOrganization();
      return organization === void 0 ? resolveKnownClient(clients, defaultOrganization) : resolveKnownClient(clients, organization);
    }),
    listOrganizations: () => organizationInfo,
    getDefaultOrganization: () => defaultOrganization
  };
}
function resolveKnownClient(clients, organization) {
  const client = clients.get(organization);
  if (!client) {
    throw new Error(`Unknown organization '${organization}'. Use list_organizations to inspect available organizations.`);
  }
  return client;
}
function createBacklogClientProxy(resolveClient) {
  return new Proxy({}, {
    get(_target, prop) {
      const client = resolveClient();
      const value = Reflect.get(client, prop);
      if (typeof value === "function") {
        return value.bind(client);
      }
      return value;
    }
  });
}

// src/core/run-operation.mjs
async function runOperation(operation, input, options = {}) {
  const trace = getUpstreamTrace(operation);
  const mutationClass = classifyMutation(operation);
  const permission = requiredPermission(operation);
  if (options.allowedPermissions !== void 0 && !options.allowedPermissions.includes(permission)) {
    return failure(
      operation,
      "PERMISSION_REQUIRED",
      `Operation ${operation} requires ${permission} permission. Add it with --allow ${permission}.`,
      trace
    );
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return failure(operation, "INVALID_INPUT", "Input must be a JSON object.", trace);
  }
  if ((mutationClass === "destructive" || mutationClass === "broad-mutation") && options.confirmDestructive !== true) {
    return failure(
      operation,
      "CONFIRMATION_REQUIRED",
      `Operation ${operation} requires explicit destructive-operation confirmation.`,
      trace
    );
  }
  let registry;
  try {
    registry = options.registry ?? createBacklogClientRegistry({ env: options.env });
  } catch (error) {
    return failure(operation, "CONFIGURATION_ERROR", errorMessage(error), trace);
  }
  const { organization, ...toolInput } = input;
  let backlog;
  try {
    backlog = registry.resolveClient(organization);
  } catch (error) {
    return failure(operation, "ORGANIZATION_ERROR", errorMessage(error), trace);
  }
  const resolved = resolveTool(backlog, operation);
  if (!resolved) {
    return failure(operation, "UNKNOWN_OPERATION", `Unknown operation: ${operation}`, trace);
  }
  const parsed = resolved.tool.schema.safeParse(toolInput);
  if (!parsed.success) {
    return {
      schemaVersion: 1,
      operation,
      toolset: resolved.toolset,
      success: false,
      diagnostics: parsed.error.issues.map((issue) => ({
        code: "INVALID_ARGUMENT",
        severity: "error",
        path: issue.path.join("."),
        message: issue.message
      })),
      trace
    };
  }
  if (options.dryRun === true) {
    return {
      schemaVersion: 1,
      operation,
      toolset: resolved.toolset,
      success: true,
      dryRun: true,
      input: parsed.data,
      diagnostics: [],
      trace
    };
  }
  try {
    const result = await resolved.tool.handler(parsed.data);
    return {
      schemaVersion: 1,
      operation,
      toolset: resolved.toolset,
      success: true,
      result,
      diagnostics: [],
      trace
    };
  } catch (error) {
    const parsedError = parseBacklogAPIError(error);
    return failure(
      operation,
      "UPSTREAM_ERROR",
      parsedError?.message ?? errorMessage(error),
      trace,
      resolved.toolset
    );
  }
}
function failure(operation, code, message, trace, toolset) {
  return {
    schemaVersion: 1,
    operation,
    ...toolset ? { toolset } : {},
    success: false,
    diagnostics: [{ code, severity: "error", message }],
    trace
  };
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

// src/runtime.mjs
var product = Object.freeze({
  name: "backlog-api",
  version: "0.3.2",
  upstream: "backlog-mcp-server@0.13.2"
});

// src/cli.mjs
var HELP = `backlog-api ${product.version} \u2014 JSON CLI for Backlog API operations

Usage:
  backlog-api --version
  backlog-api --help
  backlog-api tools list
  backlog-api trace [operation]
  backlog-api call <operation> [--input <file|->] [--allow <permissions>]
      [--dry-run] [--confirm-destructive]

Commands:
  --version
      Print only the product version, for example: ${product.version}

  --help
      Print this help text. No Backlog credentials are required.

  tools list
      Print a JSON catalog of available operations. Each entry includes the
      operation name, description, toolset, and mutation classification.

  trace [operation]
      Print JSON traceability metadata for all operations or one operation.
      Use this to relate a Node operation to its upstream implementation.

  call <operation>
      Read one JSON object, invoke the named operation, and print one JSON
      result envelope. Use "tools list" to discover operation names.

Call options:
  --input <file>          Read the request object from a UTF-8 JSON file.
  --input -               Read the request object from stdin (default).
  --allow <permissions>   Allow comma-separated CRUD permissions. Defaults to
                          READ. Values: READ, CREATE, UPDATE, DELETE.
  --dry-run               Validate and normalize input without invoking Backlog.
  --confirm-destructive   Explicitly authorize delete_* or broad reset calls.

Input JSON:
  The input must be exactly one JSON object. Operation arguments are top-level
  properties. In a multi-organization setup, add "organization" to select a
  configured Backlog connection; it is not forwarded to the Backlog API.

Output:
  "tools list", "trace", and "call" write machine-readable JSON to stdout.
  A call result contains schemaVersion, operation, success, diagnostics,
  trace, and either result or dryRun/input data. --help and --version are the
  only plain-text stdout commands. Unexpected CLI errors are written to stderr.

Safety:
  Calls allow READ operations only by default. CREATE, UPDATE, and DELETE must
  be explicitly enabled with --allow. This is a client-side execution policy,
  not a Backlog account permission.

  delete_* and reset_unread_notification_count require
  --confirm-destructive when applicable, independently of --allow. DELETE
  therefore requires both --allow DELETE and --confirm-destructive.

Environment:
  BACKLOG_DOMAIN and BACKLOG_API_KEY configure one connection. The upstream
  BACKLOG_DEFAULT_ORG and BACKLOG_ORG_<NAME>_* variables configure multiple
  organizations. Metadata commands do not require credentials.

Exit codes:
  0  Successful metadata command or operation.
  1  Configuration, confirmation, organization, or Backlog API failure.
  2  CLI usage error or operation input-schema failure.

Examples:
  backlog-api tools list
  backlog-api trace get_issue
  printf '{"issueKey":"PROJ-1"}\\n' | backlog-api call get_issue
  backlog-api call get_issue --input request.json --dry-run
  backlog-api call add_issue --input request.json --allow CREATE
  backlog-api call delete_issue --input request.json --allow DELETE --confirm-destructive
`;
main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}
`);
  process.exitCode = 1;
});
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args[0] === "help") {
    process.stdout.write(HELP);
    return;
  }
  if (args.includes("--version")) {
    process.stdout.write(`${product.version}
`);
    return;
  }
  if (args[0] === "tools" && args[1] === "list") {
    writeJson({ schemaVersion: 1, product, operations: listOperations() });
    return;
  }
  if (args[0] === "trace") {
    const mapping = getMapping();
    const operation = args[1];
    writeJson(
      operation ? {
        ...mapping.upstream,
        operation: mapping.operations.find((entry) => entry.operation === operation)
      } : mapping
    );
    return;
  }
  if (args[0] === "call" && args[1]) {
    const inputPath = optionValue(args, "--input") ?? "-";
    let allowedPermissions;
    try {
      allowedPermissions = parseAllowedPermissions(optionValue(args, "--allow"));
    } catch (error) {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}
`);
      process.exitCode = 2;
      return;
    }
    const input = JSON.parse(await readInput(inputPath));
    const result = await runOperation(args[1], input, {
      dryRun: args.includes("--dry-run"),
      confirmDestructive: args.includes("--confirm-destructive"),
      allowedPermissions
    });
    writeJson(result);
    if (!result.success) {
      process.exitCode = result.diagnostics.some(
        (diagnostic) => diagnostic.code === "INVALID_ARGUMENT"
      ) ? 2 : 1;
    }
    return;
  }
  process.stderr.write("Unknown command. Use --help for usage.\n");
  process.exitCode = 2;
}
function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index < 0) {
    return void 0;
  }
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value.`);
  }
  return value;
}
function parseAllowedPermissions(value) {
  if (value === void 0) {
    return ["READ"];
  }
  const supported = /* @__PURE__ */ new Set(["READ", "CREATE", "UPDATE", "DELETE"]);
  const permissions = [...new Set(value.split(",").map((entry) => entry.trim().toUpperCase()))];
  const invalid = permissions.filter((permission) => !supported.has(permission));
  if (invalid.length > 0) {
    throw new Error(
      `--allow contains unsupported permission(s): ${invalid.join(", ")}. Use READ, CREATE, UPDATE, or DELETE.`
    );
  }
  return permissions;
}
async function readInput(inputPath) {
  if (inputPath !== "-") {
    return fs.readFileSync(inputPath, "utf8");
  }
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (text.trim().length === 0) {
    throw new Error("call requires one JSON object through --input or stdin.");
  }
  return text;
}
function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}
`);
}
