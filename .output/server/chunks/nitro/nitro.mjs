import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { promises, existsSync } from 'node:fs';
import { dirname as dirname$1, resolve as resolve$2, join } from 'node:path';
import { toValue } from 'vue';
import { createConsola as createConsola$1 } from 'consola/core';
import { fileURLToPath } from 'node:url';
import { getIcons } from '@iconify/utils';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'ipx';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return undefined;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function encodeParam(text) {
  return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === undefined) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== undefined).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}
function withHttps(input) {
  return withProtocol(input, "https://");
}
function withProtocol(input, protocol) {
  let match = input.match(PROTOCOL_REGEX);
  if (!match) {
    match = input.match(/^\/{2,}/);
  }
  if (!match) {
    return protocol + input;
  }
  return protocol + input.slice(match[0].length);
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (undefined === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (undefined !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

const defaults = Object.freeze({
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false,
  excludeKeys: undefined,
  excludeValues: undefined,
  replacer: undefined
});
function objectHash(object, options) {
  if (options) {
    options = { ...defaults, ...options };
  } else {
    options = defaults;
  }
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}
const defaultPrototypesKeys = Object.freeze([
  "prototype",
  "__proto__",
  "constructor"
]);
function createHasher(options) {
  let buff = "";
  let context = /* @__PURE__ */ new Map();
  const write = (str) => {
    buff += str;
  };
  return {
    toString() {
      return buff;
    },
    getContext() {
      return context;
    },
    dispatch(value) {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    },
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      if (objectLength < 10) {
        objType = "unknown:[" + objString + "]";
      } else {
        objType = objString.slice(8, objectLength - 1);
      }
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = context.get(object)) === undefined) {
        context.set(object, context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        write("buffer:");
        return write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else if (!options.ignoreUnknown) {
          this.unkown(object, objType);
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        let extraKeys = [];
        if (options.respectType !== false && !isNativeFunction(object)) {
          extraKeys = defaultPrototypesKeys;
        }
        if (options.excludeKeys) {
          keys = keys.filter((key) => {
            return !options.excludeKeys(key);
          });
          extraKeys = extraKeys.filter((key) => {
            return !options.excludeKeys(key);
          });
        }
        write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    },
    array(arr, unordered) {
      unordered = unordered === undefined ? options.unorderedArrays !== false : unordered;
      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry);
        for (const [key, value] of hasher.getContext()) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    },
    date(date) {
      return write("date:" + date.toJSON());
    },
    symbol(sym) {
      return write("symbol:" + sym.toString());
    },
    unkown(value, type) {
      write(type);
      if (!value) {
        return;
      }
      write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          Array.from(value.entries()),
          true
          /* ordered */
        );
      }
    },
    error(err) {
      return write("error:" + err.toString());
    },
    boolean(bool) {
      return write("bool:" + bool);
    },
    string(string) {
      write("string:" + string.length + ":");
      write(string);
    },
    function(fn) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
      if (options.respectFunctionNames !== false) {
        this.dispatch("function-name:" + String(fn.name));
      }
      if (options.respectFunctionProperties) {
        this.object(fn);
      }
    },
    number(number) {
      return write("number:" + number);
    },
    xml(xml) {
      return write("xml:" + xml.toString());
    },
    null() {
      return write("Null");
    },
    undefined() {
      return write("Undefined");
    },
    regexp(regex) {
      return write("regex:" + regex.toString());
    },
    uint8array(arr) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint8clampedarray(arr) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int8array(arr) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint16array(arr) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int16array(arr) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint32array(arr) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int32array(arr) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float32array(arr) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float64array(arr) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    arraybuffer(arr) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    url(url) {
      return write("url:" + url.toString());
    },
    map(map) {
      write("map:");
      const arr = [...map];
      return this.array(arr, options.unorderedSets !== false);
    },
    set(set) {
      write("set:");
      const arr = [...set];
      return this.array(arr, options.unorderedSets !== false);
    },
    file(file) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error(
        'Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n'
      );
    },
    domwindow() {
      return write("domwindow");
    },
    bigint(number) {
      return write("bigint:" + number.toString());
    },
    /* Node.js standard native objects */
    process() {
      return write("process");
    },
    timer() {
      return write("timer");
    },
    pipe() {
      return write("pipe");
    },
    tcp() {
      return write("tcp");
    },
    udp() {
      return write("udp");
    },
    tty() {
      return write("tty");
    },
    statwatcher() {
      return write("statwatcher");
    },
    securecontext() {
      return write("securecontext");
    },
    connection() {
      return write("connection");
    },
    zlib() {
      return write("zlib");
    },
    context() {
      return write("context");
    },
    nodescript() {
      return write("nodescript");
    },
    httpparser() {
      return write("httpparser");
    },
    dataview() {
      return write("dataview");
    },
    signal() {
      return write("signal");
    },
    fsevent() {
      return write("fsevent");
    },
    tlswrap() {
      return write("tlswrap");
    }
  };
}
const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  return Function.prototype.toString.call(f).slice(-nativeFuncLength) === nativeFunc;
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class WordArray {
  constructor(words, sigBytes) {
    __publicField$1(this, "words");
    __publicField$1(this, "sigBytes");
    words = this.words = words || [];
    this.sigBytes = sigBytes === undefined ? words.length * 4 : sigBytes;
  }
  toString(encoder) {
    return (encoder || Hex).stringify(this);
  }
  concat(wordArray) {
    this.clamp();
    if (this.sigBytes % 4) {
      for (let i = 0; i < wordArray.sigBytes; i++) {
        const thatByte = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        this.words[this.sigBytes + i >>> 2] |= thatByte << 24 - (this.sigBytes + i) % 4 * 8;
      }
    } else {
      for (let j = 0; j < wordArray.sigBytes; j += 4) {
        this.words[this.sigBytes + j >>> 2] = wordArray.words[j >>> 2];
      }
    }
    this.sigBytes += wordArray.sigBytes;
    return this;
  }
  clamp() {
    this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8;
    this.words.length = Math.ceil(this.sigBytes / 4);
  }
  clone() {
    return new WordArray([...this.words]);
  }
}
const Hex = {
  stringify(wordArray) {
    const hexChars = [];
    for (let i = 0; i < wordArray.sigBytes; i++) {
      const bite = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      hexChars.push((bite >>> 4).toString(16), (bite & 15).toString(16));
    }
    return hexChars.join("");
  }
};
const Base64 = {
  stringify(wordArray) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const base64Chars = [];
    for (let i = 0; i < wordArray.sigBytes; i += 3) {
      const byte1 = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      const byte2 = wordArray.words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
      const byte3 = wordArray.words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
      const triplet = byte1 << 16 | byte2 << 8 | byte3;
      for (let j = 0; j < 4 && i * 8 + j * 6 < wordArray.sigBytes * 8; j++) {
        base64Chars.push(keyStr.charAt(triplet >>> 6 * (3 - j) & 63));
      }
    }
    return base64Chars.join("");
  }
};
const Latin1 = {
  parse(latin1Str) {
    const latin1StrLength = latin1Str.length;
    const words = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
    }
    return new WordArray(words, latin1StrLength);
  }
};
const Utf8 = {
  parse(utf8Str) {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};
class BufferedBlockAlgorithm {
  constructor() {
    __publicField$1(this, "_data", new WordArray());
    __publicField$1(this, "_nDataBytes", 0);
    __publicField$1(this, "_minBufferSize", 0);
    __publicField$1(this, "blockSize", 512 / 32);
  }
  reset() {
    this._data = new WordArray();
    this._nDataBytes = 0;
  }
  _append(data) {
    if (typeof data === "string") {
      data = Utf8.parse(data);
    }
    this._data.concat(data);
    this._nDataBytes += data.sigBytes;
  }
  _doProcessBlock(_dataWords, _offset) {
  }
  _process(doFlush) {
    let processedWords;
    let nBlocksReady = this._data.sigBytes / (this.blockSize * 4);
    if (doFlush) {
      nBlocksReady = Math.ceil(nBlocksReady);
    } else {
      nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    }
    const nWordsReady = nBlocksReady * this.blockSize;
    const nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += this.blockSize) {
        this._doProcessBlock(this._data.words, offset);
      }
      processedWords = this._data.words.splice(0, nWordsReady);
      this._data.sigBytes -= nBytesReady;
    }
    return new WordArray(processedWords, nBytesReady);
  }
}
class Hasher extends BufferedBlockAlgorithm {
  update(messageUpdate) {
    this._append(messageUpdate);
    this._process();
    return this;
  }
  finalize(messageUpdate) {
    if (messageUpdate) {
      this._append(messageUpdate);
    }
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => {
  __defNormalProp$3(obj, key + "" , value);
  return value;
};
const H = [
  1779033703,
  -1150833019,
  1013904242,
  -1521486534,
  1359893119,
  -1694144372,
  528734635,
  1541459225
];
const K = [
  1116352408,
  1899447441,
  -1245643825,
  -373957723,
  961987163,
  1508970993,
  -1841331548,
  -1424204075,
  -670586216,
  310598401,
  607225278,
  1426881987,
  1925078388,
  -2132889090,
  -1680079193,
  -1046744716,
  -459576895,
  -272742522,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  -1740746414,
  -1473132947,
  -1341970488,
  -1084653625,
  -958395405,
  -710438585,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  -2117940946,
  -1838011259,
  -1564481375,
  -1474664885,
  -1035236496,
  -949202525,
  -778901479,
  -694614492,
  -200395387,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  -2067236844,
  -1933114872,
  -1866530822,
  -1538233109,
  -1090935817,
  -965641998
];
const W = [];
class SHA256 extends Hasher {
  constructor() {
    super(...arguments);
    __publicField$3(this, "_hash", new WordArray([...H]));
  }
  /**
   * Resets the internal state of the hash object to initial values.
   */
  reset() {
    super.reset();
    this._hash = new WordArray([...H]);
  }
  _doProcessBlock(M, offset) {
    const H2 = this._hash.words;
    let a = H2[0];
    let b = H2[1];
    let c = H2[2];
    let d = H2[3];
    let e = H2[4];
    let f = H2[5];
    let g = H2[6];
    let h = H2[7];
    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        W[i] = M[offset + i] | 0;
      } else {
        const gamma0x = W[i - 15];
        const gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
        const gamma1x = W[i - 2];
        const gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
        W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
      }
      const ch = e & f ^ ~e & g;
      const maj = a & b ^ a & c ^ b & c;
      const sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
      const sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
      const t1 = h + sigma1 + ch + K[i] + W[i];
      const t2 = sigma0 + maj;
      h = g;
      g = f;
      f = e;
      e = d + t1 | 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 | 0;
    }
    H2[0] = H2[0] + a | 0;
    H2[1] = H2[1] + b | 0;
    H2[2] = H2[2] + c | 0;
    H2[3] = H2[3] + d | 0;
    H2[4] = H2[4] + e | 0;
    H2[5] = H2[5] + f | 0;
    H2[6] = H2[6] + g | 0;
    H2[7] = H2[7] + h | 0;
  }
  /**
   * Finishes the hash calculation and returns the hash as a WordArray.
   *
   * @param {string} messageUpdate - Additional message content to include in the hash.
   * @returns {WordArray} The finalised hash as a WordArray.
   */
  finalize(messageUpdate) {
    super.finalize(messageUpdate);
    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = this._data.sigBytes * 8;
    this._data.words[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(
      nBitsTotal / 4294967296
    );
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
    this._data.sigBytes = this._data.words.length * 4;
    this._process();
    return this._hash;
  }
}
function sha256base64(message) {
  return new SHA256().finalize(message).toString(Base64);
}

function hash(object, options = {}) {
  const hashed = typeof object === "string" ? object : objectHash(object, options);
  return sha256base64(hashed).slice(0, 10);
}

function isEqual(object1, object2, hashOptions = {}) {
  if (object1 === object2) {
    return true;
  }
  if (objectHash(object1, hashOptions) === objectHash(object2, hashOptions)) {
    return true;
  }
  return false;
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === undefined) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : undefined
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === undefined) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== undefined && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function rawHeaders(headers) {
  const rawHeaders2 = [];
  for (const key in headers) {
    if (Array.isArray(headers[key])) {
      for (const h of headers[key]) {
        rawHeaders2.push(key, h);
      }
    } else {
      rawHeaders2.push(key, headers[key]);
    }
  }
  return rawHeaders2;
}
function mergeFns(...functions) {
  return function(...args) {
    for (const fn of functions) {
      fn(...args);
    }
  };
}
function createNotImplementedError(name) {
  throw new Error(`[unenv] ${name} is not implemented yet!`);
}

let defaultMaxListeners = 10;
let EventEmitter$1 = class EventEmitter {
  __unenv__ = true;
  _events = /* @__PURE__ */ Object.create(null);
  _maxListeners;
  static get defaultMaxListeners() {
    return defaultMaxListeners;
  }
  static set defaultMaxListeners(arg) {
    if (typeof arg !== "number" || arg < 0 || Number.isNaN(arg)) {
      throw new RangeError(
        'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + "."
      );
    }
    defaultMaxListeners = arg;
  }
  setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
      throw new RangeError(
        'The value of "n" is out of range. It must be a non-negative number. Received ' + n + "."
      );
    }
    this._maxListeners = n;
    return this;
  }
  getMaxListeners() {
    return _getMaxListeners(this);
  }
  emit(type, ...args) {
    if (!this._events[type] || this._events[type].length === 0) {
      return false;
    }
    if (type === "error") {
      let er;
      if (args.length > 0) {
        er = args[0];
      }
      if (er instanceof Error) {
        throw er;
      }
      const err = new Error(
        "Unhandled error." + (er ? " (" + er.message + ")" : "")
      );
      err.context = er;
      throw err;
    }
    for (const _listener of this._events[type]) {
      (_listener.listener || _listener).apply(this, args);
    }
    return true;
  }
  addListener(type, listener) {
    return _addListener(this, type, listener, false);
  }
  on(type, listener) {
    return _addListener(this, type, listener, false);
  }
  prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  }
  once(type, listener) {
    return this.on(type, _wrapOnce(this, type, listener));
  }
  prependOnceListener(type, listener) {
    return this.prependListener(type, _wrapOnce(this, type, listener));
  }
  removeListener(type, listener) {
    return _removeListener(this, type, listener);
  }
  off(type, listener) {
    return this.removeListener(type, listener);
  }
  removeAllListeners(type) {
    return _removeAllListeners(this, type);
  }
  listeners(type) {
    return _listeners(this, type, true);
  }
  rawListeners(type) {
    return _listeners(this, type, false);
  }
  listenerCount(type) {
    return this.rawListeners(type).length;
  }
  eventNames() {
    return Object.keys(this._events);
  }
};
function _addListener(target, type, listener, prepend) {
  _checkListener(listener);
  if (target._events.newListener !== undefined) {
    target.emit("newListener", type, listener.listener || listener);
  }
  if (!target._events[type]) {
    target._events[type] = [];
  }
  if (prepend) {
    target._events[type].unshift(listener);
  } else {
    target._events[type].push(listener);
  }
  const maxListeners = _getMaxListeners(target);
  if (maxListeners > 0 && target._events[type].length > maxListeners && !target._events[type].warned) {
    target._events[type].warned = true;
    const warning = new Error(
      `[unenv] Possible EventEmitter memory leak detected. ${target._events[type].length} ${type} listeners added. Use emitter.setMaxListeners() to increase limit`
    );
    warning.name = "MaxListenersExceededWarning";
    warning.emitter = target;
    warning.type = type;
    warning.count = target._events[type]?.length;
    console.warn(warning);
  }
  return target;
}
function _removeListener(target, type, listener) {
  _checkListener(listener);
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  const lenBeforeFilter = target._events[type].length;
  target._events[type] = target._events[type].filter((fn) => fn !== listener);
  if (lenBeforeFilter === target._events[type].length) {
    return target;
  }
  if (target._events.removeListener) {
    target.emit("removeListener", type, listener.listener || listener);
  }
  if (target._events[type].length === 0) {
    delete target._events[type];
  }
  return target;
}
function _removeAllListeners(target, type) {
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  if (target._events.removeListener) {
    for (const _listener of target._events[type]) {
      target.emit("removeListener", type, _listener.listener || _listener);
    }
  }
  delete target._events[type];
  return target;
}
function _wrapOnce(target, type, listener) {
  let fired = false;
  const wrapper = (...args) => {
    if (fired) {
      return;
    }
    target.removeListener(type, wrapper);
    fired = true;
    return args.length === 0 ? listener.call(target) : listener.apply(target, args);
  };
  wrapper.listener = listener;
  return wrapper;
}
function _getMaxListeners(target) {
  return target._maxListeners ?? EventEmitter$1.defaultMaxListeners;
}
function _listeners(target, type, unwrap) {
  let listeners = target._events[type];
  if (typeof listeners === "function") {
    listeners = [listeners];
  }
  return unwrap ? listeners.map((l) => l.listener || l) : listeners;
}
function _checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError(
      'The "listener" argument must be of type Function. Received type ' + typeof listener
    );
  }
}

const EventEmitter = globalThis.EventEmitter || EventEmitter$1;

class _Readable extends EventEmitter {
  __unenv__ = true;
  readableEncoding = null;
  readableEnded = true;
  readableFlowing = false;
  readableHighWaterMark = 0;
  readableLength = 0;
  readableObjectMode = false;
  readableAborted = false;
  readableDidRead = false;
  closed = false;
  errored = null;
  readable = false;
  destroyed = false;
  static from(_iterable, options) {
    return new _Readable(options);
  }
  constructor(_opts) {
    super();
  }
  _read(_size) {
  }
  read(_size) {
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  isPaused() {
    return true;
  }
  unpipe(_destination) {
    return this;
  }
  unshift(_chunk, _encoding) {
  }
  wrap(_oldStream) {
    return this;
  }
  push(_chunk, _encoding) {
    return false;
  }
  _destroy(_error, _callback) {
    this.removeAllListeners();
  }
  destroy(error) {
    this.destroyed = true;
    this._destroy(error);
    return this;
  }
  pipe(_destenition, _options) {
    return {};
  }
  compose(stream, options) {
    throw new Error("[unenv] Method not implemented.");
  }
  [Symbol.asyncDispose]() {
    this.destroy();
    return Promise.resolve();
  }
  // eslint-disable-next-line require-yield
  async *[Symbol.asyncIterator]() {
    throw createNotImplementedError("Readable.asyncIterator");
  }
  iterator(options) {
    throw createNotImplementedError("Readable.iterator");
  }
  map(fn, options) {
    throw createNotImplementedError("Readable.map");
  }
  filter(fn, options) {
    throw createNotImplementedError("Readable.filter");
  }
  forEach(fn, options) {
    throw createNotImplementedError("Readable.forEach");
  }
  reduce(fn, initialValue, options) {
    throw createNotImplementedError("Readable.reduce");
  }
  find(fn, options) {
    throw createNotImplementedError("Readable.find");
  }
  findIndex(fn, options) {
    throw createNotImplementedError("Readable.findIndex");
  }
  some(fn, options) {
    throw createNotImplementedError("Readable.some");
  }
  toArray(options) {
    throw createNotImplementedError("Readable.toArray");
  }
  every(fn, options) {
    throw createNotImplementedError("Readable.every");
  }
  flatMap(fn, options) {
    throw createNotImplementedError("Readable.flatMap");
  }
  drop(limit, options) {
    throw createNotImplementedError("Readable.drop");
  }
  take(limit, options) {
    throw createNotImplementedError("Readable.take");
  }
  asIndexedPairs(options) {
    throw createNotImplementedError("Readable.asIndexedPairs");
  }
}
const Readable = globalThis.Readable || _Readable;

class _Writable extends EventEmitter {
  __unenv__ = true;
  writable = true;
  writableEnded = false;
  writableFinished = false;
  writableHighWaterMark = 0;
  writableLength = 0;
  writableObjectMode = false;
  writableCorked = 0;
  closed = false;
  errored = null;
  writableNeedDrain = false;
  destroyed = false;
  _data;
  _encoding = "utf-8";
  constructor(_opts) {
    super();
  }
  pipe(_destenition, _options) {
    return {};
  }
  _write(chunk, encoding, callback) {
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._data === undefined) {
      this._data = chunk;
    } else {
      const a = typeof this._data === "string" ? Buffer.from(this._data, this._encoding || encoding || "utf8") : this._data;
      const b = typeof chunk === "string" ? Buffer.from(chunk, encoding || this._encoding || "utf8") : chunk;
      this._data = Buffer.concat([a, b]);
    }
    this._encoding = encoding;
    if (callback) {
      callback();
    }
  }
  _writev(_chunks, _callback) {
  }
  _destroy(_error, _callback) {
  }
  _final(_callback) {
  }
  write(chunk, arg2, arg3) {
    const encoding = typeof arg2 === "string" ? this._encoding : "utf-8";
    const cb = typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : undefined;
    this._write(chunk, encoding, cb);
    return true;
  }
  setDefaultEncoding(_encoding) {
    return this;
  }
  end(arg1, arg2, arg3) {
    const callback = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : undefined;
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return this;
    }
    const data = arg1 === callback ? undefined : arg1;
    if (data) {
      const encoding = arg2 === callback ? undefined : arg2;
      this.write(data, encoding, callback);
    }
    this.writableEnded = true;
    this.writableFinished = true;
    this.emit("close");
    this.emit("finish");
    return this;
  }
  cork() {
  }
  uncork() {
  }
  destroy(_error) {
    this.destroyed = true;
    delete this._data;
    this.removeAllListeners();
    return this;
  }
  compose(stream, options) {
    throw new Error("[h3] Method not implemented.");
  }
}
const Writable = globalThis.Writable || _Writable;

const __Duplex = class {
  allowHalfOpen = true;
  _destroy;
  constructor(readable = new Readable(), writable = new Writable()) {
    Object.assign(this, readable);
    Object.assign(this, writable);
    this._destroy = mergeFns(readable._destroy, writable._destroy);
  }
};
function getDuplex() {
  Object.assign(__Duplex.prototype, Readable.prototype);
  Object.assign(__Duplex.prototype, Writable.prototype);
  return __Duplex;
}
const _Duplex = /* @__PURE__ */ getDuplex();
const Duplex = globalThis.Duplex || _Duplex;

class Socket extends Duplex {
  __unenv__ = true;
  bufferSize = 0;
  bytesRead = 0;
  bytesWritten = 0;
  connecting = false;
  destroyed = false;
  pending = false;
  localAddress = "";
  localPort = 0;
  remoteAddress = "";
  remoteFamily = "";
  remotePort = 0;
  autoSelectFamilyAttemptedAddresses = [];
  readyState = "readOnly";
  constructor(_options) {
    super();
  }
  write(_buffer, _arg1, _arg2) {
    return false;
  }
  connect(_arg1, _arg2, _arg3) {
    return this;
  }
  end(_arg1, _arg2, _arg3) {
    return this;
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  setTimeout(_timeout, _callback) {
    return this;
  }
  setNoDelay(_noDelay) {
    return this;
  }
  setKeepAlive(_enable, _initialDelay) {
    return this;
  }
  address() {
    return {};
  }
  unref() {
    return this;
  }
  ref() {
    return this;
  }
  destroySoon() {
    this.destroy();
  }
  resetAndDestroy() {
    const err = new Error("ERR_SOCKET_CLOSED");
    err.code = "ERR_SOCKET_CLOSED";
    this.destroy(err);
    return this;
  }
}

class IncomingMessage extends Readable {
  __unenv__ = {};
  aborted = false;
  httpVersion = "1.1";
  httpVersionMajor = 1;
  httpVersionMinor = 1;
  complete = true;
  connection;
  socket;
  headers = {};
  trailers = {};
  method = "GET";
  url = "/";
  statusCode = 200;
  statusMessage = "";
  closed = false;
  errored = null;
  readable = false;
  constructor(socket) {
    super();
    this.socket = this.connection = socket || new Socket();
  }
  get rawHeaders() {
    return rawHeaders(this.headers);
  }
  get rawTrailers() {
    return [];
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  get headersDistinct() {
    return _distinct(this.headers);
  }
  get trailersDistinct() {
    return _distinct(this.trailers);
  }
}
function _distinct(obj) {
  const d = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      d[key] = (Array.isArray(value) ? value : [value]).filter(
        Boolean
      );
    }
  }
  return d;
}

class ServerResponse extends Writable {
  __unenv__ = true;
  statusCode = 200;
  statusMessage = "";
  upgrading = false;
  chunkedEncoding = false;
  shouldKeepAlive = false;
  useChunkedEncodingByDefault = false;
  sendDate = false;
  finished = false;
  headersSent = false;
  strictContentLength = false;
  connection = null;
  socket = null;
  req;
  _headers = {};
  constructor(req) {
    super();
    this.req = req;
  }
  assignSocket(socket) {
    socket._httpMessage = this;
    this.socket = socket;
    this.connection = socket;
    this.emit("socket", socket);
    this._flush();
  }
  _flush() {
    this.flushHeaders();
  }
  detachSocket(_socket) {
  }
  writeContinue(_callback) {
  }
  writeHead(statusCode, arg1, arg2) {
    if (statusCode) {
      this.statusCode = statusCode;
    }
    if (typeof arg1 === "string") {
      this.statusMessage = arg1;
      arg1 = undefined;
    }
    const headers = arg2 || arg1;
    if (headers) {
      if (Array.isArray(headers)) ; else {
        for (const key in headers) {
          this.setHeader(key, headers[key]);
        }
      }
    }
    this.headersSent = true;
    return this;
  }
  writeProcessing() {
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  appendHeader(name, value) {
    name = name.toLowerCase();
    const current = this._headers[name];
    const all = [
      ...Array.isArray(current) ? current : [current],
      ...Array.isArray(value) ? value : [value]
    ].filter(Boolean);
    this._headers[name] = all.length > 1 ? all : all[0];
    return this;
  }
  setHeader(name, value) {
    this._headers[name.toLowerCase()] = value;
    return this;
  }
  getHeader(name) {
    return this._headers[name.toLowerCase()];
  }
  getHeaders() {
    return this._headers;
  }
  getHeaderNames() {
    return Object.keys(this._headers);
  }
  hasHeader(name) {
    return name.toLowerCase() in this._headers;
  }
  removeHeader(name) {
    delete this._headers[name.toLowerCase()];
  }
  addTrailers(_headers) {
  }
  flushHeaders() {
  }
  writeEarlyHints(_headers, cb) {
    if (typeof cb === "function") {
      cb();
    }
  }
}

function useBase(base, handler) {
  base = withoutTrailingSlash(base);
  if (!base || base === "/") {
    return handler;
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _path = event._path || event.node.req.url || "/";
    event._path = withoutBase(event.path || "/", base);
    event.node.req.url = event._path;
    try {
      return await handler(event);
    } finally {
      event._path = event.node.req.url = _path;
    }
  });
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message, opts = {}) {
    super(message, opts);
    __publicField$2(this, "statusCode", 500);
    __publicField$2(this, "fatal", false);
    __publicField$2(this, "unhandled", false);
    __publicField$2(this, "statusMessage");
    __publicField$2(this, "data");
    __publicField$2(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== undefined) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$2(H3Error, "__h3_error__", true);
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, undefined, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(undefined);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== undefined) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions) {
  serializeOptions = { path: "/", ...serializeOptions };
  const cookieStr = serialize(name, value, serializeOptions);
  let setCookies = event.node.res.getHeader("set-cookie");
  if (!Array.isArray(setCookies)) {
    setCookies = [setCookies];
  }
  const _optionsHash = objectHash(serializeOptions);
  setCookies = setCookies.filter((cookieValue) => {
    return cookieValue && _optionsHash !== objectHash(parse(cookieValue));
  });
  event.node.res.setHeader("set-cookie", [...setCookies, cookieStr]);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => undefined);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== undefined) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name)) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField(this, "__is_event__", true);
    // Context
    __publicField(this, "node");
    // Node
    __publicField(this, "web");
    // Web
    __publicField(this, "context", {});
    // Shared
    // Request
    __publicField(this, "_method");
    __publicField(this, "_path");
    __publicField(this, "_headers");
    __publicField(this, "_requestBody");
    // Response
    __publicField(this, "_handled", false);
    // Hooks
    __publicField(this, "_onBeforeResponseCalled");
    __publicField(this, "_onAfterResponseCalled");
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : undefined;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : undefined;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === undefined ? undefined : await val;
      if (_body !== undefined) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, undefined);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, undefined);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, undefined)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, undefined, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, undefined, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, undefined, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === undefined && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = undefined;
    this._after = undefined;
    this._deprecatedMessages = undefined;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = undefined;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = undefined;
      _function = undefined;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : undefined;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== undefined) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== undefined) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : undefined
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === undefined) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses$1 = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch$1(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: undefined,
      error: undefined
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses$1.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch$1({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s;
const AbortController$1 = globalThis.AbortController || i;
const ofetch = createFetch$1({ fetch: fetch$1, Headers: Headers$1, AbortController: AbortController$1 });
const $fetch$1 = ofetch;

const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createCall(handle) {
  return function callHandle(context) {
    const req = new IncomingMessage();
    const res = new ServerResponse(req);
    req.url = context.url || "/";
    req.method = context.method || "GET";
    req.headers = {};
    if (context.headers) {
      const headerEntries = typeof context.headers.entries === "function" ? context.headers.entries() : Object.entries(context.headers);
      for (const [name, value] of headerEntries) {
        if (!value) {
          continue;
        }
        req.headers[name.toLowerCase()] = value;
      }
    }
    req.headers.host = req.headers.host || context.host || "localhost";
    req.connection.encrypted = // @ts-ignore
    req.connection.encrypted || context.protocol === "https";
    req.body = context.body || null;
    req.__unenv__ = context.context;
    return handle(req, res).then(() => {
      let body = res._data;
      if (nullBodyResponses.has(res.statusCode) || req.method.toUpperCase() === "HEAD") {
        body = null;
        delete res._headers["content-length"];
      }
      const r = {
        body,
        headers: res._headers,
        status: res.statusCode,
        statusText: res.statusMessage
      };
      req.destroy();
      res.destroy();
      return r;
    });
  };
}

function createFetch(call, _fetch = global.fetch) {
  return async function ufetch(input, init) {
    const url = input.toString();
    if (!url.startsWith("/")) {
      return _fetch(url, init);
    }
    try {
      const r = await call({ url, ...init });
      return new Response(r.body, {
        status: r.status,
        statusText: r.statusText,
        headers: Object.fromEntries(
          Object.entries(r.headers).map(([name, value]) => [
            name,
            Array.isArray(value) ? value.join(",") : String(value) || ""
          ])
        )
      });
    } catch (error) {
      return new Response(error.toString(), {
        status: Number.parseInt(error.statusCode || error.code) || 500,
        statusText: error.statusText
      });
    }
  };
}

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error, isDev) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.unhandled || error.fatal) ? [] : (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.unhandled ? "internal server error" : error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.path,
    statusCode,
    statusMessage,
    message,
    stack: "",
    // TODO: check and validate error.data for serialisation into query
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, (error.message || error.toString() || "internal server error") + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    return send(event, JSON.stringify(errorObject));
  }
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (!res) {
    const { template } = await import('../_/error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : undefined, res.statusText);
  return send(event, html);
});

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {},
  "icon": {
    "provider": "server",
    "class": "b-icon",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return undefined;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = undefined;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === undefined) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /{{(.*?)}}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "38043fff-9185-44fd-a3bd-6cad3686e595",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/sitemap.xsl": {
        "headers": {
          "Content-Type": "application/xslt+xml"
        }
      },
      "/sitemap.xml": {
        "swr": 600,
        "cache": {
          "swr": true,
          "maxAge": 600,
          "varies": [
            "X-Forwarded-Host",
            "X-Forwarded-Proto",
            "Host"
          ]
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "usebootstrap": {
      "scss": true,
      "bootstrap": {
        "prefix": [
          "",
          "B"
        ],
        "presets": {
          "button-color": [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "light",
            "dark",
            "link",
            "outline-primary",
            "outline-secondary",
            "outline-success",
            "outline-danger",
            "outline-warning",
            "outline-info",
            "outline-light",
            "outline-dark"
          ],
          "alert-color": [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "light",
            "dark"
          ],
          "background-color": [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "primary-subtle",
            "secondary-subtle",
            "success-subtle",
            "danger-subtle",
            "warning-subtle",
            "info-subtle",
            "light",
            "dark",
            "light-subtle",
            "dark-subtle",
            "body-secondary",
            "body-tertiary",
            "body",
            "black",
            "white",
            "transparent"
          ],
          "text-color": [
            "primary",
            "primary-emphasis",
            "secondary",
            "secondary-emphasis",
            "success",
            "success-emphasis",
            "danger",
            "danger-emphasis",
            "warning",
            "warning-emphasis",
            "info",
            "info-emphasis",
            "light",
            "light-emphasis",
            "dark",
            "dark-emphasis",
            "body",
            "body-emphasis",
            "body-secondary",
            "body-tertiary",
            "black",
            "white",
            "black-50",
            "white-50"
          ],
          "border-color": [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "primary-subtle",
            "secondary-subtle",
            "success-subtle",
            "danger-subtle",
            "warning-subtle",
            "info-subtle",
            "light",
            "dark",
            "light-subtle",
            "dark-subtle",
            "black",
            "white"
          ],
          "text-bg-color": [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "light",
            "dark"
          ],
          "link-color": [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "light",
            "dark",
            "body-emphasis"
          ]
        }
      },
      "html": {
        "prefix": "B"
      },
      "icon": {
        "prefix": "B"
      },
      "extend": {
        "prefix": [
          "",
          "B"
        ]
      },
      "spec": {
        "prefix": [
          "",
          "B"
        ]
      },
      "unocss": {
        "prefix": "un"
      },
      "image": true,
      "fonts": true,
      "sitemap": true,
      "robots": true,
      "shiki": true,
      "leaflet": true,
      "mdc": true,
      "tiptap": true,
      "vueuse": {
        "prefix": ""
      },
      "pwa": true,
      "aos": true,
      "echarts": true,
      "dynamicRoute": {
        "defaults": {
          "lang": "en"
        }
      },
      "swiper": {
        "prefix": ""
      },
      "integration": {
        "prefix": "",
        "protocol": {
          "local-storage": {
            "type": "local"
          },
          "session-storage": {
            "type": "session"
          },
          "state": {
            "type": "state"
          },
          "api": {
            "type": "fetch",
            "prefix": "/api/",
            "lazy": false,
            "sync": {
              "method": "put",
              "delay": 500,
              "maxWait": 1000
            }
          },
          "query": {
            "type": "query"
          },
          "path": {
            "type": "path"
          },
          "hash": {
            "type": "hash"
          },
          "params": {
            "type": "params"
          },
          "route": {
            "type": "route"
          },
          "seo-meta": {
            "type": "seoMeta"
          },
          "helper": {
            "type": "helper"
          },
          "app-config": {
            "type": "appConfig"
          },
          "dom-attr": {
            "type": "domAttr"
          },
          "localization": {
            "type": "localization"
          }
        },
        "viewState": true,
        "actionState": {
          "type": [
            "fetch",
            "helper",
            "api-fetch",
            "api-fetch-sync"
          ]
        }
      }
    },
    "mdc": {
      "components": {
        "prose": true,
        "map": {}
      },
      "headings": {
        "anchorLinks": {
          "h1": false,
          "h2": true,
          "h3": true,
          "h4": true,
          "h5": false,
          "h6": false
        }
      }
    },
    "aos": {}
  },
  "icon": {
    "serverKnownCssClasses": []
  },
  "sitemap": {
    "isI18nMapped": false,
    "sitemapName": "sitemap.xml",
    "isMultiSitemap": false,
    "excludeAppSources": [],
    "cacheMaxAgeSeconds": 600,
    "autoLastmod": false,
    "defaultSitemapsChunkSize": 1000,
    "minify": false,
    "sortEntries": true,
    "debug": false,
    "discoverImages": true,
    "discoverVideos": true,
    "sitemapsPathPrefix": "/__sitemap__/",
    "isNuxtContentDocumentDriven": false,
    "xsl": "/__sitemap__/style.xsl",
    "xslTips": true,
    "xslColumns": [
      {
        "label": "URL",
        "width": "50%"
      },
      {
        "label": "Images",
        "width": "25%",
        "select": "count(image:image)"
      },
      {
        "label": "Last Updated",
        "width": "25%",
        "select": "concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"
      }
    ],
    "credits": true,
    "version": "6.1.5",
    "sitemaps": {
      "sitemap.xml": {
        "sitemapName": "sitemap.xml",
        "route": "sitemap.xml",
        "defaults": {},
        "include": [],
        "exclude": [
          "/_nuxt/**",
          "/_**"
        ],
        "includeAppSources": true
      }
    }
  },
  "nuxt-site-config": {
    "stack": [
      {
        "_context": "system",
        "_priority": -15,
        "name": "rick-morty",
        "env": "production"
      },
      {
        "_context": "package.json",
        "_priority": -10,
        "name": "nuxt-app"
      }
    ],
    "version": "2.2.21",
    "debug": false
  },
  "nuxt-robots": {
    "version": "4.1.11",
    "usingNuxtContent": false,
    "debug": false,
    "credits": true,
    "groups": [
      {
        "userAgent": [
          "*"
        ],
        "disallow": [
          ""
        ],
        "allow": [],
        "_indexable": true,
        "_rules": []
      }
    ],
    "sitemap": [
      "/sitemap.xml"
    ],
    "header": true,
    "robotsEnabledValue": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "robotsDisabledValue": "noindex, nofollow",
    "cacheControl": "max-age=14400, must-revalidate"
  },
  "nuxt-simple-robots": {
    "version": "4.1.11",
    "usingNuxtContent": false,
    "debug": false,
    "credits": true,
    "groups": [
      {
        "userAgent": [
          "*"
        ],
        "disallow": [
          ""
        ],
        "allow": [],
        "_indexable": true,
        "_rules": []
      }
    ],
    "sitemap": [
      "/sitemap.xml"
    ],
    "header": true,
    "robotsEnabledValue": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "robotsDisabledValue": "noindex, nofollow",
    "cacheControl": "max-age=14400, must-revalidate"
  },
  "ipx": {
    "baseURL": "/_ipx",
    "alias": {},
    "fs": {
      "dir": "../public"
    },
    "http": {
      "domains": []
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  if (!event) {
    return _sharedAppConfig;
  }
  if (event.context.nitro.appConfig) {
    return event.context.nitro.appConfig;
  }
  const appConfig$1 = klona(appConfig);
  event.context.nitro.appConfig = appConfig$1;
  return appConfig$1;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return undefined;
  }
});

function defineNitroPlugin(def) {
  return def;
}

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive$1(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive$1(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "hasItem",
  "getItem",
  "getItemRaw",
  "setItem",
  "setItemRaw",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : undefined,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? undefined : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === undefined) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === undefined) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      for (const mount of mounts) {
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      return base ? allKeys.filter(
        (key) => key.startsWith(base) && key[key.length - 1] !== "$"
      ) : allKeys.filter((key) => key[key.length - 1] !== "$");
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$2(dir, entry.name);
      if (entry.isDirectory()) {
        const dirFiles = await readdirRecursive(entryPath, ignore);
        files.push(...dirFiles.map((f) => entry.name + "/" + f));
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$2(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$2(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys() {
      return readdirRecursive(r("."), opts.ignore);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"/home/maria/projects/rick-morty/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== undefined);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[nitro] [cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[nitro] [cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== undefined && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = undefined;
          entry.integrity = undefined;
          entry.mtime = undefined;
          entry.expires = undefined;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[nitro] [cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === undefined) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : undefined
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === undefined) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== undefined) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(undefined);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== undefined) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== undefined) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: undefined };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== undefined) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === undefined) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = undefined;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = undefined;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : undefined;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: undefined
});

function baseURL() {
  return useRuntimeConfig().app.baseURL;
}
function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function getSiteIndexable(e) {
  const { env, indexable } = useSiteConfig(e);
  if (typeof indexable !== "undefined")
    return String(indexable) === "true";
  return env === "production";
}

function normalizeSiteConfig(config) {
  if (typeof config.indexable !== "undefined")
    config.indexable = String(config.indexable) !== "false";
  if (typeof config.trailingSlash !== "undefined" && !config.trailingSlash)
    config.trailingSlash = String(config.trailingSlash) !== "false";
  if (config.url && !hasProtocol(config.url, { acceptRelative: true, strict: false }))
    config.url = withHttps(config.url);
  const keys = Object.keys(config).sort((a, b) => a.localeCompare(b));
  const newConfig = {};
  for (const k of keys)
    newConfig[k] = config[k];
  return newConfig;
}
function createSiteConfigStack(options) {
  const debug = options?.debug || false;
  const stack = [];
  function push(input) {
    if (!input || typeof input !== "object" || Object.keys(input).length === 0)
      return;
    if (!input._context && debug) {
      let lastFunctionName = new Error("tmp").stack?.split("\n")[2].split(" ")[5];
      if (lastFunctionName?.includes("/"))
        lastFunctionName = "anonymous";
      input._context = lastFunctionName;
    }
    const entry = {};
    for (const k in input) {
      const val = input[k];
      if (typeof val !== "undefined" && val !== "")
        entry[k] = val;
    }
    if (Object.keys(entry).filter((k) => !k.startsWith("_")).length > 0)
      stack.push(entry);
  }
  function get(options2) {
    const siteConfig = {};
    if (options2?.debug)
      siteConfig._context = {};
    for (const o in stack.sort((a, b) => (a._priority || 0) - (b._priority || 0))) {
      for (const k in stack[o]) {
        const key = k;
        const val = options2?.resolveRefs ? toValue(stack[o][k]) : stack[o][k];
        if (!k.startsWith("_") && typeof val !== "undefined") {
          siteConfig[k] = val;
          if (options2?.debug)
            siteConfig._context[key] = stack[o]._context?.[key] || stack[o]._context || "anonymous";
        }
      }
    }
    return options2?.skipNormalize ? siteConfig : normalizeSiteConfig(siteConfig);
  }
  return {
    stack,
    push,
    get
  };
}

function envSiteConfig(env) {
  return Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith("NUXT_SITE_") || k.startsWith("NUXT_PUBLIC_SITE_")).map(([k, v]) => [
    k.replace(/^NUXT_(PUBLIC_)?SITE_/, "").split("_").map((s, i) => i === 0 ? s.toLowerCase() : s[0].toUpperCase() + s.slice(1).toLowerCase()).join(""),
    v
  ]));
}

function useNitroOrigin(e) {
  process.env.NITRO_SSL_CERT;
  process.env.NITRO_SSL_KEY;
  let host = process.env.NITRO_HOST || process.env.HOST || false;
  let port = false;
  let protocol = "https" ;
  {
    host = getRequestHost(e, { xForwardedHost: true }) || host;
    protocol = getRequestProtocol(e, { xForwardedProto: true }) || protocol;
  }
  if (typeof host === "string" && host.includes(":")) {
    port = host.split(":").pop();
    host = host.split(":")[0];
  }
  port = port ? `:${port}` : "";
  return withTrailingSlash(`${protocol}://${host}${port}`);
}

function useSiteConfig(e, _options) {
  e.context.siteConfig = e.context.siteConfig || createSiteConfigStack();
  const options = defu(_options, useRuntimeConfig(e)["nuxt-site-config"], { debug: false });
  return e.context.siteConfig.get(options);
}

function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : "");
  if (base !== "/" && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base));
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
function isPathFile(path) {
  const lastSegment = path.split("/").pop();
  return !!(lastSegment || path).match(/\.[0-9a-z]+$/i)?.[0];
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  if (isPathFile($url.pathname))
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}

function createSitePathResolver(e, options = {}) {
  const siteConfig = useSiteConfig(e);
  const nitroOrigin = useNitroOrigin(e);
  const nuxtBase = useRuntimeConfig(e).app.baseURL || "/";
  return (path) => {
    return resolveSitePath(path, {
      ...options,
      siteUrl: options.canonical !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    });
  };
}
function withSiteUrl(e, path, options = {}) {
  const siteConfig = e.context.siteConfig?.get();
  let siteUrl = e.context.siteConfigNitroOrigin;
  if ((options.canonical !== false || false) && siteConfig.url)
    siteUrl = siteConfig.url;
  return resolveSitePath(path, {
    absolute: true,
    siteUrl,
    trailingSlash: siteConfig.trailingSlash,
    base: e.context.nitro.baseURL,
    withBase: options.withBase
  });
}

function matches(pattern, path) {
  const pathLength = path.length;
  const patternLength = pattern.length;
  const matchingLengths = Array.from({ length: pathLength + 1 }).fill(0);
  let numMatchingLengths = 1;
  let p = 0;
  while (p < patternLength) {
    if (pattern[p] === "$" && p + 1 === patternLength) {
      return matchingLengths[numMatchingLengths - 1] === pathLength;
    }
    if (pattern[p] === "*") {
      numMatchingLengths = pathLength - matchingLengths[0] + 1;
      for (let i = 1; i < numMatchingLengths; i++) {
        matchingLengths[i] = matchingLengths[i - 1] + 1;
      }
    } else {
      let numMatches = 0;
      for (let i = 0; i < numMatchingLengths; i++) {
        const matchLength = matchingLengths[i];
        if (matchLength < pathLength && path[matchLength] === pattern[p]) {
          matchingLengths[numMatches++] = matchLength + 1;
        }
      }
      if (numMatches === 0) {
        return false;
      }
      numMatchingLengths = numMatches;
    }
    p++;
  }
  return true;
}
function matchPathToRule(path, _rules) {
  let matchedRule = null;
  const rules = _rules.filter(Boolean);
  const rulesLength = rules.length;
  let i = 0;
  while (i < rulesLength) {
    const rule = rules[i];
    if (!matches(rule.pattern, path)) {
      i++;
      continue;
    }
    if (!matchedRule || rule.pattern.length > matchedRule.pattern.length) {
      matchedRule = rule;
    } else if (rule.pattern.length === matchedRule.pattern.length && rule.allow && !matchedRule.allow) {
      matchedRule = rule;
    }
    i++;
  }
  return matchedRule;
}
function asArray(v) {
  return typeof v === "undefined" ? [] : Array.isArray(v) ? v : [v];
}
function generateRobotsTxt({ groups, sitemaps }) {
  const lines = [];
  for (const group of groups) {
    for (const comment of group.comment || [])
      lines.push(`# ${comment}`);
    for (const userAgent of group.userAgent || ["*"])
      lines.push(`User-agent: ${userAgent}`);
    for (const allow of group.allow || [])
      lines.push(`Allow: ${allow}`);
    for (const disallow of group.disallow || [])
      lines.push(`Disallow: ${disallow}`);
    for (const cleanParam of group.cleanParam || [])
      lines.push(`Clean-param: ${cleanParam}`);
    lines.push("");
  }
  for (const sitemap of sitemaps)
    lines.push(`Sitemap: ${sitemap}`);
  return lines.join("\n");
}
function normaliseRobotsRouteRule(config) {
  let allow;
  if (typeof config.robots === "boolean")
    allow = config.robots;
  else if (typeof config.robots === "object" && typeof config.robots.indexable !== "undefined")
    allow = config.robots.indexable;
  else if (typeof config.index !== "undefined")
    allow = config.index;
  let rule;
  if (typeof config.robots === "object" && typeof config.robots.rule !== "undefined")
    rule = config.robots.rule;
  else if (typeof config.robots === "string")
    rule = config.robots;
  if (rule && !allow)
    allow = rule !== "none" && !rule.includes("noindex");
  if (typeof allow === "undefined" && typeof rule === "undefined")
    return;
  return {
    allow,
    rule
  };
}

function withoutQuery$1(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher$1() {
  const { nitro, app } = useRuntimeConfig();
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [withoutTrailingSlash(path), rules])
      )
    })
  );
  return (path) => {
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(withoutTrailingSlash(withoutQuery$1(path)), app.baseURL)
    ).reverse());
  };
}

function getSiteRobotConfig(e) {
  const query = getQuery(e);
  const hints = [];
  const { groups, debug } = useRuntimeConfig(e)["nuxt-robots"];
  let indexable = getSiteIndexable(e);
  const queryIndexableEnabled = String(query.mockProductionEnv) === "true" || query.mockProductionEnv === "";
  if (debug || false) {
    const { _context } = useSiteConfig(e, { debug: debug || false });
    if (queryIndexableEnabled) {
      indexable = true;
      hints.push("You are mocking a production enviroment with ?mockProductionEnv query.");
    } else if (!indexable && _context.indexable === "nuxt-robots:config") {
      hints.push("You are blocking indexing with your Nuxt Robots config.");
    } else if (!queryIndexableEnabled && !_context.indexable) {
      hints.push(`Indexing is blocked in development. You can mock a production environment with ?mockProductionEnv query.`);
    } else if (!indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is blocked by site config set by ${_context.indexable}.`);
    } else if (indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is enabled from ${_context.indexable}.`);
    }
  }
  if (groups.some((g) => g.userAgent.includes("*") && g.disallow.includes("/"))) {
    indexable = false;
    hints.push("You are blocking all user agents with a wildcard `Disallow /`.");
  } else if (groups.some((g) => g.disallow.includes("/"))) {
    hints.push("You are blocking specific user agents with `Disallow /`.");
  }
  return { indexable, hints };
}

function getPathRobotConfig(e, options) {
  const { robotsDisabledValue, robotsEnabledValue, usingNuxtContent } = useRuntimeConfig()["nuxt-robots"];
  if (!options?.skipSiteIndexable) {
    if (!getSiteRobotConfig(e).indexable) {
      return {
        rule: robotsDisabledValue,
        indexable: false
      };
    }
  }
  const path = options?.path || e.path;
  let userAgent = options?.userAgent;
  if (!userAgent) {
    try {
      userAgent = getRequestHeader(e, "User-Agent");
    } catch {
    }
  }
  const nitroApp = useNitroApp();
  const groups = [
    // run explicit user agent matching first
    ...nitroApp._robots.ctx.groups.filter((g) => {
      if (userAgent) {
        return g.userAgent.some((ua) => ua.toLowerCase().includes(userAgent.toLowerCase()));
      }
      return false;
    }),
    // run wildcard matches second
    ...nitroApp._robots.ctx.groups.filter((g) => g.userAgent.includes("*"))
  ];
  for (const group of groups) {
    if (!group._indexable) {
      return {
        indexable: false,
        rule: robotsDisabledValue,
        debug: {
          source: "/robots.txt",
          line: `Disallow: /`
        }
      };
    }
    const robotsTxtRule = matchPathToRule(path, group._rules);
    if (robotsTxtRule) {
      if (!robotsTxtRule.allow) {
        return {
          indexable: false,
          rule: robotsDisabledValue,
          debug: {
            source: "/robots.txt",
            line: `Disallow: ${robotsTxtRule.pattern}`
          }
        };
      }
      break;
    }
  }
  if (usingNuxtContent && nitroApp._robots?.nuxtContentUrls?.has(withoutTrailingSlash(path))) {
    return {
      indexable: false,
      rule: robotsDisabledValue,
      debug: {
        source: "Nuxt Content"
      }
    };
  }
  nitroApp._robotsRuleMactcher = nitroApp._robotsRuleMactcher || createNitroRouteRuleMatcher$1();
  const routeRules = normaliseRobotsRouteRule(nitroApp._robotsRuleMactcher(path));
  if (routeRules && (routeRules.allow || routeRules.rule)) {
    return {
      indexable: routeRules.allow,
      rule: routeRules.rule || (routeRules.allow ? robotsEnabledValue : robotsDisabledValue),
      debug: {
        source: "Route Rules"
      }
    };
  }
  return {
    indexable: true,
    rule: robotsEnabledValue
  };
}

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
const unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
const reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
const escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
const objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  const counts = /* @__PURE__ */ new Map();
  let logNum = 0;
  function log(message) {
    if (logNum < 100) {
      console.warn(message);
      logNum += 1;
    }
  }
  function walk(thing) {
    if (typeof thing === "function") {
      log(`Cannot stringify a function ${thing.name}`);
      return;
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      const type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          const proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            if (typeof thing.toJSON !== "function") {
              log(`Cannot stringify arbitrary non-POJOs ${thing.constructor.name}`);
            }
          } else if (Object.getOwnPropertySymbols(thing).length > 0) {
            log(`Cannot stringify POJOs with symbolic keys ${Object.getOwnPropertySymbols(thing).map((symbol) => symbol.toString())}`);
          } else {
            Object.keys(thing).forEach((key) => walk(thing[key]));
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    const type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify(thing.valueOf())})`;
      case "RegExp":
        return thing.toString();
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "Array":
        const members = thing.map((v, i) => i in thing ? stringify(v) : "");
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return `[${members.join(",")}${tail}]`;
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify).join(",")}])`;
      default:
        if (thing.toJSON) {
          let json = thing.toJSON();
          if (getType(json) === "String") {
            try {
              json = JSON.parse(json);
            } catch (e) {
            }
          }
          return stringify(json);
        }
        if (Object.getPrototypeOf(thing) === null) {
          if (Object.keys(thing).length === 0) {
            return "Object.create(null)";
          }
          return `Object.create(null,{${Object.keys(thing).map((key) => `${safeKey(key)}:{writable:true,enumerable:true,value:${stringify(thing[key])}}`).join(",")}})`;
        }
        return `{${Object.keys(thing).map((key) => `${safeKey(key)}:${stringify(thing[key])}`).join(",")}}`;
    }
  }
  const str = stringify(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (isPrimitive(thing)) {
        values.push(stringifyPrimitive(thing));
        return;
      }
      const type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify(v)}`);
          });
          break;
        case "Set":
          values.push("new Set");
          statements.push(`${name}.${Array.from(thing).map((v) => `add(${stringify(v)})`).join(".")}`);
          break;
        case "Map":
          values.push("new Map");
          statements.push(`${name}.${Array.from(thing).map(([k, v]) => `set(${stringify(k)}, ${stringify(v)})`).join(".")}`);
          break;
        default:
          values.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach((key) => {
            statements.push(`${name}${safeProp(key)}=${stringify(thing[key])}`);
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(";")}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function getName(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string") {
    return stringifyString(thing);
  }
  if (thing === undefined) {
    return "void 0";
  }
  if (thing === 0 && 1 / thing < 0) {
    return "-0";
  }
  const str = String(thing);
  if (typeof thing === "number") {
    return str.replace(/^(-)?0\./, "$1.");
  }
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? `.${key}` : `[${escapeUnsafeChars(JSON.stringify(key))}]`;
}
function stringifyString(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}

const _T2ZRQ6lqZG = defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook("render:html", async (ctx, { event }) => {
    const routeOptions = getRouteRules(event);
    const isIsland = process.env.NUXT_COMPONENT_ISLANDS && event.path.startsWith("/__nuxt_island");
    event.path;
    const noSSR = event.context.nuxt?.noSSR || routeOptions.ssr === false && !isIsland || (false);
    if (noSSR) {
      const siteConfig = Object.fromEntries(
        Object.entries(useSiteConfig(event)).map(([k, v]) => [k, toValue(v)])
      );
      ctx.body.push(`<script>window.__NUXT_SITE_CONFIG__=${devalue(siteConfig)}<\/script>`);
    }
  });
});

const basicReporter = {
  log(logObj) {
    (console[logObj.type] || console.log)(...logObj.args);
  }
};
function createConsola(options = {}) {
  return createConsola$1({
    reporters: [basicReporter],
    ...options
  });
}
const consola = createConsola();
consola.consola = consola;

const logger = createConsola({
  defaults: { tag: "@nuxtjs/robots" }
});

async function resolveRobotsTxtContext(e, nitro = useNitroApp()) {
  const { groups, sitemap: sitemaps } = useRuntimeConfig(e)["nuxt-robots"];
  const generateRobotsTxtCtx = {
    event: e,
    context: e ? "robots.txt" : "init",
    ...JSON.parse(JSON.stringify({ groups, sitemaps }))
  };
  await nitro.hooks.callHook("robots:config", generateRobotsTxtCtx);
  nitro._robots.ctx = generateRobotsTxtCtx;
  return generateRobotsTxtCtx;
}

const _ONEYH5F790 = defineNitroPlugin(async (nitroApp) => {
  const { usingNuxtContent, robotsDisabledValue } = useRuntimeConfig()["nuxt-robots"];
  nitroApp._robots = {};
  await resolveRobotsTxtContext(undefined, nitroApp);
  const nuxtContentUrls = /* @__PURE__ */ new Set();
  if (usingNuxtContent) {
    let urls;
    try {
      urls = await (await nitroApp.localFetch("/__robots__/nuxt-content.json", {})).json();
    } catch (e) {
      logger.error("Failed to read robot rules from content files.", e);
    }
    if (urls && Array.isArray(urls) && urls.length) {
      urls.forEach((url) => nuxtContentUrls.add(withoutTrailingSlash(url)));
    }
  }
  if (nuxtContentUrls.size) {
    nitroApp._robots.nuxtContentUrls = nuxtContentUrls;
  }
});

const plugins = [
  _T2ZRQ6lqZG,
_ONEYH5F790
];

const assets = {
  "/_robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1-rcg7GeeTSRscbqD9i0bNnzLlkvw\"",
    "mtime": "2025-09-16T13:49:16.548Z",
    "size": 1,
    "path": "../public/_robots.txt"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2025-09-16T13:49:16.548Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/-30QC5Em.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"30ff-QB21Px5f9HaxTs766Fosy7DyORA\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 12543,
    "path": "../public/_nuxt/-30QC5Em.js"
  },
  "/_nuxt/-ALZ4IvE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ed54-JClNk5VRfv+IVvHeoUbu10lTML0\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 60756,
    "path": "../public/_nuxt/-ALZ4IvE.js"
  },
  "/_nuxt/0oeOWFlz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5099-v9B/I+L5QnsB7VRmkMXFq1j3068\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 20633,
    "path": "../public/_nuxt/0oeOWFlz.js"
  },
  "/_nuxt/2aygx1xg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4373-mv+9lD4QPymScQAwUb7jxBe7MaQ\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 17267,
    "path": "../public/_nuxt/2aygx1xg.js"
  },
  "/_nuxt/3e1v2bzS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"244f-x//k8Ln2Mu2aG+nMmuAM/ZSHTfI\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 9295,
    "path": "../public/_nuxt/3e1v2bzS.js"
  },
  "/_nuxt/6RUVFG9U.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"170e-a9Vz+9VCzbZyk6AZAvoO36GCWUk\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 5902,
    "path": "../public/_nuxt/6RUVFG9U.js"
  },
  "/_nuxt/7A4Fjokl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8b1-QLWy+rOMGxhTE+ERnnV+IFj++qM\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 2225,
    "path": "../public/_nuxt/7A4Fjokl.js"
  },
  "/_nuxt/7SvH_LtC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"238-L/ZGIRDZjo11uT5yDG6Hf9toohI\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 568,
    "path": "../public/_nuxt/7SvH_LtC.js"
  },
  "/_nuxt/8Uu6eIa-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5dd-6rU6+LIk2vMvBWgTOkpNqiVRB0Q\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 1501,
    "path": "../public/_nuxt/8Uu6eIa-.js"
  },
  "/_nuxt/B0m2ddpp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"48ca-vlOlJTQln4FlkoNCT6son9MOgUc\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 18634,
    "path": "../public/_nuxt/B0m2ddpp.js"
  },
  "/_nuxt/B0qRVHPH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4c7-bCo2e81Ha7jwjmZrwn7sAlSRkZ0\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 1223,
    "path": "../public/_nuxt/B0qRVHPH.js"
  },
  "/_nuxt/B15B3MEs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ba-7AYcCtTPqPy/RkQIxSQ9+W7WwbU\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 442,
    "path": "../public/_nuxt/B15B3MEs.js"
  },
  "/_nuxt/B1rsb5QC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4427-uwkiaoaQStkqjVmsr1jI96cVpfk\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 17447,
    "path": "../public/_nuxt/B1rsb5QC.js"
  },
  "/_nuxt/B2bjgU-v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11ae1-mxRJzpfJk/FmVLI/EqDRpdQyF8U\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 72417,
    "path": "../public/_nuxt/B2bjgU-v.js"
  },
  "/_nuxt/B2uSYIFn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f80-hJr5mKMOJaZ5zKr6vn9stJi//qk\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 3968,
    "path": "../public/_nuxt/B2uSYIFn.js"
  },
  "/_nuxt/B3Z_eaxm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17e61-Hkb4nDpMn23FWMIcNO7p6ukWfnY\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 97889,
    "path": "../public/_nuxt/B3Z_eaxm.js"
  },
  "/_nuxt/B3p2nf5F.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d6-R4fOTjhCeElzrdL7yTQvsqblCAE\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 470,
    "path": "../public/_nuxt/B3p2nf5F.js"
  },
  "/_nuxt/B5L7zzq-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a7e1-Ls4rCF6YmnXnIHkS0CuVC2QKdsg\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 42977,
    "path": "../public/_nuxt/B5L7zzq-.js"
  },
  "/_nuxt/B5iUSKj3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b3-2l4fUU3Zumn57mLBNZRwIneuxHk\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 691,
    "path": "../public/_nuxt/B5iUSKj3.js"
  },
  "/_nuxt/B6NdQBKR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a4eb-5xLfAQhi0LHRKz2Cko3AygnPISk\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 107755,
    "path": "../public/_nuxt/B6NdQBKR.js"
  },
  "/_nuxt/B7Eb69RL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ea9-Ojaze7iPqrqKgYVezLrNKUBn6d8\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 3753,
    "path": "../public/_nuxt/B7Eb69RL.js"
  },
  "/_nuxt/B7mTdjB0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26d5-Zx7qpUhhqjqkejhteLDsh7vIk0c\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 9941,
    "path": "../public/_nuxt/B7mTdjB0.js"
  },
  "/_nuxt/B8E-_56i.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c7d-wKnuJZPw3+qPptQbQXZBCVclX6o\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 3197,
    "path": "../public/_nuxt/B8E-_56i.js"
  },
  "/_nuxt/B9Vj0mJK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3290-X+j+R6V934dRF9iDpqHmxP6alUY\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 12944,
    "path": "../public/_nuxt/B9Vj0mJK.js"
  },
  "/_nuxt/BA1ndEPy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9ded-UnfpLzMkSwPGR0h/YUqUz0uBTEU\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 40429,
    "path": "../public/_nuxt/BA1ndEPy.js"
  },
  "/_nuxt/BCawSwWi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1613-poes7Z6xO9sRu+o8uAmgQf79Kxk\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 5651,
    "path": "../public/_nuxt/BCawSwWi.js"
  },
  "/_nuxt/BCzYJAay.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"177c-C13Jjnovm90HnLV3DHcRPBsBRf0\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 6012,
    "path": "../public/_nuxt/BCzYJAay.js"
  },
  "/_nuxt/BDjtpMT8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"dcf-5vh6JsJQwQKdQSDITODAGis9qrA\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 3535,
    "path": "../public/_nuxt/BDjtpMT8.js"
  },
  "/_nuxt/BEBZ7ncR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3177-p46lCR3NVE6Z8EGnmn+1cIjrrA4\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 12663,
    "path": "../public/_nuxt/BEBZ7ncR.js"
  },
  "/_nuxt/BEZwHV4x.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b7-l4zooCfqwmj+gIik5Bzp1VwXwy0\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 183,
    "path": "../public/_nuxt/BEZwHV4x.js"
  },
  "/_nuxt/BFLt1xDp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d33-BHDp/TYoghEeJABsDoIGhTNbO0A\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 3379,
    "path": "../public/_nuxt/BFLt1xDp.js"
  },
  "/_nuxt/BFZHnmVR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"542-Dhhg5s/eDeaK3LW8gNIZXNkDqPk\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 1346,
    "path": "../public/_nuxt/BFZHnmVR.js"
  },
  "/_nuxt/BFcZSthA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"65388-C7HKPS+u7oV2W00Devybn12i8iM\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 414600,
    "path": "../public/_nuxt/BFcZSthA.js"
  },
  "/_nuxt/BGVVfa_3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-wbzNkycq7UE1RY7rJToicaQUOMQ\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 180,
    "path": "../public/_nuxt/BGVVfa_3.js"
  },
  "/_nuxt/BGct0Hx7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e11-PKoyE+wfKlqwcIptx3kNRO6EmBk\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 7697,
    "path": "../public/_nuxt/BGct0Hx7.js"
  },
  "/_nuxt/BGfm3eyt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-RNXGr8x+ssg9VrEQX7R7c5+yPnM\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 180,
    "path": "../public/_nuxt/BGfm3eyt.js"
  },
  "/_nuxt/BINKOAKH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1576-TDVfMTZxEzgmXhOtyw8QcCNB7Ts\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 5494,
    "path": "../public/_nuxt/BINKOAKH.js"
  },
  "/_nuxt/BJNXdUBN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2482-xMTV0KhSoC8lkZV3HxKVb4sGTmw\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 9346,
    "path": "../public/_nuxt/BJNXdUBN.js"
  },
  "/_nuxt/BKbjiiqg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3c41-w9EFgR4q/BBELDxjg6sVeCxwbK8\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 15425,
    "path": "../public/_nuxt/BKbjiiqg.js"
  },
  "/_nuxt/BLhTXw86.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1404-ncR6ok6kVNdakm6kaBXm1iRVJnQ\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 5124,
    "path": "../public/_nuxt/BLhTXw86.js"
  },
  "/_nuxt/BMwgFBEQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2961-0axaMsaFnCX1jpRMsrYSwd3bA+4\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 10593,
    "path": "../public/_nuxt/BMwgFBEQ.js"
  },
  "/_nuxt/BN40hmum.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6b29-5DSAPNkBHzpRnmH9BcXHdCLzF7Q\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 27433,
    "path": "../public/_nuxt/BN40hmum.js"
  },
  "/_nuxt/BNxDCkIA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c73-8tHSXFzwoi4GVgvq7LMjDVe7LWs\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 11379,
    "path": "../public/_nuxt/BNxDCkIA.js"
  },
  "/_nuxt/BROQqZYh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2af-40r//i3vVA3E0+aP3YRcSX5Qcnc\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 687,
    "path": "../public/_nuxt/BROQqZYh.js"
  },
  "/_nuxt/BSHf-0eb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18ca-MdWJeIBhCqMrIP+CCIJo90I8NRE\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 6346,
    "path": "../public/_nuxt/BSHf-0eb.js"
  },
  "/_nuxt/BSPpinrx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5f8-kNjQyn86nGbFKQAARbexvMtAyRQ\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 1528,
    "path": "../public/_nuxt/BSPpinrx.js"
  },
  "/_nuxt/BTbGKmhu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c3-9X6Ut9U0/ZZctzQAKb1iJIwhAas\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 707,
    "path": "../public/_nuxt/BTbGKmhu.js"
  },
  "/_nuxt/BVGRssQp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b7-8hKdVmHO7IhMcfDjYoDgXDAwJzM\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 183,
    "path": "../public/_nuxt/BVGRssQp.js"
  },
  "/_nuxt/BVlVXSjx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"48d0-x33KZElAhUT1JF/yIhxqCZd76q4\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 18640,
    "path": "../public/_nuxt/BVlVXSjx.js"
  },
  "/_nuxt/BWkuYGGO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1151-WF3kqcT4PDVYfNH7IXUPfiA3Mlw\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 4433,
    "path": "../public/_nuxt/BWkuYGGO.js"
  },
  "/_nuxt/BWslPs4p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4c8d-SyCbyhctw+APpVBaGQh72Yf0kto\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 19597,
    "path": "../public/_nuxt/BWslPs4p.js"
  },
  "/_nuxt/BXkSAIEj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5254-Axn1fQr9TF+GkmVdLvo6H+JJ8B8\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 21076,
    "path": "../public/_nuxt/BXkSAIEj.js"
  },
  "/_nuxt/BYqZ7etr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2fc9-sUWy2RHM1uihdbsUvukDLGR78Ek\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 12233,
    "path": "../public/_nuxt/BYqZ7etr.js"
  },
  "/_nuxt/BYquIMm6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b1-AoLG4/+guInQNJg/m6VlzKPB93o\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 177,
    "path": "../public/_nuxt/BYquIMm6.js"
  },
  "/_nuxt/BZ3P6AVf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8059-5fjoLg49rPVFTQ8suim2A90Vzg4\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 32857,
    "path": "../public/_nuxt/BZ3P6AVf.js"
  },
  "/_nuxt/BZRbnyjI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2268-sPKYxWqelzZSC+BnKRu3SzRBdoY\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 8808,
    "path": "../public/_nuxt/BZRbnyjI.js"
  },
  "/_nuxt/B_R80ZlN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6dba-VZ9pwFKdNEaQUE3rXKgwkFWRBMA\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 28090,
    "path": "../public/_nuxt/B_R80ZlN.js"
  },
  "/_nuxt/B_m7g4N7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e3-vD9JpGY0mKtBCmzkjdIj7UVuzls\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 739,
    "path": "../public/_nuxt/B_m7g4N7.js"
  },
  "/_nuxt/BaLI2h1d.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6372-900l/13vL6GpVtmJtgEo3Wxn9Aw\"",
    "mtime": "2025-09-16T13:49:16.520Z",
    "size": 25458,
    "path": "../public/_nuxt/BaLI2h1d.js"
  },
  "/_nuxt/BbalPOsb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"20ff-04cpAx/zL+DhvBvvu9RSkGqetco\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 8447,
    "path": "../public/_nuxt/BbalPOsb.js"
  },
  "/_nuxt/BbccZ3y2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21f5-oIY1tbMMPfn/Iq3DSv+lpWgJAtg\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 8693,
    "path": "../public/_nuxt/BbccZ3y2.js"
  },
  "/_nuxt/BcG7JQmf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"238-1sf1FKU0EKUJBx0PzpD5tI15jAY\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 568,
    "path": "../public/_nuxt/BcG7JQmf.js"
  },
  "/_nuxt/Bcw97oti.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2230e-ytVITf4rPXt8n9UbkvT1895gF3Y\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 140046,
    "path": "../public/_nuxt/Bcw97oti.js"
  },
  "/_nuxt/BdKQZBgB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b7-zUv7JrTZbDT4RjJGPtFoyf3cZjQ\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 183,
    "path": "../public/_nuxt/BdKQZBgB.js"
  },
  "/_nuxt/Bdprqoiu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"831a-85Q4k2o2Bcwq14rJ1snhqpfuxj4\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 33562,
    "path": "../public/_nuxt/Bdprqoiu.js"
  },
  "/_nuxt/BfHTSMKl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"48c5-2KtadDLdcujxXy8y4Bt2hElnnOs\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 18629,
    "path": "../public/_nuxt/BfHTSMKl.js"
  },
  "/_nuxt/BfjtVDDH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"37c3-xDmtEk31qK1Bh5UReLYFJAKxJ5I\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 14275,
    "path": "../public/_nuxt/BfjtVDDH.js"
  },
  "/_nuxt/BgDCqdQA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d1f1-Hu9sPs6I5PgTPGWd3WR7nOwmRy8\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 53745,
    "path": "../public/_nuxt/BgDCqdQA.js"
  },
  "/_nuxt/BgqZeg96.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"899a-OnzHD7q93LwzvW2WzGPyMeoOXjY\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 35226,
    "path": "../public/_nuxt/BgqZeg96.js"
  },
  "/_nuxt/Bh-T8_Sd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"237-l14fsRNmYBshjcYG5ZArf/au71o\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 567,
    "path": "../public/_nuxt/Bh-T8_Sd.js"
  },
  "/_nuxt/BhC5s0V7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e26-vwG0FTs7mQyC6ub4gYnxSNaKP4g\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 20006,
    "path": "../public/_nuxt/BhC5s0V7.js"
  },
  "/_nuxt/BhsLqr-4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12094-U2f5S7V3vHuCSsdt7LUkPqOSWw8\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 73876,
    "path": "../public/_nuxt/BhsLqr-4.js"
  },
  "/_nuxt/BjABl1g7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5f9-jBh85NrAGgqEDiS4a/QPtcdsy1M\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 1529,
    "path": "../public/_nuxt/BjABl1g7.js"
  },
  "/_nuxt/BjXeLqNd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8b4d-oAJp6Fr1cxWyd/m94L+YZXZCtYY\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 35661,
    "path": "../public/_nuxt/BjXeLqNd.js"
  },
  "/_nuxt/Bjs2cL5p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44bf-OgHuoIQ7tMRyZZYHqy8Z9GFDxsY\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 17599,
    "path": "../public/_nuxt/Bjs2cL5p.js"
  },
  "/_nuxt/BkG9CdHo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ad8c-hRh7DmbSP1J4W9lOzuV0TlMi2Kg\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 175500,
    "path": "../public/_nuxt/BkG9CdHo.js"
  },
  "/_nuxt/Bkuqu6BP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"356d-zBk2O671hcu14yjA5BaP8bRgML4\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 13677,
    "path": "../public/_nuxt/Bkuqu6BP.js"
  },
  "/_nuxt/Bmb0A568.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19757-wagNEtXNk4ZGOIja0vw5uj68X5g\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 104279,
    "path": "../public/_nuxt/Bmb0A568.js"
  },
  "/_nuxt/Bmg4PQcd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7532-Ux6yZdy2nV2tKQIQno8Us4P2oEk\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 30002,
    "path": "../public/_nuxt/Bmg4PQcd.js"
  },
  "/_nuxt/Bn8UFn5d.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"185-dK3u9FELGkPYN/4QsgAHXqVSZak\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 389,
    "path": "../public/_nuxt/Bn8UFn5d.js"
  },
  "/_nuxt/Bnbw1zOw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"560-fdXPdwPB0cs03U/IFdJJpu0YYLQ\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 1376,
    "path": "../public/_nuxt/Bnbw1zOw.js"
  },
  "/_nuxt/BnfnAR_u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5c69-cCPBbek8QeZ3Ab/bR7d8bDiK7Fs\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 23657,
    "path": "../public/_nuxt/BnfnAR_u.js"
  },
  "/_nuxt/BoZcIFWd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c768-hhiITqog9SQ8Z39eG69x8xC4UGA\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 51048,
    "path": "../public/_nuxt/BoZcIFWd.js"
  },
  "/_nuxt/Bohx6pHs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21bd-4VnuIyqWQIRBP5/0bVLGoAPr3KI\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 8637,
    "path": "../public/_nuxt/Bohx6pHs.js"
  },
  "/_nuxt/Bp6g37R7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"223-LScnQcrupWjGOHlgVTaKyfzcpy0\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 547,
    "path": "../public/_nuxt/Bp6g37R7.js"
  },
  "/_nuxt/Bpd8X2ze.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e24-eJGPl//Grj++U12jDo+VZIlFbh0\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 7716,
    "path": "../public/_nuxt/Bpd8X2ze.js"
  },
  "/_nuxt/BqC09HBT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"103-KVMDZeUN7N6HzPY86s3M2HxylKY\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 259,
    "path": "../public/_nuxt/BqC09HBT.js"
  },
  "/_nuxt/BqtQrzRp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"dce0-mIEoQFOx4l3xhXpM865ztteLpnc\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 56544,
    "path": "../public/_nuxt/BqtQrzRp.js"
  },
  "/_nuxt/BrbOHqWv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24bd-ljciiqAs1gDXtSbno5dy0x0/cfY\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 9405,
    "path": "../public/_nuxt/BrbOHqWv.js"
  },
  "/_nuxt/BthQWCQV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"239d-LHMBsyUFh86qGFvM+u7t3WkZtbw\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 9117,
    "path": "../public/_nuxt/BthQWCQV.js"
  },
  "/_nuxt/Bu73EIfS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"94ec-l++ZOlpk+WH3Aq1wKKHTbZYexT4\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 38124,
    "path": "../public/_nuxt/Bu73EIfS.js"
  },
  "/_nuxt/BuBMJB-y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bd7a-wuono4YyUETRsCanH/hcsz/3HXg\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 48506,
    "path": "../public/_nuxt/BuBMJB-y.js"
  },
  "/_nuxt/Bv-mwDEg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1862-x/lkKlyYqciwp73N43wVTRopAlg\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 6242,
    "path": "../public/_nuxt/Bv-mwDEg.js"
  },
  "/_nuxt/Bv_sPlCv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"904-FD8sEyuTNrIPQ2jESlBo84yWQbs\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 2308,
    "path": "../public/_nuxt/Bv_sPlCv.js"
  },
  "/_nuxt/Bw305WKR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5125-tbBJwAwza6HClVoP6OvDw/UyczE\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 20773,
    "path": "../public/_nuxt/Bw305WKR.js"
  },
  "/_nuxt/ByY1Guvr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1728-GCr1nGG+cO+72SahfZpQ9NfZF2I\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 5928,
    "path": "../public/_nuxt/ByY1Guvr.js"
  },
  "/_nuxt/BzAMEn9Z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b32-x6N4+tNSWBW+x45RdhhhASm6tls\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 11058,
    "path": "../public/_nuxt/BzAMEn9Z.js"
  },
  "/_nuxt/BzJJZx-M.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"524a-+n2NQF4pUrirtbVLSya0Zll9gp8\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 21066,
    "path": "../public/_nuxt/BzJJZx-M.js"
  },
  "/_nuxt/BzaEo2Du.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d58-ycJCWzxEIC1nd8CS/xOIW/ouIwg\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 3416,
    "path": "../public/_nuxt/BzaEo2Du.js"
  },
  "/_nuxt/BzeVlI2I.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"af-RnNDhDyvU3xxlwYkBjk9dHdZz6E\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 175,
    "path": "../public/_nuxt/BzeVlI2I.js"
  },
  "/_nuxt/BzwtH5UL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b56c-U3gp+2aWi3PT5gttWtxX5e++CuU\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 46444,
    "path": "../public/_nuxt/BzwtH5UL.js"
  },
  "/_nuxt/C-_shW-Y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b235-IOuqdH140zmembMIabC2omrC0gk\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 45621,
    "path": "../public/_nuxt/C-_shW-Y.js"
  },
  "/_nuxt/C0hdQUNN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e82-FpITGZV6iD0AOF1zA4Ha2cQtwLY\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 3714,
    "path": "../public/_nuxt/C0hdQUNN.js"
  },
  "/_nuxt/C0ncgsz2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-B+fSFamjxy8T19PcOa6Nncqe5TI\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 180,
    "path": "../public/_nuxt/C0ncgsz2.js"
  },
  "/_nuxt/C30t_gpS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a46-AY7LzxKhpfuH4RTdOHAZ0eBfl+E\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 2630,
    "path": "../public/_nuxt/C30t_gpS.js"
  },
  "/_nuxt/C39BiMTA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"70f1-XkEMDsROL+KqTkmkI7vaY0QDB/s\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 28913,
    "path": "../public/_nuxt/C39BiMTA.js"
  },
  "/_nuxt/C3khCPGq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"229d-3GfF78JdzfO32fqTvNakp2eNACA\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 8861,
    "path": "../public/_nuxt/C3khCPGq.js"
  },
  "/_nuxt/C3mMm8J8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2389-BXT9xKjaiqBfp3OCAewo89+9Wpg\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 9097,
    "path": "../public/_nuxt/C3mMm8J8.js"
  },
  "/_nuxt/C4Ro8ZjH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1eb4-YpNGcTZ1baegA+6aTmFXrKHFLpA\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 7860,
    "path": "../public/_nuxt/C4Ro8ZjH.js"
  },
  "/_nuxt/C5-9kuJc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c9b8-m/RAhP5pmyA1ng0JVzebtyucj8o\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 51640,
    "path": "../public/_nuxt/C5-9kuJc.js"
  },
  "/_nuxt/C8M2exoo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d1f4-DRqIliTj8jrkpY6QITy6jlt6T6w\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 53748,
    "path": "../public/_nuxt/C8M2exoo.js"
  },
  "/_nuxt/C8lEn-DE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3ea-+fq0/BxvZOQ+157ZaRNbUKWMmIo\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 1002,
    "path": "../public/_nuxt/C8lEn-DE.js"
  },
  "/_nuxt/C8pgRvQH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d4c-h0HTD1hvOu4Gy9N2gt+4kF5VQzk\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 3404,
    "path": "../public/_nuxt/C8pgRvQH.js"
  },
  "/_nuxt/CDK175Y_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b8-u1Gjj49VDMFfVXReRxIDb/KS5M8\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 184,
    "path": "../public/_nuxt/CDK175Y_.js"
  },
  "/_nuxt/CD_QflpE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b230-Ye6how9tyXomcJDGSeovtQzWAi8\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 45616,
    "path": "../public/_nuxt/CD_QflpE.js"
  },
  "/_nuxt/CEjiMJLT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2aff-v8b98e0ChiSgJ+QfVNVfzLT8i0w\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 11007,
    "path": "../public/_nuxt/CEjiMJLT.js"
  },
  "/_nuxt/CEvzwb0I.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2909-Ykectmq65rpV80aJ66nqfTO4AJU\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 10505,
    "path": "../public/_nuxt/CEvzwb0I.js"
  },
  "/_nuxt/CFFzfAWz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11eb-P4FlDTMVYQMc3dyLgKX1n7jqdBw\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 4587,
    "path": "../public/_nuxt/CFFzfAWz.js"
  },
  "/_nuxt/CG6Dc4jp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"97f00-rYm+CybCMCqxOZ2Np2GsfIrREbo\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 622336,
    "path": "../public/_nuxt/CG6Dc4jp.js"
  },
  "/_nuxt/CGXjegLJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a29-jQVc2NSXAOF5Wtdiu6VP9xuDTt8\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 6697,
    "path": "../public/_nuxt/CGXjegLJ.js"
  },
  "/_nuxt/CI15r38m.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1acac-dto7rOze3XEbdmk3Vvr6JMJ4w8U\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 109740,
    "path": "../public/_nuxt/CI15r38m.js"
  },
  "/_nuxt/CIiI48o2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2a25-MUU00uQDCP2Ev/J2DEylfLNhucI\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 10789,
    "path": "../public/_nuxt/CIiI48o2.js"
  },
  "/_nuxt/CIxipgmy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"51f2-C+MsgfH76/wfJhgRncPOVAZs/UE\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 20978,
    "path": "../public/_nuxt/CIxipgmy.js"
  },
  "/_nuxt/CJxt7p29.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c4a-4UmG9xO4PvUHepWgeC6S/Ljtq2Y\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 7242,
    "path": "../public/_nuxt/CJxt7p29.js"
  },
  "/_nuxt/CK56Z9cH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11ead-imC0J98Rld6jdHicSlQWBrrAK7U\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 73389,
    "path": "../public/_nuxt/CK56Z9cH.js"
  },
  "/_nuxt/CK7S-5jS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"25e0-qcCIsVgHfobV7v+uzIavMHbLK3Q\"",
    "mtime": "2025-09-16T13:49:16.524Z",
    "size": 9696,
    "path": "../public/_nuxt/CK7S-5jS.js"
  },
  "/_nuxt/CLmbwNS9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fd12-CE60Kf2epZw9hC+8Hzb1Ax2pSOQ\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 64786,
    "path": "../public/_nuxt/CLmbwNS9.js"
  },
  "/_nuxt/CM4fc1WH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2dc05-+/Ls5XVpzZgCfyyTfjpXNJgeK1s\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 187397,
    "path": "../public/_nuxt/CM4fc1WH.js"
  },
  "/_nuxt/CMMRBUxV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-38YiIXna0Bk4xDMRKoeFqQt34EQ\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 180,
    "path": "../public/_nuxt/CMMRBUxV.js"
  },
  "/_nuxt/CMOi41r9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8dca-PUxYGK3k4L1bfVE8uCFcCJ2XEO4\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 36298,
    "path": "../public/_nuxt/CMOi41r9.js"
  },
  "/_nuxt/CMQyqBr5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"54a-/oO9xUsemCDqnnVUYvpSiHr7Zf0\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 1354,
    "path": "../public/_nuxt/CMQyqBr5.js"
  },
  "/_nuxt/CMnybHwx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4cbe-POaOlFR8VLqIEMoJFvDTls8ar6k\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 19646,
    "path": "../public/_nuxt/CMnybHwx.js"
  },
  "/_nuxt/CMz7PuSU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c4742-GVaoluLAoLIhKxSGkUD0nOpeBWo\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 804674,
    "path": "../public/_nuxt/CMz7PuSU.js"
  },
  "/_nuxt/CNRQ974Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e26-m3ZNFOuy1Du03gJ9a/CL3j3pBkM\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 3622,
    "path": "../public/_nuxt/CNRQ974Q.js"
  },
  "/_nuxt/CNXuF1yM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"de87-DL/BEmrcv7zrUSIshq/haUBrFU0\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 56967,
    "path": "../public/_nuxt/CNXuF1yM.js"
  },
  "/_nuxt/COcR7UxN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6e6-KVy2CiQj/15tE4fKfH6tc7FPvoY\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 1766,
    "path": "../public/_nuxt/COcR7UxN.js"
  },
  "/_nuxt/CQO4gZEw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5f37-2eJlxIzWhBvPSLhyFzv+sXEXHJ8\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 24375,
    "path": "../public/_nuxt/CQO4gZEw.js"
  },
  "/_nuxt/CQjiPCtT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3e-EJXPrP7qzhwcxCXB1vhQUTgP4K0\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 3390,
    "path": "../public/_nuxt/CQjiPCtT.js"
  },
  "/_nuxt/CQzXS8_C.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1509-GMGg7J4yS+QEAwmJ9Jk2QPMCh9k\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 5385,
    "path": "../public/_nuxt/CQzXS8_C.js"
  },
  "/_nuxt/CS3Unz2-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"82d6-aUEs94AcfLqjSVpnmdfYdfX5koA\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 33494,
    "path": "../public/_nuxt/CS3Unz2-.js"
  },
  "/_nuxt/CScALxCO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"238-/3LV+V8UjxAteD78PXY+fajaV2A\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 568,
    "path": "../public/_nuxt/CScALxCO.js"
  },
  "/_nuxt/CSoQzgif.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1958-/3zwQCWwKU8HefbKd5oXevi/9/k\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 6488,
    "path": "../public/_nuxt/CSoQzgif.js"
  },
  "/_nuxt/CTRr51gU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b39-AV5b5gMlIyFBg8ZLVvBtodDGnYI\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 6969,
    "path": "../public/_nuxt/CTRr51gU.js"
  },
  "/_nuxt/CVESyXxo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2efba-vkwuizl/Wl3AA1zQuKpHQ5F/LzI\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 192442,
    "path": "../public/_nuxt/CVESyXxo.js"
  },
  "/_nuxt/CVO1_9PV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3530-TayDmxRMvy5Bv+gyldrxxN/vEUA\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 13616,
    "path": "../public/_nuxt/CVO1_9PV.js"
  },
  "/_nuxt/CXJJodaB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bb3-XrsqErFysFaxPd1JqM+mLK0V0bA\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 2995,
    "path": "../public/_nuxt/CXJJodaB.js"
  },
  "/_nuxt/CXc_4DKG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"544-3D5FOAw3XER9VBQ1Qi8C5EzlR50\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 1348,
    "path": "../public/_nuxt/CXc_4DKG.js"
  },
  "/_nuxt/CXmV_HiI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3855-MmQ3lz8UEftWqGVCDbPAbvb2wPg\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 14421,
    "path": "../public/_nuxt/CXmV_HiI.js"
  },
  "/_nuxt/CY2R9RuK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b0f-U+C2VSX3ohUyEhFqxHmX2LZ3res\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 6927,
    "path": "../public/_nuxt/CY2R9RuK.js"
  },
  "/_nuxt/CZzQMiei.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18ea-tg0J3tV6c3Rkw1XR4SGFseRm4Vg\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 6378,
    "path": "../public/_nuxt/CZzQMiei.js"
  },
  "/_nuxt/CafNBF8u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1893-d496H0Z60lAg57LiRH/wyqJ+BmM\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 6291,
    "path": "../public/_nuxt/CafNBF8u.js"
  },
  "/_nuxt/CbUnruJU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f64-4ljxDZNBtE6pXFPdvI1C6qBsUtM\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 3940,
    "path": "../public/_nuxt/CbUnruJU.js"
  },
  "/_nuxt/CbfX1IO0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"36d4-rw7+tMOmFbgQDhwnT0kx7VdqnBs\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 14036,
    "path": "../public/_nuxt/CbfX1IO0.js"
  },
  "/_nuxt/CcPoRNJz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a9902-ErtP/sX3B6PNnAFbHnNBSrxbrz0\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 694530,
    "path": "../public/_nuxt/CcPoRNJz.js"
  },
  "/_nuxt/CcSEeikT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16d25-ndXwqX3h0ky5uDQtWQsWyeFLRYg\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 93477,
    "path": "../public/_nuxt/CcSEeikT.js"
  },
  "/_nuxt/CeZwWGti.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"148e3-qLzKDFdLSnp5o9hzYdsuTMy0dz8\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 84195,
    "path": "../public/_nuxt/CeZwWGti.js"
  },
  "/_nuxt/CgtJCZHG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b5-TsDNEpgK2blxq8Os5mRCAZCuHjA\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 437,
    "path": "../public/_nuxt/CgtJCZHG.js"
  },
  "/_nuxt/Cgum3Yvx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a3-LzNAcjZWMQJD72LZh+qkVtw+8yo\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 419,
    "path": "../public/_nuxt/Cgum3Yvx.js"
  },
  "/_nuxt/ChDww4um.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a86c-8SBJ7Vlb9hpz3vpTxk4Yodocrno\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 43116,
    "path": "../public/_nuxt/ChDww4um.js"
  },
  "/_nuxt/CharacterLink.fkoko4f1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"28-Rrt4DtsVXaI1I6fjveICb5xyUQk\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 40,
    "path": "../public/_nuxt/CharacterLink.fkoko4f1.css"
  },
  "/_nuxt/Ci-La1BS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3869-n89lebmW0mTSYqEhBeX1OlDCOhs\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 14441,
    "path": "../public/_nuxt/Ci-La1BS.js"
  },
  "/_nuxt/CjDtw9vr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5509-RCWnxb+vl/IAW+9+6MTNAA59rgg\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 21769,
    "path": "../public/_nuxt/CjDtw9vr.js"
  },
  "/_nuxt/CkkyLDzd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7d0-ckHkrHI2SKZitxThfe6anSOoDSA\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 2000,
    "path": "../public/_nuxt/CkkyLDzd.js"
  },
  "/_nuxt/CkqQx3Va.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"151b-kTmq0I3YqVDNxgNmTsz3FK2ZODM\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 5403,
    "path": "../public/_nuxt/CkqQx3Va.js"
  },
  "/_nuxt/ClV7KpCc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"46fa-3o1QKUMJRjJCLdezTW5/HULOCz0\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 18170,
    "path": "../public/_nuxt/ClV7KpCc.js"
  },
  "/_nuxt/CmCqftbK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"54ff-h7t1IkAm9sZKUd73kBTFe7jRv4o\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 21759,
    "path": "../public/_nuxt/CmCqftbK.js"
  },
  "/_nuxt/CmFc-ZVE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a1-OQMGkqpenb+f2XIwzAzMkiCDYhA\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 417,
    "path": "../public/_nuxt/CmFc-ZVE.js"
  },
  "/_nuxt/CmWLV2bY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3a3a-5zVVwoSX/E5YgEQyONPFeh0gLbI\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 14906,
    "path": "../public/_nuxt/CmWLV2bY.js"
  },
  "/_nuxt/Cmwku-12.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"88e-/XdzgV9CFwQJIicof3fy2WL3AVI\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 2190,
    "path": "../public/_nuxt/Cmwku-12.js"
  },
  "/_nuxt/CodIOJDM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4b4e-j/GtsGn7GAAwV8k9jxqIUb6bFOM\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 19278,
    "path": "../public/_nuxt/CodIOJDM.js"
  },
  "/_nuxt/CpRrwcwt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e2a-BZj+pyrMuvbDFvx+DcUeTCBad1E\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 3626,
    "path": "../public/_nuxt/CpRrwcwt.js"
  },
  "/_nuxt/CpWBKVjh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13cb-HCIWLP8BoJ8DUXZm/fSi6m4czvE\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 5067,
    "path": "../public/_nuxt/CpWBKVjh.js"
  },
  "/_nuxt/Cqv5JV-q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8ffe-Es7gO0/Ze/BZtbxqBseoiQFd1uw\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 36862,
    "path": "../public/_nuxt/Cqv5JV-q.js"
  },
  "/_nuxt/CrOfvjVs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"939-sjoz+XwbastRT5DWrI9XgVX0iUA\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 2361,
    "path": "../public/_nuxt/CrOfvjVs.js"
  },
  "/_nuxt/Csfq5Kiy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"48cb-tPSCpNF7svRHRSnrhMp7s2aYFJE\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 18635,
    "path": "../public/_nuxt/Csfq5Kiy.js"
  },
  "/_nuxt/CuIYtGag.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5bfc-pFViQfRCN73U/EiQriXVlylIDWw\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 23548,
    "path": "../public/_nuxt/CuIYtGag.js"
  },
  "/_nuxt/Cuk6v7N8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3863-ch+lyFS9QkuOdtlQcqnXQ5iOqcc\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 14435,
    "path": "../public/_nuxt/Cuk6v7N8.js"
  },
  "/_nuxt/Cv3cJnDV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6c12-G/4+yUk5TLkBwF3NodOlicltobU\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 27666,
    "path": "../public/_nuxt/Cv3cJnDV.js"
  },
  "/_nuxt/Cv9koXgw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3a65-Q1j891KpAph3EWu90fhfuUDvR08\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 14949,
    "path": "../public/_nuxt/Cv9koXgw.js"
  },
  "/_nuxt/CwIbMU3B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17cef-BUKimekJNlfGkPxUMOU61GxKyaU\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 97519,
    "path": "../public/_nuxt/CwIbMU3B.js"
  },
  "/_nuxt/CyEc264g.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5e86-i0s4eIZGB7krhhwd5kN8NdVNMjo\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 24198,
    "path": "../public/_nuxt/CyEc264g.js"
  },
  "/_nuxt/CyktbL80.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"48c5-38IV7Gj1pi36TR7qiSHzlCs9XIo\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 18629,
    "path": "../public/_nuxt/CyktbL80.js"
  },
  "/_nuxt/D-2ljcwZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"355b-ltA2RbrvMtKWMV4KgoBMozLYWVE\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 13659,
    "path": "../public/_nuxt/D-2ljcwZ.js"
  },
  "/_nuxt/D-RymO5g.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e18-6S5DoO+mRSk+lIPvN0L8zSriqhk\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 3608,
    "path": "../public/_nuxt/D-RymO5g.js"
  },
  "/_nuxt/D0UgJbcu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c879-HnZh8ZlreDQFfZ57Y/ExPsDt+Cw\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 51321,
    "path": "../public/_nuxt/D0UgJbcu.js"
  },
  "/_nuxt/D0iSTDRL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b3-pd7t09ymmVzTPZ1ZbVSrq4PnJnU\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 179,
    "path": "../public/_nuxt/D0iSTDRL.js"
  },
  "/_nuxt/D0r3Knsf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"35bf-NpZrPk9jdEu6IxpilmRefOR1sKI\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 13759,
    "path": "../public/_nuxt/D0r3Knsf.js"
  },
  "/_nuxt/D2O4HAMr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"aca2-Z8LWaSUISgtZhWMm89pugjhEsY4\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 44194,
    "path": "../public/_nuxt/D2O4HAMr.js"
  },
  "/_nuxt/D2TqM893.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17cbc-A037yu8580INRX9NgthwtNp9Qf8\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 97468,
    "path": "../public/_nuxt/D2TqM893.js"
  },
  "/_nuxt/D44NvAEk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1557-EOI2pCJ2K1NQFHQXDBtpBW/DCpg\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 5463,
    "path": "../public/_nuxt/D44NvAEk.js"
  },
  "/_nuxt/D4h5O-jR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ecc-X4WIf5/MKovdXkpn2ucY2Fvz+nI\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 7884,
    "path": "../public/_nuxt/D4h5O-jR.js"
  },
  "/_nuxt/D5KoaKCx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"48b7-CJZAUj4SYa7cWrWmLW1ca67ky3Y\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 18615,
    "path": "../public/_nuxt/D5KoaKCx.js"
  },
  "/_nuxt/D5Y-gRzf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2620-MzDpJ37r+ZFN3MtmJM4iCGHJJV8\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 9760,
    "path": "../public/_nuxt/D5Y-gRzf.js"
  },
  "/_nuxt/D7oLnXFd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"374c-u5ndhk1KsUHitkpMJ6KIbAiO+N0\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 14156,
    "path": "../public/_nuxt/D7oLnXFd.js"
  },
  "/_nuxt/D7v6OrNy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15164-Gmfecbyl2dECHXNRnFkPozS7xhA\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 86372,
    "path": "../public/_nuxt/D7v6OrNy.js"
  },
  "/_nuxt/D8nBeWSR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5d55-t8ybIBJo2+Qm+FUMWSgfj/W15kE\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 23893,
    "path": "../public/_nuxt/D8nBeWSR.js"
  },
  "/_nuxt/D9Bn7OQI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ff4-3SISjYWgWYykt3PxbG3Ual/Le2E\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 12276,
    "path": "../public/_nuxt/D9Bn7OQI.js"
  },
  "/_nuxt/DA0ESIWO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1edf-ZNF7EmWM0XAlATCxxuaCrqJMsgY\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 7903,
    "path": "../public/_nuxt/DA0ESIWO.js"
  },
  "/_nuxt/DAi9KRSo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2bb0-kCaePAc0SkqzEXT/m+0Gi8SfIkE\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 11184,
    "path": "../public/_nuxt/DAi9KRSo.js"
  },
  "/_nuxt/DBQeEorK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"863b-TOdRR4rpuAqM0Jl05f8alb/LCIc\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 34363,
    "path": "../public/_nuxt/DBQeEorK.js"
  },
  "/_nuxt/DCcCncrU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e958-O5OnGQsj3Lhd4SEY7Ro3rpIllWk\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 59736,
    "path": "../public/_nuxt/DCcCncrU.js"
  },
  "/_nuxt/DDUKAZWS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"29f0-djr27MGTFNZno8rIKnPSz7WN9IM\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 10736,
    "path": "../public/_nuxt/DDUKAZWS.js"
  },
  "/_nuxt/DD_O6_fN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a1-fgEy5qKhQKuNWF1oJr0xo6Cno5M\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 417,
    "path": "../public/_nuxt/DD_O6_fN.js"
  },
  "/_nuxt/DEIpsLCJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7eb-re77T+9BfnvaYlymlHGmq0XHpwM\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 2027,
    "path": "../public/_nuxt/DEIpsLCJ.js"
  },
  "/_nuxt/DES0gjzB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"56de-cEX810TCpucBg3cbonzsXM/sTWM\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 22238,
    "path": "../public/_nuxt/DES0gjzB.js"
  },
  "/_nuxt/DFQ4Xr-4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6825-xRxQQhck1J4JObFHAn813BjCcNk\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 26661,
    "path": "../public/_nuxt/DFQ4Xr-4.js"
  },
  "/_nuxt/DFW6HATB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e7f8-RAw864aDJO/yZOPy7hkY5SiSfvc\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 59384,
    "path": "../public/_nuxt/DFW6HATB.js"
  },
  "/_nuxt/DH4N8IuU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"34c6-jnDQRwoDI9Zr5uRl9qlp+MDrTMk\"",
    "mtime": "2025-09-16T13:49:16.528Z",
    "size": 13510,
    "path": "../public/_nuxt/DH4N8IuU.js"
  },
  "/_nuxt/DH5Ifo-i.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3861-ZsBIvSUlsHzh+aocazJKD4XzMVc\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 14433,
    "path": "../public/_nuxt/DH5Ifo-i.js"
  },
  "/_nuxt/DHJKELXO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c8d-G52k5HF2RR+jOGOolyZJDXOaYjU\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 11405,
    "path": "../public/_nuxt/DHJKELXO.js"
  },
  "/_nuxt/DIt9OTko.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"76fb-3qH/6qIyJR+C9BK0ZArJRPJI8Is\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 30459,
    "path": "../public/_nuxt/DIt9OTko.js"
  },
  "/_nuxt/DJEtsjbi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d32-9a/nFvrA36aAjRQI5+eJn/2NrOo\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 3378,
    "path": "../public/_nuxt/DJEtsjbi.js"
  },
  "/_nuxt/DL4Dju3v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"42c7-BsMkMBd7ZILxqB7CCc7NM5Y8KTo\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 17095,
    "path": "../public/_nuxt/DL4Dju3v.js"
  },
  "/_nuxt/DLbgOhZU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e6e-HjKchXJIUuHOAYTWw1w+Xe8C+uM\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 3694,
    "path": "../public/_nuxt/DLbgOhZU.js"
  },
  "/_nuxt/DMcMdqhj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"153e-eUoSc2zN1eCcVo8ZxWyXis8PeoA\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 5438,
    "path": "../public/_nuxt/DMcMdqhj.js"
  },
  "/_nuxt/DNDvMORL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2332-Wejln9oYNIFYdUq98Xbyojog6kg\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 9010,
    "path": "../public/_nuxt/DNDvMORL.js"
  },
  "/_nuxt/DNgb01dh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d064-eXJi6kaS1GdS7zJ5xUM1wKdK47c\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 184420,
    "path": "../public/_nuxt/DNgb01dh.js"
  },
  "/_nuxt/DPTZissz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9f58-791bte2a1tRW/kYnioHfJGTsXf8\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 40792,
    "path": "../public/_nuxt/DPTZissz.js"
  },
  "/_nuxt/DQxx3LPD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"69c-Lyq4BXKfoMYsRbdAuCGD9cIY9lk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 1692,
    "path": "../public/_nuxt/DQxx3LPD.js"
  },
  "/_nuxt/DRW-0cLl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b22e-xy+/TiCHaZs8UqctXSO5FKTjVQI\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 45614,
    "path": "../public/_nuxt/DRW-0cLl.js"
  },
  "/_nuxt/DRhUEtVu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11ea-Bi8lp+xVYINDlZUpWDfS2STQLTI\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 4586,
    "path": "../public/_nuxt/DRhUEtVu.js"
  },
  "/_nuxt/DUdzsfxe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8ab1-BdowNQz2j+MUS00f9oNJOkphh6A\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 35505,
    "path": "../public/_nuxt/DUdzsfxe.js"
  },
  "/_nuxt/DUszq2jm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ceb-ePBMCAX7SG0Irjogl+g1U5DwooA\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 11499,
    "path": "../public/_nuxt/DUszq2jm.js"
  },
  "/_nuxt/DVWcdiGS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3ba5-jVQRr2OlytmJ1vZsZDGySXCxZkk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 15269,
    "path": "../public/_nuxt/DVWcdiGS.js"
  },
  "/_nuxt/DWMP3yrW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d6b-F3HV/v/PWQqRzPvL5A3+I761Mjc\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 11627,
    "path": "../public/_nuxt/DWMP3yrW.js"
  },
  "/_nuxt/DWmkr0yC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b60-ICeA37a8kQvsM6sxKJ2gL7MWzHk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 2912,
    "path": "../public/_nuxt/DWmkr0yC.js"
  },
  "/_nuxt/DXbdFlpD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1abe-6NRBR7/r0g2IDmknK3kpzih1ojk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 6846,
    "path": "../public/_nuxt/DXbdFlpD.js"
  },
  "/_nuxt/DXsao0IY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b7-MiAqXbkygnRvPRxky72mTRsQqzs\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 695,
    "path": "../public/_nuxt/DXsao0IY.js"
  },
  "/_nuxt/DZ4hUExO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"295e-FDs7hCUc2LcGoM2nrFc3BdhLEeg\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 10590,
    "path": "../public/_nuxt/DZ4hUExO.js"
  },
  "/_nuxt/Db-JQHi3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"237c-ClwgyfYP+zm9KtoZRBNsrUz1w3U\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 9084,
    "path": "../public/_nuxt/Db-JQHi3.js"
  },
  "/_nuxt/DbXoA79R.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2907-ZkPirys+uaF8rNhxTqYD8phOkIk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 10503,
    "path": "../public/_nuxt/DbXoA79R.js"
  },
  "/_nuxt/DdY7uXr-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f86-J1Pjd0/78KLL2fGiXKs+uWfplYg\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 16262,
    "path": "../public/_nuxt/DdY7uXr-.js"
  },
  "/_nuxt/Ddv68eIx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6863-kMtZ6hRkLXSKT61B4950edu4MjQ\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 26723,
    "path": "../public/_nuxt/Ddv68eIx.js"
  },
  "/_nuxt/DepYB8Ml.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3200-A3UvdYRGOwFpDcMqaIHPpTDE3QI\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 12800,
    "path": "../public/_nuxt/DepYB8Ml.js"
  },
  "/_nuxt/DfpIq38s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a9a-UeZPJKoPtm6I/Hl0eCnRPb42ZOs\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 6810,
    "path": "../public/_nuxt/DfpIq38s.js"
  },
  "/_nuxt/DhMKtDLN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e8a-xKqvlxsACkI+FJYhs89ziAnlgR0\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 7818,
    "path": "../public/_nuxt/DhMKtDLN.js"
  },
  "/_nuxt/DhRVplvY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"41ba-/r/cBT6L1xY4uZYwhQlXeQ2xIM8\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 16826,
    "path": "../public/_nuxt/DhRVplvY.js"
  },
  "/_nuxt/DhjS0j1J.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b85-Qs1WU0zqEjH4iPilAqa2T/6q6vg\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 2949,
    "path": "../public/_nuxt/DhjS0j1J.js"
  },
  "/_nuxt/DhqJCFIX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"46d8-ik77XPikon5cBtPevjJvVW7SRs4\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 18136,
    "path": "../public/_nuxt/DhqJCFIX.js"
  },
  "/_nuxt/Dk1rBueR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19011-GOwjeyII5KHOdeUA8mp4DihIAtY\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 102417,
    "path": "../public/_nuxt/Dk1rBueR.js"
  },
  "/_nuxt/DkpUthgY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d8e-okvgwx1mebNSxtpVd59c+2p7Qv0\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 7566,
    "path": "../public/_nuxt/DkpUthgY.js"
  },
  "/_nuxt/DlYXzDlu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b9e-rkEVP785CHgr4bY6do9oFeAQIIk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 2974,
    "path": "../public/_nuxt/DlYXzDlu.js"
  },
  "/_nuxt/DmF4-xLG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"196c-6JSvy8Jhz4rHPQ4yeEkCCWVpn/g\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 6508,
    "path": "../public/_nuxt/DmF4-xLG.js"
  },
  "/_nuxt/DmZ-uG0V.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"418a-c29zEJ1BL/a4tb0nelZa6LH09GQ\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 16778,
    "path": "../public/_nuxt/DmZ-uG0V.js"
  },
  "/_nuxt/Dn00JSTd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"339b-eDgYgmZylp6cuLTa7fn/CGMPvKo\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 13211,
    "path": "../public/_nuxt/Dn00JSTd.js"
  },
  "/_nuxt/DnULxvSX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8a5e-lpZgdjKbVFHBYkOMCMZXYihb+Y0\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 35422,
    "path": "../public/_nuxt/DnULxvSX.js"
  },
  "/_nuxt/Dnfm4U7b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a4b-uPm++E9mt5E+WvEN8oThWVYgfKA\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 2635,
    "path": "../public/_nuxt/Dnfm4U7b.js"
  },
  "/_nuxt/DnyWjya5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"972-eJTySJbZjSuVyvBSboWNvZrr07o\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 2418,
    "path": "../public/_nuxt/DnyWjya5.js"
  },
  "/_nuxt/DoBRWXs5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"574e-QetClR1ko0KOAcYWF2bVSR5dMMI\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 22350,
    "path": "../public/_nuxt/DoBRWXs5.js"
  },
  "/_nuxt/DoiKbUTj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f83-hHHno5VwRHEo1/B7i1cryLYu3iA\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 8067,
    "path": "../public/_nuxt/DoiKbUTj.js"
  },
  "/_nuxt/DqpEK-75.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d335-zL855UNxYVrNUwvQdWdccleV3DI\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 185141,
    "path": "../public/_nuxt/DqpEK-75.js"
  },
  "/_nuxt/DqwNpetd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24d7-BiRtKEQjWndnYLM1xGeXTGnUgo4\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 9431,
    "path": "../public/_nuxt/DqwNpetd.js"
  },
  "/_nuxt/Ds-gbosJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"550a-XzUApj4T28iKwTNlG8VmS8Brr0I\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 21770,
    "path": "../public/_nuxt/Ds-gbosJ.js"
  },
  "/_nuxt/DsCg8CPl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1068-a2usagXtEcqY/FZgG+RNGA0dAWs\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 4200,
    "path": "../public/_nuxt/DsCg8CPl.js"
  },
  "/_nuxt/Dtn98rcr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c87-kxzcak9Zh7643xSYeW/k5A2bNHo\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 3207,
    "path": "../public/_nuxt/Dtn98rcr.js"
  },
  "/_nuxt/DuTy9v_Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"67f-6W2M+Z+CSvMlZLEP6OKjcb3oCXw\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 1663,
    "path": "../public/_nuxt/DuTy9v_Q.js"
  },
  "/_nuxt/DvA-6Bhw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e26-YrODpdo1i2P63M5quO5L+f7RTZs\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 20006,
    "path": "../public/_nuxt/DvA-6Bhw.js"
  },
  "/_nuxt/DvLlm7w-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b7-GwVA8oRxCMz3UD1WeGAnIOisnBA\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 183,
    "path": "../public/_nuxt/DvLlm7w-.js"
  },
  "/_nuxt/DvQyZZSe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"42bc-Oiw0gvGh9SILsQHc4nIz/jrYUdE\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 17084,
    "path": "../public/_nuxt/DvQyZZSe.js"
  },
  "/_nuxt/DwU8c_yx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7b2a-8gjf5DUnqkUeGV03uk5S3+yuN00\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 31530,
    "path": "../public/_nuxt/DwU8c_yx.js"
  },
  "/_nuxt/Dwo6uFCY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1985-Z6yDtvypVitJj075w1zWSIQmjec\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 6533,
    "path": "../public/_nuxt/Dwo6uFCY.js"
  },
  "/_nuxt/DxokFBIi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"53b6-uYVZmBeRYULFrnU2LCBljmjT3eE\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 21430,
    "path": "../public/_nuxt/DxokFBIi.js"
  },
  "/_nuxt/DymQr0nX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f4d-PxG/nkhVsRNnJMFXB18t5cF+Cjk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 16205,
    "path": "../public/_nuxt/DymQr0nX.js"
  },
  "/_nuxt/DzaHHFTY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1310a-tZZVF7clemFknfWidN+4dDkX+ng\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 78090,
    "path": "../public/_nuxt/DzaHHFTY.js"
  },
  "/_nuxt/Dzwn3p-3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3d-H3HzpY+paINRBRlsgoXBob/W/Bo\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 3389,
    "path": "../public/_nuxt/Dzwn3p-3.js"
  },
  "/_nuxt/E3gJ1_iC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3903-b1i07XzPpd3BHF9/vi4M4mGWen8\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 14595,
    "path": "../public/_nuxt/E3gJ1_iC.js"
  },
  "/_nuxt/EZUUsui8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4eff-4GM8OpweimUHa4kJ/9GcoGD5x/w\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 20223,
    "path": "../public/_nuxt/EZUUsui8.js"
  },
  "/_nuxt/F89DG-fP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2140-+GH/uMrtMcWZMaUPn5lHnytRd+Y\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 8512,
    "path": "../public/_nuxt/F89DG-fP.js"
  },
  "/_nuxt/FMvz1E70.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3b6-B+F/Z8xHKIp1aUy2fAJlkoa8pCI\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 950,
    "path": "../public/_nuxt/FMvz1E70.js"
  },
  "/_nuxt/G4wKSYvv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3c-pEp6taVTzyipIs5fDOe2oYTYfGk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 3388,
    "path": "../public/_nuxt/G4wKSYvv.js"
  },
  "/_nuxt/GBQ2dnAY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"83ce-zWDVCrXuif3I+lb47snPq7wlnHI\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 33742,
    "path": "../public/_nuxt/GBQ2dnAY.js"
  },
  "/_nuxt/HNM5thJl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a635-RHREg9zX2YSGCQIBpVMLd64baPk\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 42549,
    "path": "../public/_nuxt/HNM5thJl.js"
  },
  "/_nuxt/HxxdhYiO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8b-7nPSkHinwpToGjg94t5KuJ2ZSPU\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 139,
    "path": "../public/_nuxt/HxxdhYiO.js"
  },
  "/_nuxt/IBB5Tl9j.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5c6d-3fn/+Uqojui+Owa8YCpKGLhlJUo\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 23661,
    "path": "../public/_nuxt/IBB5Tl9j.js"
  },
  "/_nuxt/IqKf4WGj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"43f-SqnhV4zfo6zUK6BM4igqB2WYnbQ\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 1087,
    "path": "../public/_nuxt/IqKf4WGj.js"
  },
  "/_nuxt/JqZropPD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1052-lr+ZoPrGKVsqJM1QoHr029xJXr8\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 4178,
    "path": "../public/_nuxt/JqZropPD.js"
  },
  "/_nuxt/KUYRHWK4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"63e6-JWqO481EWrkiqN/Tycwwio52s74\"",
    "mtime": "2025-09-16T13:49:16.532Z",
    "size": 25574,
    "path": "../public/_nuxt/KUYRHWK4.js"
  },
  "/_nuxt/Kxp7UmFj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e43-yEQSHW7hVHOCk4ZwFTv6j0YssDI\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 20035,
    "path": "../public/_nuxt/Kxp7UmFj.js"
  },
  "/_nuxt/L9-HYnaW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"721-iChEbY92FLbrov6Ien+Y+Ovn0X8\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 1825,
    "path": "../public/_nuxt/L9-HYnaW.js"
  },
  "/_nuxt/L9t79GZl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1950-bOSHs4QuofVjf2ggJ3A58EemLcc\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 6480,
    "path": "../public/_nuxt/L9t79GZl.js"
  },
  "/_nuxt/LGGdnPYs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b22d-9HJY4AmCww6E1KE0oACg3a5+tEg\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 45613,
    "path": "../public/_nuxt/LGGdnPYs.js"
  },
  "/_nuxt/LKU2TuZ1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2179-66nxLzpa/D8qjlvdNJygXub6tgg\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 8569,
    "path": "../public/_nuxt/LKU2TuZ1.js"
  },
  "/_nuxt/Lp17StYA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"745b-+CZZb+zEL743vtoEdST4ws7uc5c\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 29787,
    "path": "../public/_nuxt/Lp17StYA.js"
  },
  "/_nuxt/NKd-Y1zG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c1b-FjQAbTxzVPKEGM//BbOQlI7BmwY\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 3099,
    "path": "../public/_nuxt/NKd-Y1zG.js"
  },
  "/_nuxt/NUI3YrRW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"138a-IP4ERYxYqdvUjh1J9F4Dl1oMS1E\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 5002,
    "path": "../public/_nuxt/NUI3YrRW.js"
  },
  "/_nuxt/NgWrSVUg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1127-FUCzAYRvS6Ts3N39JtOEkPAM708\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 4391,
    "path": "../public/_nuxt/NgWrSVUg.js"
  },
  "/_nuxt/NwJH37YQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-lmf9cvi2XIAaTfcVOt6fk2L6s98\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 180,
    "path": "../public/_nuxt/NwJH37YQ.js"
  },
  "/_nuxt/OAllIW5A.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"360-kagBJz3HltV7w5YGRml/nfk/o48\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 864,
    "path": "../public/_nuxt/OAllIW5A.js"
  },
  "/_nuxt/Pagination.YeJR2yUI.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9c-l7gsJeyJ39f+jR9t/MDRBmvJwg0\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 156,
    "path": "../public/_nuxt/Pagination.YeJR2yUI.css"
  },
  "/_nuxt/PoHY5YXO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"62d2-RQN1eJvOzFVrdHrv5KOv5WHUyDo\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 25298,
    "path": "../public/_nuxt/PoHY5YXO.js"
  },
  "/_nuxt/ProsePre.D5orA6B_.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e-jczvRAVUXbzGL6yotozKFbyMO4s\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 30,
    "path": "../public/_nuxt/ProsePre.D5orA6B_.css"
  },
  "/_nuxt/PxMG_1gE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"556-aalbTqjLXsn/IUXdJREK6kZC5AU\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 1366,
    "path": "../public/_nuxt/PxMG_1gE.js"
  },
  "/_nuxt/RXHOmnpW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4377-AowbxJcQh65TjgIkOWKvlSiZWeM\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 17271,
    "path": "../public/_nuxt/RXHOmnpW.js"
  },
  "/_nuxt/VBn1Tcxy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"238-KZoZ4P06NOPp+fRXQkdduwJdrcc\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 568,
    "path": "../public/_nuxt/VBn1Tcxy.js"
  },
  "/_nuxt/W2lx4xae.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"834d-nA7l1FZnVkdhyJAYbcgS/xMrwf4\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 33613,
    "path": "../public/_nuxt/W2lx4xae.js"
  },
  "/_nuxt/XF954dHc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b67-27l5c/pp48RNZVd/U8xkjNsesC0\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 2919,
    "path": "../public/_nuxt/XF954dHc.js"
  },
  "/_nuxt/YurBl9Qv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ac8-YastRpRwXWLXHzG/ogvjXFlUrlU\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 2760,
    "path": "../public/_nuxt/YurBl9Qv.js"
  },
  "/_nuxt/ZJvK9Z2N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4d16-RbRdkN3vUtHnP1UvhN3BnAkBcaQ\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 19734,
    "path": "../public/_nuxt/ZJvK9Z2N.js"
  },
  "/_nuxt/_Zu0RE-q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e33-QQWc8wUjE0I4qeKoVW+vLrUJx8w\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 11827,
    "path": "../public/_nuxt/_Zu0RE-q.js"
  },
  "/_nuxt/aeT0-ak7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"418f4-NWy/Mz0RBmlZ4B9NP7OdrFs4rPY\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 268532,
    "path": "../public/_nuxt/aeT0-ak7.js"
  },
  "/_nuxt/bGS5FTDY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1865-MwYffEfFX9hyRZeOlJZdp3QuBsQ\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 6245,
    "path": "../public/_nuxt/bGS5FTDY.js"
  },
  "/_nuxt/bN70gL4F.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1876-TIy/lDxhgGcsWEw99X2SyGsc2kY\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 6262,
    "path": "../public/_nuxt/bN70gL4F.js"
  },
  "/_nuxt/character-_ch_id_.CtPfhXor.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14d-L9RyUIeOeKLlt/HRYRNroSsAkGs\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 333,
    "path": "../public/_nuxt/character-_ch_id_.CtPfhXor.css"
  },
  "/_nuxt/dZn0vQkf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12bb-KHHAJTJt9QsiGowsK8gwwszD+0U\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 4795,
    "path": "../public/_nuxt/dZn0vQkf.js"
  },
  "/_nuxt/default.y4boCT1X.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"100-RtB5+jCMh1V9c7VHR8A0y8IgwTU\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 256,
    "path": "../public/_nuxt/default.y4boCT1X.css"
  },
  "/_nuxt/dwbxrGt_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e69f-bfnJ3iZdb9UGbRq2dGbQpYxbPW4\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 59039,
    "path": "../public/_nuxt/dwbxrGt_.js"
  },
  "/_nuxt/eACALr6E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6ad2-v0JJImeIIi8HbSe/KKjvYWTJr3s\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 27346,
    "path": "../public/_nuxt/eACALr6E.js"
  },
  "/_nuxt/entry.B1XS7CLf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4619f-T61bDUoUBYBEzlfLhHthsrB5vQ8\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 287135,
    "path": "../public/_nuxt/entry.B1XS7CLf.css"
  },
  "/_nuxt/episode-_e_id_.BGkQHTfd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"132-BcOiX0ikPIQXV1nJ+MapChMMjdc\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 306,
    "path": "../public/_nuxt/episode-_e_id_.BGkQHTfd.css"
  },
  "/_nuxt/error-404.C3V-3Mc4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"de4-tk05rgubWwonEl8hX4lgLuosKN0\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 3556,
    "path": "../public/_nuxt/error-404.C3V-3Mc4.css"
  },
  "/_nuxt/error-500.dGVH929u.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75c-KF6NWZfD3QI/4EI5b2MfK1uNuAg\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 1884,
    "path": "../public/_nuxt/error-500.dGVH929u.css"
  },
  "/_nuxt/favorite.DOryi4oI.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"77-jyQNKlVBofpS4ZEeIBXo3rRkVz0\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 119,
    "path": "../public/_nuxt/favorite.DOryi4oI.css"
  },
  "/_nuxt/gOa3Yz9U.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2fa58-Lzfizv3ewHy+8SYzdUBl4xlawRE\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 195160,
    "path": "../public/_nuxt/gOa3Yz9U.js"
  },
  "/_nuxt/h2UQyw6P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6fc-G6Obv/nhaJnVM2P9fmkSe7Up9TU\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 1788,
    "path": "../public/_nuxt/h2UQyw6P.js"
  },
  "/_nuxt/hdsyEllQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19ae-6OKZ0SbZb1jfPlYnTBhxxVMjuzA\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 6574,
    "path": "../public/_nuxt/hdsyEllQ.js"
  },
  "/_nuxt/i22b9gbM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3a09-7ZxiBDWBDjGIlKaydyKoPWS2n2w\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 14857,
    "path": "../public/_nuxt/i22b9gbM.js"
  },
  "/_nuxt/i5HCB2tm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2638-hxhIsiMNH1IxRY4XxJRxHIMm4i8\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 9784,
    "path": "../public/_nuxt/i5HCB2tm.js"
  },
  "/_nuxt/iL6rllz4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9c2-Rg9A0D3pWHCuU3+qxNq1fW5Ghpc\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 2498,
    "path": "../public/_nuxt/iL6rllz4.js"
  },
  "/_nuxt/index.BIT0BAQX.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a-B0Vwfs7JAozhx3cpslg2I1yJpKA\"",
    "mtime": "2025-09-16T13:49:16.540Z",
    "size": 58,
    "path": "../public/_nuxt/index.BIT0BAQX.css"
  },
  "/_nuxt/index.CdCFola1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"21-wzuGt0w4DNVuA0ZRcM8yGb2XAy8\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 33,
    "path": "../public/_nuxt/index.CdCFola1.css"
  },
  "/_nuxt/index.CjXw_5Oi.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a-mJvFm/TehTNvK6AV/56s5Ed35c4\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 58,
    "path": "../public/_nuxt/index.CjXw_5Oi.css"
  },
  "/_nuxt/index.DbwKyawg.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"97-Egg019lU5S04/RjptXVxXmXtftc\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 151,
    "path": "../public/_nuxt/index.DbwKyawg.css"
  },
  "/_nuxt/j_FrBdja.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f3e-9UN987wZ9NUSfixL6r55mgtpjeU\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 3902,
    "path": "../public/_nuxt/j_FrBdja.js"
  },
  "/_nuxt/location-_l_id_.DMcZRB-Q.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ea-5rryHUMU1IF/YmDCHtlh3r8D1vw\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 234,
    "path": "../public/_nuxt/location-_l_id_.DMcZRB-Q.css"
  },
  "/_nuxt/mLcCfA0-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a55-EkjrtPhCERa9y/xUQDctVcW9Aro\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 6741,
    "path": "../public/_nuxt/mLcCfA0-.js"
  },
  "/_nuxt/qxjzWB4B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"165b-fsr5Z/JsWtdIsRoHGtYxGRJLn/8\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 5723,
    "path": "../public/_nuxt/qxjzWB4B.js"
  },
  "/_nuxt/rf8nNrOk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"33ab-Lw2JxZb8sGdzGpDLmKAdu7265aA\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 13227,
    "path": "../public/_nuxt/rf8nNrOk.js"
  },
  "/_nuxt/s1PdnzAn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3c8-K7yF6KJUPJ9Pd8FrHPM0/BYWNu8\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 968,
    "path": "../public/_nuxt/s1PdnzAn.js"
  },
  "/_nuxt/sH2JAGjN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3e37-w9DltSQkPwTfFfsXvOYvcVYYZME\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 15927,
    "path": "../public/_nuxt/sH2JAGjN.js"
  },
  "/_nuxt/t4fommln.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"25bc-9BDim7p54ta8dYP9gy2dIzMOWpw\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 9660,
    "path": "../public/_nuxt/t4fommln.js"
  },
  "/_nuxt/u4bm_LMz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c069-NO7BKPxZ6EajANnujLSOj25+PSY\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 49257,
    "path": "../public/_nuxt/u4bm_LMz.js"
  },
  "/_nuxt/vYMVKWp1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"867-Y/VDmZYvBLCFUU7/e2EdJnUe8mQ\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 2151,
    "path": "../public/_nuxt/vYMVKWp1.js"
  },
  "/_nuxt/vocl-2a6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5dd6-7SlJacaH1w3KXPlmSuEoazqtpKs\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 24022,
    "path": "../public/_nuxt/vocl-2a6.js"
  },
  "/_nuxt/wyhl1mRA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"238-TBxG2Xh6hy03yQxuKo8v/hEtRV4\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 568,
    "path": "../public/_nuxt/wyhl1mRA.js"
  },
  "/_nuxt/xKr5uT9z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-ujNJ6yMsDcokCM0QJRvATUcZTCk\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 180,
    "path": "../public/_nuxt/xKr5uT9z.js"
  },
  "/_nuxt/xfgw03QH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1515-o6VUqGeExBlU9ChSi4wObD3S6Z8\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 5397,
    "path": "../public/_nuxt/xfgw03QH.js"
  },
  "/_nuxt/yA8e6OR-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1595-a9IolQ4XJ+hiG9GENeinGPmHfLw\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 5525,
    "path": "../public/_nuxt/yA8e6OR-.js"
  },
  "/_nuxt/yLioyJ2E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10a4-fm3neGvCzwPlKmJCWIJPkfz4S+Q\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 4260,
    "path": "../public/_nuxt/yLioyJ2E.js"
  },
  "/_nuxt/zchoCBdH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4376-zfuC1U/Ge71ZRyAuYsHgr0zadWE\"",
    "mtime": "2025-09-16T13:49:16.544Z",
    "size": 17270,
    "path": "../public/_nuxt/zchoCBdH.js"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-7peMBrNdgrfDGIK2u3obS6YBC3E\"",
    "mtime": "2025-09-16T13:49:16.424Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/38043fff-9185-44fd-a3bd-6cad3686e595.json": {
    "type": "application/json",
    "etag": "\"8b-vXht9MPE4qHijTxoM8mUFJZVcSM\"",
    "mtime": "2025-09-16T13:49:16.416Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/38043fff-9185-44fd-a3bd-6cad3686e595.json"
  }
};

const _DRIVE_LETTER_START_RE$1 = /^[A-Za-z]:\//;
function normalizeWindowsPath$1(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE$1, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve$1 = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath$1(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath$1(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_fonts/":{"maxAge":31536000},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _FHn8hs = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const basename = function(p, extension) {
  const lastSegment = normalizeWindowsPath(p).split("/").pop();
  return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
};

const collections = {
  'bi': () => import('../_/icons.mjs').then(m => m.default),
};

const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _OgPRwo = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError$1({ status: 400, message: "Invalid icon request" });
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = url.searchParams.get("icons")?.split(",");
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      );
      consola.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError$1({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola.error(e);
      if (e.status === 404)
        return createError$1({ status: 404 });
      else
        return createError$1({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError$1({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const _a7HhZF = defineEventHandler(async (e) => {
  if (e.context.siteConfig)
    return;
  const runtimeConfig = useRuntimeConfig(e);
  const config = runtimeConfig["nuxt-site-config"];
  const nitroApp = useNitroApp();
  const siteConfig = createSiteConfigStack({
    debug: config.debug
  });
  const appConfig = useAppConfig(e);
  const nitroOrigin = useNitroOrigin(e);
  e.context.siteConfigNitroOrigin = nitroOrigin;
  {
    siteConfig.push({
      _context: "nitro:init",
      _priority: -4,
      url: nitroOrigin
    });
  }
  siteConfig.push({
    _context: "runtimeEnv",
    _priority: 0,
    ...runtimeConfig.site || {},
    ...runtimeConfig.public.site || {},
    // @ts-expect-error untyped
    ...envSiteConfig(globalThis._importMeta_.env)
    // just in-case, shouldn't be needed
  });
  const buildStack = config.stack || [];
  buildStack.forEach((c) => siteConfig.push(c));
  if (appConfig.site) {
    siteConfig.push({
      _priority: -2,
      _context: "app:config",
      ...appConfig.site
    });
  }
  if (e.context._nitro.routeRules.site) {
    siteConfig.push({
      _context: "route-rules",
      ...e.context._nitro.routeRules.site
    });
  }
  const ctx = { siteConfig, event: e };
  await nitroApp.hooks.callHook("site-config:init", ctx);
  e.context.siteConfig = ctx.siteConfig;
});

createConsola({
  defaults: {
    tag: "@nuxt/sitemap"
  }
});
const merger = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value))
    obj[key] = Array.from(/* @__PURE__ */ new Set([...obj[key], ...value]));
  return obj[key];
});
function mergeOnKey(arr, key) {
  const res = {};
  arr.forEach((item) => {
    const k = item[key];
    res[k] = merger(item, res[k] || {});
  });
  return Object.values(res);
}
function splitForLocales(path, locales) {
  const prefix = withLeadingSlash(path).split("/")[1];
  if (locales.includes(prefix))
    return [prefix, path.replace(`/${prefix}`, "")];
  return [null, path];
}
const StringifiedRegExpPattern = /\/(.*?)\/([gimsuy]*)$/;
function normalizeRuntimeFilters(input) {
  return (input || []).map((rule) => {
    if (rule instanceof RegExp || typeof rule === "string")
      return rule;
    const match = rule.regex.match(StringifiedRegExpPattern);
    if (match)
      return new RegExp(match[1], match[2]);
    return false;
  }).filter(Boolean);
}
function createPathFilter(options = {}) {
  const urlFilter = createFilter(options);
  return (loc) => {
    let path = loc;
    try {
      path = parseURL(loc).pathname;
    } catch {
      return false;
    }
    return urlFilter(path);
  };
}
function createFilter(options = {}) {
  const include = options.include || [];
  const exclude = options.exclude || [];
  if (include.length === 0 && exclude.length === 0)
    return () => true;
  return function(path) {
    for (const v of [{ rules: exclude, result: false }, { rules: include, result: true }]) {
      const regexRules = v.rules.filter((r) => r instanceof RegExp);
      if (regexRules.some((r) => r.test(path)))
        return v.result;
      const stringRules = v.rules.filter((r) => typeof r === "string");
      if (stringRules.length > 0) {
        const routes = {};
        for (const r of stringRules) {
          if (r === path)
            return v.result;
          routes[r] = true;
        }
        const routeRulesMatcher = toRouteMatcher(createRouter$1({ routes, strictTrailingSlash: false }));
        if (routeRulesMatcher.matchAll(path).length > 0)
          return Boolean(v.result);
      }
    }
    return include.length === 0;
  };
}

function useSimpleSitemapRuntimeConfig(e) {
  const clone = JSON.parse(JSON.stringify(useRuntimeConfig(e).sitemap));
  for (const k in clone.sitemaps) {
    const sitemap = clone.sitemaps[k];
    sitemap.include = normalizeRuntimeFilters(sitemap.include);
    sitemap.exclude = normalizeRuntimeFilters(sitemap.exclude);
    clone.sitemaps[k] = sitemap;
  }
  return Object.freeze(clone);
}

const _Kx6Wf4 = defineEventHandler(async (e) => {
  const fixPath = createSitePathResolver(e, { absolute: false, withBase: true });
  const { sitemapName: fallbackSitemapName, cacheMaxAgeSeconds, version, xslColumns, xslTips } = useSimpleSitemapRuntimeConfig();
  setHeader(e, "Content-Type", "application/xslt+xml");
  if (cacheMaxAgeSeconds)
    setHeader(e, "Cache-Control", `public, max-age=${cacheMaxAgeSeconds}, must-revalidate`);
  else
    setHeader(e, "Cache-Control", `no-cache, no-store`);
  const { name: siteName, url: siteUrl } = useSiteConfig(e);
  const referrer = getHeader(e, "Referer") || "/";
  const referrerPath = parseURL(referrer).pathname;
  const isNotIndexButHasIndex = referrerPath !== "/sitemap.xml" && referrerPath !== "/sitemap_index.xml" && referrerPath.endsWith(".xml");
  const sitemapName = parseURL(referrer).pathname.split("/").pop()?.split("-sitemap")[0] || fallbackSitemapName;
  const title = `${siteName}${sitemapName !== "sitemap.xml" ? ` - ${sitemapName === "sitemap_index.xml" ? "index" : sitemapName}` : ""}`.replace(/&/g, "&amp;");
  const canonicalQuery = getQuery$1(referrer).canonical;
  const isShowingCanonical = typeof canonicalQuery !== "undefined" && canonicalQuery !== "false";
  const conditionalTips = [
    'You are looking at a <a href="https://developer.mozilla.org/en-US/docs/Web/XSLT/Transforming_XML_with_XSLT/An_Overview" style="color: #398465" target="_blank">XML stylesheet</a>. Read the <a href="https://nuxtseo.com/sitemap/guides/customising-ui" style="color: #398465" target="_blank">docs</a> to learn how to customize it. View the page source to see the raw XML.',
    `URLs missing? Check Nuxt Devtools Sitemap tab (or the <a href="${withQuery("/__sitemap__/debug.json", { sitemap: sitemapName })}" style="color: #398465" target="_blank">debug endpoint</a>).`
  ];
  if (!isShowingCanonical) {
    const canonicalPreviewUrl = withQuery(referrer, { canonical: "" });
    conditionalTips.push(`Your canonical site URL is <strong>${siteUrl}</strong>.`);
    conditionalTips.push(`You can preview your canonical sitemap by visiting <a href="${canonicalPreviewUrl}" style="color: #398465; white-space: nowrap;">${fixPath(canonicalPreviewUrl)}?canonical</a>`);
  } else {
    conditionalTips.push(`You are viewing the canonical sitemap. You can switch to using the request origin: <a href="${fixPath(referrer)}" style="color: #398465; white-space: nowrap ">${fixPath(referrer)}</a>`);
  }
  let columns = [...xslColumns];
  if (!columns.length) {
    columns = [
      { label: "URL", width: "50%" },
      { label: "Images", width: "25%", select: "count(image:image)" },
      { label: "Last Updated", width: "25%", select: "concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))" }
    ];
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          body {
            font-family: Inter, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: #333;
          }

          table {
            border: none;
            border-collapse: collapse;
          }

          .bg-yellow-200 {
            background-color: #fef9c3;
          }

          .p-5 {
            padding: 1.25rem;
          }

          .rounded {
            border-radius: 4px;
            }

          .shadow {
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }

          #sitemap tr:nth-child(odd) td {
            background-color: #f8f8f8 !important;
          }

          #sitemap tbody tr:hover td {
            background-color: #fff;
          }

          #sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
            color: #000;
          }

          .expl a {
            color: #398465
            font-weight: 600;
          }

          .expl a:visited {
            color: #398465
          }

          a {
            color: #000;
            text-decoration: none;
          }

          a:visited {
            color: #777;
          }

          a:hover {
            text-decoration: underline;
          }

          td {
            font-size: 12px;
          }

          .text-2xl {
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.25;
          }

          th {
            text-align: left;
            padding-right: 30px;
            font-size: 12px;
          }

          thead th {
            border-bottom: 1px solid #000;
          }
          .fixed { position: fixed; }
          .right-2 { right: 2rem; }
          .top-2 { top: 2rem; }
          .w-30 { width: 30rem; }
          p { margin: 0; }
          li { padding-bottom: 0.5rem; line-height: 1.5; }
          h1 { margin: 0; }
          .mb-5 { margin-bottom: 1.25rem; }
          .mb-3 { margin-bottom: 0.75rem; }
        </style>
      </head>
      <body>
        <div style="grid-template-columns: 1fr 1fr; display: grid; margin: 3rem;">
            <div>
             <div id="content">
          <h1 class="text-2xl mb-3">XML Sitemap</h1>
          <h2>${title}</h2>
          ${isNotIndexButHasIndex ? `<p style="font-size: 12px; margin-bottom: 1rem;"><a href="${fixPath("/sitemap_index.xml")}">${fixPath("/sitemap_index.xml")}</a></p>` : ""}
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <p class="expl" style="margin-bottom: 1rem;">
              This XML Sitemap Index file contains
              <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.
            </p>
            <table id="sitemap" cellpadding="3">
              <thead>
                <tr>
                  <th width="75%">Sitemap</th>
                  <th width="25%">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <xsl:variable name="sitemapURL">
                    <xsl:value-of select="sitemap:loc"/>
                  </xsl:variable>
                  <tr>
                    <td>
                      <a href="{$sitemapURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:value-of
                        select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
            <p class="expl" style="margin-bottom: 1rem;">
              This XML Sitemap contains
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
            </p>
            <table id="sitemap" cellpadding="3">
              <thead>
                <tr>
                  ${columns.map((c) => `<th width="${c.width}">${c.label}</th>`).join("\n")}
                </tr>
              </thead>
              <tbody>
                <xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
                <xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    ${columns.filter((c) => c.label !== "URL").map((c) => `<td>
<xsl:value-of select="${c.select}"/>
</td>`).join("\n")}
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
        </div>
                    ${""}
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;
});

function withoutQuery(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher() {
  const { nitro, app } = useRuntimeConfig();
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [path === "/" ? path : withoutTrailingSlash(path), rules])
      )
    })
  );
  return (pathOrUrl) => {
    const path = pathOrUrl[0] === "/" ? pathOrUrl : parseURL(pathOrUrl, app.baseURL).pathname;
    const pathWithoutQuery = withoutQuery(path);
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(pathWithoutQuery === "/" ? pathWithoutQuery : withoutTrailingSlash(pathWithoutQuery), app.baseURL)
    ).reverse());
  };
}

function resolve(s, resolvers) {
  if (typeof s === "undefined" || !resolvers)
    return s;
  s = typeof s === "string" ? s : s.toString();
  if (hasProtocol(s, { acceptRelative: true, strict: false }))
    return resolvers.fixSlashes(s);
  return resolvers.canonicalUrlResolver(s);
}
function removeTrailingSlash(s) {
  return s.replace(/\/(\?|#|$)/, "$1");
}
function preNormalizeEntry(_e, resolvers) {
  const e = typeof _e === "string" ? { loc: _e } : { ..._e };
  if (e.url && !e.loc) {
    e.loc = e.url;
    delete e.url;
  }
  if (typeof e.loc !== "string") {
    e.loc = "";
  }
  e.loc = removeTrailingSlash(e.loc);
  e._abs = hasProtocol(e.loc, { acceptRelative: false, strict: false });
  try {
    e._path = e._abs ? parseURL(e.loc) : parsePath(e.loc);
  } catch (e2) {
    e2._path = null;
  }
  if (e._path) {
    const query = parseQuery(e._path.search);
    const qs = stringifyQuery(query);
    e._relativeLoc = `${encodePath(e._path?.pathname)}${qs.length ? `?${qs}` : ""}`;
    if (e._path.host) {
      e.loc = stringifyParsedURL(e._path);
    } else {
      e.loc = e._relativeLoc;
    }
  } else {
    e.loc = encodeURI(e.loc);
  }
  if (e.loc === "")
    e.loc = `/`;
  e.loc = resolve(e.loc, resolvers);
  e._key = `${e._sitemap || ""}${withoutTrailingSlash(e.loc)}`;
  return e;
}
function normaliseEntry(_e, defaults, resolvers) {
  const e = defu(_e, defaults);
  if (e.lastmod) {
    const date = normaliseDate(e.lastmod);
    if (date)
      e.lastmod = date;
    else
      delete e.lastmod;
  }
  if (!e.lastmod)
    delete e.lastmod;
  e.loc = resolve(e.loc, resolvers);
  if (e.alternatives) {
    e.alternatives = mergeOnKey(e.alternatives.map((e2) => {
      const a = { ...e2 };
      if (typeof a.href === "string")
        a.href = resolve(a.href, resolvers);
      else if (typeof a.href === "object" && a.href)
        a.href = resolve(a.href.href, resolvers);
      return a;
    }), "hreflang");
  }
  if (e.images) {
    e.images = mergeOnKey(e.images.map((i) => {
      i = { ...i };
      i.loc = resolve(i.loc, resolvers);
      return i;
    }), "loc");
  }
  if (e.videos) {
    e.videos = e.videos.map((v) => {
      v = { ...v };
      if (v.content_loc)
        v.content_loc = resolve(v.content_loc, resolvers);
      return v;
    });
  }
  return e;
}
const IS_VALID_W3C_DATE = [
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  /^\d{4}-[01]\d-[0-3]\d$/,
  /^\d{4}-[01]\d$/,
  /^\d{4}$/
];
function isValidW3CDate(d) {
  return IS_VALID_W3C_DATE.some((r) => r.test(d));
}
function normaliseDate(d) {
  if (typeof d === "string") {
    if (d.includes("T")) {
      const t = d.split("T")[1];
      if (!t.includes("+") && !t.includes("-") && !t.includes("Z")) {
        d += "Z";
      }
    }
    if (!isValidW3CDate(d))
      return false;
    d = new Date(d);
    d.setMilliseconds(0);
    if (Number.isNaN(d.getTime()))
      return false;
  }
  const z = (n) => `0${n}`.slice(-2);
  const date = `${d.getUTCFullYear()}-${z(d.getUTCMonth() + 1)}-${z(d.getUTCDate())}`;
  if (d.getUTCHours() > 0 || d.getUTCMinutes() > 0 || d.getUTCSeconds() > 0) {
    return `${date}T${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}Z`;
  }
  return date;
}

async function fetchDataSource(input, event) {
  const context = typeof input.context === "string" ? { name: input.context } : input.context || { name: "fetch" };
  context.tips = context.tips || [];
  const url = typeof input.fetch === "string" ? input.fetch : input.fetch[0];
  const options = typeof input.fetch === "string" ? {} : input.fetch[1];
  const start = Date.now();
  const timeout = options.timeout || 5e3;
  const timeoutController = new AbortController();
  const abortRequestTimeout = setTimeout(() => timeoutController.abort(), timeout);
  let isHtmlResponse = false;
  try {
    const fetchContainer = url.startsWith("/") && event ? event : globalThis;
    const urls = await fetchContainer.$fetch(url, {
      ...options,
      responseType: "json",
      signal: timeoutController.signal,
      headers: defu(options?.headers, {
        Accept: "application/json"
      }, event ? { Host: getRequestHost(event, { xForwardedHost: true }) } : {}),
      // @ts-expect-error untyped
      onResponse({ response }) {
        if (typeof response._data === "string" && response._data.startsWith("<!DOCTYPE html>"))
          isHtmlResponse = true;
      }
    });
    const timeTakenMs = Date.now() - start;
    if (isHtmlResponse) {
      context.tips.push("This is usually because the URL isn't correct or is throwing an error. Please check the URL");
      return {
        ...input,
        context,
        urls: [],
        timeTakenMs,
        error: "Received HTML response instead of JSON"
      };
    }
    return {
      ...input,
      context,
      timeTakenMs,
      urls
    };
  } catch (_err) {
    const error = _err;
    if (error.message.includes("This operation was aborted"))
      context.tips.push("The request has taken too long. Make sure app sources respond within 5 seconds or adjust the timeout fetch option.");
    else
      context.tips.push(`Response returned a status of ${error.response?.status || "unknown"}.`);
    console.error("[@nuxtjs/sitemap] Failed to fetch source.", { url, error });
    return {
      ...input,
      context,
      urls: [],
      error: error.message
    };
  } finally {
    if (abortRequestTimeout) {
      clearTimeout(abortRequestTimeout);
    }
  }
}
function globalSitemapSources() {
  return import('../virtual/global-sources.mjs').then((m) => m.sources);
}
function childSitemapSources(definition) {
  return definition?._hasSourceChunk ? import('../virtual/child-sources.mjs').then((m) => m.sources[definition.sitemapName] || []) : Promise.resolve([]);
}
async function resolveSitemapSources(sources, event) {
  return (await Promise.all(
    sources.map((source) => {
      if (typeof source === "object" && "urls" in source) {
        return {
          timeTakenMs: 0,
          ...source,
          urls: source.urls
        };
      }
      if (source.fetch)
        return fetchDataSource(source, event);
      return {
        ...source,
        error: "Invalid source"
      };
    })
  )).flat();
}

function sortSitemapUrls(urls) {
  return urls.sort(
    (a, b) => {
      const aLoc = typeof a === "string" ? a : a.loc;
      const bLoc = typeof b === "string" ? b : b.loc;
      return aLoc.localeCompare(bLoc, undefined, { numeric: true });
    }
  ).sort((a, b) => {
    const aLoc = (typeof a === "string" ? a : a.loc) || "";
    const bLoc = (typeof b === "string" ? b : b.loc) || "";
    const aSegments = aLoc.split("/").length;
    const bSegments = bLoc.split("/").length;
    if (aSegments > bSegments)
      return 1;
    if (aSegments < bSegments)
      return -1;
    return 0;
  });
}

function resolveKey(k) {
  switch (k) {
    case "images":
      return "image";
    case "videos":
      return "video";
    // news & others?
    case "news":
      return "news";
    default:
      return k;
  }
}
function handleObject(key, obj) {
  return [
    `        <${key}:${key}>`,
    ...Object.entries(obj).map(([sk, sv]) => {
      if (key === "video" && Array.isArray(sv)) {
        return sv.map((v) => {
          if (typeof v === "string") {
            return [
              `            `,
              `<${key}:${sk}>`,
              escapeValueForXml(v),
              `</${key}:${sk}>`
            ].join("");
          }
          const attributes = Object.entries(v).filter(([ssk]) => ssk !== sk).map(([ssk, ssv]) => `${ssk}="${escapeValueForXml(ssv)}"`).join(" ");
          return [
            `            <${key}:${sk} ${attributes}>`,
            // value is the same sk
            v[sk],
            `</${key}:${sk}>`
          ].join("");
        }).join("\n");
      }
      if (typeof sv === "object") {
        if (key === "video") {
          const attributes = Object.entries(sv).filter(([ssk]) => ssk !== sk).map(([ssk, ssv]) => `${ssk}="${escapeValueForXml(ssv)}"`).join(" ");
          return [
            `            <${key}:${sk} ${attributes}>`,
            // value is the same sk
            sv[sk],
            `</${key}:${sk}>`
          ].join("");
        }
        return [
          `            <${key}:${sk}>`,
          ...Object.entries(sv).map(([ssk, ssv]) => `                <${key}:${ssk}>${escapeValueForXml(ssv)}</${key}:${ssk}>`),
          `            </${key}:${sk}>`
        ].join("\n");
      }
      return `            <${key}:${sk}>${escapeValueForXml(sv)}</${key}:${sk}>`;
    }),
    `        </${key}:${key}>`
  ].join("\n");
}
function handleArray(key, arr) {
  if (arr.length === 0)
    return false;
  key = resolveKey(key);
  if (key === "alternatives") {
    return arr.map((obj) => [
      `        <xhtml:link rel="alternate" ${Object.entries(obj).map(([sk, sv]) => `${sk}="${escapeValueForXml(sv)}"`).join(" ")} />`
    ].join("\n")).join("\n");
  }
  return arr.map((obj) => handleObject(key, obj)).join("\n");
}
function handleEntry(k, e) {
  return Array.isArray(e[k]) ? handleArray(k, e[k]) : typeof e[k] === "object" ? handleObject(k, e[k]) : `        <${k}>${escapeValueForXml(e[k])}</${k}>`;
}
function wrapSitemapXml(input, resolvers, options) {
  const xsl = options.xsl ? resolvers.relativeBaseUrlResolver(options.xsl) : false;
  const credits = options.credits;
  input.unshift(`<?xml version="1.0" encoding="UTF-8"?>${xsl ? `<?xml-stylesheet type="text/xsl" href="${xsl}"?>` : ""}`);
  if (credits)
    input.push(`<!-- XML Sitemap generated by @nuxtjs/sitemap v${options.version} at ${(/* @__PURE__ */ new Date()).toISOString()} -->`);
  if (options.minify)
    return input.join("").replace(/(?<!<[^>]*)\s(?![^<]*>)/g, "");
  return input.join("\n");
}
function escapeValueForXml(value) {
  if (value === true || value === false)
    return value ? "yes" : "no";
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function resolveSitemapEntries(sitemap, sources, runtimeConfig, resolvers) {
  const {
    autoI18n,
    isI18nMapped
  } = runtimeConfig;
  const filterPath = createPathFilter({
    include: sitemap.include,
    exclude: sitemap.exclude
  });
  const _urls = sources.flatMap((e) => e.urls).map((_e) => {
    const e = preNormalizeEntry(_e, resolvers);
    if (!e.loc || !filterPath(e.loc))
      return false;
    return e;
  }).filter(Boolean);
  let validI18nUrlsForTransform = [];
  const withoutPrefixPaths = {};
  if (autoI18n && autoI18n.strategy !== "no_prefix") {
    const localeCodes = autoI18n.locales.map((l) => l.code);
    validI18nUrlsForTransform = _urls.map((_e, i) => {
      if (_e._abs)
        return false;
      const split = splitForLocales(_e._relativeLoc, localeCodes);
      let localeCode = split[0];
      const pathWithoutPrefix = split[1];
      if (!localeCode)
        localeCode = autoI18n.defaultLocale;
      const e = _e;
      e._pathWithoutPrefix = pathWithoutPrefix;
      const locale = autoI18n.locales.find((l) => l.code === localeCode);
      if (!locale)
        return false;
      e._locale = locale;
      e._index = i;
      e._key = `${e._sitemap || ""}${e._path?.pathname || "/"}${e._path.search}`;
      withoutPrefixPaths[pathWithoutPrefix] = withoutPrefixPaths[pathWithoutPrefix] || [];
      if (!withoutPrefixPaths[pathWithoutPrefix].some((e2) => e2._locale.code === locale.code))
        withoutPrefixPaths[pathWithoutPrefix].push(e);
      return e;
    }).filter(Boolean);
    for (const e of validI18nUrlsForTransform) {
      if (!e._i18nTransform && !e.alternatives?.length) {
        const alternatives = withoutPrefixPaths[e._pathWithoutPrefix].map((u) => {
          const entries = [];
          if (u._locale.code === autoI18n.defaultLocale) {
            entries.push({
              href: u.loc,
              hreflang: "x-default"
            });
          }
          entries.push({
            href: u.loc,
            hreflang: u._locale._hreflang || autoI18n.defaultLocale
          });
          return entries;
        }).flat().filter(Boolean);
        if (alternatives.length)
          e.alternatives = alternatives;
      } else if (e._i18nTransform) {
        delete e._i18nTransform;
        if (autoI18n.strategy === "no_prefix") ;
        if (autoI18n.differentDomains) {
          e.alternatives = [
            {
              // apply default locale domain
              ...autoI18n.locales.find((l) => [l.code, l.language].includes(autoI18n.defaultLocale)),
              code: "x-default"
            },
            ...autoI18n.locales.filter((l) => !!l.domain)
          ].map((locale) => {
            return {
              hreflang: locale._hreflang,
              href: joinURL(withHttps(locale.domain), e._pathWithoutPrefix)
            };
          });
        } else {
          for (const l of autoI18n.locales) {
            let loc = joinURL(`/${l.code}`, e._pathWithoutPrefix);
            if (autoI18n.differentDomains || ["prefix_and_default", "prefix_except_default"].includes(autoI18n.strategy) && l.code === autoI18n.defaultLocale)
              loc = e._pathWithoutPrefix;
            const _sitemap = isI18nMapped ? l._sitemap : undefined;
            const newEntry = preNormalizeEntry({
              _sitemap,
              ...e,
              _index: undefined,
              _key: `${_sitemap || ""}${loc || "/"}${e._path.search}`,
              _locale: l,
              loc,
              alternatives: [{ code: "x-default", _hreflang: "x-default" }, ...autoI18n.locales].map((locale) => {
                const code = locale.code === "x-default" ? autoI18n.defaultLocale : locale.code;
                const isDefault = locale.code === "x-default" || locale.code === autoI18n.defaultLocale;
                let href = "";
                if (autoI18n.strategy === "prefix") {
                  href = joinURL("/", code, e._pathWithoutPrefix);
                } else if (["prefix_and_default", "prefix_except_default"].includes(autoI18n.strategy)) {
                  if (isDefault) {
                    href = e._pathWithoutPrefix;
                  } else {
                    href = joinURL("/", code, e._pathWithoutPrefix);
                  }
                }
                if (!filterPath(href))
                  return false;
                return {
                  hreflang: locale._hreflang,
                  href
                };
              }).filter(Boolean)
            }, resolvers);
            if (e._locale.code === newEntry._locale.code) {
              _urls[e._index] = newEntry;
              e._index = undefined;
            } else {
              _urls.push(newEntry);
            }
          }
        }
      }
      if (isI18nMapped) {
        e._sitemap = e._sitemap || e._locale._sitemap;
        e._key = `${e._sitemap || ""}${e.loc || "/"}${e._path.search}`;
      }
      if (e._index)
        _urls[e._index] = e;
    }
  }
  return _urls;
}
async function buildSitemapUrls(sitemap, resolvers, runtimeConfig) {
  const {
    sitemaps,
    // enhancing
    autoI18n,
    isI18nMapped,
    isMultiSitemap,
    // sorting
    sortEntries,
    // chunking
    defaultSitemapsChunkSize
  } = runtimeConfig;
  const isChunking = typeof sitemaps.chunks !== "undefined" && !Number.isNaN(Number(sitemap.sitemapName));
  function maybeSort(urls) {
    return sortEntries ? sortSitemapUrls(urls) : urls;
  }
  function maybeSlice(urls) {
    if (isChunking && defaultSitemapsChunkSize) {
      const chunk = Number(sitemap.sitemapName);
      return urls.slice(chunk * defaultSitemapsChunkSize, (chunk + 1) * defaultSitemapsChunkSize);
    }
    return urls;
  }
  if (autoI18n?.differentDomains) {
    const domain = autoI18n.locales.find((e) => [e.language, e.code].includes(sitemap.sitemapName))?.domain;
    if (domain) {
      const _tester = resolvers.canonicalUrlResolver;
      resolvers.canonicalUrlResolver = (path) => resolveSitePath(path, {
        absolute: true,
        withBase: false,
        siteUrl: withHttps(domain),
        trailingSlash: _tester("/test/").endsWith("/"),
        base: "/"
      });
    }
  }
  const sources = sitemap.includeAppSources ? await globalSitemapSources() : [];
  sources.push(...await childSitemapSources(sitemap));
  const resolvedSources = await resolveSitemapSources(sources, resolvers.event);
  const enhancedUrls = resolveSitemapEntries(sitemap, resolvedSources, { autoI18n, isI18nMapped }, resolvers);
  const filteredUrls = enhancedUrls.filter((e) => {
    if (isMultiSitemap && e._sitemap && sitemap.sitemapName)
      return e._sitemap === sitemap.sitemapName;
    return true;
  });
  const sortedUrls = maybeSort(filteredUrls);
  return maybeSlice(sortedUrls);
}
function urlsToXml(urls, resolvers, { version, xsl, credits, minify }) {
  const urlset = urls.map((e) => {
    const keys = Object.keys(e).filter((k) => !k.startsWith("_"));
    return [
      "    <url>",
      keys.map((k) => handleEntry(k, e)).filter(Boolean).join("\n"),
      "    </url>"
    ].join("\n");
  });
  return wrapSitemapXml([
    '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlset.join("\n"),
    "</urlset>"
  ], resolvers, { version, xsl, credits, minify });
}

function useNitroUrlResolvers(e) {
  const canonicalQuery = getQuery(e).canonical;
  const isShowingCanonical = typeof canonicalQuery !== "undefined" && canonicalQuery !== "false";
  const siteConfig = useSiteConfig(e);
  return {
    event: e,
    fixSlashes: (path) => fixSlashes(siteConfig.trailingSlash, path),
    // we need these as they depend on the nitro event
    canonicalUrlResolver: createSitePathResolver(e, {
      canonical: isShowingCanonical || true,
      absolute: true,
      withBase: true
    }),
    relativeBaseUrlResolver: createSitePathResolver(e, { absolute: false, withBase: true })
  };
}
async function createSitemap(event, definition, runtimeConfig) {
  const { sitemapName } = definition;
  const nitro = useNitroApp();
  const resolvers = useNitroUrlResolvers(event);
  let sitemapUrls = await buildSitemapUrls(definition, resolvers, runtimeConfig);
  const routeRuleMatcher = createNitroRouteRuleMatcher();
  const { autoI18n } = runtimeConfig;
  sitemapUrls = sitemapUrls.map((u) => {
    const path = u._path?.pathname || u.loc;
    if (!getPathRobotConfig(event, { path, skipSiteIndexable: true }).indexable)
      return false;
    let routeRules = routeRuleMatcher(path);
    if (autoI18n?.locales && autoI18n?.strategy !== "no_prefix") {
      const match = splitForLocales(path, autoI18n.locales.map((l) => l.code));
      const pathWithoutPrefix = match[1];
      if (pathWithoutPrefix && pathWithoutPrefix !== path)
        routeRules = defu(routeRules, routeRuleMatcher(pathWithoutPrefix));
    }
    if (routeRules.sitemap === false)
      return false;
    if (typeof routeRules.index !== "undefined" && !routeRules.index || typeof routeRules.robots !== "undefined" && !routeRules.robots) {
      return false;
    }
    const hasRobotsDisabled = Object.entries(routeRules.headers || {}).some(([name, value]) => name.toLowerCase() === "x-robots-tag" && value.toLowerCase().includes("noindex"));
    if (routeRules.redirect || hasRobotsDisabled)
      return false;
    return routeRules.sitemap ? defu(u, routeRules.sitemap) : u;
  }).filter(Boolean);
  const resolvedCtx = {
    urls: sitemapUrls,
    sitemapName
  };
  await nitro.hooks.callHook("sitemap:resolved", resolvedCtx);
  const maybeSort = (urls2) => runtimeConfig.sortEntries ? sortSitemapUrls(urls2) : urls2;
  const normalizedPreDedupe = resolvedCtx.urls.map((e) => normaliseEntry(e, definition.defaults, resolvers));
  const urls = maybeSort(mergeOnKey(normalizedPreDedupe, "_key").map((e) => normaliseEntry(e, definition.defaults, resolvers)));
  const sitemap = urlsToXml(urls, resolvers, runtimeConfig);
  const ctx = { sitemap, sitemapName };
  await nitro.hooks.callHook("sitemap:output", ctx);
  setHeader(event, "Content-Type", "text/xml; charset=UTF-8");
  if (runtimeConfig.cacheMaxAgeSeconds)
    setHeader(event, "Cache-Control", `public, max-age=${runtimeConfig.cacheMaxAgeSeconds}, must-revalidate`);
  else
    setHeader(event, "Cache-Control", `no-cache, no-store`);
  event.context._isSitemap = true;
  return ctx.sitemap;
}

const _62QoRs = defineEventHandler(async (e) => {
  const runtimeConfig = useSimpleSitemapRuntimeConfig();
  const { sitemaps } = runtimeConfig;
  if ("index" in sitemaps) {
    return sendRedirect(e, withBase("/sitemap_index.xml", useRuntimeConfig().app.baseURL), 301);
  }
  return createSitemap(e, Object.values(sitemaps)[0], runtimeConfig);
});

const _GyFcCn = defineEventHandler(async (e) => {
  const nitro = useNitroApp();
  const { indexable, hints } = getSiteRobotConfig(e);
  const { credits, usingNuxtContent, cacheControl } = useRuntimeConfig(e)["nuxt-robots"];
  let robotsTxtCtx = {
    errors: [],
    sitemaps: [],
    groups: [
      {
        allow: [],
        comment: [],
        userAgent: ["*"],
        disallow: ["/"]
      }
    ]
  };
  if (indexable) {
    robotsTxtCtx = await resolveRobotsTxtContext(e);
    robotsTxtCtx.sitemaps = [...new Set(
      asArray(robotsTxtCtx.sitemaps).map((s) => !s.startsWith("http") ? withSiteUrl(e, s, { withBase: true, absolute: true }) : s)
    )];
    if (usingNuxtContent) {
      const contentWithRobotRules = await e.$fetch("/__robots__/nuxt-content.json", {
        headers: {
          Accept: "application/json"
        }
      });
      for (const group of robotsTxtCtx.groups) {
        if (group.userAgent.includes("*")) {
          group.disallow.push(...contentWithRobotRules);
          group.disallow = group.disallow.filter(Boolean);
        }
      }
    }
  }
  let robotsTxt = generateRobotsTxt(robotsTxtCtx);
  if (credits) {
    robotsTxt = [
      `# START nuxt-robots (${indexable ? "indexable" : "indexing disabled"})`,
      robotsTxt,
      "# END nuxt-robots"
    ].filter(Boolean).join("\n");
  }
  setHeader(e, "Content-Type", "text/plain; charset=utf-8");
  setHeader(e, "Cache-Control", globalThis._importMeta_.test || !cacheControl ? "no-store" : cacheControl);
  const hookCtx = { robotsTxt, e };
  await nitro.hooks.callHook("robots:robots-txt", hookCtx);
  return hookCtx.robotsTxt;
});

const _ezGB5Y = defineEventHandler(async (e) => {
  if (e.path === "/robots.txt" || e.path.startsWith("/__") || e.path.startsWith("/api") || e.path.startsWith("/_nuxt"))
    return;
  const robotConfig = getPathRobotConfig(e);
  const nuxtRobotsConfig = useRuntimeConfig(e)["nuxt-robots"];
  if (nuxtRobotsConfig) {
    const { header } = nuxtRobotsConfig;
    if (header) {
      setHeader(e, "X-Robots-Tag", robotConfig.rule);
    }
    e.context.robots = robotConfig;
  }
});

const _32mCLt = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {};
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map((dir) => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, globalThis._importMeta_.url))) : undefined;
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : undefined;
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : undefined;
  if (!fsStorage && !httpStorage) {
    throw new Error("IPX storage is not configured!");
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  };
  const ipx = createIPX(ipxOptions);
  const ipxHandler = createIPXH3Handler(ipx);
  return useBase(opts.baseURL, ipxHandler);
});

const _lazy_SHirA0 = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '', handler: _FHn8hs, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_SHirA0, lazy: true, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _OgPRwo, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _a7HhZF, lazy: false, middleware: true, method: undefined },
  { route: '/__sitemap__/style.xsl', handler: _Kx6Wf4, lazy: false, middleware: false, method: undefined },
  { route: '/sitemap.xml', handler: _62QoRs, lazy: false, middleware: false, method: undefined },
  { route: '/robots.txt', handler: _GyFcCn, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _ezGB5Y, lazy: false, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _32mCLt, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_SHirA0, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (input, init) => _localFetch(input, init).then(
    (response) => normalizeFetchResponse(response)
  );
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        destroy(socket);
      }
    }
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        destroy(socket);
      }
    }
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    if (options.development) {
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $fetch$1 as $, getCookie as A, deleteCookie as B, toRouteMatcher as C, createRouter$1 as D, withLeadingSlash as E, withTrailingSlash as F, encodeParam as G, parseURL as H, encodePath as I, parseQuery as J, withoutTrailingSlash as K, nodeServer as L, getRouteRules as a, buildAssetsURL as b, createError$1 as c, defineRenderHandler as d, getResponseStatus as e, getResponseStatusText as f, getQuery as g, useNitroApp as h, baseURL as i, hasProtocol as j, isScriptProtocol as k, joinURL as l, klona as m, defu as n, defuFn as o, publicAssetsURL as p, getContext as q, createHooks as r, sanitizeStatusCode as s, parse as t, useRuntimeConfig as u, getRequestHeader as v, withQuery as w, destr as x, isEqual as y, setCookie as z };
//# sourceMappingURL=nitro.mjs.map
