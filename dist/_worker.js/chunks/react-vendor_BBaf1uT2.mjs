globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDefaultExportFromCjs } from './astro/server_BhDrV1PX.mjs';
import { c as composeEventHandlers, a as clamp$1 } from './ui-vendor_DegK_Zk8.mjs';

function _mergeNamespaces(n, m) {
	for (var i = 0; i < m.length; i++) {
		const e = m[i];
		if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
			if (k !== 'default' && !(k in n)) {
				const d = Object.getOwnPropertyDescriptor(e, k);
				if (d) {
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: () => e[k]
					});
				}
			}
		} }
	}
	return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

var react = {exports: {}};

var react_production = {};

/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReact_production;

function requireReact_production () {
	if (hasRequiredReact_production) return react_production;
	hasRequiredReact_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
	  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	  REACT_MEMO_TYPE = Symbol.for("react.memo"),
	  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
	  MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
	  if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
	  maybeIterable =
	    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
	    maybeIterable["@@iterator"];
	  return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
	    isMounted: function () {
	      return false;
	    },
	    enqueueForceUpdate: function () {},
	    enqueueReplaceState: function () {},
	    enqueueSetState: function () {}
	  },
	  assign = Object.assign,
	  emptyObject = {};
	function Component(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  this.refs = emptyObject;
	  this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function (partialState, callback) {
	  if (
	    "object" !== typeof partialState &&
	    "function" !== typeof partialState &&
	    null != partialState
	  )
	    throw Error(
	      "takes an object of state variables to update or a function which returns an object of state variables."
	    );
	  this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function (callback) {
	  this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  this.refs = emptyObject;
	  this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = true;
	var isArrayImpl = Array.isArray,
	  ReactSharedInternals = { H: null, A: null, T: null, S: null, V: null },
	  hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, self, source, owner, props) {
	  self = props.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== self ? self : null,
	    props: props
	  };
	}
	function cloneAndReplaceKey(oldElement, newKey) {
	  return ReactElement(
	    oldElement.type,
	    newKey,
	    void 0,
	    void 0,
	    void 0,
	    oldElement.props
	  );
	}
	function isValidElement(object) {
	  return (
	    "object" === typeof object &&
	    null !== object &&
	    object.$$typeof === REACT_ELEMENT_TYPE
	  );
	}
	function escape(key) {
	  var escaperLookup = { "=": "=0", ":": "=2" };
	  return (
	    "$" +
	    key.replace(/[=:]/g, function (match) {
	      return escaperLookup[match];
	    })
	  );
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
	  return "object" === typeof element && null !== element && null != element.key
	    ? escape("" + element.key)
	    : index.toString(36);
	}
	function noop$1() {}
	function resolveThenable(thenable) {
	  switch (thenable.status) {
	    case "fulfilled":
	      return thenable.value;
	    case "rejected":
	      throw thenable.reason;
	    default:
	      switch (
	        ("string" === typeof thenable.status
	          ? thenable.then(noop$1, noop$1)
	          : ((thenable.status = "pending"),
	            thenable.then(
	              function (fulfilledValue) {
	                "pending" === thenable.status &&
	                  ((thenable.status = "fulfilled"),
	                  (thenable.value = fulfilledValue));
	              },
	              function (error) {
	                "pending" === thenable.status &&
	                  ((thenable.status = "rejected"), (thenable.reason = error));
	              }
	            )),
	        thenable.status)
	      ) {
	        case "fulfilled":
	          return thenable.value;
	        case "rejected":
	          throw thenable.reason;
	      }
	  }
	  throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
	  var type = typeof children;
	  if ("undefined" === type || "boolean" === type) children = null;
	  var invokeCallback = false;
	  if (null === children) invokeCallback = true;
	  else
	    switch (type) {
	      case "bigint":
	      case "string":
	      case "number":
	        invokeCallback = true;
	        break;
	      case "object":
	        switch (children.$$typeof) {
	          case REACT_ELEMENT_TYPE:
	          case REACT_PORTAL_TYPE:
	            invokeCallback = true;
	            break;
	          case REACT_LAZY_TYPE:
	            return (
	              (invokeCallback = children._init),
	              mapIntoArray(
	                invokeCallback(children._payload),
	                array,
	                escapedPrefix,
	                nameSoFar,
	                callback
	              )
	            );
	        }
	    }
	  if (invokeCallback)
	    return (
	      (callback = callback(children)),
	      (invokeCallback =
	        "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar),
	      isArrayImpl(callback)
	        ? ((escapedPrefix = ""),
	          null != invokeCallback &&
	            (escapedPrefix =
	              invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"),
	          mapIntoArray(callback, array, escapedPrefix, "", function (c) {
	            return c;
	          }))
	        : null != callback &&
	          (isValidElement(callback) &&
	            (callback = cloneAndReplaceKey(
	              callback,
	              escapedPrefix +
	                (null == callback.key ||
	                (children && children.key === callback.key)
	                  ? ""
	                  : ("" + callback.key).replace(
	                      userProvidedKeyEscapeRegex,
	                      "$&/"
	                    ) + "/") +
	                invokeCallback
	            )),
	          array.push(callback)),
	      1
	    );
	  invokeCallback = 0;
	  var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
	  if (isArrayImpl(children))
	    for (var i = 0; i < children.length; i++)
	      (nameSoFar = children[i]),
	        (type = nextNamePrefix + getElementKey(nameSoFar, i)),
	        (invokeCallback += mapIntoArray(
	          nameSoFar,
	          array,
	          escapedPrefix,
	          type,
	          callback
	        ));
	  else if (((i = getIteratorFn(children)), "function" === typeof i))
	    for (
	      children = i.call(children), i = 0;
	      !(nameSoFar = children.next()).done;

	    )
	      (nameSoFar = nameSoFar.value),
	        (type = nextNamePrefix + getElementKey(nameSoFar, i++)),
	        (invokeCallback += mapIntoArray(
	          nameSoFar,
	          array,
	          escapedPrefix,
	          type,
	          callback
	        ));
	  else if ("object" === type) {
	    if ("function" === typeof children.then)
	      return mapIntoArray(
	        resolveThenable(children),
	        array,
	        escapedPrefix,
	        nameSoFar,
	        callback
	      );
	    array = String(children);
	    throw Error(
	      "Objects are not valid as a React child (found: " +
	        ("[object Object]" === array
	          ? "object with keys {" + Object.keys(children).join(", ") + "}"
	          : array) +
	        "). If you meant to render a collection of children, use an array instead."
	    );
	  }
	  return invokeCallback;
	}
	function mapChildren(children, func, context) {
	  if (null == children) return children;
	  var result = [],
	    count = 0;
	  mapIntoArray(children, result, "", "", function (child) {
	    return func.call(context, child, count++);
	  });
	  return result;
	}
	function lazyInitializer(payload) {
	  if (-1 === payload._status) {
	    var ctor = payload._result;
	    ctor = ctor();
	    ctor.then(
	      function (moduleObject) {
	        if (0 === payload._status || -1 === payload._status)
	          (payload._status = 1), (payload._result = moduleObject);
	      },
	      function (error) {
	        if (0 === payload._status || -1 === payload._status)
	          (payload._status = 2), (payload._result = error);
	      }
	    );
	    -1 === payload._status && ((payload._status = 0), (payload._result = ctor));
	  }
	  if (1 === payload._status) return payload._result.default;
	  throw payload._result;
	}
	var reportGlobalError =
	  "function" === typeof reportError
	    ? reportError
	    : function (error) {
	        if (
	          "object" === typeof window &&
	          "function" === typeof window.ErrorEvent
	        ) {
	          var event = new window.ErrorEvent("error", {
	            bubbles: true,
	            cancelable: true,
	            message:
	              "object" === typeof error &&
	              null !== error &&
	              "string" === typeof error.message
	                ? String(error.message)
	                : String(error),
	            error: error
	          });
	          if (!window.dispatchEvent(event)) return;
	        } else if (
	          "object" === typeof process &&
	          "function" === typeof process.emit
	        ) {
	          process.emit("uncaughtException", error);
	          return;
	        }
	        console.error(error);
	      };
	function noop() {}
	react_production.Children = {
	  map: mapChildren,
	  forEach: function (children, forEachFunc, forEachContext) {
	    mapChildren(
	      children,
	      function () {
	        forEachFunc.apply(this, arguments);
	      },
	      forEachContext
	    );
	  },
	  count: function (children) {
	    var n = 0;
	    mapChildren(children, function () {
	      n++;
	    });
	    return n;
	  },
	  toArray: function (children) {
	    return (
	      mapChildren(children, function (child) {
	        return child;
	      }) || []
	    );
	  },
	  only: function (children) {
	    if (!isValidElement(children))
	      throw Error(
	        "React.Children.only expected to receive a single React element child."
	      );
	    return children;
	  }
	};
	react_production.Component = Component;
	react_production.Fragment = REACT_FRAGMENT_TYPE;
	react_production.Profiler = REACT_PROFILER_TYPE;
	react_production.PureComponent = PureComponent;
	react_production.StrictMode = REACT_STRICT_MODE_TYPE;
	react_production.Suspense = REACT_SUSPENSE_TYPE;
	react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
	  ReactSharedInternals;
	react_production.__COMPILER_RUNTIME = {
	  __proto__: null,
	  c: function (size) {
	    return ReactSharedInternals.H.useMemoCache(size);
	  }
	};
	react_production.cache = function (fn) {
	  return function () {
	    return fn.apply(null, arguments);
	  };
	};
	react_production.cloneElement = function (element, config, children) {
	  if (null === element || void 0 === element)
	    throw Error(
	      "The argument must be a React element, but you passed " + element + "."
	    );
	  var props = assign({}, element.props),
	    key = element.key,
	    owner = void 0;
	  if (null != config)
	    for (propName in (void 0 !== config.ref && (owner = void 0),
	    void 0 !== config.key && (key = "" + config.key),
	    config))
	      !hasOwnProperty.call(config, propName) ||
	        "key" === propName ||
	        "__self" === propName ||
	        "__source" === propName ||
	        ("ref" === propName && void 0 === config.ref) ||
	        (props[propName] = config[propName]);
	  var propName = arguments.length - 2;
	  if (1 === propName) props.children = children;
	  else if (1 < propName) {
	    for (var childArray = Array(propName), i = 0; i < propName; i++)
	      childArray[i] = arguments[i + 2];
	    props.children = childArray;
	  }
	  return ReactElement(element.type, key, void 0, void 0, owner, props);
	};
	react_production.createContext = function (defaultValue) {
	  defaultValue = {
	    $$typeof: REACT_CONTEXT_TYPE,
	    _currentValue: defaultValue,
	    _currentValue2: defaultValue,
	    _threadCount: 0,
	    Provider: null,
	    Consumer: null
	  };
	  defaultValue.Provider = defaultValue;
	  defaultValue.Consumer = {
	    $$typeof: REACT_CONSUMER_TYPE,
	    _context: defaultValue
	  };
	  return defaultValue;
	};
	react_production.createElement = function (type, config, children) {
	  var propName,
	    props = {},
	    key = null;
	  if (null != config)
	    for (propName in (void 0 !== config.key && (key = "" + config.key), config))
	      hasOwnProperty.call(config, propName) &&
	        "key" !== propName &&
	        "__self" !== propName &&
	        "__source" !== propName &&
	        (props[propName] = config[propName]);
	  var childrenLength = arguments.length - 2;
	  if (1 === childrenLength) props.children = children;
	  else if (1 < childrenLength) {
	    for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
	      childArray[i] = arguments[i + 2];
	    props.children = childArray;
	  }
	  if (type && type.defaultProps)
	    for (propName in ((childrenLength = type.defaultProps), childrenLength))
	      void 0 === props[propName] &&
	        (props[propName] = childrenLength[propName]);
	  return ReactElement(type, key, void 0, void 0, null, props);
	};
	react_production.createRef = function () {
	  return { current: null };
	};
	react_production.forwardRef = function (render) {
	  return { $$typeof: REACT_FORWARD_REF_TYPE, render: render };
	};
	react_production.isValidElement = isValidElement;
	react_production.lazy = function (ctor) {
	  return {
	    $$typeof: REACT_LAZY_TYPE,
	    _payload: { _status: -1, _result: ctor },
	    _init: lazyInitializer
	  };
	};
	react_production.memo = function (type, compare) {
	  return {
	    $$typeof: REACT_MEMO_TYPE,
	    type: type,
	    compare: void 0 === compare ? null : compare
	  };
	};
	react_production.startTransition = function (scope) {
	  var prevTransition = ReactSharedInternals.T,
	    currentTransition = {};
	  ReactSharedInternals.T = currentTransition;
	  try {
	    var returnValue = scope(),
	      onStartTransitionFinish = ReactSharedInternals.S;
	    null !== onStartTransitionFinish &&
	      onStartTransitionFinish(currentTransition, returnValue);
	    "object" === typeof returnValue &&
	      null !== returnValue &&
	      "function" === typeof returnValue.then &&
	      returnValue.then(noop, reportGlobalError);
	  } catch (error) {
	    reportGlobalError(error);
	  } finally {
	    ReactSharedInternals.T = prevTransition;
	  }
	};
	react_production.unstable_useCacheRefresh = function () {
	  return ReactSharedInternals.H.useCacheRefresh();
	};
	react_production.use = function (usable) {
	  return ReactSharedInternals.H.use(usable);
	};
	react_production.useActionState = function (action, initialState, permalink) {
	  return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	react_production.useCallback = function (callback, deps) {
	  return ReactSharedInternals.H.useCallback(callback, deps);
	};
	react_production.useContext = function (Context) {
	  return ReactSharedInternals.H.useContext(Context);
	};
	react_production.useDebugValue = function () {};
	react_production.useDeferredValue = function (value, initialValue) {
	  return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	react_production.useEffect = function (create, createDeps, update) {
	  var dispatcher = ReactSharedInternals.H;
	  if ("function" === typeof update)
	    throw Error(
	      "useEffect CRUD overload is not enabled in this build of React."
	    );
	  return dispatcher.useEffect(create, createDeps);
	};
	react_production.useId = function () {
	  return ReactSharedInternals.H.useId();
	};
	react_production.useImperativeHandle = function (ref, create, deps) {
	  return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	react_production.useInsertionEffect = function (create, deps) {
	  return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	react_production.useLayoutEffect = function (create, deps) {
	  return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	react_production.useMemo = function (create, deps) {
	  return ReactSharedInternals.H.useMemo(create, deps);
	};
	react_production.useOptimistic = function (passthrough, reducer) {
	  return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	react_production.useReducer = function (reducer, initialArg, init) {
	  return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	react_production.useRef = function (initialValue) {
	  return ReactSharedInternals.H.useRef(initialValue);
	};
	react_production.useState = function (initialState) {
	  return ReactSharedInternals.H.useState(initialState);
	};
	react_production.useSyncExternalStore = function (
	  subscribe,
	  getSnapshot,
	  getServerSnapshot
	) {
	  return ReactSharedInternals.H.useSyncExternalStore(
	    subscribe,
	    getSnapshot,
	    getServerSnapshot
	  );
	};
	react_production.useTransition = function () {
	  return ReactSharedInternals.H.useTransition();
	};
	react_production.version = "19.1.0";
	return react_production;
}

var hasRequiredReact;

function requireReact () {
	if (hasRequiredReact) return react.exports;
	hasRequiredReact = 1;
	{
	  react.exports = requireReact_production();
	}
	return react.exports;
}

var reactExports = requireReact();
const React = /*@__PURE__*/getDefaultExportFromCjs(reactExports);

const React$1 = /*#__PURE__*/_mergeNamespaces({
	__proto__: null,
	default: React
}, [reactExports]);

var server_edge = {};

var reactDomServer_edge_production = {};

var reactDom = {exports: {}};

var reactDom_production = {};

/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactDom_production;

function requireReactDom_production () {
	if (hasRequiredReactDom_production) return reactDom_production;
	hasRequiredReactDom_production = 1;
	var React = requireReact();
	function formatProdErrorMessage(code) {
	  var url = "https://react.dev/errors/" + code;
	  if (1 < arguments.length) {
	    url += "?args[]=" + encodeURIComponent(arguments[1]);
	    for (var i = 2; i < arguments.length; i++)
	      url += "&args[]=" + encodeURIComponent(arguments[i]);
	  }
	  return (
	    "Minified React error #" +
	    code +
	    "; visit " +
	    url +
	    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
	  );
	}
	function noop() {}
	var Internals = {
	    d: {
	      f: noop,
	      r: function () {
	        throw Error(formatProdErrorMessage(522));
	      },
	      D: noop,
	      C: noop,
	      L: noop,
	      m: noop,
	      X: noop,
	      S: noop,
	      M: noop
	    },
	    p: 0,
	    findDOMNode: null
	  },
	  REACT_PORTAL_TYPE = Symbol.for("react.portal");
	function createPortal$1(children, containerInfo, implementation) {
	  var key =
	    3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
	  return {
	    $$typeof: REACT_PORTAL_TYPE,
	    key: null == key ? null : "" + key,
	    children: children,
	    containerInfo: containerInfo,
	    implementation: implementation
	  };
	}
	var ReactSharedInternals =
	  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function getCrossOriginStringAs(as, input) {
	  if ("font" === as) return "";
	  if ("string" === typeof input)
	    return "use-credentials" === input ? input : "";
	}
	reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
	  Internals;
	reactDom_production.createPortal = function (children, container) {
	  var key =
	    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
	  if (
	    !container ||
	    (1 !== container.nodeType &&
	      9 !== container.nodeType &&
	      11 !== container.nodeType)
	  )
	    throw Error(formatProdErrorMessage(299));
	  return createPortal$1(children, container, null, key);
	};
	reactDom_production.flushSync = function (fn) {
	  var previousTransition = ReactSharedInternals.T,
	    previousUpdatePriority = Internals.p;
	  try {
	    if (((ReactSharedInternals.T = null), (Internals.p = 2), fn)) return fn();
	  } finally {
	    (ReactSharedInternals.T = previousTransition),
	      (Internals.p = previousUpdatePriority),
	      Internals.d.f();
	  }
	};
	reactDom_production.preconnect = function (href, options) {
	  "string" === typeof href &&
	    (options
	      ? ((options = options.crossOrigin),
	        (options =
	          "string" === typeof options
	            ? "use-credentials" === options
	              ? options
	              : ""
	            : void 0))
	      : (options = null),
	    Internals.d.C(href, options));
	};
	reactDom_production.prefetchDNS = function (href) {
	  "string" === typeof href && Internals.d.D(href);
	};
	reactDom_production.preinit = function (href, options) {
	  if ("string" === typeof href && options && "string" === typeof options.as) {
	    var as = options.as,
	      crossOrigin = getCrossOriginStringAs(as, options.crossOrigin),
	      integrity =
	        "string" === typeof options.integrity ? options.integrity : void 0,
	      fetchPriority =
	        "string" === typeof options.fetchPriority
	          ? options.fetchPriority
	          : void 0;
	    "style" === as
	      ? Internals.d.S(
	          href,
	          "string" === typeof options.precedence ? options.precedence : void 0,
	          {
	            crossOrigin: crossOrigin,
	            integrity: integrity,
	            fetchPriority: fetchPriority
	          }
	        )
	      : "script" === as &&
	        Internals.d.X(href, {
	          crossOrigin: crossOrigin,
	          integrity: integrity,
	          fetchPriority: fetchPriority,
	          nonce: "string" === typeof options.nonce ? options.nonce : void 0
	        });
	  }
	};
	reactDom_production.preinitModule = function (href, options) {
	  if ("string" === typeof href)
	    if ("object" === typeof options && null !== options) {
	      if (null == options.as || "script" === options.as) {
	        var crossOrigin = getCrossOriginStringAs(
	          options.as,
	          options.crossOrigin
	        );
	        Internals.d.M(href, {
	          crossOrigin: crossOrigin,
	          integrity:
	            "string" === typeof options.integrity ? options.integrity : void 0,
	          nonce: "string" === typeof options.nonce ? options.nonce : void 0
	        });
	      }
	    } else null == options && Internals.d.M(href);
	};
	reactDom_production.preload = function (href, options) {
	  if (
	    "string" === typeof href &&
	    "object" === typeof options &&
	    null !== options &&
	    "string" === typeof options.as
	  ) {
	    var as = options.as,
	      crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
	    Internals.d.L(href, as, {
	      crossOrigin: crossOrigin,
	      integrity:
	        "string" === typeof options.integrity ? options.integrity : void 0,
	      nonce: "string" === typeof options.nonce ? options.nonce : void 0,
	      type: "string" === typeof options.type ? options.type : void 0,
	      fetchPriority:
	        "string" === typeof options.fetchPriority
	          ? options.fetchPriority
	          : void 0,
	      referrerPolicy:
	        "string" === typeof options.referrerPolicy
	          ? options.referrerPolicy
	          : void 0,
	      imageSrcSet:
	        "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
	      imageSizes:
	        "string" === typeof options.imageSizes ? options.imageSizes : void 0,
	      media: "string" === typeof options.media ? options.media : void 0
	    });
	  }
	};
	reactDom_production.preloadModule = function (href, options) {
	  if ("string" === typeof href)
	    if (options) {
	      var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
	      Internals.d.m(href, {
	        as:
	          "string" === typeof options.as && "script" !== options.as
	            ? options.as
	            : void 0,
	        crossOrigin: crossOrigin,
	        integrity:
	          "string" === typeof options.integrity ? options.integrity : void 0
	      });
	    } else Internals.d.m(href);
	};
	reactDom_production.requestFormReset = function (form) {
	  Internals.d.r(form);
	};
	reactDom_production.unstable_batchedUpdates = function (fn, a) {
	  return fn(a);
	};
	reactDom_production.useFormState = function (action, initialState, permalink) {
	  return ReactSharedInternals.H.useFormState(action, initialState, permalink);
	};
	reactDom_production.useFormStatus = function () {
	  return ReactSharedInternals.H.useHostTransitionStatus();
	};
	reactDom_production.version = "19.1.0";
	return reactDom_production;
}

var hasRequiredReactDom;

function requireReactDom () {
	if (hasRequiredReactDom) return reactDom.exports;
	hasRequiredReactDom = 1;
	function checkDCE() {
	  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
	    return;
	  }
	  try {
	    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
	  } catch (err) {
	    console.error(err);
	  }
	}
	{
	  checkDCE();
	  reactDom.exports = requireReactDom_production();
	}
	return reactDom.exports;
}

/**
 * @license React
 * react-dom-server.edge.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactDomServer_edge_production;

function requireReactDomServer_edge_production () {
	if (hasRequiredReactDomServer_edge_production) return reactDomServer_edge_production;
	hasRequiredReactDomServer_edge_production = 1;
	var React = requireReact(),
	  ReactDOM = requireReactDom(),
	  REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
	  REACT_PROVIDER_TYPE = Symbol.for("react.provider"),
	  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	  REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
	  REACT_MEMO_TYPE = Symbol.for("react.memo"),
	  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
	  REACT_SCOPE_TYPE = Symbol.for("react.scope"),
	  REACT_ACTIVITY_TYPE = Symbol.for("react.activity"),
	  REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden"),
	  REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
	  REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"),
	  MAYBE_ITERATOR_SYMBOL = Symbol.iterator,
	  isArrayImpl = Array.isArray;
	function murmurhash3_32_gc(key, seed) {
	  var remainder = key.length & 3;
	  var bytes = key.length - remainder;
	  var h1 = seed;
	  for (seed = 0; seed < bytes; ) {
	    var k1 =
	      (key.charCodeAt(seed) & 255) |
	      ((key.charCodeAt(++seed) & 255) << 8) |
	      ((key.charCodeAt(++seed) & 255) << 16) |
	      ((key.charCodeAt(++seed) & 255) << 24);
	    ++seed;
	    k1 =
	      (3432918353 * (k1 & 65535) +
	        (((3432918353 * (k1 >>> 16)) & 65535) << 16)) &
	      4294967295;
	    k1 = (k1 << 15) | (k1 >>> 17);
	    k1 =
	      (461845907 * (k1 & 65535) + (((461845907 * (k1 >>> 16)) & 65535) << 16)) &
	      4294967295;
	    h1 ^= k1;
	    h1 = (h1 << 13) | (h1 >>> 19);
	    h1 = (5 * (h1 & 65535) + (((5 * (h1 >>> 16)) & 65535) << 16)) & 4294967295;
	    h1 = (h1 & 65535) + 27492 + ((((h1 >>> 16) + 58964) & 65535) << 16);
	  }
	  k1 = 0;
	  switch (remainder) {
	    case 3:
	      k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
	    case 2:
	      k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
	    case 1:
	      (k1 ^= key.charCodeAt(seed) & 255),
	        (k1 =
	          (3432918353 * (k1 & 65535) +
	            (((3432918353 * (k1 >>> 16)) & 65535) << 16)) &
	          4294967295),
	        (k1 = (k1 << 15) | (k1 >>> 17)),
	        (h1 ^=
	          (461845907 * (k1 & 65535) +
	            (((461845907 * (k1 >>> 16)) & 65535) << 16)) &
	          4294967295);
	  }
	  h1 ^= key.length;
	  h1 ^= h1 >>> 16;
	  h1 =
	    (2246822507 * (h1 & 65535) + (((2246822507 * (h1 >>> 16)) & 65535) << 16)) &
	    4294967295;
	  h1 ^= h1 >>> 13;
	  h1 =
	    (3266489909 * (h1 & 65535) + (((3266489909 * (h1 >>> 16)) & 65535) << 16)) &
	    4294967295;
	  return (h1 ^ (h1 >>> 16)) >>> 0;
	}
	function handleErrorInNextTick(error) {
	  setTimeout(function () {
	    throw error;
	  });
	}
	var LocalPromise = Promise,
	  scheduleMicrotask =
	    "function" === typeof queueMicrotask
	      ? queueMicrotask
	      : function (callback) {
	          LocalPromise.resolve(null)
	            .then(callback)
	            .catch(handleErrorInNextTick);
	        },
	  currentView = null,
	  writtenBytes = 0;
	function writeChunk(destination, chunk) {
	  if (0 !== chunk.byteLength)
	    if (2048 < chunk.byteLength)
	      0 < writtenBytes &&
	        (destination.enqueue(
	          new Uint8Array(currentView.buffer, 0, writtenBytes)
	        ),
	        (currentView = new Uint8Array(2048)),
	        (writtenBytes = 0)),
	        destination.enqueue(chunk);
	    else {
	      var allowableBytes = currentView.length - writtenBytes;
	      allowableBytes < chunk.byteLength &&
	        (0 === allowableBytes
	          ? destination.enqueue(currentView)
	          : (currentView.set(chunk.subarray(0, allowableBytes), writtenBytes),
	            destination.enqueue(currentView),
	            (chunk = chunk.subarray(allowableBytes))),
	        (currentView = new Uint8Array(2048)),
	        (writtenBytes = 0));
	      currentView.set(chunk, writtenBytes);
	      writtenBytes += chunk.byteLength;
	    }
	}
	function writeChunkAndReturn(destination, chunk) {
	  writeChunk(destination, chunk);
	  return true;
	}
	function completeWriting(destination) {
	  currentView &&
	    0 < writtenBytes &&
	    (destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes)),
	    (currentView = null),
	    (writtenBytes = 0));
	}
	var textEncoder = new TextEncoder();
	function stringToChunk(content) {
	  return textEncoder.encode(content);
	}
	function stringToPrecomputedChunk(content) {
	  return textEncoder.encode(content);
	}
	function closeWithError(destination, error) {
	  "function" === typeof destination.error
	    ? destination.error(error)
	    : destination.close();
	}
	var assign = Object.assign,
	  hasOwnProperty = Object.prototype.hasOwnProperty,
	  VALID_ATTRIBUTE_NAME_REGEX = RegExp(
	    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
	  ),
	  illegalAttributeNameCache = {},
	  validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
	  if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
	    return true;
	  if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
	  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
	    return (validatedAttributeNameCache[attributeName] = true);
	  illegalAttributeNameCache[attributeName] = true;
	  return false;
	}
	var unitlessNumbers = new Set(
	    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
	      " "
	    )
	  ),
	  aliases = new Map([
	    ["acceptCharset", "accept-charset"],
	    ["htmlFor", "for"],
	    ["httpEquiv", "http-equiv"],
	    ["crossOrigin", "crossorigin"],
	    ["accentHeight", "accent-height"],
	    ["alignmentBaseline", "alignment-baseline"],
	    ["arabicForm", "arabic-form"],
	    ["baselineShift", "baseline-shift"],
	    ["capHeight", "cap-height"],
	    ["clipPath", "clip-path"],
	    ["clipRule", "clip-rule"],
	    ["colorInterpolation", "color-interpolation"],
	    ["colorInterpolationFilters", "color-interpolation-filters"],
	    ["colorProfile", "color-profile"],
	    ["colorRendering", "color-rendering"],
	    ["dominantBaseline", "dominant-baseline"],
	    ["enableBackground", "enable-background"],
	    ["fillOpacity", "fill-opacity"],
	    ["fillRule", "fill-rule"],
	    ["floodColor", "flood-color"],
	    ["floodOpacity", "flood-opacity"],
	    ["fontFamily", "font-family"],
	    ["fontSize", "font-size"],
	    ["fontSizeAdjust", "font-size-adjust"],
	    ["fontStretch", "font-stretch"],
	    ["fontStyle", "font-style"],
	    ["fontVariant", "font-variant"],
	    ["fontWeight", "font-weight"],
	    ["glyphName", "glyph-name"],
	    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
	    ["glyphOrientationVertical", "glyph-orientation-vertical"],
	    ["horizAdvX", "horiz-adv-x"],
	    ["horizOriginX", "horiz-origin-x"],
	    ["imageRendering", "image-rendering"],
	    ["letterSpacing", "letter-spacing"],
	    ["lightingColor", "lighting-color"],
	    ["markerEnd", "marker-end"],
	    ["markerMid", "marker-mid"],
	    ["markerStart", "marker-start"],
	    ["overlinePosition", "overline-position"],
	    ["overlineThickness", "overline-thickness"],
	    ["paintOrder", "paint-order"],
	    ["panose-1", "panose-1"],
	    ["pointerEvents", "pointer-events"],
	    ["renderingIntent", "rendering-intent"],
	    ["shapeRendering", "shape-rendering"],
	    ["stopColor", "stop-color"],
	    ["stopOpacity", "stop-opacity"],
	    ["strikethroughPosition", "strikethrough-position"],
	    ["strikethroughThickness", "strikethrough-thickness"],
	    ["strokeDasharray", "stroke-dasharray"],
	    ["strokeDashoffset", "stroke-dashoffset"],
	    ["strokeLinecap", "stroke-linecap"],
	    ["strokeLinejoin", "stroke-linejoin"],
	    ["strokeMiterlimit", "stroke-miterlimit"],
	    ["strokeOpacity", "stroke-opacity"],
	    ["strokeWidth", "stroke-width"],
	    ["textAnchor", "text-anchor"],
	    ["textDecoration", "text-decoration"],
	    ["textRendering", "text-rendering"],
	    ["transformOrigin", "transform-origin"],
	    ["underlinePosition", "underline-position"],
	    ["underlineThickness", "underline-thickness"],
	    ["unicodeBidi", "unicode-bidi"],
	    ["unicodeRange", "unicode-range"],
	    ["unitsPerEm", "units-per-em"],
	    ["vAlphabetic", "v-alphabetic"],
	    ["vHanging", "v-hanging"],
	    ["vIdeographic", "v-ideographic"],
	    ["vMathematical", "v-mathematical"],
	    ["vectorEffect", "vector-effect"],
	    ["vertAdvY", "vert-adv-y"],
	    ["vertOriginX", "vert-origin-x"],
	    ["vertOriginY", "vert-origin-y"],
	    ["wordSpacing", "word-spacing"],
	    ["writingMode", "writing-mode"],
	    ["xmlnsXlink", "xmlns:xlink"],
	    ["xHeight", "x-height"]
	  ]),
	  matchHtmlRegExp = /["'&<>]/;
	function escapeTextForBrowser(text) {
	  if (
	    "boolean" === typeof text ||
	    "number" === typeof text ||
	    "bigint" === typeof text
	  )
	    return "" + text;
	  text = "" + text;
	  var match = matchHtmlRegExp.exec(text);
	  if (match) {
	    var html = "",
	      index,
	      lastIndex = 0;
	    for (index = match.index; index < text.length; index++) {
	      switch (text.charCodeAt(index)) {
	        case 34:
	          match = "&quot;";
	          break;
	        case 38:
	          match = "&amp;";
	          break;
	        case 39:
	          match = "&#x27;";
	          break;
	        case 60:
	          match = "&lt;";
	          break;
	        case 62:
	          match = "&gt;";
	          break;
	        default:
	          continue;
	      }
	      lastIndex !== index && (html += text.slice(lastIndex, index));
	      lastIndex = index + 1;
	      html += match;
	    }
	    text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
	  }
	  return text;
	}
	var uppercasePattern = /([A-Z])/g,
	  msPattern = /^ms-/,
	  isJavaScriptProtocol =
	    /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
	  return isJavaScriptProtocol.test("" + url)
	    ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
	    : url;
	}
	var ReactSharedInternals =
	    React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	  ReactDOMSharedInternals =
	    ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	  sharedNotPendingObject = {
	    pending: false,
	    data: null,
	    method: null,
	    action: null
	  },
	  previousDispatcher = ReactDOMSharedInternals.d;
	ReactDOMSharedInternals.d = {
	  f: previousDispatcher.f,
	  r: previousDispatcher.r,
	  D: prefetchDNS,
	  C: preconnect,
	  L: preload,
	  m: preloadModule,
	  X: preinitScript,
	  S: preinitStyle,
	  M: preinitModuleScript
	};
	var PRELOAD_NO_CREDS = [];
	stringToPrecomputedChunk('"></template>');
	var startInlineScript = stringToPrecomputedChunk("<script>"),
	  endInlineScript = stringToPrecomputedChunk("\x3c/script>"),
	  startScriptSrc = stringToPrecomputedChunk('<script src="'),
	  startModuleSrc = stringToPrecomputedChunk('<script type="module" src="'),
	  scriptNonce = stringToPrecomputedChunk('" nonce="'),
	  scriptIntegirty = stringToPrecomputedChunk('" integrity="'),
	  scriptCrossOrigin = stringToPrecomputedChunk('" crossorigin="'),
	  endAsyncScript = stringToPrecomputedChunk('" async="">\x3c/script>'),
	  scriptRegex = /(<\/|<)(s)(cript)/gi;
	function scriptReplacer(match, prefix, s, suffix) {
	  return "" + prefix + ("s" === s ? "\\u0073" : "\\u0053") + suffix;
	}
	var importMapScriptStart = stringToPrecomputedChunk(
	    '<script type="importmap">'
	  ),
	  importMapScriptEnd = stringToPrecomputedChunk("\x3c/script>");
	function createRenderState(
	  resumableState,
	  nonce,
	  externalRuntimeConfig,
	  importMap,
	  onHeaders,
	  maxHeadersLength
	) {
	  var inlineScriptWithNonce =
	      void 0 === nonce
	        ? startInlineScript
	        : stringToPrecomputedChunk(
	            '<script nonce="' + escapeTextForBrowser(nonce) + '">'
	          ),
	    idPrefix = resumableState.idPrefix;
	  externalRuntimeConfig = [];
	  var bootstrapScriptContent = resumableState.bootstrapScriptContent,
	    bootstrapScripts = resumableState.bootstrapScripts,
	    bootstrapModules = resumableState.bootstrapModules;
	  void 0 !== bootstrapScriptContent &&
	    externalRuntimeConfig.push(
	      inlineScriptWithNonce,
	      stringToChunk(
	        ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer)
	      ),
	      endInlineScript
	    );
	  bootstrapScriptContent = [];
	  void 0 !== importMap &&
	    (bootstrapScriptContent.push(importMapScriptStart),
	    bootstrapScriptContent.push(
	      stringToChunk(
	        ("" + JSON.stringify(importMap)).replace(scriptRegex, scriptReplacer)
	      )
	    ),
	    bootstrapScriptContent.push(importMapScriptEnd));
	  importMap = onHeaders
	    ? {
	        preconnects: "",
	        fontPreloads: "",
	        highImagePreloads: "",
	        remainingCapacity:
	          2 + ("number" === typeof maxHeadersLength ? maxHeadersLength : 2e3)
	      }
	    : null;
	  onHeaders = {
	    placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
	    segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
	    boundaryPrefix: stringToPrecomputedChunk(idPrefix + "B:"),
	    startInlineScript: inlineScriptWithNonce,
	    preamble: createPreambleState(),
	    externalRuntimeScript: null,
	    bootstrapChunks: externalRuntimeConfig,
	    importMapChunks: bootstrapScriptContent,
	    onHeaders: onHeaders,
	    headers: importMap,
	    resets: {
	      font: {},
	      dns: {},
	      connect: { default: {}, anonymous: {}, credentials: {} },
	      image: {},
	      style: {}
	    },
	    charsetChunks: [],
	    viewportChunks: [],
	    hoistableChunks: [],
	    preconnects: new Set(),
	    fontPreloads: new Set(),
	    highImagePreloads: new Set(),
	    styles: new Map(),
	    bootstrapScripts: new Set(),
	    scripts: new Set(),
	    bulkPreloads: new Set(),
	    preloads: {
	      images: new Map(),
	      stylesheets: new Map(),
	      scripts: new Map(),
	      moduleScripts: new Map()
	    },
	    nonce: nonce,
	    hoistableState: null,
	    stylesToHoist: false
	  };
	  if (void 0 !== bootstrapScripts)
	    for (importMap = 0; importMap < bootstrapScripts.length; importMap++) {
	      var scriptConfig = bootstrapScripts[importMap];
	      idPrefix = inlineScriptWithNonce = void 0;
	      bootstrapScriptContent = {
	        rel: "preload",
	        as: "script",
	        fetchPriority: "low",
	        nonce: nonce
	      };
	      "string" === typeof scriptConfig
	        ? (bootstrapScriptContent.href = maxHeadersLength = scriptConfig)
	        : ((bootstrapScriptContent.href = maxHeadersLength = scriptConfig.src),
	          (bootstrapScriptContent.integrity = idPrefix =
	            "string" === typeof scriptConfig.integrity
	              ? scriptConfig.integrity
	              : void 0),
	          (bootstrapScriptContent.crossOrigin = inlineScriptWithNonce =
	            "string" === typeof scriptConfig || null == scriptConfig.crossOrigin
	              ? void 0
	              : "use-credentials" === scriptConfig.crossOrigin
	                ? "use-credentials"
	                : ""));
	      scriptConfig = resumableState;
	      var href = maxHeadersLength;
	      scriptConfig.scriptResources[href] = null;
	      scriptConfig.moduleScriptResources[href] = null;
	      scriptConfig = [];
	      pushLinkImpl(scriptConfig, bootstrapScriptContent);
	      onHeaders.bootstrapScripts.add(scriptConfig);
	      externalRuntimeConfig.push(
	        startScriptSrc,
	        stringToChunk(escapeTextForBrowser(maxHeadersLength))
	      );
	      nonce &&
	        externalRuntimeConfig.push(
	          scriptNonce,
	          stringToChunk(escapeTextForBrowser(nonce))
	        );
	      "string" === typeof idPrefix &&
	        externalRuntimeConfig.push(
	          scriptIntegirty,
	          stringToChunk(escapeTextForBrowser(idPrefix))
	        );
	      "string" === typeof inlineScriptWithNonce &&
	        externalRuntimeConfig.push(
	          scriptCrossOrigin,
	          stringToChunk(escapeTextForBrowser(inlineScriptWithNonce))
	        );
	      externalRuntimeConfig.push(endAsyncScript);
	    }
	  if (void 0 !== bootstrapModules)
	    for (
	      bootstrapScripts = 0;
	      bootstrapScripts < bootstrapModules.length;
	      bootstrapScripts++
	    )
	      (bootstrapScriptContent = bootstrapModules[bootstrapScripts]),
	        (inlineScriptWithNonce = maxHeadersLength = void 0),
	        (idPrefix = {
	          rel: "modulepreload",
	          fetchPriority: "low",
	          nonce: nonce
	        }),
	        "string" === typeof bootstrapScriptContent
	          ? (idPrefix.href = importMap = bootstrapScriptContent)
	          : ((idPrefix.href = importMap = bootstrapScriptContent.src),
	            (idPrefix.integrity = inlineScriptWithNonce =
	              "string" === typeof bootstrapScriptContent.integrity
	                ? bootstrapScriptContent.integrity
	                : void 0),
	            (idPrefix.crossOrigin = maxHeadersLength =
	              "string" === typeof bootstrapScriptContent ||
	              null == bootstrapScriptContent.crossOrigin
	                ? void 0
	                : "use-credentials" === bootstrapScriptContent.crossOrigin
	                  ? "use-credentials"
	                  : "")),
	        (bootstrapScriptContent = resumableState),
	        (scriptConfig = importMap),
	        (bootstrapScriptContent.scriptResources[scriptConfig] = null),
	        (bootstrapScriptContent.moduleScriptResources[scriptConfig] = null),
	        (bootstrapScriptContent = []),
	        pushLinkImpl(bootstrapScriptContent, idPrefix),
	        onHeaders.bootstrapScripts.add(bootstrapScriptContent),
	        externalRuntimeConfig.push(
	          startModuleSrc,
	          stringToChunk(escapeTextForBrowser(importMap))
	        ),
	        nonce &&
	          externalRuntimeConfig.push(
	            scriptNonce,
	            stringToChunk(escapeTextForBrowser(nonce))
	          ),
	        "string" === typeof inlineScriptWithNonce &&
	          externalRuntimeConfig.push(
	            scriptIntegirty,
	            stringToChunk(escapeTextForBrowser(inlineScriptWithNonce))
	          ),
	        "string" === typeof maxHeadersLength &&
	          externalRuntimeConfig.push(
	            scriptCrossOrigin,
	            stringToChunk(escapeTextForBrowser(maxHeadersLength))
	          ),
	        externalRuntimeConfig.push(endAsyncScript);
	  return onHeaders;
	}
	function createResumableState(
	  identifierPrefix,
	  externalRuntimeConfig,
	  bootstrapScriptContent,
	  bootstrapScripts,
	  bootstrapModules
	) {
	  return {
	    idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
	    nextFormID: 0,
	    streamingFormat: 0,
	    bootstrapScriptContent: bootstrapScriptContent,
	    bootstrapScripts: bootstrapScripts,
	    bootstrapModules: bootstrapModules,
	    instructions: 0,
	    hasBody: false,
	    hasHtml: false,
	    unknownResources: {},
	    dnsResources: {},
	    connectResources: { default: {}, anonymous: {}, credentials: {} },
	    imageResources: {},
	    styleResources: {},
	    scriptResources: {},
	    moduleUnknownResources: {},
	    moduleScriptResources: {}
	  };
	}
	function createPreambleState() {
	  return {
	    htmlChunks: null,
	    headChunks: null,
	    bodyChunks: null,
	    contribution: 0
	  };
	}
	function createFormatContext(insertionMode, selectedValue, tagScope) {
	  return {
	    insertionMode: insertionMode,
	    selectedValue: selectedValue,
	    tagScope: tagScope
	  };
	}
	function createRootFormatContext(namespaceURI) {
	  return createFormatContext(
	    "http://www.w3.org/2000/svg" === namespaceURI
	      ? 4
	      : "http://www.w3.org/1998/Math/MathML" === namespaceURI
	        ? 5
	        : 0,
	    null,
	    0
	  );
	}
	function getChildFormatContext(parentContext, type, props) {
	  switch (type) {
	    case "noscript":
	      return createFormatContext(2, null, parentContext.tagScope | 1);
	    case "select":
	      return createFormatContext(
	        2,
	        null != props.value ? props.value : props.defaultValue,
	        parentContext.tagScope
	      );
	    case "svg":
	      return createFormatContext(4, null, parentContext.tagScope);
	    case "picture":
	      return createFormatContext(2, null, parentContext.tagScope | 2);
	    case "math":
	      return createFormatContext(5, null, parentContext.tagScope);
	    case "foreignObject":
	      return createFormatContext(2, null, parentContext.tagScope);
	    case "table":
	      return createFormatContext(6, null, parentContext.tagScope);
	    case "thead":
	    case "tbody":
	    case "tfoot":
	      return createFormatContext(7, null, parentContext.tagScope);
	    case "colgroup":
	      return createFormatContext(9, null, parentContext.tagScope);
	    case "tr":
	      return createFormatContext(8, null, parentContext.tagScope);
	    case "head":
	      if (2 > parentContext.insertionMode)
	        return createFormatContext(3, null, parentContext.tagScope);
	      break;
	    case "html":
	      if (0 === parentContext.insertionMode)
	        return createFormatContext(1, null, parentContext.tagScope);
	  }
	  return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode
	    ? createFormatContext(2, null, parentContext.tagScope)
	    : parentContext;
	}
	var textSeparator = stringToPrecomputedChunk("\x3c!-- --\x3e");
	function pushTextInstance(target, text, renderState, textEmbedded) {
	  if ("" === text) return textEmbedded;
	  textEmbedded && target.push(textSeparator);
	  target.push(stringToChunk(escapeTextForBrowser(text)));
	  return true;
	}
	var styleNameCache = new Map(),
	  styleAttributeStart = stringToPrecomputedChunk(' style="'),
	  styleAssign = stringToPrecomputedChunk(":"),
	  styleSeparator = stringToPrecomputedChunk(";");
	function pushStyleAttribute(target, style) {
	  if ("object" !== typeof style)
	    throw Error(
	      "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
	    );
	  var isFirst = true,
	    styleName;
	  for (styleName in style)
	    if (hasOwnProperty.call(style, styleName)) {
	      var styleValue = style[styleName];
	      if (
	        null != styleValue &&
	        "boolean" !== typeof styleValue &&
	        "" !== styleValue
	      ) {
	        if (0 === styleName.indexOf("--")) {
	          var nameChunk = stringToChunk(escapeTextForBrowser(styleName));
	          styleValue = stringToChunk(
	            escapeTextForBrowser(("" + styleValue).trim())
	          );
	        } else
	          (nameChunk = styleNameCache.get(styleName)),
	            void 0 === nameChunk &&
	              ((nameChunk = stringToPrecomputedChunk(
	                escapeTextForBrowser(
	                  styleName
	                    .replace(uppercasePattern, "-$1")
	                    .toLowerCase()
	                    .replace(msPattern, "-ms-")
	                )
	              )),
	              styleNameCache.set(styleName, nameChunk)),
	            (styleValue =
	              "number" === typeof styleValue
	                ? 0 === styleValue || unitlessNumbers.has(styleName)
	                  ? stringToChunk("" + styleValue)
	                  : stringToChunk(styleValue + "px")
	                : stringToChunk(
	                    escapeTextForBrowser(("" + styleValue).trim())
	                  ));
	        isFirst
	          ? ((isFirst = false),
	            target.push(
	              styleAttributeStart,
	              nameChunk,
	              styleAssign,
	              styleValue
	            ))
	          : target.push(styleSeparator, nameChunk, styleAssign, styleValue);
	      }
	    }
	  isFirst || target.push(attributeEnd);
	}
	var attributeSeparator = stringToPrecomputedChunk(" "),
	  attributeAssign = stringToPrecomputedChunk('="'),
	  attributeEnd = stringToPrecomputedChunk('"'),
	  attributeEmptyString = stringToPrecomputedChunk('=""');
	function pushBooleanAttribute(target, name, value) {
	  value &&
	    "function" !== typeof value &&
	    "symbol" !== typeof value &&
	    target.push(attributeSeparator, stringToChunk(name), attributeEmptyString);
	}
	function pushStringAttribute(target, name, value) {
	  "function" !== typeof value &&
	    "symbol" !== typeof value &&
	    "boolean" !== typeof value &&
	    target.push(
	      attributeSeparator,
	      stringToChunk(name),
	      attributeAssign,
	      stringToChunk(escapeTextForBrowser(value)),
	      attributeEnd
	    );
	}
	var actionJavaScriptURL = stringToPrecomputedChunk(
	    escapeTextForBrowser(
	      "javascript:throw new Error('React form unexpectedly submitted.')"
	    )
	  ),
	  startHiddenInputChunk = stringToPrecomputedChunk('<input type="hidden"');
	function pushAdditionalFormField(value, key) {
	  this.push(startHiddenInputChunk);
	  validateAdditionalFormField(value);
	  pushStringAttribute(this, "name", key);
	  pushStringAttribute(this, "value", value);
	  this.push(endOfStartTagSelfClosing);
	}
	function validateAdditionalFormField(value) {
	  if ("string" !== typeof value)
	    throw Error(
	      "File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration."
	    );
	}
	function getCustomFormFields(resumableState, formAction) {
	  if ("function" === typeof formAction.$$FORM_ACTION) {
	    var id = resumableState.nextFormID++;
	    resumableState = resumableState.idPrefix + id;
	    try {
	      var customFields = formAction.$$FORM_ACTION(resumableState);
	      if (customFields) {
	        var formData = customFields.data;
	        null != formData && formData.forEach(validateAdditionalFormField);
	      }
	      return customFields;
	    } catch (x) {
	      if ("object" === typeof x && null !== x && "function" === typeof x.then)
	        throw x;
	    }
	  }
	  return null;
	}
	function pushFormActionAttribute(
	  target,
	  resumableState,
	  renderState,
	  formAction,
	  formEncType,
	  formMethod,
	  formTarget,
	  name
	) {
	  var formData = null;
	  if ("function" === typeof formAction) {
	    var customFields = getCustomFormFields(resumableState, formAction);
	    null !== customFields
	      ? ((name = customFields.name),
	        (formAction = customFields.action || ""),
	        (formEncType = customFields.encType),
	        (formMethod = customFields.method),
	        (formTarget = customFields.target),
	        (formData = customFields.data))
	      : (target.push(
	          attributeSeparator,
	          stringToChunk("formAction"),
	          attributeAssign,
	          actionJavaScriptURL,
	          attributeEnd
	        ),
	        (formTarget = formMethod = formEncType = formAction = name = null),
	        injectFormReplayingRuntime(resumableState, renderState));
	  }
	  null != name && pushAttribute(target, "name", name);
	  null != formAction && pushAttribute(target, "formAction", formAction);
	  null != formEncType && pushAttribute(target, "formEncType", formEncType);
	  null != formMethod && pushAttribute(target, "formMethod", formMethod);
	  null != formTarget && pushAttribute(target, "formTarget", formTarget);
	  return formData;
	}
	function pushAttribute(target, name, value) {
	  switch (name) {
	    case "className":
	      pushStringAttribute(target, "class", value);
	      break;
	    case "tabIndex":
	      pushStringAttribute(target, "tabindex", value);
	      break;
	    case "dir":
	    case "role":
	    case "viewBox":
	    case "width":
	    case "height":
	      pushStringAttribute(target, name, value);
	      break;
	    case "style":
	      pushStyleAttribute(target, value);
	      break;
	    case "src":
	    case "href":
	      if ("" === value) break;
	    case "action":
	    case "formAction":
	      if (
	        null == value ||
	        "function" === typeof value ||
	        "symbol" === typeof value ||
	        "boolean" === typeof value
	      )
	        break;
	      value = sanitizeURL("" + value);
	      target.push(
	        attributeSeparator,
	        stringToChunk(name),
	        attributeAssign,
	        stringToChunk(escapeTextForBrowser(value)),
	        attributeEnd
	      );
	      break;
	    case "defaultValue":
	    case "defaultChecked":
	    case "innerHTML":
	    case "suppressContentEditableWarning":
	    case "suppressHydrationWarning":
	    case "ref":
	      break;
	    case "autoFocus":
	    case "multiple":
	    case "muted":
	      pushBooleanAttribute(target, name.toLowerCase(), value);
	      break;
	    case "xlinkHref":
	      if (
	        "function" === typeof value ||
	        "symbol" === typeof value ||
	        "boolean" === typeof value
	      )
	        break;
	      value = sanitizeURL("" + value);
	      target.push(
	        attributeSeparator,
	        stringToChunk("xlink:href"),
	        attributeAssign,
	        stringToChunk(escapeTextForBrowser(value)),
	        attributeEnd
	      );
	      break;
	    case "contentEditable":
	    case "spellCheck":
	    case "draggable":
	    case "value":
	    case "autoReverse":
	    case "externalResourcesRequired":
	    case "focusable":
	    case "preserveAlpha":
	      "function" !== typeof value &&
	        "symbol" !== typeof value &&
	        target.push(
	          attributeSeparator,
	          stringToChunk(name),
	          attributeAssign,
	          stringToChunk(escapeTextForBrowser(value)),
	          attributeEnd
	        );
	      break;
	    case "inert":
	    case "allowFullScreen":
	    case "async":
	    case "autoPlay":
	    case "controls":
	    case "default":
	    case "defer":
	    case "disabled":
	    case "disablePictureInPicture":
	    case "disableRemotePlayback":
	    case "formNoValidate":
	    case "hidden":
	    case "loop":
	    case "noModule":
	    case "noValidate":
	    case "open":
	    case "playsInline":
	    case "readOnly":
	    case "required":
	    case "reversed":
	    case "scoped":
	    case "seamless":
	    case "itemScope":
	      value &&
	        "function" !== typeof value &&
	        "symbol" !== typeof value &&
	        target.push(
	          attributeSeparator,
	          stringToChunk(name),
	          attributeEmptyString
	        );
	      break;
	    case "capture":
	    case "download":
	      true === value
	        ? target.push(
	            attributeSeparator,
	            stringToChunk(name),
	            attributeEmptyString
	          )
	        : false !== value &&
	          "function" !== typeof value &&
	          "symbol" !== typeof value &&
	          target.push(
	            attributeSeparator,
	            stringToChunk(name),
	            attributeAssign,
	            stringToChunk(escapeTextForBrowser(value)),
	            attributeEnd
	          );
	      break;
	    case "cols":
	    case "rows":
	    case "size":
	    case "span":
	      "function" !== typeof value &&
	        "symbol" !== typeof value &&
	        !isNaN(value) &&
	        1 <= value &&
	        target.push(
	          attributeSeparator,
	          stringToChunk(name),
	          attributeAssign,
	          stringToChunk(escapeTextForBrowser(value)),
	          attributeEnd
	        );
	      break;
	    case "rowSpan":
	    case "start":
	      "function" === typeof value ||
	        "symbol" === typeof value ||
	        isNaN(value) ||
	        target.push(
	          attributeSeparator,
	          stringToChunk(name),
	          attributeAssign,
	          stringToChunk(escapeTextForBrowser(value)),
	          attributeEnd
	        );
	      break;
	    case "xlinkActuate":
	      pushStringAttribute(target, "xlink:actuate", value);
	      break;
	    case "xlinkArcrole":
	      pushStringAttribute(target, "xlink:arcrole", value);
	      break;
	    case "xlinkRole":
	      pushStringAttribute(target, "xlink:role", value);
	      break;
	    case "xlinkShow":
	      pushStringAttribute(target, "xlink:show", value);
	      break;
	    case "xlinkTitle":
	      pushStringAttribute(target, "xlink:title", value);
	      break;
	    case "xlinkType":
	      pushStringAttribute(target, "xlink:type", value);
	      break;
	    case "xmlBase":
	      pushStringAttribute(target, "xml:base", value);
	      break;
	    case "xmlLang":
	      pushStringAttribute(target, "xml:lang", value);
	      break;
	    case "xmlSpace":
	      pushStringAttribute(target, "xml:space", value);
	      break;
	    default:
	      if (
	        !(2 < name.length) ||
	        ("o" !== name[0] && "O" !== name[0]) ||
	        ("n" !== name[1] && "N" !== name[1])
	      )
	        if (((name = aliases.get(name) || name), isAttributeNameSafe(name))) {
	          switch (typeof value) {
	            case "function":
	            case "symbol":
	              return;
	            case "boolean":
	              var prefix$8 = name.toLowerCase().slice(0, 5);
	              if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
	          }
	          target.push(
	            attributeSeparator,
	            stringToChunk(name),
	            attributeAssign,
	            stringToChunk(escapeTextForBrowser(value)),
	            attributeEnd
	          );
	        }
	  }
	}
	var endOfStartTag = stringToPrecomputedChunk(">"),
	  endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
	function pushInnerHTML(target, innerHTML, children) {
	  if (null != innerHTML) {
	    if (null != children)
	      throw Error(
	        "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
	      );
	    if ("object" !== typeof innerHTML || !("__html" in innerHTML))
	      throw Error(
	        "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
	      );
	    innerHTML = innerHTML.__html;
	    null !== innerHTML &&
	      void 0 !== innerHTML &&
	      target.push(stringToChunk("" + innerHTML));
	  }
	}
	function flattenOptionChildren(children) {
	  var content = "";
	  React.Children.forEach(children, function (child) {
	    null != child && (content += child);
	  });
	  return content;
	}
	var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""'),
	  formReplayingRuntimeScript = stringToPrecomputedChunk(
	    'addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error(\'React form unexpectedly submitted.\')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});'
	  );
	function injectFormReplayingRuntime(resumableState, renderState) {
	  0 === (resumableState.instructions & 16) &&
	    ((resumableState.instructions |= 16),
	    renderState.bootstrapChunks.unshift(
	      renderState.startInlineScript,
	      formReplayingRuntimeScript,
	      endInlineScript
	    ));
	}
	var formStateMarkerIsMatching = stringToPrecomputedChunk("\x3c!--F!--\x3e"),
	  formStateMarkerIsNotMatching = stringToPrecomputedChunk("\x3c!--F--\x3e");
	function pushLinkImpl(target, props) {
	  target.push(startChunkForTag("link"));
	  for (var propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	          case "dangerouslySetInnerHTML":
	            throw Error(
	              "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
	            );
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(endOfStartTagSelfClosing);
	  return null;
	}
	var styleRegex = /(<\/|<)(s)(tyle)/gi;
	function styleReplacer(match, prefix, s, suffix) {
	  return "" + prefix + ("s" === s ? "\\73 " : "\\53 ") + suffix;
	}
	function pushSelfClosing(target, props, tag) {
	  target.push(startChunkForTag(tag));
	  for (var propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	          case "dangerouslySetInnerHTML":
	            throw Error(
	              tag +
	                " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
	            );
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(endOfStartTagSelfClosing);
	  return null;
	}
	function pushTitleImpl(target, props) {
	  target.push(startChunkForTag("title"));
	  var children = null,
	    innerHTML = null,
	    propKey;
	  for (propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	            children = propValue;
	            break;
	          case "dangerouslySetInnerHTML":
	            innerHTML = propValue;
	            break;
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(endOfStartTag);
	  props = Array.isArray(children)
	    ? 2 > children.length
	      ? children[0]
	      : null
	    : children;
	  "function" !== typeof props &&
	    "symbol" !== typeof props &&
	    null !== props &&
	    void 0 !== props &&
	    target.push(stringToChunk(escapeTextForBrowser("" + props)));
	  pushInnerHTML(target, innerHTML, children);
	  target.push(endChunkForTag("title"));
	  return null;
	}
	function pushScriptImpl(target, props) {
	  target.push(startChunkForTag("script"));
	  var children = null,
	    innerHTML = null,
	    propKey;
	  for (propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	            children = propValue;
	            break;
	          case "dangerouslySetInnerHTML":
	            innerHTML = propValue;
	            break;
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(endOfStartTag);
	  pushInnerHTML(target, innerHTML, children);
	  "string" === typeof children &&
	    target.push(
	      stringToChunk(("" + children).replace(scriptRegex, scriptReplacer))
	    );
	  target.push(endChunkForTag("script"));
	  return null;
	}
	function pushStartSingletonElement(target, props, tag) {
	  target.push(startChunkForTag(tag));
	  var innerHTML = (tag = null),
	    propKey;
	  for (propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	            tag = propValue;
	            break;
	          case "dangerouslySetInnerHTML":
	            innerHTML = propValue;
	            break;
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(endOfStartTag);
	  pushInnerHTML(target, innerHTML, tag);
	  return tag;
	}
	function pushStartGenericElement(target, props, tag) {
	  target.push(startChunkForTag(tag));
	  var innerHTML = (tag = null),
	    propKey;
	  for (propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	            tag = propValue;
	            break;
	          case "dangerouslySetInnerHTML":
	            innerHTML = propValue;
	            break;
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(endOfStartTag);
	  pushInnerHTML(target, innerHTML, tag);
	  return "string" === typeof tag
	    ? (target.push(stringToChunk(escapeTextForBrowser(tag))), null)
	    : tag;
	}
	var leadingNewline = stringToPrecomputedChunk("\n"),
	  VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,
	  validatedTagCache = new Map();
	function startChunkForTag(tag) {
	  var tagStartChunk = validatedTagCache.get(tag);
	  if (void 0 === tagStartChunk) {
	    if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
	    tagStartChunk = stringToPrecomputedChunk("<" + tag);
	    validatedTagCache.set(tag, tagStartChunk);
	  }
	  return tagStartChunk;
	}
	var doctypeChunk = stringToPrecomputedChunk("<!DOCTYPE html>");
	function pushStartInstance(
	  target$jscomp$0,
	  type,
	  props,
	  resumableState,
	  renderState,
	  preambleState,
	  hoistableState,
	  formatContext,
	  textEmbedded,
	  isFallback
	) {
	  switch (type) {
	    case "div":
	    case "span":
	    case "svg":
	    case "path":
	      break;
	    case "a":
	      target$jscomp$0.push(startChunkForTag("a"));
	      var children = null,
	        innerHTML = null,
	        propKey;
	      for (propKey in props)
	        if (hasOwnProperty.call(props, propKey)) {
	          var propValue = props[propKey];
	          if (null != propValue)
	            switch (propKey) {
	              case "children":
	                children = propValue;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML = propValue;
	                break;
	              case "href":
	                "" === propValue
	                  ? pushStringAttribute(target$jscomp$0, "href", "")
	                  : pushAttribute(target$jscomp$0, propKey, propValue);
	                break;
	              default:
	                pushAttribute(target$jscomp$0, propKey, propValue);
	            }
	        }
	      target$jscomp$0.push(endOfStartTag);
	      pushInnerHTML(target$jscomp$0, innerHTML, children);
	      if ("string" === typeof children) {
	        target$jscomp$0.push(stringToChunk(escapeTextForBrowser(children)));
	        var JSCompiler_inline_result = null;
	      } else JSCompiler_inline_result = children;
	      return JSCompiler_inline_result;
	    case "g":
	    case "p":
	    case "li":
	      break;
	    case "select":
	      target$jscomp$0.push(startChunkForTag("select"));
	      var children$jscomp$0 = null,
	        innerHTML$jscomp$0 = null,
	        propKey$jscomp$0;
	      for (propKey$jscomp$0 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$0)) {
	          var propValue$jscomp$0 = props[propKey$jscomp$0];
	          if (null != propValue$jscomp$0)
	            switch (propKey$jscomp$0) {
	              case "children":
	                children$jscomp$0 = propValue$jscomp$0;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$0 = propValue$jscomp$0;
	                break;
	              case "defaultValue":
	              case "value":
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$0,
	                  propValue$jscomp$0
	                );
	            }
	        }
	      target$jscomp$0.push(endOfStartTag);
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
	      return children$jscomp$0;
	    case "option":
	      var selectedValue = formatContext.selectedValue;
	      target$jscomp$0.push(startChunkForTag("option"));
	      var children$jscomp$1 = null,
	        value = null,
	        selected = null,
	        innerHTML$jscomp$1 = null,
	        propKey$jscomp$1;
	      for (propKey$jscomp$1 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$1)) {
	          var propValue$jscomp$1 = props[propKey$jscomp$1];
	          if (null != propValue$jscomp$1)
	            switch (propKey$jscomp$1) {
	              case "children":
	                children$jscomp$1 = propValue$jscomp$1;
	                break;
	              case "selected":
	                selected = propValue$jscomp$1;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$1 = propValue$jscomp$1;
	                break;
	              case "value":
	                value = propValue$jscomp$1;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$1,
	                  propValue$jscomp$1
	                );
	            }
	        }
	      if (null != selectedValue) {
	        var stringValue =
	          null !== value
	            ? "" + value
	            : flattenOptionChildren(children$jscomp$1);
	        if (isArrayImpl(selectedValue))
	          for (var i = 0; i < selectedValue.length; i++) {
	            if ("" + selectedValue[i] === stringValue) {
	              target$jscomp$0.push(selectedMarkerAttribute);
	              break;
	            }
	          }
	        else
	          "" + selectedValue === stringValue &&
	            target$jscomp$0.push(selectedMarkerAttribute);
	      } else selected && target$jscomp$0.push(selectedMarkerAttribute);
	      target$jscomp$0.push(endOfStartTag);
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
	      return children$jscomp$1;
	    case "textarea":
	      target$jscomp$0.push(startChunkForTag("textarea"));
	      var value$jscomp$0 = null,
	        defaultValue = null,
	        children$jscomp$2 = null,
	        propKey$jscomp$2;
	      for (propKey$jscomp$2 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$2)) {
	          var propValue$jscomp$2 = props[propKey$jscomp$2];
	          if (null != propValue$jscomp$2)
	            switch (propKey$jscomp$2) {
	              case "children":
	                children$jscomp$2 = propValue$jscomp$2;
	                break;
	              case "value":
	                value$jscomp$0 = propValue$jscomp$2;
	                break;
	              case "defaultValue":
	                defaultValue = propValue$jscomp$2;
	                break;
	              case "dangerouslySetInnerHTML":
	                throw Error(
	                  "`dangerouslySetInnerHTML` does not make sense on <textarea>."
	                );
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$2,
	                  propValue$jscomp$2
	                );
	            }
	        }
	      null === value$jscomp$0 &&
	        null !== defaultValue &&
	        (value$jscomp$0 = defaultValue);
	      target$jscomp$0.push(endOfStartTag);
	      if (null != children$jscomp$2) {
	        if (null != value$jscomp$0)
	          throw Error(
	            "If you supply `defaultValue` on a <textarea>, do not pass children."
	          );
	        if (isArrayImpl(children$jscomp$2)) {
	          if (1 < children$jscomp$2.length)
	            throw Error("<textarea> can only have at most one child.");
	          value$jscomp$0 = "" + children$jscomp$2[0];
	        }
	        value$jscomp$0 = "" + children$jscomp$2;
	      }
	      "string" === typeof value$jscomp$0 &&
	        "\n" === value$jscomp$0[0] &&
	        target$jscomp$0.push(leadingNewline);
	      null !== value$jscomp$0 &&
	        target$jscomp$0.push(
	          stringToChunk(escapeTextForBrowser("" + value$jscomp$0))
	        );
	      return null;
	    case "input":
	      target$jscomp$0.push(startChunkForTag("input"));
	      var name = null,
	        formAction = null,
	        formEncType = null,
	        formMethod = null,
	        formTarget = null,
	        value$jscomp$1 = null,
	        defaultValue$jscomp$0 = null,
	        checked = null,
	        defaultChecked = null,
	        propKey$jscomp$3;
	      for (propKey$jscomp$3 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$3)) {
	          var propValue$jscomp$3 = props[propKey$jscomp$3];
	          if (null != propValue$jscomp$3)
	            switch (propKey$jscomp$3) {
	              case "children":
	              case "dangerouslySetInnerHTML":
	                throw Error(
	                  "input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
	                );
	              case "name":
	                name = propValue$jscomp$3;
	                break;
	              case "formAction":
	                formAction = propValue$jscomp$3;
	                break;
	              case "formEncType":
	                formEncType = propValue$jscomp$3;
	                break;
	              case "formMethod":
	                formMethod = propValue$jscomp$3;
	                break;
	              case "formTarget":
	                formTarget = propValue$jscomp$3;
	                break;
	              case "defaultChecked":
	                defaultChecked = propValue$jscomp$3;
	                break;
	              case "defaultValue":
	                defaultValue$jscomp$0 = propValue$jscomp$3;
	                break;
	              case "checked":
	                checked = propValue$jscomp$3;
	                break;
	              case "value":
	                value$jscomp$1 = propValue$jscomp$3;
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$3,
	                  propValue$jscomp$3
	                );
	            }
	        }
	      var formData = pushFormActionAttribute(
	        target$jscomp$0,
	        resumableState,
	        renderState,
	        formAction,
	        formEncType,
	        formMethod,
	        formTarget,
	        name
	      );
	      null !== checked
	        ? pushBooleanAttribute(target$jscomp$0, "checked", checked)
	        : null !== defaultChecked &&
	          pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
	      null !== value$jscomp$1
	        ? pushAttribute(target$jscomp$0, "value", value$jscomp$1)
	        : null !== defaultValue$jscomp$0 &&
	          pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
	      target$jscomp$0.push(endOfStartTagSelfClosing);
	      null != formData &&
	        formData.forEach(pushAdditionalFormField, target$jscomp$0);
	      return null;
	    case "button":
	      target$jscomp$0.push(startChunkForTag("button"));
	      var children$jscomp$3 = null,
	        innerHTML$jscomp$2 = null,
	        name$jscomp$0 = null,
	        formAction$jscomp$0 = null,
	        formEncType$jscomp$0 = null,
	        formMethod$jscomp$0 = null,
	        formTarget$jscomp$0 = null,
	        propKey$jscomp$4;
	      for (propKey$jscomp$4 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$4)) {
	          var propValue$jscomp$4 = props[propKey$jscomp$4];
	          if (null != propValue$jscomp$4)
	            switch (propKey$jscomp$4) {
	              case "children":
	                children$jscomp$3 = propValue$jscomp$4;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$2 = propValue$jscomp$4;
	                break;
	              case "name":
	                name$jscomp$0 = propValue$jscomp$4;
	                break;
	              case "formAction":
	                formAction$jscomp$0 = propValue$jscomp$4;
	                break;
	              case "formEncType":
	                formEncType$jscomp$0 = propValue$jscomp$4;
	                break;
	              case "formMethod":
	                formMethod$jscomp$0 = propValue$jscomp$4;
	                break;
	              case "formTarget":
	                formTarget$jscomp$0 = propValue$jscomp$4;
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$4,
	                  propValue$jscomp$4
	                );
	            }
	        }
	      var formData$jscomp$0 = pushFormActionAttribute(
	        target$jscomp$0,
	        resumableState,
	        renderState,
	        formAction$jscomp$0,
	        formEncType$jscomp$0,
	        formMethod$jscomp$0,
	        formTarget$jscomp$0,
	        name$jscomp$0
	      );
	      target$jscomp$0.push(endOfStartTag);
	      null != formData$jscomp$0 &&
	        formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
	      if ("string" === typeof children$jscomp$3) {
	        target$jscomp$0.push(
	          stringToChunk(escapeTextForBrowser(children$jscomp$3))
	        );
	        var JSCompiler_inline_result$jscomp$0 = null;
	      } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
	      return JSCompiler_inline_result$jscomp$0;
	    case "form":
	      target$jscomp$0.push(startChunkForTag("form"));
	      var children$jscomp$4 = null,
	        innerHTML$jscomp$3 = null,
	        formAction$jscomp$1 = null,
	        formEncType$jscomp$1 = null,
	        formMethod$jscomp$1 = null,
	        formTarget$jscomp$1 = null,
	        propKey$jscomp$5;
	      for (propKey$jscomp$5 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$5)) {
	          var propValue$jscomp$5 = props[propKey$jscomp$5];
	          if (null != propValue$jscomp$5)
	            switch (propKey$jscomp$5) {
	              case "children":
	                children$jscomp$4 = propValue$jscomp$5;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$3 = propValue$jscomp$5;
	                break;
	              case "action":
	                formAction$jscomp$1 = propValue$jscomp$5;
	                break;
	              case "encType":
	                formEncType$jscomp$1 = propValue$jscomp$5;
	                break;
	              case "method":
	                formMethod$jscomp$1 = propValue$jscomp$5;
	                break;
	              case "target":
	                formTarget$jscomp$1 = propValue$jscomp$5;
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$5,
	                  propValue$jscomp$5
	                );
	            }
	        }
	      var formData$jscomp$1 = null,
	        formActionName = null;
	      if ("function" === typeof formAction$jscomp$1) {
	        var customFields = getCustomFormFields(
	          resumableState,
	          formAction$jscomp$1
	        );
	        null !== customFields
	          ? ((formAction$jscomp$1 = customFields.action || ""),
	            (formEncType$jscomp$1 = customFields.encType),
	            (formMethod$jscomp$1 = customFields.method),
	            (formTarget$jscomp$1 = customFields.target),
	            (formData$jscomp$1 = customFields.data),
	            (formActionName = customFields.name))
	          : (target$jscomp$0.push(
	              attributeSeparator,
	              stringToChunk("action"),
	              attributeAssign,
	              actionJavaScriptURL,
	              attributeEnd
	            ),
	            (formTarget$jscomp$1 =
	              formMethod$jscomp$1 =
	              formEncType$jscomp$1 =
	              formAction$jscomp$1 =
	                null),
	            injectFormReplayingRuntime(resumableState, renderState));
	      }
	      null != formAction$jscomp$1 &&
	        pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
	      null != formEncType$jscomp$1 &&
	        pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
	      null != formMethod$jscomp$1 &&
	        pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
	      null != formTarget$jscomp$1 &&
	        pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
	      target$jscomp$0.push(endOfStartTag);
	      null !== formActionName &&
	        (target$jscomp$0.push(startHiddenInputChunk),
	        pushStringAttribute(target$jscomp$0, "name", formActionName),
	        target$jscomp$0.push(endOfStartTagSelfClosing),
	        null != formData$jscomp$1 &&
	          formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
	      if ("string" === typeof children$jscomp$4) {
	        target$jscomp$0.push(
	          stringToChunk(escapeTextForBrowser(children$jscomp$4))
	        );
	        var JSCompiler_inline_result$jscomp$1 = null;
	      } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
	      return JSCompiler_inline_result$jscomp$1;
	    case "menuitem":
	      target$jscomp$0.push(startChunkForTag("menuitem"));
	      for (var propKey$jscomp$6 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$6)) {
	          var propValue$jscomp$6 = props[propKey$jscomp$6];
	          if (null != propValue$jscomp$6)
	            switch (propKey$jscomp$6) {
	              case "children":
	              case "dangerouslySetInnerHTML":
	                throw Error(
	                  "menuitems cannot have `children` nor `dangerouslySetInnerHTML`."
	                );
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$6,
	                  propValue$jscomp$6
	                );
	            }
	        }
	      target$jscomp$0.push(endOfStartTag);
	      return null;
	    case "object":
	      target$jscomp$0.push(startChunkForTag("object"));
	      var children$jscomp$5 = null,
	        innerHTML$jscomp$4 = null,
	        propKey$jscomp$7;
	      for (propKey$jscomp$7 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$7)) {
	          var propValue$jscomp$7 = props[propKey$jscomp$7];
	          if (null != propValue$jscomp$7)
	            switch (propKey$jscomp$7) {
	              case "children":
	                children$jscomp$5 = propValue$jscomp$7;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$4 = propValue$jscomp$7;
	                break;
	              case "data":
	                var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
	                if ("" === sanitizedValue) break;
	                target$jscomp$0.push(
	                  attributeSeparator,
	                  stringToChunk("data"),
	                  attributeAssign,
	                  stringToChunk(escapeTextForBrowser(sanitizedValue)),
	                  attributeEnd
	                );
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$7,
	                  propValue$jscomp$7
	                );
	            }
	        }
	      target$jscomp$0.push(endOfStartTag);
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
	      if ("string" === typeof children$jscomp$5) {
	        target$jscomp$0.push(
	          stringToChunk(escapeTextForBrowser(children$jscomp$5))
	        );
	        var JSCompiler_inline_result$jscomp$2 = null;
	      } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
	      return JSCompiler_inline_result$jscomp$2;
	    case "title":
	      if (
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp
	      )
	        var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(
	          target$jscomp$0,
	          props
	        );
	      else
	        isFallback
	          ? (JSCompiler_inline_result$jscomp$3 = null)
	          : (pushTitleImpl(renderState.hoistableChunks, props),
	            (JSCompiler_inline_result$jscomp$3 = void 0));
	      return JSCompiler_inline_result$jscomp$3;
	    case "link":
	      var rel = props.rel,
	        href = props.href,
	        precedence = props.precedence;
	      if (
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp ||
	        "string" !== typeof rel ||
	        "string" !== typeof href ||
	        "" === href
	      ) {
	        pushLinkImpl(target$jscomp$0, props);
	        var JSCompiler_inline_result$jscomp$4 = null;
	      } else if ("stylesheet" === props.rel)
	        if (
	          "string" !== typeof precedence ||
	          null != props.disabled ||
	          props.onLoad ||
	          props.onError
	        )
	          JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
	            target$jscomp$0,
	            props
	          );
	        else {
	          var styleQueue = renderState.styles.get(precedence),
	            resourceState = resumableState.styleResources.hasOwnProperty(href)
	              ? resumableState.styleResources[href]
	              : void 0;
	          if (null !== resourceState) {
	            resumableState.styleResources[href] = null;
	            styleQueue ||
	              ((styleQueue = {
	                precedence: stringToChunk(escapeTextForBrowser(precedence)),
	                rules: [],
	                hrefs: [],
	                sheets: new Map()
	              }),
	              renderState.styles.set(precedence, styleQueue));
	            var resource = {
	              state: 0,
	              props: assign({}, props, {
	                "data-precedence": props.precedence,
	                precedence: null
	              })
	            };
	            if (resourceState) {
	              2 === resourceState.length &&
	                adoptPreloadCredentials(resource.props, resourceState);
	              var preloadResource = renderState.preloads.stylesheets.get(href);
	              preloadResource && 0 < preloadResource.length
	                ? (preloadResource.length = 0)
	                : (resource.state = 1);
	            }
	            styleQueue.sheets.set(href, resource);
	            hoistableState && hoistableState.stylesheets.add(resource);
	          } else if (styleQueue) {
	            var resource$9 = styleQueue.sheets.get(href);
	            resource$9 &&
	              hoistableState &&
	              hoistableState.stylesheets.add(resource$9);
	          }
	          textEmbedded && target$jscomp$0.push(textSeparator);
	          JSCompiler_inline_result$jscomp$4 = null;
	        }
	      else
	        props.onLoad || props.onError
	          ? (JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
	              target$jscomp$0,
	              props
	            ))
	          : (textEmbedded && target$jscomp$0.push(textSeparator),
	            (JSCompiler_inline_result$jscomp$4 = isFallback
	              ? null
	              : pushLinkImpl(renderState.hoistableChunks, props)));
	      return JSCompiler_inline_result$jscomp$4;
	    case "script":
	      var asyncProp = props.async;
	      if (
	        "string" !== typeof props.src ||
	        !props.src ||
	        !asyncProp ||
	        "function" === typeof asyncProp ||
	        "symbol" === typeof asyncProp ||
	        props.onLoad ||
	        props.onError ||
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp
	      )
	        var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(
	          target$jscomp$0,
	          props
	        );
	      else {
	        var key = props.src;
	        if ("module" === props.type) {
	          var resources = resumableState.moduleScriptResources;
	          var preloads = renderState.preloads.moduleScripts;
	        } else
	          (resources = resumableState.scriptResources),
	            (preloads = renderState.preloads.scripts);
	        var resourceState$jscomp$0 = resources.hasOwnProperty(key)
	          ? resources[key]
	          : void 0;
	        if (null !== resourceState$jscomp$0) {
	          resources[key] = null;
	          var scriptProps = props;
	          if (resourceState$jscomp$0) {
	            2 === resourceState$jscomp$0.length &&
	              ((scriptProps = assign({}, props)),
	              adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
	            var preloadResource$jscomp$0 = preloads.get(key);
	            preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
	          }
	          var resource$jscomp$0 = [];
	          renderState.scripts.add(resource$jscomp$0);
	          pushScriptImpl(resource$jscomp$0, scriptProps);
	        }
	        textEmbedded && target$jscomp$0.push(textSeparator);
	        JSCompiler_inline_result$jscomp$5 = null;
	      }
	      return JSCompiler_inline_result$jscomp$5;
	    case "style":
	      var precedence$jscomp$0 = props.precedence,
	        href$jscomp$0 = props.href;
	      if (
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp ||
	        "string" !== typeof precedence$jscomp$0 ||
	        "string" !== typeof href$jscomp$0 ||
	        "" === href$jscomp$0
	      ) {
	        target$jscomp$0.push(startChunkForTag("style"));
	        var children$jscomp$6 = null,
	          innerHTML$jscomp$5 = null,
	          propKey$jscomp$8;
	        for (propKey$jscomp$8 in props)
	          if (hasOwnProperty.call(props, propKey$jscomp$8)) {
	            var propValue$jscomp$8 = props[propKey$jscomp$8];
	            if (null != propValue$jscomp$8)
	              switch (propKey$jscomp$8) {
	                case "children":
	                  children$jscomp$6 = propValue$jscomp$8;
	                  break;
	                case "dangerouslySetInnerHTML":
	                  innerHTML$jscomp$5 = propValue$jscomp$8;
	                  break;
	                default:
	                  pushAttribute(
	                    target$jscomp$0,
	                    propKey$jscomp$8,
	                    propValue$jscomp$8
	                  );
	              }
	          }
	        target$jscomp$0.push(endOfStartTag);
	        var child = Array.isArray(children$jscomp$6)
	          ? 2 > children$jscomp$6.length
	            ? children$jscomp$6[0]
	            : null
	          : children$jscomp$6;
	        "function" !== typeof child &&
	          "symbol" !== typeof child &&
	          null !== child &&
	          void 0 !== child &&
	          target$jscomp$0.push(
	            stringToChunk(("" + child).replace(styleRegex, styleReplacer))
	          );
	        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
	        target$jscomp$0.push(endChunkForTag("style"));
	        var JSCompiler_inline_result$jscomp$6 = null;
	      } else {
	        var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
	        if (
	          null !==
	          (resumableState.styleResources.hasOwnProperty(href$jscomp$0)
	            ? resumableState.styleResources[href$jscomp$0]
	            : void 0)
	        ) {
	          resumableState.styleResources[href$jscomp$0] = null;
	          styleQueue$jscomp$0
	            ? styleQueue$jscomp$0.hrefs.push(
	                stringToChunk(escapeTextForBrowser(href$jscomp$0))
	              )
	            : ((styleQueue$jscomp$0 = {
	                precedence: stringToChunk(
	                  escapeTextForBrowser(precedence$jscomp$0)
	                ),
	                rules: [],
	                hrefs: [stringToChunk(escapeTextForBrowser(href$jscomp$0))],
	                sheets: new Map()
	              }),
	              renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
	          var target = styleQueue$jscomp$0.rules,
	            children$jscomp$7 = null,
	            innerHTML$jscomp$6 = null,
	            propKey$jscomp$9;
	          for (propKey$jscomp$9 in props)
	            if (hasOwnProperty.call(props, propKey$jscomp$9)) {
	              var propValue$jscomp$9 = props[propKey$jscomp$9];
	              if (null != propValue$jscomp$9)
	                switch (propKey$jscomp$9) {
	                  case "children":
	                    children$jscomp$7 = propValue$jscomp$9;
	                    break;
	                  case "dangerouslySetInnerHTML":
	                    innerHTML$jscomp$6 = propValue$jscomp$9;
	                }
	            }
	          var child$jscomp$0 = Array.isArray(children$jscomp$7)
	            ? 2 > children$jscomp$7.length
	              ? children$jscomp$7[0]
	              : null
	            : children$jscomp$7;
	          "function" !== typeof child$jscomp$0 &&
	            "symbol" !== typeof child$jscomp$0 &&
	            null !== child$jscomp$0 &&
	            void 0 !== child$jscomp$0 &&
	            target.push(
	              stringToChunk(
	                ("" + child$jscomp$0).replace(styleRegex, styleReplacer)
	              )
	            );
	          pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
	        }
	        styleQueue$jscomp$0 &&
	          hoistableState &&
	          hoistableState.styles.add(styleQueue$jscomp$0);
	        textEmbedded && target$jscomp$0.push(textSeparator);
	        JSCompiler_inline_result$jscomp$6 = void 0;
	      }
	      return JSCompiler_inline_result$jscomp$6;
	    case "meta":
	      if (
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp
	      )
	        var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(
	          target$jscomp$0,
	          props,
	          "meta"
	        );
	      else
	        textEmbedded && target$jscomp$0.push(textSeparator),
	          (JSCompiler_inline_result$jscomp$7 = isFallback
	            ? null
	            : "string" === typeof props.charSet
	              ? pushSelfClosing(renderState.charsetChunks, props, "meta")
	              : "viewport" === props.name
	                ? pushSelfClosing(renderState.viewportChunks, props, "meta")
	                : pushSelfClosing(renderState.hoistableChunks, props, "meta"));
	      return JSCompiler_inline_result$jscomp$7;
	    case "listing":
	    case "pre":
	      target$jscomp$0.push(startChunkForTag(type));
	      var children$jscomp$8 = null,
	        innerHTML$jscomp$7 = null,
	        propKey$jscomp$10;
	      for (propKey$jscomp$10 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$10)) {
	          var propValue$jscomp$10 = props[propKey$jscomp$10];
	          if (null != propValue$jscomp$10)
	            switch (propKey$jscomp$10) {
	              case "children":
	                children$jscomp$8 = propValue$jscomp$10;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$7 = propValue$jscomp$10;
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$10,
	                  propValue$jscomp$10
	                );
	            }
	        }
	      target$jscomp$0.push(endOfStartTag);
	      if (null != innerHTML$jscomp$7) {
	        if (null != children$jscomp$8)
	          throw Error(
	            "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
	          );
	        if (
	          "object" !== typeof innerHTML$jscomp$7 ||
	          !("__html" in innerHTML$jscomp$7)
	        )
	          throw Error(
	            "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
	          );
	        var html = innerHTML$jscomp$7.__html;
	        null !== html &&
	          void 0 !== html &&
	          ("string" === typeof html && 0 < html.length && "\n" === html[0]
	            ? target$jscomp$0.push(leadingNewline, stringToChunk(html))
	            : target$jscomp$0.push(stringToChunk("" + html)));
	      }
	      "string" === typeof children$jscomp$8 &&
	        "\n" === children$jscomp$8[0] &&
	        target$jscomp$0.push(leadingNewline);
	      return children$jscomp$8;
	    case "img":
	      var src = props.src,
	        srcSet = props.srcSet;
	      if (
	        !(
	          "lazy" === props.loading ||
	          (!src && !srcSet) ||
	          ("string" !== typeof src && null != src) ||
	          ("string" !== typeof srcSet && null != srcSet)
	        ) &&
	        "low" !== props.fetchPriority &&
	        false === !!(formatContext.tagScope & 3) &&
	        ("string" !== typeof src ||
	          ":" !== src[4] ||
	          ("d" !== src[0] && "D" !== src[0]) ||
	          ("a" !== src[1] && "A" !== src[1]) ||
	          ("t" !== src[2] && "T" !== src[2]) ||
	          ("a" !== src[3] && "A" !== src[3])) &&
	        ("string" !== typeof srcSet ||
	          ":" !== srcSet[4] ||
	          ("d" !== srcSet[0] && "D" !== srcSet[0]) ||
	          ("a" !== srcSet[1] && "A" !== srcSet[1]) ||
	          ("t" !== srcSet[2] && "T" !== srcSet[2]) ||
	          ("a" !== srcSet[3] && "A" !== srcSet[3]))
	      ) {
	        var sizes = "string" === typeof props.sizes ? props.sizes : void 0,
	          key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src,
	          promotablePreloads = renderState.preloads.images,
	          resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
	        if (resource$jscomp$1) {
	          if (
	            "high" === props.fetchPriority ||
	            10 > renderState.highImagePreloads.size
	          )
	            promotablePreloads.delete(key$jscomp$0),
	              renderState.highImagePreloads.add(resource$jscomp$1);
	        } else if (
	          !resumableState.imageResources.hasOwnProperty(key$jscomp$0)
	        ) {
	          resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
	          var input = props.crossOrigin;
	          var JSCompiler_inline_result$jscomp$8 =
	            "string" === typeof input
	              ? "use-credentials" === input
	                ? input
	                : ""
	              : void 0;
	          var headers = renderState.headers,
	            header;
	          headers &&
	          0 < headers.remainingCapacity &&
	          "string" !== typeof props.srcSet &&
	          ("high" === props.fetchPriority ||
	            500 > headers.highImagePreloads.length) &&
	          ((header = getPreloadAsHeader(src, "image", {
	            imageSrcSet: props.srcSet,
	            imageSizes: props.sizes,
	            crossOrigin: JSCompiler_inline_result$jscomp$8,
	            integrity: props.integrity,
	            nonce: props.nonce,
	            type: props.type,
	            fetchPriority: props.fetchPriority,
	            referrerPolicy: props.refererPolicy
	          })),
	          0 <= (headers.remainingCapacity -= header.length + 2))
	            ? ((renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS),
	              headers.highImagePreloads && (headers.highImagePreloads += ", "),
	              (headers.highImagePreloads += header))
	            : ((resource$jscomp$1 = []),
	              pushLinkImpl(resource$jscomp$1, {
	                rel: "preload",
	                as: "image",
	                href: srcSet ? void 0 : src,
	                imageSrcSet: srcSet,
	                imageSizes: sizes,
	                crossOrigin: JSCompiler_inline_result$jscomp$8,
	                integrity: props.integrity,
	                type: props.type,
	                fetchPriority: props.fetchPriority,
	                referrerPolicy: props.referrerPolicy
	              }),
	              "high" === props.fetchPriority ||
	              10 > renderState.highImagePreloads.size
	                ? renderState.highImagePreloads.add(resource$jscomp$1)
	                : (renderState.bulkPreloads.add(resource$jscomp$1),
	                  promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
	        }
	      }
	      return pushSelfClosing(target$jscomp$0, props, "img");
	    case "base":
	    case "area":
	    case "br":
	    case "col":
	    case "embed":
	    case "hr":
	    case "keygen":
	    case "param":
	    case "source":
	    case "track":
	    case "wbr":
	      return pushSelfClosing(target$jscomp$0, props, type);
	    case "annotation-xml":
	    case "color-profile":
	    case "font-face":
	    case "font-face-src":
	    case "font-face-uri":
	    case "font-face-format":
	    case "font-face-name":
	    case "missing-glyph":
	      break;
	    case "head":
	      if (2 > formatContext.insertionMode) {
	        var preamble = preambleState || renderState.preamble;
	        if (preamble.headChunks)
	          throw Error("The `<head>` tag may only be rendered once.");
	        preamble.headChunks = [];
	        var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
	          preamble.headChunks,
	          props,
	          "head"
	        );
	      } else
	        JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
	          target$jscomp$0,
	          props,
	          "head"
	        );
	      return JSCompiler_inline_result$jscomp$9;
	    case "body":
	      if (2 > formatContext.insertionMode) {
	        var preamble$jscomp$0 = preambleState || renderState.preamble;
	        if (preamble$jscomp$0.bodyChunks)
	          throw Error("The `<body>` tag may only be rendered once.");
	        preamble$jscomp$0.bodyChunks = [];
	        var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
	          preamble$jscomp$0.bodyChunks,
	          props,
	          "body"
	        );
	      } else
	        JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
	          target$jscomp$0,
	          props,
	          "body"
	        );
	      return JSCompiler_inline_result$jscomp$10;
	    case "html":
	      if (0 === formatContext.insertionMode) {
	        var preamble$jscomp$1 = preambleState || renderState.preamble;
	        if (preamble$jscomp$1.htmlChunks)
	          throw Error("The `<html>` tag may only be rendered once.");
	        preamble$jscomp$1.htmlChunks = [doctypeChunk];
	        var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
	          preamble$jscomp$1.htmlChunks,
	          props,
	          "html"
	        );
	      } else
	        JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
	          target$jscomp$0,
	          props,
	          "html"
	        );
	      return JSCompiler_inline_result$jscomp$11;
	    default:
	      if (-1 !== type.indexOf("-")) {
	        target$jscomp$0.push(startChunkForTag(type));
	        var children$jscomp$9 = null,
	          innerHTML$jscomp$8 = null,
	          propKey$jscomp$11;
	        for (propKey$jscomp$11 in props)
	          if (hasOwnProperty.call(props, propKey$jscomp$11)) {
	            var propValue$jscomp$11 = props[propKey$jscomp$11];
	            if (null != propValue$jscomp$11) {
	              var attributeName = propKey$jscomp$11;
	              switch (propKey$jscomp$11) {
	                case "children":
	                  children$jscomp$9 = propValue$jscomp$11;
	                  break;
	                case "dangerouslySetInnerHTML":
	                  innerHTML$jscomp$8 = propValue$jscomp$11;
	                  break;
	                case "style":
	                  pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
	                  break;
	                case "suppressContentEditableWarning":
	                case "suppressHydrationWarning":
	                case "ref":
	                  break;
	                case "className":
	                  attributeName = "class";
	                default:
	                  if (
	                    isAttributeNameSafe(propKey$jscomp$11) &&
	                    "function" !== typeof propValue$jscomp$11 &&
	                    "symbol" !== typeof propValue$jscomp$11 &&
	                    false !== propValue$jscomp$11
	                  ) {
	                    if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
	                    else if ("object" === typeof propValue$jscomp$11) continue;
	                    target$jscomp$0.push(
	                      attributeSeparator,
	                      stringToChunk(attributeName),
	                      attributeAssign,
	                      stringToChunk(escapeTextForBrowser(propValue$jscomp$11)),
	                      attributeEnd
	                    );
	                  }
	              }
	            }
	          }
	        target$jscomp$0.push(endOfStartTag);
	        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
	        return children$jscomp$9;
	      }
	  }
	  return pushStartGenericElement(target$jscomp$0, props, type);
	}
	var endTagCache = new Map();
	function endChunkForTag(tag) {
	  var chunk = endTagCache.get(tag);
	  void 0 === chunk &&
	    ((chunk = stringToPrecomputedChunk("</" + tag + ">")),
	    endTagCache.set(tag, chunk));
	  return chunk;
	}
	function hoistPreambleState(renderState, preambleState) {
	  renderState = renderState.preamble;
	  null === renderState.htmlChunks &&
	    preambleState.htmlChunks &&
	    ((renderState.htmlChunks = preambleState.htmlChunks),
	    (preambleState.contribution |= 1));
	  null === renderState.headChunks &&
	    preambleState.headChunks &&
	    ((renderState.headChunks = preambleState.headChunks),
	    (preambleState.contribution |= 4));
	  null === renderState.bodyChunks &&
	    preambleState.bodyChunks &&
	    ((renderState.bodyChunks = preambleState.bodyChunks),
	    (preambleState.contribution |= 2));
	}
	function writeBootstrap(destination, renderState) {
	  renderState = renderState.bootstrapChunks;
	  for (var i = 0; i < renderState.length - 1; i++)
	    writeChunk(destination, renderState[i]);
	  return i < renderState.length
	    ? ((i = renderState[i]),
	      (renderState.length = 0),
	      writeChunkAndReturn(destination, i))
	    : true;
	}
	var placeholder1 = stringToPrecomputedChunk('<template id="'),
	  placeholder2 = stringToPrecomputedChunk('"></template>'),
	  startCompletedSuspenseBoundary = stringToPrecomputedChunk("\x3c!--$--\x3e"),
	  startPendingSuspenseBoundary1 = stringToPrecomputedChunk(
	    '\x3c!--$?--\x3e<template id="'
	  ),
	  startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>'),
	  startClientRenderedSuspenseBoundary =
	    stringToPrecomputedChunk("\x3c!--$!--\x3e"),
	  endSuspenseBoundary = stringToPrecomputedChunk("\x3c!--/$--\x3e"),
	  clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template"),
	  clientRenderedSuspenseBoundaryErrorAttrInterstitial =
	    stringToPrecomputedChunk('"'),
	  clientRenderedSuspenseBoundaryError1A =
	    stringToPrecomputedChunk(' data-dgst="');
	stringToPrecomputedChunk(' data-msg="');
	stringToPrecomputedChunk(' data-stck="');
	stringToPrecomputedChunk(' data-cstck="');
	var clientRenderedSuspenseBoundaryError2 =
	  stringToPrecomputedChunk("></template>");
	function writeStartPendingSuspenseBoundary(destination, renderState, id) {
	  writeChunk(destination, startPendingSuspenseBoundary1);
	  if (null === id)
	    throw Error(
	      "An ID must have been assigned before we can complete the boundary."
	    );
	  writeChunk(destination, renderState.boundaryPrefix);
	  writeChunk(destination, stringToChunk(id.toString(16)));
	  return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
	}
	var boundaryPreambleContributionChunkStart =
	    stringToPrecomputedChunk("\x3c!--"),
	  boundaryPreambleContributionChunkEnd = stringToPrecomputedChunk("--\x3e");
	function writePreambleContribution(destination, preambleState) {
	  preambleState = preambleState.contribution;
	  0 !== preambleState &&
	    (writeChunk(destination, boundaryPreambleContributionChunkStart),
	    writeChunk(destination, stringToChunk("" + preambleState)),
	    writeChunk(destination, boundaryPreambleContributionChunkEnd));
	}
	var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="'),
	  startSegmentHTML2 = stringToPrecomputedChunk('">'),
	  endSegmentHTML = stringToPrecomputedChunk("</div>"),
	  startSegmentSVG = stringToPrecomputedChunk(
	    '<svg aria-hidden="true" style="display:none" id="'
	  ),
	  startSegmentSVG2 = stringToPrecomputedChunk('">'),
	  endSegmentSVG = stringToPrecomputedChunk("</svg>"),
	  startSegmentMathML = stringToPrecomputedChunk(
	    '<math aria-hidden="true" style="display:none" id="'
	  ),
	  startSegmentMathML2 = stringToPrecomputedChunk('">'),
	  endSegmentMathML = stringToPrecomputedChunk("</math>"),
	  startSegmentTable = stringToPrecomputedChunk('<table hidden id="'),
	  startSegmentTable2 = stringToPrecomputedChunk('">'),
	  endSegmentTable = stringToPrecomputedChunk("</table>"),
	  startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="'),
	  startSegmentTableBody2 = stringToPrecomputedChunk('">'),
	  endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>"),
	  startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="'),
	  startSegmentTableRow2 = stringToPrecomputedChunk('">'),
	  endSegmentTableRow = stringToPrecomputedChunk("</tr></table>"),
	  startSegmentColGroup = stringToPrecomputedChunk(
	    '<table hidden><colgroup id="'
	  ),
	  startSegmentColGroup2 = stringToPrecomputedChunk('">'),
	  endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
	function writeStartSegment(destination, renderState, formatContext, id) {
	  switch (formatContext.insertionMode) {
	    case 0:
	    case 1:
	    case 3:
	    case 2:
	      return (
	        writeChunk(destination, startSegmentHTML),
	        writeChunk(destination, renderState.segmentPrefix),
	        writeChunk(destination, stringToChunk(id.toString(16))),
	        writeChunkAndReturn(destination, startSegmentHTML2)
	      );
	    case 4:
	      return (
	        writeChunk(destination, startSegmentSVG),
	        writeChunk(destination, renderState.segmentPrefix),
	        writeChunk(destination, stringToChunk(id.toString(16))),
	        writeChunkAndReturn(destination, startSegmentSVG2)
	      );
	    case 5:
	      return (
	        writeChunk(destination, startSegmentMathML),
	        writeChunk(destination, renderState.segmentPrefix),
	        writeChunk(destination, stringToChunk(id.toString(16))),
	        writeChunkAndReturn(destination, startSegmentMathML2)
	      );
	    case 6:
	      return (
	        writeChunk(destination, startSegmentTable),
	        writeChunk(destination, renderState.segmentPrefix),
	        writeChunk(destination, stringToChunk(id.toString(16))),
	        writeChunkAndReturn(destination, startSegmentTable2)
	      );
	    case 7:
	      return (
	        writeChunk(destination, startSegmentTableBody),
	        writeChunk(destination, renderState.segmentPrefix),
	        writeChunk(destination, stringToChunk(id.toString(16))),
	        writeChunkAndReturn(destination, startSegmentTableBody2)
	      );
	    case 8:
	      return (
	        writeChunk(destination, startSegmentTableRow),
	        writeChunk(destination, renderState.segmentPrefix),
	        writeChunk(destination, stringToChunk(id.toString(16))),
	        writeChunkAndReturn(destination, startSegmentTableRow2)
	      );
	    case 9:
	      return (
	        writeChunk(destination, startSegmentColGroup),
	        writeChunk(destination, renderState.segmentPrefix),
	        writeChunk(destination, stringToChunk(id.toString(16))),
	        writeChunkAndReturn(destination, startSegmentColGroup2)
	      );
	    default:
	      throw Error("Unknown insertion mode. This is a bug in React.");
	  }
	}
	function writeEndSegment(destination, formatContext) {
	  switch (formatContext.insertionMode) {
	    case 0:
	    case 1:
	    case 3:
	    case 2:
	      return writeChunkAndReturn(destination, endSegmentHTML);
	    case 4:
	      return writeChunkAndReturn(destination, endSegmentSVG);
	    case 5:
	      return writeChunkAndReturn(destination, endSegmentMathML);
	    case 6:
	      return writeChunkAndReturn(destination, endSegmentTable);
	    case 7:
	      return writeChunkAndReturn(destination, endSegmentTableBody);
	    case 8:
	      return writeChunkAndReturn(destination, endSegmentTableRow);
	    case 9:
	      return writeChunkAndReturn(destination, endSegmentColGroup);
	    default:
	      throw Error("Unknown insertion mode. This is a bug in React.");
	  }
	}
	var completeSegmentScript1Full = stringToPrecomputedChunk(
	    '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'
	  ),
	  completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("'),
	  completeSegmentScript2 = stringToPrecomputedChunk('","'),
	  completeSegmentScriptEnd = stringToPrecomputedChunk('")\x3c/script>');
	stringToPrecomputedChunk('<template data-rsi="" data-sid="');
	stringToPrecomputedChunk('" data-pid="');
	var completeBoundaryScript1Full = stringToPrecomputedChunk(
	    '$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RC("'
	  ),
	  completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("'),
	  completeBoundaryWithStylesScript1FullBoth = stringToPrecomputedChunk(
	    '$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RM=new Map;\n$RR=function(t,u,y){function v(n){this._p=null;n()}for(var w=$RC,p=$RM,q=new Map,r=document,g,b,h=r.querySelectorAll("link[data-precedence],style[data-precedence]"),x=[],k=0;b=h[k++];)"not all"===b.getAttribute("media")?x.push(b):("LINK"===b.tagName&&p.set(b.getAttribute("href"),b),q.set(b.dataset.precedence,g=b));b=0;h=[];var l,a;for(k=!0;;){if(k){var e=y[b++];if(!e){k=!1;b=0;continue}var c=!1,m=0;var d=e[m++];if(a=p.get(d)){var f=a._p;c=!0}else{a=r.createElement("link");a.href=\nd;a.rel="stylesheet";for(a.dataset.precedence=l=e[m++];f=e[m++];)a.setAttribute(f,e[m++]);f=a._p=new Promise(function(n,z){a.onload=v.bind(a,n);a.onerror=v.bind(a,z)});p.set(d,a)}d=a.getAttribute("media");!f||d&&!matchMedia(d).matches||h.push(f);if(c)continue}else{a=x[b++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=q.get(l)||g;c===g&&(g=a);q.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=r.head,c.insertBefore(a,c.firstChild))}Promise.all(h).then(w.bind(null,\nt,u,""),w.bind(null,t,u,"Resource failed to load"))};$RR("'
	  ),
	  completeBoundaryWithStylesScript1FullPartial = stringToPrecomputedChunk(
	    '$RM=new Map;\n$RR=function(t,u,y){function v(n){this._p=null;n()}for(var w=$RC,p=$RM,q=new Map,r=document,g,b,h=r.querySelectorAll("link[data-precedence],style[data-precedence]"),x=[],k=0;b=h[k++];)"not all"===b.getAttribute("media")?x.push(b):("LINK"===b.tagName&&p.set(b.getAttribute("href"),b),q.set(b.dataset.precedence,g=b));b=0;h=[];var l,a;for(k=!0;;){if(k){var e=y[b++];if(!e){k=!1;b=0;continue}var c=!1,m=0;var d=e[m++];if(a=p.get(d)){var f=a._p;c=!0}else{a=r.createElement("link");a.href=\nd;a.rel="stylesheet";for(a.dataset.precedence=l=e[m++];f=e[m++];)a.setAttribute(f,e[m++]);f=a._p=new Promise(function(n,z){a.onload=v.bind(a,n);a.onerror=v.bind(a,z)});p.set(d,a)}d=a.getAttribute("media");!f||d&&!matchMedia(d).matches||h.push(f);if(c)continue}else{a=x[b++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=q.get(l)||g;c===g&&(g=a);q.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=r.head,c.insertBefore(a,c.firstChild))}Promise.all(h).then(w.bind(null,\nt,u,""),w.bind(null,t,u,"Resource failed to load"))};$RR("'
	  ),
	  completeBoundaryWithStylesScript1Partial = stringToPrecomputedChunk('$RR("'),
	  completeBoundaryScript2 = stringToPrecomputedChunk('","'),
	  completeBoundaryScript3a = stringToPrecomputedChunk('",'),
	  completeBoundaryScript3b = stringToPrecomputedChunk('"'),
	  completeBoundaryScriptEnd = stringToPrecomputedChunk(")\x3c/script>");
	stringToPrecomputedChunk('<template data-rci="" data-bid="');
	stringToPrecomputedChunk('<template data-rri="" data-bid="');
	stringToPrecomputedChunk('" data-sid="');
	stringToPrecomputedChunk('" data-sty="');
	var clientRenderScript1Full = stringToPrecomputedChunk(
	    '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("'
	  ),
	  clientRenderScript1Partial = stringToPrecomputedChunk('$RX("'),
	  clientRenderScript1A = stringToPrecomputedChunk('"'),
	  clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(","),
	  clientRenderScriptEnd = stringToPrecomputedChunk(")\x3c/script>");
	stringToPrecomputedChunk('<template data-rxi="" data-bid="');
	stringToPrecomputedChunk('" data-dgst="');
	stringToPrecomputedChunk('" data-msg="');
	stringToPrecomputedChunk('" data-stck="');
	stringToPrecomputedChunk('" data-cstck="');
	var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
	function escapeJSStringsForInstructionScripts(input) {
	  return JSON.stringify(input).replace(
	    regexForJSStringsInInstructionScripts,
	    function (match) {
	      switch (match) {
	        case "<":
	          return "\\u003c";
	        case "\u2028":
	          return "\\u2028";
	        case "\u2029":
	          return "\\u2029";
	        default:
	          throw Error(
	            "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
	          );
	      }
	    }
	  );
	}
	var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
	function escapeJSObjectForInstructionScripts(input) {
	  return JSON.stringify(input).replace(
	    regexForJSStringsInScripts,
	    function (match) {
	      switch (match) {
	        case "&":
	          return "\\u0026";
	        case ">":
	          return "\\u003e";
	        case "<":
	          return "\\u003c";
	        case "\u2028":
	          return "\\u2028";
	        case "\u2029":
	          return "\\u2029";
	        default:
	          throw Error(
	            "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
	          );
	      }
	    }
	  );
	}
	var lateStyleTagResourceOpen1 = stringToPrecomputedChunk(
	    '<style media="not all" data-precedence="'
	  ),
	  lateStyleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="'),
	  lateStyleTagResourceOpen3 = stringToPrecomputedChunk('">'),
	  lateStyleTagTemplateClose = stringToPrecomputedChunk("</style>"),
	  currentlyRenderingBoundaryHasStylesToHoist = false,
	  destinationHasCapacity = true;
	function flushStyleTagsLateForBoundary(styleQueue) {
	  var rules = styleQueue.rules,
	    hrefs = styleQueue.hrefs,
	    i = 0;
	  if (hrefs.length) {
	    writeChunk(this, lateStyleTagResourceOpen1);
	    writeChunk(this, styleQueue.precedence);
	    for (writeChunk(this, lateStyleTagResourceOpen2); i < hrefs.length - 1; i++)
	      writeChunk(this, hrefs[i]), writeChunk(this, spaceSeparator);
	    writeChunk(this, hrefs[i]);
	    writeChunk(this, lateStyleTagResourceOpen3);
	    for (i = 0; i < rules.length; i++) writeChunk(this, rules[i]);
	    destinationHasCapacity = writeChunkAndReturn(
	      this,
	      lateStyleTagTemplateClose
	    );
	    currentlyRenderingBoundaryHasStylesToHoist = true;
	    rules.length = 0;
	    hrefs.length = 0;
	  }
	}
	function hasStylesToHoist(stylesheet) {
	  return 2 !== stylesheet.state
	    ? (currentlyRenderingBoundaryHasStylesToHoist = true)
	    : false;
	}
	function writeHoistablesForBoundary(destination, hoistableState, renderState) {
	  currentlyRenderingBoundaryHasStylesToHoist = false;
	  destinationHasCapacity = true;
	  hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
	  hoistableState.stylesheets.forEach(hasStylesToHoist);
	  currentlyRenderingBoundaryHasStylesToHoist &&
	    (renderState.stylesToHoist = true);
	  return destinationHasCapacity;
	}
	function flushResource(resource) {
	  for (var i = 0; i < resource.length; i++) writeChunk(this, resource[i]);
	  resource.length = 0;
	}
	var stylesheetFlushingQueue = [];
	function flushStyleInPreamble(stylesheet) {
	  pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
	  for (var i = 0; i < stylesheetFlushingQueue.length; i++)
	    writeChunk(this, stylesheetFlushingQueue[i]);
	  stylesheetFlushingQueue.length = 0;
	  stylesheet.state = 2;
	}
	var styleTagResourceOpen1 = stringToPrecomputedChunk(
	    '<style data-precedence="'
	  ),
	  styleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="'),
	  spaceSeparator = stringToPrecomputedChunk(" "),
	  styleTagResourceOpen3 = stringToPrecomputedChunk('">'),
	  styleTagResourceClose = stringToPrecomputedChunk("</style>");
	function flushStylesInPreamble(styleQueue) {
	  var hasStylesheets = 0 < styleQueue.sheets.size;
	  styleQueue.sheets.forEach(flushStyleInPreamble, this);
	  styleQueue.sheets.clear();
	  var rules = styleQueue.rules,
	    hrefs = styleQueue.hrefs;
	  if (!hasStylesheets || hrefs.length) {
	    writeChunk(this, styleTagResourceOpen1);
	    writeChunk(this, styleQueue.precedence);
	    styleQueue = 0;
	    if (hrefs.length) {
	      for (
	        writeChunk(this, styleTagResourceOpen2);
	        styleQueue < hrefs.length - 1;
	        styleQueue++
	      )
	        writeChunk(this, hrefs[styleQueue]), writeChunk(this, spaceSeparator);
	      writeChunk(this, hrefs[styleQueue]);
	    }
	    writeChunk(this, styleTagResourceOpen3);
	    for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
	      writeChunk(this, rules[styleQueue]);
	    writeChunk(this, styleTagResourceClose);
	    rules.length = 0;
	    hrefs.length = 0;
	  }
	}
	function preloadLateStyle(stylesheet) {
	  if (0 === stylesheet.state) {
	    stylesheet.state = 1;
	    var props = stylesheet.props;
	    pushLinkImpl(stylesheetFlushingQueue, {
	      rel: "preload",
	      as: "style",
	      href: stylesheet.props.href,
	      crossOrigin: props.crossOrigin,
	      fetchPriority: props.fetchPriority,
	      integrity: props.integrity,
	      media: props.media,
	      hrefLang: props.hrefLang,
	      referrerPolicy: props.referrerPolicy
	    });
	    for (
	      stylesheet = 0;
	      stylesheet < stylesheetFlushingQueue.length;
	      stylesheet++
	    )
	      writeChunk(this, stylesheetFlushingQueue[stylesheet]);
	    stylesheetFlushingQueue.length = 0;
	  }
	}
	function preloadLateStyles(styleQueue) {
	  styleQueue.sheets.forEach(preloadLateStyle, this);
	  styleQueue.sheets.clear();
	}
	var arrayFirstOpenBracket = stringToPrecomputedChunk("["),
	  arraySubsequentOpenBracket = stringToPrecomputedChunk(",["),
	  arrayInterstitial = stringToPrecomputedChunk(","),
	  arrayCloseBracket = stringToPrecomputedChunk("]");
	function writeStyleResourceDependenciesInJS(destination, hoistableState) {
	  writeChunk(destination, arrayFirstOpenBracket);
	  var nextArrayOpenBrackChunk = arrayFirstOpenBracket;
	  hoistableState.stylesheets.forEach(function (resource) {
	    if (2 !== resource.state)
	      if (3 === resource.state)
	        writeChunk(destination, nextArrayOpenBrackChunk),
	          writeChunk(
	            destination,
	            stringToChunk(
	              escapeJSObjectForInstructionScripts("" + resource.props.href)
	            )
	          ),
	          writeChunk(destination, arrayCloseBracket),
	          (nextArrayOpenBrackChunk = arraySubsequentOpenBracket);
	      else {
	        writeChunk(destination, nextArrayOpenBrackChunk);
	        var precedence = resource.props["data-precedence"],
	          props = resource.props,
	          coercedHref = sanitizeURL("" + resource.props.href);
	        writeChunk(
	          destination,
	          stringToChunk(escapeJSObjectForInstructionScripts(coercedHref))
	        );
	        precedence = "" + precedence;
	        writeChunk(destination, arrayInterstitial);
	        writeChunk(
	          destination,
	          stringToChunk(escapeJSObjectForInstructionScripts(precedence))
	        );
	        for (var propKey in props)
	          if (
	            hasOwnProperty.call(props, propKey) &&
	            ((precedence = props[propKey]), null != precedence)
	          )
	            switch (propKey) {
	              case "href":
	              case "rel":
	              case "precedence":
	              case "data-precedence":
	                break;
	              case "children":
	              case "dangerouslySetInnerHTML":
	                throw Error(
	                  "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
	                );
	              default:
	                writeStyleResourceAttributeInJS(
	                  destination,
	                  propKey,
	                  precedence
	                );
	            }
	        writeChunk(destination, arrayCloseBracket);
	        nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
	        resource.state = 3;
	      }
	  });
	  writeChunk(destination, arrayCloseBracket);
	}
	function writeStyleResourceAttributeInJS(destination, name, value) {
	  var attributeName = name.toLowerCase();
	  switch (typeof value) {
	    case "function":
	    case "symbol":
	      return;
	  }
	  switch (name) {
	    case "innerHTML":
	    case "dangerouslySetInnerHTML":
	    case "suppressContentEditableWarning":
	    case "suppressHydrationWarning":
	    case "style":
	    case "ref":
	      return;
	    case "className":
	      attributeName = "class";
	      name = "" + value;
	      break;
	    case "hidden":
	      if (false === value) return;
	      name = "";
	      break;
	    case "src":
	    case "href":
	      value = sanitizeURL(value);
	      name = "" + value;
	      break;
	    default:
	      if (
	        (2 < name.length &&
	          ("o" === name[0] || "O" === name[0]) &&
	          ("n" === name[1] || "N" === name[1])) ||
	        !isAttributeNameSafe(name)
	      )
	        return;
	      name = "" + value;
	  }
	  writeChunk(destination, arrayInterstitial);
	  writeChunk(
	    destination,
	    stringToChunk(escapeJSObjectForInstructionScripts(attributeName))
	  );
	  writeChunk(destination, arrayInterstitial);
	  writeChunk(
	    destination,
	    stringToChunk(escapeJSObjectForInstructionScripts(name))
	  );
	}
	function createHoistableState() {
	  return { styles: new Set(), stylesheets: new Set() };
	}
	function prefetchDNS(href) {
	  var request = resolveRequest();
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if ("string" === typeof href && href) {
	      if (!resumableState.dnsResources.hasOwnProperty(href)) {
	        resumableState.dnsResources[href] = null;
	        resumableState = renderState.headers;
	        var header, JSCompiler_temp;
	        if (
	          (JSCompiler_temp =
	            resumableState && 0 < resumableState.remainingCapacity)
	        )
	          JSCompiler_temp =
	            ((header =
	              "<" +
	              ("" + href).replace(
	                regexForHrefInLinkHeaderURLContext,
	                escapeHrefForLinkHeaderURLContextReplacer
	              ) +
	              ">; rel=dns-prefetch"),
	            0 <= (resumableState.remainingCapacity -= header.length + 2));
	        JSCompiler_temp
	          ? ((renderState.resets.dns[href] = null),
	            resumableState.preconnects && (resumableState.preconnects += ", "),
	            (resumableState.preconnects += header))
	          : ((header = []),
	            pushLinkImpl(header, { href: href, rel: "dns-prefetch" }),
	            renderState.preconnects.add(header));
	      }
	      enqueueFlush(request);
	    }
	  } else previousDispatcher.D(href);
	}
	function preconnect(href, crossOrigin) {
	  var request = resolveRequest();
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if ("string" === typeof href && href) {
	      var bucket =
	        "use-credentials" === crossOrigin
	          ? "credentials"
	          : "string" === typeof crossOrigin
	            ? "anonymous"
	            : "default";
	      if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
	        resumableState.connectResources[bucket][href] = null;
	        resumableState = renderState.headers;
	        var header, JSCompiler_temp;
	        if (
	          (JSCompiler_temp =
	            resumableState && 0 < resumableState.remainingCapacity)
	        ) {
	          JSCompiler_temp =
	            "<" +
	            ("" + href).replace(
	              regexForHrefInLinkHeaderURLContext,
	              escapeHrefForLinkHeaderURLContextReplacer
	            ) +
	            ">; rel=preconnect";
	          if ("string" === typeof crossOrigin) {
	            var escapedCrossOrigin = ("" + crossOrigin).replace(
	              regexForLinkHeaderQuotedParamValueContext,
	              escapeStringForLinkHeaderQuotedParamValueContextReplacer
	            );
	            JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
	          }
	          JSCompiler_temp =
	            ((header = JSCompiler_temp),
	            0 <= (resumableState.remainingCapacity -= header.length + 2));
	        }
	        JSCompiler_temp
	          ? ((renderState.resets.connect[bucket][href] = null),
	            resumableState.preconnects && (resumableState.preconnects += ", "),
	            (resumableState.preconnects += header))
	          : ((bucket = []),
	            pushLinkImpl(bucket, {
	              rel: "preconnect",
	              href: href,
	              crossOrigin: crossOrigin
	            }),
	            renderState.preconnects.add(bucket));
	      }
	      enqueueFlush(request);
	    }
	  } else previousDispatcher.C(href, crossOrigin);
	}
	function preload(href, as, options) {
	  var request = resolveRequest();
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (as && href) {
	      switch (as) {
	        case "image":
	          if (options) {
	            var imageSrcSet = options.imageSrcSet;
	            var imageSizes = options.imageSizes;
	            var fetchPriority = options.fetchPriority;
	          }
	          var key = imageSrcSet
	            ? imageSrcSet + "\n" + (imageSizes || "")
	            : href;
	          if (resumableState.imageResources.hasOwnProperty(key)) return;
	          resumableState.imageResources[key] = PRELOAD_NO_CREDS;
	          resumableState = renderState.headers;
	          var header;
	          resumableState &&
	          0 < resumableState.remainingCapacity &&
	          "string" !== typeof imageSrcSet &&
	          "high" === fetchPriority &&
	          ((header = getPreloadAsHeader(href, as, options)),
	          0 <= (resumableState.remainingCapacity -= header.length + 2))
	            ? ((renderState.resets.image[key] = PRELOAD_NO_CREDS),
	              resumableState.highImagePreloads &&
	                (resumableState.highImagePreloads += ", "),
	              (resumableState.highImagePreloads += header))
	            : ((resumableState = []),
	              pushLinkImpl(
	                resumableState,
	                assign(
	                  { rel: "preload", href: imageSrcSet ? void 0 : href, as: as },
	                  options
	                )
	              ),
	              "high" === fetchPriority
	                ? renderState.highImagePreloads.add(resumableState)
	                : (renderState.bulkPreloads.add(resumableState),
	                  renderState.preloads.images.set(key, resumableState)));
	          break;
	        case "style":
	          if (resumableState.styleResources.hasOwnProperty(href)) return;
	          imageSrcSet = [];
	          pushLinkImpl(
	            imageSrcSet,
	            assign({ rel: "preload", href: href, as: as }, options)
	          );
	          resumableState.styleResources[href] =
	            !options ||
	            ("string" !== typeof options.crossOrigin &&
	              "string" !== typeof options.integrity)
	              ? PRELOAD_NO_CREDS
	              : [options.crossOrigin, options.integrity];
	          renderState.preloads.stylesheets.set(href, imageSrcSet);
	          renderState.bulkPreloads.add(imageSrcSet);
	          break;
	        case "script":
	          if (resumableState.scriptResources.hasOwnProperty(href)) return;
	          imageSrcSet = [];
	          renderState.preloads.scripts.set(href, imageSrcSet);
	          renderState.bulkPreloads.add(imageSrcSet);
	          pushLinkImpl(
	            imageSrcSet,
	            assign({ rel: "preload", href: href, as: as }, options)
	          );
	          resumableState.scriptResources[href] =
	            !options ||
	            ("string" !== typeof options.crossOrigin &&
	              "string" !== typeof options.integrity)
	              ? PRELOAD_NO_CREDS
	              : [options.crossOrigin, options.integrity];
	          break;
	        default:
	          if (resumableState.unknownResources.hasOwnProperty(as)) {
	            if (
	              ((imageSrcSet = resumableState.unknownResources[as]),
	              imageSrcSet.hasOwnProperty(href))
	            )
	              return;
	          } else
	            (imageSrcSet = {}),
	              (resumableState.unknownResources[as] = imageSrcSet);
	          imageSrcSet[href] = PRELOAD_NO_CREDS;
	          if (
	            (resumableState = renderState.headers) &&
	            0 < resumableState.remainingCapacity &&
	            "font" === as &&
	            ((key = getPreloadAsHeader(href, as, options)),
	            0 <= (resumableState.remainingCapacity -= key.length + 2))
	          )
	            (renderState.resets.font[href] = PRELOAD_NO_CREDS),
	              resumableState.fontPreloads &&
	                (resumableState.fontPreloads += ", "),
	              (resumableState.fontPreloads += key);
	          else
	            switch (
	              ((resumableState = []),
	              (href = assign({ rel: "preload", href: href, as: as }, options)),
	              pushLinkImpl(resumableState, href),
	              as)
	            ) {
	              case "font":
	                renderState.fontPreloads.add(resumableState);
	                break;
	              default:
	                renderState.bulkPreloads.add(resumableState);
	            }
	      }
	      enqueueFlush(request);
	    }
	  } else previousDispatcher.L(href, as, options);
	}
	function preloadModule(href, options) {
	  var request = resolveRequest();
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (href) {
	      var as =
	        options && "string" === typeof options.as ? options.as : "script";
	      switch (as) {
	        case "script":
	          if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
	          as = [];
	          resumableState.moduleScriptResources[href] =
	            !options ||
	            ("string" !== typeof options.crossOrigin &&
	              "string" !== typeof options.integrity)
	              ? PRELOAD_NO_CREDS
	              : [options.crossOrigin, options.integrity];
	          renderState.preloads.moduleScripts.set(href, as);
	          break;
	        default:
	          if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
	            var resources = resumableState.unknownResources[as];
	            if (resources.hasOwnProperty(href)) return;
	          } else
	            (resources = {}),
	              (resumableState.moduleUnknownResources[as] = resources);
	          as = [];
	          resources[href] = PRELOAD_NO_CREDS;
	      }
	      pushLinkImpl(as, assign({ rel: "modulepreload", href: href }, options));
	      renderState.bulkPreloads.add(as);
	      enqueueFlush(request);
	    }
	  } else previousDispatcher.m(href, options);
	}
	function preinitStyle(href, precedence, options) {
	  var request = resolveRequest();
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (href) {
	      precedence = precedence || "default";
	      var styleQueue = renderState.styles.get(precedence),
	        resourceState = resumableState.styleResources.hasOwnProperty(href)
	          ? resumableState.styleResources[href]
	          : void 0;
	      null !== resourceState &&
	        ((resumableState.styleResources[href] = null),
	        styleQueue ||
	          ((styleQueue = {
	            precedence: stringToChunk(escapeTextForBrowser(precedence)),
	            rules: [],
	            hrefs: [],
	            sheets: new Map()
	          }),
	          renderState.styles.set(precedence, styleQueue)),
	        (precedence = {
	          state: 0,
	          props: assign(
	            { rel: "stylesheet", href: href, "data-precedence": precedence },
	            options
	          )
	        }),
	        resourceState &&
	          (2 === resourceState.length &&
	            adoptPreloadCredentials(precedence.props, resourceState),
	          (renderState = renderState.preloads.stylesheets.get(href)) &&
	          0 < renderState.length
	            ? (renderState.length = 0)
	            : (precedence.state = 1)),
	        styleQueue.sheets.set(href, precedence),
	        enqueueFlush(request));
	    }
	  } else previousDispatcher.S(href, precedence, options);
	}
	function preinitScript(src, options) {
	  var request = resolveRequest();
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (src) {
	      var resourceState = resumableState.scriptResources.hasOwnProperty(src)
	        ? resumableState.scriptResources[src]
	        : void 0;
	      null !== resourceState &&
	        ((resumableState.scriptResources[src] = null),
	        (options = assign({ src: src, async: true }, options)),
	        resourceState &&
	          (2 === resourceState.length &&
	            adoptPreloadCredentials(options, resourceState),
	          (src = renderState.preloads.scripts.get(src))) &&
	          (src.length = 0),
	        (src = []),
	        renderState.scripts.add(src),
	        pushScriptImpl(src, options),
	        enqueueFlush(request));
	    }
	  } else previousDispatcher.X(src, options);
	}
	function preinitModuleScript(src, options) {
	  var request = resolveRequest();
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (src) {
	      var resourceState = resumableState.moduleScriptResources.hasOwnProperty(
	        src
	      )
	        ? resumableState.moduleScriptResources[src]
	        : void 0;
	      null !== resourceState &&
	        ((resumableState.moduleScriptResources[src] = null),
	        (options = assign({ src: src, type: "module", async: true }, options)),
	        resourceState &&
	          (2 === resourceState.length &&
	            adoptPreloadCredentials(options, resourceState),
	          (src = renderState.preloads.moduleScripts.get(src))) &&
	          (src.length = 0),
	        (src = []),
	        renderState.scripts.add(src),
	        pushScriptImpl(src, options),
	        enqueueFlush(request));
	    }
	  } else previousDispatcher.M(src, options);
	}
	function adoptPreloadCredentials(target, preloadState) {
	  null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
	  null == target.integrity && (target.integrity = preloadState[1]);
	}
	function getPreloadAsHeader(href, as, params) {
	  href = ("" + href).replace(
	    regexForHrefInLinkHeaderURLContext,
	    escapeHrefForLinkHeaderURLContextReplacer
	  );
	  as = ("" + as).replace(
	    regexForLinkHeaderQuotedParamValueContext,
	    escapeStringForLinkHeaderQuotedParamValueContextReplacer
	  );
	  as = "<" + href + '>; rel=preload; as="' + as + '"';
	  for (var paramName in params)
	    hasOwnProperty.call(params, paramName) &&
	      ((href = params[paramName]),
	      "string" === typeof href &&
	        (as +=
	          "; " +
	          paramName.toLowerCase() +
	          '="' +
	          ("" + href).replace(
	            regexForLinkHeaderQuotedParamValueContext,
	            escapeStringForLinkHeaderQuotedParamValueContextReplacer
	          ) +
	          '"'));
	  return as;
	}
	var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
	function escapeHrefForLinkHeaderURLContextReplacer(match) {
	  switch (match) {
	    case "<":
	      return "%3C";
	    case ">":
	      return "%3E";
	    case "\n":
	      return "%0A";
	    case "\r":
	      return "%0D";
	    default:
	      throw Error(
	        "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
	      );
	  }
	}
	var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
	function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
	  switch (match) {
	    case '"':
	      return "%22";
	    case "'":
	      return "%27";
	    case ";":
	      return "%3B";
	    case ",":
	      return "%2C";
	    case "\n":
	      return "%0A";
	    case "\r":
	      return "%0D";
	    default:
	      throw Error(
	        "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
	      );
	  }
	}
	function hoistStyleQueueDependency(styleQueue) {
	  this.styles.add(styleQueue);
	}
	function hoistStylesheetDependency(stylesheet) {
	  this.stylesheets.add(stylesheet);
	}
	var bind = Function.prototype.bind,
	  supportsRequestStorage = "function" === typeof AsyncLocalStorage,
	  requestStorage = supportsRequestStorage ? new AsyncLocalStorage() : null,
	  REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
	  if (null == type) return null;
	  if ("function" === typeof type)
	    return type.$$typeof === REACT_CLIENT_REFERENCE
	      ? null
	      : type.displayName || type.name || null;
	  if ("string" === typeof type) return type;
	  switch (type) {
	    case REACT_FRAGMENT_TYPE:
	      return "Fragment";
	    case REACT_PROFILER_TYPE:
	      return "Profiler";
	    case REACT_STRICT_MODE_TYPE:
	      return "StrictMode";
	    case REACT_SUSPENSE_TYPE:
	      return "Suspense";
	    case REACT_SUSPENSE_LIST_TYPE:
	      return "SuspenseList";
	    case REACT_ACTIVITY_TYPE:
	      return "Activity";
	  }
	  if ("object" === typeof type)
	    switch (type.$$typeof) {
	      case REACT_PORTAL_TYPE:
	        return "Portal";
	      case REACT_CONTEXT_TYPE:
	        return (type.displayName || "Context") + ".Provider";
	      case REACT_CONSUMER_TYPE:
	        return (type._context.displayName || "Context") + ".Consumer";
	      case REACT_FORWARD_REF_TYPE:
	        var innerType = type.render;
	        type = type.displayName;
	        type ||
	          ((type = innerType.displayName || innerType.name || ""),
	          (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
	        return type;
	      case REACT_MEMO_TYPE:
	        return (
	          (innerType = type.displayName || null),
	          null !== innerType
	            ? innerType
	            : getComponentNameFromType(type.type) || "Memo"
	        );
	      case REACT_LAZY_TYPE:
	        innerType = type._payload;
	        type = type._init;
	        try {
	          return getComponentNameFromType(type(innerType));
	        } catch (x) {}
	    }
	  return null;
	}
	var emptyContextObject = {},
	  currentActiveSnapshot = null;
	function popToNearestCommonAncestor(prev, next) {
	  if (prev !== next) {
	    prev.context._currentValue = prev.parentValue;
	    prev = prev.parent;
	    var parentNext = next.parent;
	    if (null === prev) {
	      if (null !== parentNext)
	        throw Error(
	          "The stacks must reach the root at the same time. This is a bug in React."
	        );
	    } else {
	      if (null === parentNext)
	        throw Error(
	          "The stacks must reach the root at the same time. This is a bug in React."
	        );
	      popToNearestCommonAncestor(prev, parentNext);
	    }
	    next.context._currentValue = next.value;
	  }
	}
	function popAllPrevious(prev) {
	  prev.context._currentValue = prev.parentValue;
	  prev = prev.parent;
	  null !== prev && popAllPrevious(prev);
	}
	function pushAllNext(next) {
	  var parentNext = next.parent;
	  null !== parentNext && pushAllNext(parentNext);
	  next.context._currentValue = next.value;
	}
	function popPreviousToCommonLevel(prev, next) {
	  prev.context._currentValue = prev.parentValue;
	  prev = prev.parent;
	  if (null === prev)
	    throw Error(
	      "The depth must equal at least at zero before reaching the root. This is a bug in React."
	    );
	  prev.depth === next.depth
	    ? popToNearestCommonAncestor(prev, next)
	    : popPreviousToCommonLevel(prev, next);
	}
	function popNextToCommonLevel(prev, next) {
	  var parentNext = next.parent;
	  if (null === parentNext)
	    throw Error(
	      "The depth must equal at least at zero before reaching the root. This is a bug in React."
	    );
	  prev.depth === parentNext.depth
	    ? popToNearestCommonAncestor(prev, parentNext)
	    : popNextToCommonLevel(prev, parentNext);
	  next.context._currentValue = next.value;
	}
	function switchContext(newSnapshot) {
	  var prev = currentActiveSnapshot;
	  prev !== newSnapshot &&
	    (null === prev
	      ? pushAllNext(newSnapshot)
	      : null === newSnapshot
	        ? popAllPrevious(prev)
	        : prev.depth === newSnapshot.depth
	          ? popToNearestCommonAncestor(prev, newSnapshot)
	          : prev.depth > newSnapshot.depth
	            ? popPreviousToCommonLevel(prev, newSnapshot)
	            : popNextToCommonLevel(prev, newSnapshot),
	    (currentActiveSnapshot = newSnapshot));
	}
	var classComponentUpdater = {
	    enqueueSetState: function (inst, payload) {
	      inst = inst._reactInternals;
	      null !== inst.queue && inst.queue.push(payload);
	    },
	    enqueueReplaceState: function (inst, payload) {
	      inst = inst._reactInternals;
	      inst.replace = true;
	      inst.queue = [payload];
	    },
	    enqueueForceUpdate: function () {}
	  },
	  emptyTreeContext = { id: 1, overflow: "" };
	function pushTreeContext(baseContext, totalChildren, index) {
	  var baseIdWithLeadingBit = baseContext.id;
	  baseContext = baseContext.overflow;
	  var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
	  baseIdWithLeadingBit &= ~(1 << baseLength);
	  index += 1;
	  var length = 32 - clz32(totalChildren) + baseLength;
	  if (30 < length) {
	    var numberOfOverflowBits = baseLength - (baseLength % 5);
	    length = (
	      baseIdWithLeadingBit &
	      ((1 << numberOfOverflowBits) - 1)
	    ).toString(32);
	    baseIdWithLeadingBit >>= numberOfOverflowBits;
	    baseLength -= numberOfOverflowBits;
	    return {
	      id:
	        (1 << (32 - clz32(totalChildren) + baseLength)) |
	        (index << baseLength) |
	        baseIdWithLeadingBit,
	      overflow: length + baseContext
	    };
	  }
	  return {
	    id: (1 << length) | (index << baseLength) | baseIdWithLeadingBit,
	    overflow: baseContext
	  };
	}
	var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback,
	  log = Math.log,
	  LN2 = Math.LN2;
	function clz32Fallback(x) {
	  x >>>= 0;
	  return 0 === x ? 32 : (31 - ((log(x) / LN2) | 0)) | 0;
	}
	var SuspenseException = Error(
	  "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
	);
	function noop$2() {}
	function trackUsedThenable(thenableState, thenable, index) {
	  index = thenableState[index];
	  void 0 === index
	    ? thenableState.push(thenable)
	    : index !== thenable && (thenable.then(noop$2, noop$2), (thenable = index));
	  switch (thenable.status) {
	    case "fulfilled":
	      return thenable.value;
	    case "rejected":
	      throw thenable.reason;
	    default:
	      "string" === typeof thenable.status
	        ? thenable.then(noop$2, noop$2)
	        : ((thenableState = thenable),
	          (thenableState.status = "pending"),
	          thenableState.then(
	            function (fulfilledValue) {
	              if ("pending" === thenable.status) {
	                var fulfilledThenable = thenable;
	                fulfilledThenable.status = "fulfilled";
	                fulfilledThenable.value = fulfilledValue;
	              }
	            },
	            function (error) {
	              if ("pending" === thenable.status) {
	                var rejectedThenable = thenable;
	                rejectedThenable.status = "rejected";
	                rejectedThenable.reason = error;
	              }
	            }
	          ));
	      switch (thenable.status) {
	        case "fulfilled":
	          return thenable.value;
	        case "rejected":
	          throw thenable.reason;
	      }
	      suspendedThenable = thenable;
	      throw SuspenseException;
	  }
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
	  if (null === suspendedThenable)
	    throw Error(
	      "Expected a suspended thenable. This is a bug in React. Please file an issue."
	    );
	  var thenable = suspendedThenable;
	  suspendedThenable = null;
	  return thenable;
	}
	function is(x, y) {
	  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is,
	  currentlyRenderingComponent = null,
	  currentlyRenderingTask = null,
	  currentlyRenderingRequest = null,
	  currentlyRenderingKeyPath = null,
	  firstWorkInProgressHook = null,
	  workInProgressHook = null,
	  isReRender = false,
	  didScheduleRenderPhaseUpdate = false,
	  localIdCounter = 0,
	  actionStateCounter = 0,
	  actionStateMatchingIndex = -1,
	  thenableIndexCounter = 0,
	  thenableState = null,
	  renderPhaseUpdates = null,
	  numberOfReRenders = 0;
	function resolveCurrentlyRenderingComponent() {
	  if (null === currentlyRenderingComponent)
	    throw Error(
	      "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
	    );
	  return currentlyRenderingComponent;
	}
	function createHook() {
	  if (0 < numberOfReRenders)
	    throw Error("Rendered more hooks than during the previous render");
	  return { memoizedState: null, queue: null, next: null };
	}
	function createWorkInProgressHook() {
	  null === workInProgressHook
	    ? null === firstWorkInProgressHook
	      ? ((isReRender = false),
	        (firstWorkInProgressHook = workInProgressHook = createHook()))
	      : ((isReRender = true), (workInProgressHook = firstWorkInProgressHook))
	    : null === workInProgressHook.next
	      ? ((isReRender = false),
	        (workInProgressHook = workInProgressHook.next = createHook()))
	      : ((isReRender = true), (workInProgressHook = workInProgressHook.next));
	  return workInProgressHook;
	}
	function getThenableStateAfterSuspending() {
	  var state = thenableState;
	  thenableState = null;
	  return state;
	}
	function resetHooksState() {
	  currentlyRenderingKeyPath =
	    currentlyRenderingRequest =
	    currentlyRenderingTask =
	    currentlyRenderingComponent =
	      null;
	  didScheduleRenderPhaseUpdate = false;
	  firstWorkInProgressHook = null;
	  numberOfReRenders = 0;
	  workInProgressHook = renderPhaseUpdates = null;
	}
	function basicStateReducer(state, action) {
	  return "function" === typeof action ? action(state) : action;
	}
	function useReducer(reducer, initialArg, init) {
	  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	  workInProgressHook = createWorkInProgressHook();
	  if (isReRender) {
	    var queue = workInProgressHook.queue;
	    initialArg = queue.dispatch;
	    if (
	      null !== renderPhaseUpdates &&
	      ((init = renderPhaseUpdates.get(queue)), void 0 !== init)
	    ) {
	      renderPhaseUpdates.delete(queue);
	      queue = workInProgressHook.memoizedState;
	      do (queue = reducer(queue, init.action)), (init = init.next);
	      while (null !== init);
	      workInProgressHook.memoizedState = queue;
	      return [queue, initialArg];
	    }
	    return [workInProgressHook.memoizedState, initialArg];
	  }
	  reducer =
	    reducer === basicStateReducer
	      ? "function" === typeof initialArg
	        ? initialArg()
	        : initialArg
	      : void 0 !== init
	        ? init(initialArg)
	        : initialArg;
	  workInProgressHook.memoizedState = reducer;
	  reducer = workInProgressHook.queue = { last: null, dispatch: null };
	  reducer = reducer.dispatch = dispatchAction.bind(
	    null,
	    currentlyRenderingComponent,
	    reducer
	  );
	  return [workInProgressHook.memoizedState, reducer];
	}
	function useMemo(nextCreate, deps) {
	  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	  workInProgressHook = createWorkInProgressHook();
	  deps = void 0 === deps ? null : deps;
	  if (null !== workInProgressHook) {
	    var prevState = workInProgressHook.memoizedState;
	    if (null !== prevState && null !== deps) {
	      var prevDeps = prevState[1];
	      a: if (null === prevDeps) prevDeps = false;
	      else {
	        for (var i = 0; i < prevDeps.length && i < deps.length; i++)
	          if (!objectIs(deps[i], prevDeps[i])) {
	            prevDeps = false;
	            break a;
	          }
	        prevDeps = true;
	      }
	      if (prevDeps) return prevState[0];
	    }
	  }
	  nextCreate = nextCreate();
	  workInProgressHook.memoizedState = [nextCreate, deps];
	  return nextCreate;
	}
	function dispatchAction(componentIdentity, queue, action) {
	  if (25 <= numberOfReRenders)
	    throw Error(
	      "Too many re-renders. React limits the number of renders to prevent an infinite loop."
	    );
	  if (componentIdentity === currentlyRenderingComponent)
	    if (
	      ((didScheduleRenderPhaseUpdate = true),
	      (componentIdentity = { action: action, next: null }),
	      null === renderPhaseUpdates && (renderPhaseUpdates = new Map()),
	      (action = renderPhaseUpdates.get(queue)),
	      void 0 === action)
	    )
	      renderPhaseUpdates.set(queue, componentIdentity);
	    else {
	      for (queue = action; null !== queue.next; ) queue = queue.next;
	      queue.next = componentIdentity;
	    }
	}
	function unsupportedStartTransition() {
	  throw Error("startTransition cannot be called during server rendering.");
	}
	function unsupportedSetOptimisticState() {
	  throw Error("Cannot update optimistic state while rendering.");
	}
	function useActionState(action, initialState, permalink) {
	  resolveCurrentlyRenderingComponent();
	  var actionStateHookIndex = actionStateCounter++,
	    request = currentlyRenderingRequest;
	  if ("function" === typeof action.$$FORM_ACTION) {
	    var nextPostbackStateKey = null,
	      componentKeyPath = currentlyRenderingKeyPath;
	    request = request.formState;
	    var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
	    if (null !== request && "function" === typeof isSignatureEqual) {
	      var postbackKey = request[1];
	      isSignatureEqual.call(action, request[2], request[3]) &&
	        ((nextPostbackStateKey =
	          void 0 !== permalink
	            ? "p" + permalink
	            : "k" +
	              murmurhash3_32_gc(
	                JSON.stringify([componentKeyPath, null, actionStateHookIndex]),
	                0
	              )),
	        postbackKey === nextPostbackStateKey &&
	          ((actionStateMatchingIndex = actionStateHookIndex),
	          (initialState = request[0])));
	    }
	    var boundAction = action.bind(null, initialState);
	    action = function (payload) {
	      boundAction(payload);
	    };
	    "function" === typeof boundAction.$$FORM_ACTION &&
	      (action.$$FORM_ACTION = function (prefix) {
	        prefix = boundAction.$$FORM_ACTION(prefix);
	        void 0 !== permalink &&
	          ((permalink += ""), (prefix.action = permalink));
	        var formData = prefix.data;
	        formData &&
	          (null === nextPostbackStateKey &&
	            (nextPostbackStateKey =
	              void 0 !== permalink
	                ? "p" + permalink
	                : "k" +
	                  murmurhash3_32_gc(
	                    JSON.stringify([
	                      componentKeyPath,
	                      null,
	                      actionStateHookIndex
	                    ]),
	                    0
	                  )),
	          formData.append("$ACTION_KEY", nextPostbackStateKey));
	        return prefix;
	      });
	    return [initialState, action, false];
	  }
	  var boundAction$22 = action.bind(null, initialState);
	  return [
	    initialState,
	    function (payload) {
	      boundAction$22(payload);
	    },
	    false
	  ];
	}
	function unwrapThenable(thenable) {
	  var index = thenableIndexCounter;
	  thenableIndexCounter += 1;
	  null === thenableState && (thenableState = []);
	  return trackUsedThenable(thenableState, thenable, index);
	}
	function unsupportedRefresh() {
	  throw Error("Cache cannot be refreshed during server rendering.");
	}
	function noop$1() {}
	var HooksDispatcher = {
	    readContext: function (context) {
	      return context._currentValue;
	    },
	    use: function (usable) {
	      if (null !== usable && "object" === typeof usable) {
	        if ("function" === typeof usable.then) return unwrapThenable(usable);
	        if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue;
	      }
	      throw Error("An unsupported type was passed to use(): " + String(usable));
	    },
	    useContext: function (context) {
	      resolveCurrentlyRenderingComponent();
	      return context._currentValue;
	    },
	    useMemo: useMemo,
	    useReducer: useReducer,
	    useRef: function (initialValue) {
	      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	      workInProgressHook = createWorkInProgressHook();
	      var previousRef = workInProgressHook.memoizedState;
	      return null === previousRef
	        ? ((initialValue = { current: initialValue }),
	          (workInProgressHook.memoizedState = initialValue))
	        : previousRef;
	    },
	    useState: function (initialState) {
	      return useReducer(basicStateReducer, initialState);
	    },
	    useInsertionEffect: noop$1,
	    useLayoutEffect: noop$1,
	    useCallback: function (callback, deps) {
	      return useMemo(function () {
	        return callback;
	      }, deps);
	    },
	    useImperativeHandle: noop$1,
	    useEffect: noop$1,
	    useDebugValue: noop$1,
	    useDeferredValue: function (value, initialValue) {
	      resolveCurrentlyRenderingComponent();
	      return void 0 !== initialValue ? initialValue : value;
	    },
	    useTransition: function () {
	      resolveCurrentlyRenderingComponent();
	      return [false, unsupportedStartTransition];
	    },
	    useId: function () {
	      var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
	      var overflow = JSCompiler_inline_result.overflow;
	      JSCompiler_inline_result = JSCompiler_inline_result.id;
	      JSCompiler_inline_result =
	        (
	          JSCompiler_inline_result &
	          ~(1 << (32 - clz32(JSCompiler_inline_result) - 1))
	        ).toString(32) + overflow;
	      var resumableState = currentResumableState;
	      if (null === resumableState)
	        throw Error(
	          "Invalid hook call. Hooks can only be called inside of the body of a function component."
	        );
	      overflow = localIdCounter++;
	      JSCompiler_inline_result =
	        "\u00ab" + resumableState.idPrefix + "R" + JSCompiler_inline_result;
	      0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
	      return JSCompiler_inline_result + "\u00bb";
	    },
	    useSyncExternalStore: function (subscribe, getSnapshot, getServerSnapshot) {
	      if (void 0 === getServerSnapshot)
	        throw Error(
	          "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
	        );
	      return getServerSnapshot();
	    },
	    useOptimistic: function (passthrough) {
	      resolveCurrentlyRenderingComponent();
	      return [passthrough, unsupportedSetOptimisticState];
	    },
	    useActionState: useActionState,
	    useFormState: useActionState,
	    useHostTransitionStatus: function () {
	      resolveCurrentlyRenderingComponent();
	      return sharedNotPendingObject;
	    },
	    useMemoCache: function (size) {
	      for (var data = Array(size), i = 0; i < size; i++)
	        data[i] = REACT_MEMO_CACHE_SENTINEL;
	      return data;
	    },
	    useCacheRefresh: function () {
	      return unsupportedRefresh;
	    }
	  },
	  currentResumableState = null,
	  DefaultAsyncDispatcher = {
	    getCacheForType: function () {
	      throw Error("Not implemented.");
	    }
	  };
	function prepareStackTrace(error, structuredStackTrace) {
	  error = (error.name || "Error") + ": " + (error.message || "");
	  for (var i = 0; i < structuredStackTrace.length; i++)
	    error += "\n    at " + structuredStackTrace[i].toString();
	  return error;
	}
	var prefix, suffix;
	function describeBuiltInComponentFrame(name) {
	  if (void 0 === prefix)
	    try {
	      throw Error();
	    } catch (x) {
	      var match = x.stack.trim().match(/\n( *(at )?)/);
	      prefix = (match && match[1]) || "";
	      suffix =
	        -1 < x.stack.indexOf("\n    at")
	          ? " (<anonymous>)"
	          : -1 < x.stack.indexOf("@")
	            ? "@unknown:0:0"
	            : "";
	    }
	  return "\n" + prefix + name + suffix;
	}
	var reentry = false;
	function describeNativeComponentFrame(fn, construct) {
	  if (!fn || reentry) return "";
	  reentry = true;
	  var previousPrepareStackTrace = Error.prepareStackTrace;
	  Error.prepareStackTrace = prepareStackTrace;
	  try {
	    var RunInRootFrame = {
	      DetermineComponentFrameRoot: function () {
	        try {
	          if (construct) {
	            var Fake = function () {
	              throw Error();
	            };
	            Object.defineProperty(Fake.prototype, "props", {
	              set: function () {
	                throw Error();
	              }
	            });
	            if ("object" === typeof Reflect && Reflect.construct) {
	              try {
	                Reflect.construct(Fake, []);
	              } catch (x) {
	                var control = x;
	              }
	              Reflect.construct(fn, [], Fake);
	            } else {
	              try {
	                Fake.call();
	              } catch (x$24) {
	                control = x$24;
	              }
	              fn.call(Fake.prototype);
	            }
	          } else {
	            try {
	              throw Error();
	            } catch (x$25) {
	              control = x$25;
	            }
	            (Fake = fn()) &&
	              "function" === typeof Fake.catch &&
	              Fake.catch(function () {});
	          }
	        } catch (sample) {
	          if (sample && control && "string" === typeof sample.stack)
	            return [sample.stack, control.stack];
	        }
	        return [null, null];
	      }
	    };
	    RunInRootFrame.DetermineComponentFrameRoot.displayName =
	      "DetermineComponentFrameRoot";
	    var namePropDescriptor = Object.getOwnPropertyDescriptor(
	      RunInRootFrame.DetermineComponentFrameRoot,
	      "name"
	    );
	    namePropDescriptor &&
	      namePropDescriptor.configurable &&
	      Object.defineProperty(
	        RunInRootFrame.DetermineComponentFrameRoot,
	        "name",
	        { value: "DetermineComponentFrameRoot" }
	      );
	    var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(),
	      sampleStack = _RunInRootFrame$Deter[0],
	      controlStack = _RunInRootFrame$Deter[1];
	    if (sampleStack && controlStack) {
	      var sampleLines = sampleStack.split("\n"),
	        controlLines = controlStack.split("\n");
	      for (
	        namePropDescriptor = RunInRootFrame = 0;
	        RunInRootFrame < sampleLines.length &&
	        !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");

	      )
	        RunInRootFrame++;
	      for (
	        ;
	        namePropDescriptor < controlLines.length &&
	        !controlLines[namePropDescriptor].includes(
	          "DetermineComponentFrameRoot"
	        );

	      )
	        namePropDescriptor++;
	      if (
	        RunInRootFrame === sampleLines.length ||
	        namePropDescriptor === controlLines.length
	      )
	        for (
	          RunInRootFrame = sampleLines.length - 1,
	            namePropDescriptor = controlLines.length - 1;
	          1 <= RunInRootFrame &&
	          0 <= namePropDescriptor &&
	          sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];

	        )
	          namePropDescriptor--;
	      for (
	        ;
	        1 <= RunInRootFrame && 0 <= namePropDescriptor;
	        RunInRootFrame--, namePropDescriptor--
	      )
	        if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
	          if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
	            do
	              if (
	                (RunInRootFrame--,
	                namePropDescriptor--,
	                0 > namePropDescriptor ||
	                  sampleLines[RunInRootFrame] !==
	                    controlLines[namePropDescriptor])
	              ) {
	                var frame =
	                  "\n" +
	                  sampleLines[RunInRootFrame].replace(" at new ", " at ");
	                fn.displayName &&
	                  frame.includes("<anonymous>") &&
	                  (frame = frame.replace("<anonymous>", fn.displayName));
	                return frame;
	              }
	            while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
	          }
	          break;
	        }
	    }
	  } finally {
	    (reentry = false), (Error.prepareStackTrace = previousPrepareStackTrace);
	  }
	  return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "")
	    ? describeBuiltInComponentFrame(previousPrepareStackTrace)
	    : "";
	}
	function describeComponentStackByType(type) {
	  if ("string" === typeof type) return describeBuiltInComponentFrame(type);
	  if ("function" === typeof type)
	    return type.prototype && type.prototype.isReactComponent
	      ? describeNativeComponentFrame(type, true)
	      : describeNativeComponentFrame(type, false);
	  if ("object" === typeof type && null !== type) {
	    switch (type.$$typeof) {
	      case REACT_FORWARD_REF_TYPE:
	        return describeNativeComponentFrame(type.render, false);
	      case REACT_MEMO_TYPE:
	        return describeNativeComponentFrame(type.type, false);
	      case REACT_LAZY_TYPE:
	        var lazyComponent = type,
	          payload = lazyComponent._payload;
	        lazyComponent = lazyComponent._init;
	        try {
	          type = lazyComponent(payload);
	        } catch (x) {
	          return describeBuiltInComponentFrame("Lazy");
	        }
	        return describeComponentStackByType(type);
	    }
	    if ("string" === typeof type.name)
	      return (
	        (payload = type.env),
	        describeBuiltInComponentFrame(
	          type.name + (payload ? " [" + payload + "]" : "")
	        )
	      );
	  }
	  switch (type) {
	    case REACT_SUSPENSE_LIST_TYPE:
	      return describeBuiltInComponentFrame("SuspenseList");
	    case REACT_SUSPENSE_TYPE:
	      return describeBuiltInComponentFrame("Suspense");
	  }
	  return "";
	}
	function defaultErrorHandler(error) {
	  if (
	    "object" === typeof error &&
	    null !== error &&
	    "string" === typeof error.environmentName
	  ) {
	    var JSCompiler_inline_result = error.environmentName;
	    error = [error].slice(0);
	    "string" === typeof error[0]
	      ? error.splice(
	          0,
	          1,
	          "\u001b[0m\u001b[7m%c%s\u001b[0m%c " + error[0],
	          "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
	          " " + JSCompiler_inline_result + " ",
	          ""
	        )
	      : error.splice(
	          0,
	          0,
	          "\u001b[0m\u001b[7m%c%s\u001b[0m%c ",
	          "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
	          " " + JSCompiler_inline_result + " ",
	          ""
	        );
	    error.unshift(console);
	    JSCompiler_inline_result = bind.apply(console.error, error);
	    JSCompiler_inline_result();
	  } else console.error(error);
	  return null;
	}
	function noop() {}
	function RequestInstance(
	  resumableState,
	  renderState,
	  rootFormatContext,
	  progressiveChunkSize,
	  onError,
	  onAllReady,
	  onShellReady,
	  onShellError,
	  onFatalError,
	  onPostpone,
	  formState
	) {
	  var abortSet = new Set();
	  this.destination = null;
	  this.flushScheduled = false;
	  this.resumableState = resumableState;
	  this.renderState = renderState;
	  this.rootFormatContext = rootFormatContext;
	  this.progressiveChunkSize =
	    void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
	  this.status = 10;
	  this.fatalError = null;
	  this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
	  this.completedPreambleSegments = this.completedRootSegment = null;
	  this.abortableTasks = abortSet;
	  this.pingedTasks = [];
	  this.clientRenderedBoundaries = [];
	  this.completedBoundaries = [];
	  this.partialBoundaries = [];
	  this.trackedPostpones = null;
	  this.onError = void 0 === onError ? defaultErrorHandler : onError;
	  this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
	  this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
	  this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
	  this.onShellError = void 0 === onShellError ? noop : onShellError;
	  this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
	  this.formState = void 0 === formState ? null : formState;
	}
	function createRequest(
	  children,
	  resumableState,
	  renderState,
	  rootFormatContext,
	  progressiveChunkSize,
	  onError,
	  onAllReady,
	  onShellReady,
	  onShellError,
	  onFatalError,
	  onPostpone,
	  formState
	) {
	  resumableState = new RequestInstance(
	    resumableState,
	    renderState,
	    rootFormatContext,
	    progressiveChunkSize,
	    onError,
	    onAllReady,
	    onShellReady,
	    onShellError,
	    onFatalError,
	    onPostpone,
	    formState
	  );
	  renderState = createPendingSegment(
	    resumableState,
	    0,
	    null,
	    rootFormatContext,
	    false,
	    false
	  );
	  renderState.parentFlushed = true;
	  children = createRenderTask(
	    resumableState,
	    null,
	    children,
	    -1,
	    null,
	    renderState,
	    null,
	    null,
	    resumableState.abortableTasks,
	    null,
	    rootFormatContext,
	    null,
	    emptyTreeContext,
	    null,
	    false
	  );
	  pushComponentStack(children);
	  resumableState.pingedTasks.push(children);
	  return resumableState;
	}
	function createPrerenderRequest(
	  children,
	  resumableState,
	  renderState,
	  rootFormatContext,
	  progressiveChunkSize,
	  onError,
	  onAllReady,
	  onShellReady,
	  onShellError,
	  onFatalError,
	  onPostpone
	) {
	  children = createRequest(
	    children,
	    resumableState,
	    renderState,
	    rootFormatContext,
	    progressiveChunkSize,
	    onError,
	    onAllReady,
	    onShellReady,
	    onShellError,
	    onFatalError,
	    onPostpone,
	    void 0
	  );
	  children.trackedPostpones = {
	    workingMap: new Map(),
	    rootNodes: [],
	    rootSlots: null
	  };
	  return children;
	}
	var currentRequest = null;
	function resolveRequest() {
	  if (currentRequest) return currentRequest;
	  if (supportsRequestStorage) {
	    var store = requestStorage.getStore();
	    if (store) return store;
	  }
	  return null;
	}
	function pingTask(request, task) {
	  request.pingedTasks.push(task);
	  1 === request.pingedTasks.length &&
	    ((request.flushScheduled = null !== request.destination),
	    null !== request.trackedPostpones || 10 === request.status
	      ? scheduleMicrotask(function () {
	          return performWork(request);
	        })
	      : setTimeout(function () {
	          return performWork(request);
	        }, 0));
	}
	function createSuspenseBoundary(
	  request,
	  fallbackAbortableTasks,
	  contentPreamble,
	  fallbackPreamble
	) {
	  return {
	    status: 0,
	    rootSegmentID: -1,
	    parentFlushed: false,
	    pendingTasks: 0,
	    completedSegments: [],
	    byteSize: 0,
	    fallbackAbortableTasks: fallbackAbortableTasks,
	    errorDigest: null,
	    contentState: createHoistableState(),
	    fallbackState: createHoistableState(),
	    contentPreamble: contentPreamble,
	    fallbackPreamble: fallbackPreamble,
	    trackedContentKeyPath: null,
	    trackedFallbackNode: null
	  };
	}
	function createRenderTask(
	  request,
	  thenableState,
	  node,
	  childIndex,
	  blockedBoundary,
	  blockedSegment,
	  blockedPreamble,
	  hoistableState,
	  abortSet,
	  keyPath,
	  formatContext,
	  context,
	  treeContext,
	  componentStack,
	  isFallback
	) {
	  request.allPendingTasks++;
	  null === blockedBoundary
	    ? request.pendingRootTasks++
	    : blockedBoundary.pendingTasks++;
	  var task = {
	    replay: null,
	    node: node,
	    childIndex: childIndex,
	    ping: function () {
	      return pingTask(request, task);
	    },
	    blockedBoundary: blockedBoundary,
	    blockedSegment: blockedSegment,
	    blockedPreamble: blockedPreamble,
	    hoistableState: hoistableState,
	    abortSet: abortSet,
	    keyPath: keyPath,
	    formatContext: formatContext,
	    context: context,
	    treeContext: treeContext,
	    componentStack: componentStack,
	    thenableState: thenableState,
	    isFallback: isFallback
	  };
	  abortSet.add(task);
	  return task;
	}
	function createReplayTask(
	  request,
	  thenableState,
	  replay,
	  node,
	  childIndex,
	  blockedBoundary,
	  hoistableState,
	  abortSet,
	  keyPath,
	  formatContext,
	  context,
	  treeContext,
	  componentStack,
	  isFallback
	) {
	  request.allPendingTasks++;
	  null === blockedBoundary
	    ? request.pendingRootTasks++
	    : blockedBoundary.pendingTasks++;
	  replay.pendingTasks++;
	  var task = {
	    replay: replay,
	    node: node,
	    childIndex: childIndex,
	    ping: function () {
	      return pingTask(request, task);
	    },
	    blockedBoundary: blockedBoundary,
	    blockedSegment: null,
	    blockedPreamble: null,
	    hoistableState: hoistableState,
	    abortSet: abortSet,
	    keyPath: keyPath,
	    formatContext: formatContext,
	    context: context,
	    treeContext: treeContext,
	    componentStack: componentStack,
	    thenableState: thenableState,
	    isFallback: isFallback
	  };
	  abortSet.add(task);
	  return task;
	}
	function createPendingSegment(
	  request,
	  index,
	  boundary,
	  parentFormatContext,
	  lastPushedText,
	  textEmbedded
	) {
	  return {
	    status: 0,
	    parentFlushed: false,
	    id: -1,
	    index: index,
	    chunks: [],
	    children: [],
	    preambleChildren: [],
	    parentFormatContext: parentFormatContext,
	    boundary: boundary,
	    lastPushedText: lastPushedText,
	    textEmbedded: textEmbedded
	  };
	}
	function pushComponentStack(task) {
	  var node = task.node;
	  if ("object" === typeof node && null !== node)
	    switch (node.$$typeof) {
	      case REACT_ELEMENT_TYPE:
	        task.componentStack = { parent: task.componentStack, type: node.type };
	    }
	}
	function getThrownInfo(node$jscomp$0) {
	  var errorInfo = {};
	  node$jscomp$0 &&
	    Object.defineProperty(errorInfo, "componentStack", {
	      configurable: true,
	      enumerable: true,
	      get: function () {
	        try {
	          var info = "",
	            node = node$jscomp$0;
	          do
	            (info += describeComponentStackByType(node.type)),
	              (node = node.parent);
	          while (node);
	          var JSCompiler_inline_result = info;
	        } catch (x) {
	          JSCompiler_inline_result =
	            "\nError generating stack: " + x.message + "\n" + x.stack;
	        }
	        Object.defineProperty(errorInfo, "componentStack", {
	          value: JSCompiler_inline_result
	        });
	        return JSCompiler_inline_result;
	      }
	    });
	  return errorInfo;
	}
	function logRecoverableError(request, error, errorInfo) {
	  request = request.onError;
	  error = request(error, errorInfo);
	  if (null == error || "string" === typeof error) return error;
	}
	function fatalError(request, error) {
	  var onShellError = request.onShellError,
	    onFatalError = request.onFatalError;
	  onShellError(error);
	  onFatalError(error);
	  null !== request.destination
	    ? ((request.status = 14), closeWithError(request.destination, error))
	    : ((request.status = 13), (request.fatalError = error));
	}
	function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
	  var prevThenableState = task.thenableState;
	  task.thenableState = null;
	  currentlyRenderingComponent = {};
	  currentlyRenderingTask = task;
	  currentlyRenderingRequest = request;
	  currentlyRenderingKeyPath = keyPath;
	  actionStateCounter = localIdCounter = 0;
	  actionStateMatchingIndex = -1;
	  thenableIndexCounter = 0;
	  thenableState = prevThenableState;
	  for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
	    (didScheduleRenderPhaseUpdate = false),
	      (actionStateCounter = localIdCounter = 0),
	      (actionStateMatchingIndex = -1),
	      (thenableIndexCounter = 0),
	      (numberOfReRenders += 1),
	      (workInProgressHook = null),
	      (request = Component(props, secondArg));
	  resetHooksState();
	  return request;
	}
	function finishFunctionComponent(
	  request,
	  task,
	  keyPath,
	  children,
	  hasId,
	  actionStateCount,
	  actionStateMatchingIndex
	) {
	  var didEmitActionStateMarkers = false;
	  if (0 !== actionStateCount && null !== request.formState) {
	    var segment = task.blockedSegment;
	    if (null !== segment) {
	      didEmitActionStateMarkers = true;
	      segment = segment.chunks;
	      for (var i = 0; i < actionStateCount; i++)
	        i === actionStateMatchingIndex
	          ? segment.push(formStateMarkerIsMatching)
	          : segment.push(formStateMarkerIsNotMatching);
	    }
	  }
	  actionStateCount = task.keyPath;
	  task.keyPath = keyPath;
	  hasId
	    ? ((keyPath = task.treeContext),
	      (task.treeContext = pushTreeContext(keyPath, 1, 0)),
	      renderNode(request, task, children, -1),
	      (task.treeContext = keyPath))
	    : didEmitActionStateMarkers
	      ? renderNode(request, task, children, -1)
	      : renderNodeDestructive(request, task, children, -1);
	  task.keyPath = actionStateCount;
	}
	function renderElement(request, task, keyPath, type, props, ref) {
	  if ("function" === typeof type)
	    if (type.prototype && type.prototype.isReactComponent) {
	      var newProps = props;
	      if ("ref" in props) {
	        newProps = {};
	        for (var propName in props)
	          "ref" !== propName && (newProps[propName] = props[propName]);
	      }
	      var defaultProps = type.defaultProps;
	      if (defaultProps) {
	        newProps === props && (newProps = assign({}, newProps, props));
	        for (var propName$33 in defaultProps)
	          void 0 === newProps[propName$33] &&
	            (newProps[propName$33] = defaultProps[propName$33]);
	      }
	      props = newProps;
	      newProps = emptyContextObject;
	      defaultProps = type.contextType;
	      "object" === typeof defaultProps &&
	        null !== defaultProps &&
	        (newProps = defaultProps._currentValue);
	      newProps = new type(props, newProps);
	      var initialState = void 0 !== newProps.state ? newProps.state : null;
	      newProps.updater = classComponentUpdater;
	      newProps.props = props;
	      newProps.state = initialState;
	      defaultProps = { queue: [], replace: false };
	      newProps._reactInternals = defaultProps;
	      ref = type.contextType;
	      newProps.context =
	        "object" === typeof ref && null !== ref
	          ? ref._currentValue
	          : emptyContextObject;
	      ref = type.getDerivedStateFromProps;
	      "function" === typeof ref &&
	        ((ref = ref(props, initialState)),
	        (initialState =
	          null === ref || void 0 === ref
	            ? initialState
	            : assign({}, initialState, ref)),
	        (newProps.state = initialState));
	      if (
	        "function" !== typeof type.getDerivedStateFromProps &&
	        "function" !== typeof newProps.getSnapshotBeforeUpdate &&
	        ("function" === typeof newProps.UNSAFE_componentWillMount ||
	          "function" === typeof newProps.componentWillMount)
	      )
	        if (
	          ((type = newProps.state),
	          "function" === typeof newProps.componentWillMount &&
	            newProps.componentWillMount(),
	          "function" === typeof newProps.UNSAFE_componentWillMount &&
	            newProps.UNSAFE_componentWillMount(),
	          type !== newProps.state &&
	            classComponentUpdater.enqueueReplaceState(
	              newProps,
	              newProps.state,
	              null
	            ),
	          null !== defaultProps.queue && 0 < defaultProps.queue.length)
	        )
	          if (
	            ((type = defaultProps.queue),
	            (ref = defaultProps.replace),
	            (defaultProps.queue = null),
	            (defaultProps.replace = false),
	            ref && 1 === type.length)
	          )
	            newProps.state = type[0];
	          else {
	            defaultProps = ref ? type[0] : newProps.state;
	            initialState = true;
	            for (ref = ref ? 1 : 0; ref < type.length; ref++)
	              (propName$33 = type[ref]),
	                (propName$33 =
	                  "function" === typeof propName$33
	                    ? propName$33.call(newProps, defaultProps, props, void 0)
	                    : propName$33),
	                null != propName$33 &&
	                  (initialState
	                    ? ((initialState = false),
	                      (defaultProps = assign({}, defaultProps, propName$33)))
	                    : assign(defaultProps, propName$33));
	            newProps.state = defaultProps;
	          }
	        else defaultProps.queue = null;
	      type = newProps.render();
	      if (12 === request.status) throw null;
	      props = task.keyPath;
	      task.keyPath = keyPath;
	      renderNodeDestructive(request, task, type, -1);
	      task.keyPath = props;
	    } else {
	      type = renderWithHooks(request, task, keyPath, type, props, void 0);
	      if (12 === request.status) throw null;
	      finishFunctionComponent(
	        request,
	        task,
	        keyPath,
	        type,
	        0 !== localIdCounter,
	        actionStateCounter,
	        actionStateMatchingIndex
	      );
	    }
	  else if ("string" === typeof type)
	    if (((newProps = task.blockedSegment), null === newProps))
	      (newProps = props.children),
	        (defaultProps = task.formatContext),
	        (initialState = task.keyPath),
	        (task.formatContext = getChildFormatContext(defaultProps, type, props)),
	        (task.keyPath = keyPath),
	        renderNode(request, task, newProps, -1),
	        (task.formatContext = defaultProps),
	        (task.keyPath = initialState);
	    else {
	      ref = pushStartInstance(
	        newProps.chunks,
	        type,
	        props,
	        request.resumableState,
	        request.renderState,
	        task.blockedPreamble,
	        task.hoistableState,
	        task.formatContext,
	        newProps.lastPushedText,
	        task.isFallback
	      );
	      newProps.lastPushedText = false;
	      defaultProps = task.formatContext;
	      initialState = task.keyPath;
	      task.keyPath = keyPath;
	      3 ===
	      (task.formatContext = getChildFormatContext(defaultProps, type, props))
	        .insertionMode
	        ? ((keyPath = createPendingSegment(
	            request,
	            0,
	            null,
	            task.formatContext,
	            false,
	            false
	          )),
	          newProps.preambleChildren.push(keyPath),
	          (keyPath = createRenderTask(
	            request,
	            null,
	            ref,
	            -1,
	            task.blockedBoundary,
	            keyPath,
	            task.blockedPreamble,
	            task.hoistableState,
	            request.abortableTasks,
	            task.keyPath,
	            task.formatContext,
	            task.context,
	            task.treeContext,
	            task.componentStack,
	            task.isFallback
	          )),
	          pushComponentStack(keyPath),
	          request.pingedTasks.push(keyPath))
	        : renderNode(request, task, ref, -1);
	      task.formatContext = defaultProps;
	      task.keyPath = initialState;
	      a: {
	        task = newProps.chunks;
	        request = request.resumableState;
	        switch (type) {
	          case "title":
	          case "style":
	          case "script":
	          case "area":
	          case "base":
	          case "br":
	          case "col":
	          case "embed":
	          case "hr":
	          case "img":
	          case "input":
	          case "keygen":
	          case "link":
	          case "meta":
	          case "param":
	          case "source":
	          case "track":
	          case "wbr":
	            break a;
	          case "body":
	            if (1 >= defaultProps.insertionMode) {
	              request.hasBody = true;
	              break a;
	            }
	            break;
	          case "html":
	            if (0 === defaultProps.insertionMode) {
	              request.hasHtml = true;
	              break a;
	            }
	            break;
	          case "head":
	            if (1 >= defaultProps.insertionMode) break a;
	        }
	        task.push(endChunkForTag(type));
	      }
	      newProps.lastPushedText = false;
	    }
	  else {
	    switch (type) {
	      case REACT_LEGACY_HIDDEN_TYPE:
	      case REACT_STRICT_MODE_TYPE:
	      case REACT_PROFILER_TYPE:
	      case REACT_FRAGMENT_TYPE:
	        type = task.keyPath;
	        task.keyPath = keyPath;
	        renderNodeDestructive(request, task, props.children, -1);
	        task.keyPath = type;
	        return;
	      case REACT_ACTIVITY_TYPE:
	        "hidden" !== props.mode &&
	          ((type = task.keyPath),
	          (task.keyPath = keyPath),
	          renderNodeDestructive(request, task, props.children, -1),
	          (task.keyPath = type));
	        return;
	      case REACT_SUSPENSE_LIST_TYPE:
	        type = task.keyPath;
	        task.keyPath = keyPath;
	        renderNodeDestructive(request, task, props.children, -1);
	        task.keyPath = type;
	        return;
	      case REACT_VIEW_TRANSITION_TYPE:
	      case REACT_SCOPE_TYPE:
	        throw Error("ReactDOMServer does not yet support scope components.");
	      case REACT_SUSPENSE_TYPE:
	        a: if (null !== task.replay) {
	          type = task.keyPath;
	          task.keyPath = keyPath;
	          keyPath = props.children;
	          try {
	            renderNode(request, task, keyPath, -1);
	          } finally {
	            task.keyPath = type;
	          }
	        } else {
	          type = task.keyPath;
	          var parentBoundary = task.blockedBoundary;
	          ref = task.blockedPreamble;
	          var parentHoistableState = task.hoistableState;
	          propName$33 = task.blockedSegment;
	          propName = props.fallback;
	          props = props.children;
	          var fallbackAbortSet = new Set();
	          var newBoundary =
	            2 > task.formatContext.insertionMode
	              ? createSuspenseBoundary(
	                  request,
	                  fallbackAbortSet,
	                  createPreambleState(),
	                  createPreambleState()
	                )
	              : createSuspenseBoundary(request, fallbackAbortSet, null, null);
	          null !== request.trackedPostpones &&
	            (newBoundary.trackedContentKeyPath = keyPath);
	          var boundarySegment = createPendingSegment(
	            request,
	            propName$33.chunks.length,
	            newBoundary,
	            task.formatContext,
	            false,
	            false
	          );
	          propName$33.children.push(boundarySegment);
	          propName$33.lastPushedText = false;
	          var contentRootSegment = createPendingSegment(
	            request,
	            0,
	            null,
	            task.formatContext,
	            false,
	            false
	          );
	          contentRootSegment.parentFlushed = true;
	          if (null !== request.trackedPostpones) {
	            newProps = [keyPath[0], "Suspense Fallback", keyPath[2]];
	            defaultProps = [newProps[1], newProps[2], [], null];
	            request.trackedPostpones.workingMap.set(newProps, defaultProps);
	            newBoundary.trackedFallbackNode = defaultProps;
	            task.blockedSegment = boundarySegment;
	            task.blockedPreamble = newBoundary.fallbackPreamble;
	            task.keyPath = newProps;
	            boundarySegment.status = 6;
	            try {
	              renderNode(request, task, propName, -1),
	                boundarySegment.lastPushedText &&
	                  boundarySegment.textEmbedded &&
	                  boundarySegment.chunks.push(textSeparator),
	                (boundarySegment.status = 1);
	            } catch (thrownValue) {
	              throw (
	                ((boundarySegment.status = 12 === request.status ? 3 : 4),
	                thrownValue)
	              );
	            } finally {
	              (task.blockedSegment = propName$33),
	                (task.blockedPreamble = ref),
	                (task.keyPath = type);
	            }
	            task = createRenderTask(
	              request,
	              null,
	              props,
	              -1,
	              newBoundary,
	              contentRootSegment,
	              newBoundary.contentPreamble,
	              newBoundary.contentState,
	              task.abortSet,
	              keyPath,
	              task.formatContext,
	              task.context,
	              task.treeContext,
	              task.componentStack,
	              task.isFallback
	            );
	            pushComponentStack(task);
	            request.pingedTasks.push(task);
	          } else {
	            task.blockedBoundary = newBoundary;
	            task.blockedPreamble = newBoundary.contentPreamble;
	            task.hoistableState = newBoundary.contentState;
	            task.blockedSegment = contentRootSegment;
	            task.keyPath = keyPath;
	            contentRootSegment.status = 6;
	            try {
	              if (
	                (renderNode(request, task, props, -1),
	                contentRootSegment.lastPushedText &&
	                  contentRootSegment.textEmbedded &&
	                  contentRootSegment.chunks.push(textSeparator),
	                (contentRootSegment.status = 1),
	                queueCompletedSegment(newBoundary, contentRootSegment),
	                0 === newBoundary.pendingTasks && 0 === newBoundary.status)
	              ) {
	                newBoundary.status = 1;
	                0 === request.pendingRootTasks &&
	                  task.blockedPreamble &&
	                  preparePreamble(request);
	                break a;
	              }
	            } catch (thrownValue$28) {
	              (newBoundary.status = 4),
	                12 === request.status
	                  ? ((contentRootSegment.status = 3),
	                    (newProps = request.fatalError))
	                  : ((contentRootSegment.status = 4),
	                    (newProps = thrownValue$28)),
	                (defaultProps = getThrownInfo(task.componentStack)),
	                (initialState = logRecoverableError(
	                  request,
	                  newProps,
	                  defaultProps
	                )),
	                (newBoundary.errorDigest = initialState),
	                untrackBoundary(request, newBoundary);
	            } finally {
	              (task.blockedBoundary = parentBoundary),
	                (task.blockedPreamble = ref),
	                (task.hoistableState = parentHoistableState),
	                (task.blockedSegment = propName$33),
	                (task.keyPath = type);
	            }
	            task = createRenderTask(
	              request,
	              null,
	              propName,
	              -1,
	              parentBoundary,
	              boundarySegment,
	              newBoundary.fallbackPreamble,
	              newBoundary.fallbackState,
	              fallbackAbortSet,
	              [keyPath[0], "Suspense Fallback", keyPath[2]],
	              task.formatContext,
	              task.context,
	              task.treeContext,
	              task.componentStack,
	              true
	            );
	            pushComponentStack(task);
	            request.pingedTasks.push(task);
	          }
	        }
	        return;
	    }
	    if ("object" === typeof type && null !== type)
	      switch (type.$$typeof) {
	        case REACT_FORWARD_REF_TYPE:
	          if ("ref" in props)
	            for (newBoundary in ((newProps = {}), props))
	              "ref" !== newBoundary &&
	                (newProps[newBoundary] = props[newBoundary]);
	          else newProps = props;
	          type = renderWithHooks(
	            request,
	            task,
	            keyPath,
	            type.render,
	            newProps,
	            ref
	          );
	          finishFunctionComponent(
	            request,
	            task,
	            keyPath,
	            type,
	            0 !== localIdCounter,
	            actionStateCounter,
	            actionStateMatchingIndex
	          );
	          return;
	        case REACT_MEMO_TYPE:
	          renderElement(request, task, keyPath, type.type, props, ref);
	          return;
	        case REACT_PROVIDER_TYPE:
	        case REACT_CONTEXT_TYPE:
	          defaultProps = props.children;
	          newProps = task.keyPath;
	          props = props.value;
	          initialState = type._currentValue;
	          type._currentValue = props;
	          ref = currentActiveSnapshot;
	          currentActiveSnapshot = type = {
	            parent: ref,
	            depth: null === ref ? 0 : ref.depth + 1,
	            context: type,
	            parentValue: initialState,
	            value: props
	          };
	          task.context = type;
	          task.keyPath = keyPath;
	          renderNodeDestructive(request, task, defaultProps, -1);
	          request = currentActiveSnapshot;
	          if (null === request)
	            throw Error(
	              "Tried to pop a Context at the root of the app. This is a bug in React."
	            );
	          request.context._currentValue = request.parentValue;
	          request = currentActiveSnapshot = request.parent;
	          task.context = request;
	          task.keyPath = newProps;
	          return;
	        case REACT_CONSUMER_TYPE:
	          props = props.children;
	          type = props(type._context._currentValue);
	          props = task.keyPath;
	          task.keyPath = keyPath;
	          renderNodeDestructive(request, task, type, -1);
	          task.keyPath = props;
	          return;
	        case REACT_LAZY_TYPE:
	          newProps = type._init;
	          type = newProps(type._payload);
	          if (12 === request.status) throw null;
	          renderElement(request, task, keyPath, type, props, ref);
	          return;
	      }
	    throw Error(
	      "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " +
	        ((null == type ? type : typeof type) + ".")
	    );
	  }
	}
	function resumeNode(request, task, segmentId, node, childIndex) {
	  var prevReplay = task.replay,
	    blockedBoundary = task.blockedBoundary,
	    resumedSegment = createPendingSegment(
	      request,
	      0,
	      null,
	      task.formatContext,
	      false,
	      false
	    );
	  resumedSegment.id = segmentId;
	  resumedSegment.parentFlushed = true;
	  try {
	    (task.replay = null),
	      (task.blockedSegment = resumedSegment),
	      renderNode(request, task, node, childIndex),
	      (resumedSegment.status = 1),
	      null === blockedBoundary
	        ? (request.completedRootSegment = resumedSegment)
	        : (queueCompletedSegment(blockedBoundary, resumedSegment),
	          blockedBoundary.parentFlushed &&
	            request.partialBoundaries.push(blockedBoundary));
	  } finally {
	    (task.replay = prevReplay), (task.blockedSegment = null);
	  }
	}
	function renderNodeDestructive(request, task, node, childIndex) {
	  null !== task.replay && "number" === typeof task.replay.slots
	    ? resumeNode(request, task, task.replay.slots, node, childIndex)
	    : ((task.node = node),
	      (task.childIndex = childIndex),
	      (node = task.componentStack),
	      pushComponentStack(task),
	      retryNode(request, task),
	      (task.componentStack = node));
	}
	function retryNode(request, task) {
	  var node = task.node,
	    childIndex = task.childIndex;
	  if (null !== node) {
	    if ("object" === typeof node) {
	      switch (node.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          var type = node.type,
	            key = node.key,
	            props = node.props;
	          node = props.ref;
	          var ref = void 0 !== node ? node : null,
	            name = getComponentNameFromType(type),
	            keyOrIndex =
	              null == key ? (-1 === childIndex ? 0 : childIndex) : key;
	          key = [task.keyPath, name, keyOrIndex];
	          if (null !== task.replay)
	            a: {
	              var replay = task.replay;
	              childIndex = replay.nodes;
	              for (node = 0; node < childIndex.length; node++) {
	                var node$jscomp$0 = childIndex[node];
	                if (keyOrIndex === node$jscomp$0[1]) {
	                  if (4 === node$jscomp$0.length) {
	                    if (null !== name && name !== node$jscomp$0[0])
	                      throw Error(
	                        "Expected the resume to render <" +
	                          node$jscomp$0[0] +
	                          "> in this slot but instead it rendered <" +
	                          name +
	                          ">. The tree doesn't match so React will fallback to client rendering."
	                      );
	                    var childNodes = node$jscomp$0[2];
	                    name = node$jscomp$0[3];
	                    keyOrIndex = task.node;
	                    task.replay = {
	                      nodes: childNodes,
	                      slots: name,
	                      pendingTasks: 1
	                    };
	                    try {
	                      renderElement(request, task, key, type, props, ref);
	                      if (
	                        1 === task.replay.pendingTasks &&
	                        0 < task.replay.nodes.length
	                      )
	                        throw Error(
	                          "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
	                        );
	                      task.replay.pendingTasks--;
	                    } catch (x) {
	                      if (
	                        "object" === typeof x &&
	                        null !== x &&
	                        (x === SuspenseException ||
	                          "function" === typeof x.then)
	                      )
	                        throw (
	                          (task.node === keyOrIndex && (task.replay = replay),
	                          x)
	                        );
	                      task.replay.pendingTasks--;
	                      props = getThrownInfo(task.componentStack);
	                      key = task.blockedBoundary;
	                      type = x;
	                      props = logRecoverableError(request, type, props);
	                      abortRemainingReplayNodes(
	                        request,
	                        key,
	                        childNodes,
	                        name,
	                        type,
	                        props
	                      );
	                    }
	                    task.replay = replay;
	                  } else {
	                    if (type !== REACT_SUSPENSE_TYPE)
	                      throw Error(
	                        "Expected the resume to render <Suspense> in this slot but instead it rendered <" +
	                          (getComponentNameFromType(type) || "Unknown") +
	                          ">. The tree doesn't match so React will fallback to client rendering."
	                      );
	                    b: {
	                      replay = void 0;
	                      type = node$jscomp$0[5];
	                      ref = node$jscomp$0[2];
	                      name = node$jscomp$0[3];
	                      keyOrIndex =
	                        null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
	                      node$jscomp$0 =
	                        null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
	                      var prevKeyPath = task.keyPath,
	                        previousReplaySet = task.replay,
	                        parentBoundary = task.blockedBoundary,
	                        parentHoistableState = task.hoistableState,
	                        content = props.children,
	                        fallback = props.fallback,
	                        fallbackAbortSet = new Set();
	                      props =
	                        2 > task.formatContext.insertionMode
	                          ? createSuspenseBoundary(
	                              request,
	                              fallbackAbortSet,
	                              createPreambleState(),
	                              createPreambleState()
	                            )
	                          : createSuspenseBoundary(
	                              request,
	                              fallbackAbortSet,
	                              null,
	                              null
	                            );
	                      props.parentFlushed = true;
	                      props.rootSegmentID = type;
	                      task.blockedBoundary = props;
	                      task.hoistableState = props.contentState;
	                      task.keyPath = key;
	                      task.replay = {
	                        nodes: ref,
	                        slots: name,
	                        pendingTasks: 1
	                      };
	                      try {
	                        renderNode(request, task, content, -1);
	                        if (
	                          1 === task.replay.pendingTasks &&
	                          0 < task.replay.nodes.length
	                        )
	                          throw Error(
	                            "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
	                          );
	                        task.replay.pendingTasks--;
	                        if (0 === props.pendingTasks && 0 === props.status) {
	                          props.status = 1;
	                          request.completedBoundaries.push(props);
	                          break b;
	                        }
	                      } catch (error) {
	                        (props.status = 4),
	                          (childNodes = getThrownInfo(task.componentStack)),
	                          (replay = logRecoverableError(
	                            request,
	                            error,
	                            childNodes
	                          )),
	                          (props.errorDigest = replay),
	                          task.replay.pendingTasks--,
	                          request.clientRenderedBoundaries.push(props);
	                      } finally {
	                        (task.blockedBoundary = parentBoundary),
	                          (task.hoistableState = parentHoistableState),
	                          (task.replay = previousReplaySet),
	                          (task.keyPath = prevKeyPath);
	                      }
	                      task = createReplayTask(
	                        request,
	                        null,
	                        {
	                          nodes: keyOrIndex,
	                          slots: node$jscomp$0,
	                          pendingTasks: 0
	                        },
	                        fallback,
	                        -1,
	                        parentBoundary,
	                        props.fallbackState,
	                        fallbackAbortSet,
	                        [key[0], "Suspense Fallback", key[2]],
	                        task.formatContext,
	                        task.context,
	                        task.treeContext,
	                        task.componentStack,
	                        true
	                      );
	                      pushComponentStack(task);
	                      request.pingedTasks.push(task);
	                    }
	                  }
	                  childIndex.splice(node, 1);
	                  break a;
	                }
	              }
	            }
	          else renderElement(request, task, key, type, props, ref);
	          return;
	        case REACT_PORTAL_TYPE:
	          throw Error(
	            "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."
	          );
	        case REACT_LAZY_TYPE:
	          childNodes = node._init;
	          node = childNodes(node._payload);
	          if (12 === request.status) throw null;
	          renderNodeDestructive(request, task, node, childIndex);
	          return;
	      }
	      if (isArrayImpl(node)) {
	        renderChildrenArray(request, task, node, childIndex);
	        return;
	      }
	      null === node || "object" !== typeof node
	        ? (childNodes = null)
	        : ((childNodes =
	            (MAYBE_ITERATOR_SYMBOL && node[MAYBE_ITERATOR_SYMBOL]) ||
	            node["@@iterator"]),
	          (childNodes = "function" === typeof childNodes ? childNodes : null));
	      if (childNodes && (childNodes = childNodes.call(node))) {
	        node = childNodes.next();
	        if (!node.done) {
	          props = [];
	          do props.push(node.value), (node = childNodes.next());
	          while (!node.done);
	          renderChildrenArray(request, task, props, childIndex);
	        }
	        return;
	      }
	      if ("function" === typeof node.then)
	        return (
	          (task.thenableState = null),
	          renderNodeDestructive(request, task, unwrapThenable(node), childIndex)
	        );
	      if (node.$$typeof === REACT_CONTEXT_TYPE)
	        return renderNodeDestructive(
	          request,
	          task,
	          node._currentValue,
	          childIndex
	        );
	      childIndex = Object.prototype.toString.call(node);
	      throw Error(
	        "Objects are not valid as a React child (found: " +
	          ("[object Object]" === childIndex
	            ? "object with keys {" + Object.keys(node).join(", ") + "}"
	            : childIndex) +
	          "). If you meant to render a collection of children, use an array instead."
	      );
	    }
	    if ("string" === typeof node)
	      (childIndex = task.blockedSegment),
	        null !== childIndex &&
	          (childIndex.lastPushedText = pushTextInstance(
	            childIndex.chunks,
	            node,
	            request.renderState,
	            childIndex.lastPushedText
	          ));
	    else if ("number" === typeof node || "bigint" === typeof node)
	      (childIndex = task.blockedSegment),
	        null !== childIndex &&
	          (childIndex.lastPushedText = pushTextInstance(
	            childIndex.chunks,
	            "" + node,
	            request.renderState,
	            childIndex.lastPushedText
	          ));
	  }
	}
	function renderChildrenArray(request, task, children, childIndex) {
	  var prevKeyPath = task.keyPath;
	  if (
	    -1 !== childIndex &&
	    ((task.keyPath = [task.keyPath, "Fragment", childIndex]),
	    null !== task.replay)
	  ) {
	    for (
	      var replay = task.replay, replayNodes = replay.nodes, j = 0;
	      j < replayNodes.length;
	      j++
	    ) {
	      var node = replayNodes[j];
	      if (node[1] === childIndex) {
	        childIndex = node[2];
	        node = node[3];
	        task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
	        try {
	          renderChildrenArray(request, task, children, -1);
	          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
	            throw Error(
	              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
	            );
	          task.replay.pendingTasks--;
	        } catch (x) {
	          if (
	            "object" === typeof x &&
	            null !== x &&
	            (x === SuspenseException || "function" === typeof x.then)
	          )
	            throw x;
	          task.replay.pendingTasks--;
	          children = getThrownInfo(task.componentStack);
	          var boundary = task.blockedBoundary,
	            error = x;
	          children = logRecoverableError(request, error, children);
	          abortRemainingReplayNodes(
	            request,
	            boundary,
	            childIndex,
	            node,
	            error,
	            children
	          );
	        }
	        task.replay = replay;
	        replayNodes.splice(j, 1);
	        break;
	      }
	    }
	    task.keyPath = prevKeyPath;
	    return;
	  }
	  replay = task.treeContext;
	  replayNodes = children.length;
	  if (
	    null !== task.replay &&
	    ((j = task.replay.slots), null !== j && "object" === typeof j)
	  ) {
	    for (childIndex = 0; childIndex < replayNodes; childIndex++)
	      (node = children[childIndex]),
	        (task.treeContext = pushTreeContext(replay, replayNodes, childIndex)),
	        (boundary = j[childIndex]),
	        "number" === typeof boundary
	          ? (resumeNode(request, task, boundary, node, childIndex),
	            delete j[childIndex])
	          : renderNode(request, task, node, childIndex);
	    task.treeContext = replay;
	    task.keyPath = prevKeyPath;
	    return;
	  }
	  for (j = 0; j < replayNodes; j++)
	    (childIndex = children[j]),
	      (task.treeContext = pushTreeContext(replay, replayNodes, j)),
	      renderNode(request, task, childIndex, j);
	  task.treeContext = replay;
	  task.keyPath = prevKeyPath;
	}
	function untrackBoundary(request, boundary) {
	  request = request.trackedPostpones;
	  null !== request &&
	    ((boundary = boundary.trackedContentKeyPath),
	    null !== boundary &&
	      ((boundary = request.workingMap.get(boundary)),
	      void 0 !== boundary &&
	        ((boundary.length = 4), (boundary[2] = []), (boundary[3] = null))));
	}
	function spawnNewSuspendedReplayTask(request, task, thenableState) {
	  return createReplayTask(
	    request,
	    thenableState,
	    task.replay,
	    task.node,
	    task.childIndex,
	    task.blockedBoundary,
	    task.hoistableState,
	    task.abortSet,
	    task.keyPath,
	    task.formatContext,
	    task.context,
	    task.treeContext,
	    task.componentStack,
	    task.isFallback
	  );
	}
	function spawnNewSuspendedRenderTask(request, task, thenableState) {
	  var segment = task.blockedSegment,
	    newSegment = createPendingSegment(
	      request,
	      segment.chunks.length,
	      null,
	      task.formatContext,
	      segment.lastPushedText,
	      true
	    );
	  segment.children.push(newSegment);
	  segment.lastPushedText = false;
	  return createRenderTask(
	    request,
	    thenableState,
	    task.node,
	    task.childIndex,
	    task.blockedBoundary,
	    newSegment,
	    task.blockedPreamble,
	    task.hoistableState,
	    task.abortSet,
	    task.keyPath,
	    task.formatContext,
	    task.context,
	    task.treeContext,
	    task.componentStack,
	    task.isFallback
	  );
	}
	function renderNode(request, task, node, childIndex) {
	  var previousFormatContext = task.formatContext,
	    previousContext = task.context,
	    previousKeyPath = task.keyPath,
	    previousTreeContext = task.treeContext,
	    previousComponentStack = task.componentStack,
	    segment = task.blockedSegment;
	  if (null === segment)
	    try {
	      return renderNodeDestructive(request, task, node, childIndex);
	    } catch (thrownValue) {
	      if (
	        (resetHooksState(),
	        (node =
	          thrownValue === SuspenseException
	            ? getSuspendedThenable()
	            : thrownValue),
	        "object" === typeof node && null !== node)
	      ) {
	        if ("function" === typeof node.then) {
	          childIndex = getThenableStateAfterSuspending();
	          request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
	          node.then(request, request);
	          task.formatContext = previousFormatContext;
	          task.context = previousContext;
	          task.keyPath = previousKeyPath;
	          task.treeContext = previousTreeContext;
	          task.componentStack = previousComponentStack;
	          switchContext(previousContext);
	          return;
	        }
	        if ("Maximum call stack size exceeded" === node.message) {
	          node = getThenableStateAfterSuspending();
	          node = spawnNewSuspendedReplayTask(request, task, node);
	          request.pingedTasks.push(node);
	          task.formatContext = previousFormatContext;
	          task.context = previousContext;
	          task.keyPath = previousKeyPath;
	          task.treeContext = previousTreeContext;
	          task.componentStack = previousComponentStack;
	          switchContext(previousContext);
	          return;
	        }
	      }
	    }
	  else {
	    var childrenLength = segment.children.length,
	      chunkLength = segment.chunks.length;
	    try {
	      return renderNodeDestructive(request, task, node, childIndex);
	    } catch (thrownValue$48) {
	      if (
	        (resetHooksState(),
	        (segment.children.length = childrenLength),
	        (segment.chunks.length = chunkLength),
	        (node =
	          thrownValue$48 === SuspenseException
	            ? getSuspendedThenable()
	            : thrownValue$48),
	        "object" === typeof node && null !== node)
	      ) {
	        if ("function" === typeof node.then) {
	          childIndex = getThenableStateAfterSuspending();
	          request = spawnNewSuspendedRenderTask(request, task, childIndex).ping;
	          node.then(request, request);
	          task.formatContext = previousFormatContext;
	          task.context = previousContext;
	          task.keyPath = previousKeyPath;
	          task.treeContext = previousTreeContext;
	          task.componentStack = previousComponentStack;
	          switchContext(previousContext);
	          return;
	        }
	        if ("Maximum call stack size exceeded" === node.message) {
	          node = getThenableStateAfterSuspending();
	          node = spawnNewSuspendedRenderTask(request, task, node);
	          request.pingedTasks.push(node);
	          task.formatContext = previousFormatContext;
	          task.context = previousContext;
	          task.keyPath = previousKeyPath;
	          task.treeContext = previousTreeContext;
	          task.componentStack = previousComponentStack;
	          switchContext(previousContext);
	          return;
	        }
	      }
	    }
	  }
	  task.formatContext = previousFormatContext;
	  task.context = previousContext;
	  task.keyPath = previousKeyPath;
	  task.treeContext = previousTreeContext;
	  switchContext(previousContext);
	  throw node;
	}
	function abortTaskSoft(task) {
	  var boundary = task.blockedBoundary;
	  task = task.blockedSegment;
	  null !== task && ((task.status = 3), finishedTask(this, boundary, task));
	}
	function abortRemainingReplayNodes(
	  request$jscomp$0,
	  boundary,
	  nodes,
	  slots,
	  error,
	  errorDigest$jscomp$0
	) {
	  for (var i = 0; i < nodes.length; i++) {
	    var node = nodes[i];
	    if (4 === node.length)
	      abortRemainingReplayNodes(
	        request$jscomp$0,
	        boundary,
	        node[2],
	        node[3],
	        error,
	        errorDigest$jscomp$0
	      );
	    else {
	      node = node[5];
	      var request = request$jscomp$0,
	        errorDigest = errorDigest$jscomp$0,
	        resumedBoundary = createSuspenseBoundary(
	          request,
	          new Set(),
	          null,
	          null
	        );
	      resumedBoundary.parentFlushed = true;
	      resumedBoundary.rootSegmentID = node;
	      resumedBoundary.status = 4;
	      resumedBoundary.errorDigest = errorDigest;
	      resumedBoundary.parentFlushed &&
	        request.clientRenderedBoundaries.push(resumedBoundary);
	    }
	  }
	  nodes.length = 0;
	  if (null !== slots) {
	    if (null === boundary)
	      throw Error(
	        "We should not have any resumable nodes in the shell. This is a bug in React."
	      );
	    4 !== boundary.status &&
	      ((boundary.status = 4),
	      (boundary.errorDigest = errorDigest$jscomp$0),
	      boundary.parentFlushed &&
	        request$jscomp$0.clientRenderedBoundaries.push(boundary));
	    if ("object" === typeof slots) for (var index in slots) delete slots[index];
	  }
	}
	function abortTask(task, request, error) {
	  var boundary = task.blockedBoundary,
	    segment = task.blockedSegment;
	  if (null !== segment) {
	    if (6 === segment.status) return;
	    segment.status = 3;
	  }
	  segment = getThrownInfo(task.componentStack);
	  if (null === boundary) {
	    if (13 !== request.status && 14 !== request.status) {
	      boundary = task.replay;
	      if (null === boundary) {
	        logRecoverableError(request, error, segment);
	        fatalError(request, error);
	        return;
	      }
	      boundary.pendingTasks--;
	      0 === boundary.pendingTasks &&
	        0 < boundary.nodes.length &&
	        ((task = logRecoverableError(request, error, segment)),
	        abortRemainingReplayNodes(
	          request,
	          null,
	          boundary.nodes,
	          boundary.slots,
	          error,
	          task
	        ));
	      request.pendingRootTasks--;
	      0 === request.pendingRootTasks && completeShell(request);
	    }
	  } else
	    boundary.pendingTasks--,
	      4 !== boundary.status &&
	        ((boundary.status = 4),
	        (task = logRecoverableError(request, error, segment)),
	        (boundary.status = 4),
	        (boundary.errorDigest = task),
	        untrackBoundary(request, boundary),
	        boundary.parentFlushed &&
	          request.clientRenderedBoundaries.push(boundary)),
	      boundary.fallbackAbortableTasks.forEach(function (fallbackTask) {
	        return abortTask(fallbackTask, request, error);
	      }),
	      boundary.fallbackAbortableTasks.clear();
	  request.allPendingTasks--;
	  0 === request.allPendingTasks && completeAll(request);
	}
	function safelyEmitEarlyPreloads(request, shellComplete) {
	  try {
	    var renderState = request.renderState,
	      onHeaders = renderState.onHeaders;
	    if (onHeaders) {
	      var headers = renderState.headers;
	      if (headers) {
	        renderState.headers = null;
	        var linkHeader = headers.preconnects;
	        headers.fontPreloads &&
	          (linkHeader && (linkHeader += ", "),
	          (linkHeader += headers.fontPreloads));
	        headers.highImagePreloads &&
	          (linkHeader && (linkHeader += ", "),
	          (linkHeader += headers.highImagePreloads));
	        if (!shellComplete) {
	          var queueIter = renderState.styles.values(),
	            queueStep = queueIter.next();
	          b: for (
	            ;
	            0 < headers.remainingCapacity && !queueStep.done;
	            queueStep = queueIter.next()
	          )
	            for (
	              var sheetIter = queueStep.value.sheets.values(),
	                sheetStep = sheetIter.next();
	              0 < headers.remainingCapacity && !sheetStep.done;
	              sheetStep = sheetIter.next()
	            ) {
	              var sheet = sheetStep.value,
	                props = sheet.props,
	                key = props.href,
	                props$jscomp$0 = sheet.props,
	                header = getPreloadAsHeader(props$jscomp$0.href, "style", {
	                  crossOrigin: props$jscomp$0.crossOrigin,
	                  integrity: props$jscomp$0.integrity,
	                  nonce: props$jscomp$0.nonce,
	                  type: props$jscomp$0.type,
	                  fetchPriority: props$jscomp$0.fetchPriority,
	                  referrerPolicy: props$jscomp$0.referrerPolicy,
	                  media: props$jscomp$0.media
	                });
	              if (0 <= (headers.remainingCapacity -= header.length + 2))
	                (renderState.resets.style[key] = PRELOAD_NO_CREDS),
	                  linkHeader && (linkHeader += ", "),
	                  (linkHeader += header),
	                  (renderState.resets.style[key] =
	                    "string" === typeof props.crossOrigin ||
	                    "string" === typeof props.integrity
	                      ? [props.crossOrigin, props.integrity]
	                      : PRELOAD_NO_CREDS);
	              else break b;
	            }
	        }
	        linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
	      }
	    }
	  } catch (error) {
	    logRecoverableError(request, error, {});
	  }
	}
	function completeShell(request) {
	  null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
	  null === request.trackedPostpones && preparePreamble(request);
	  request.onShellError = noop;
	  request = request.onShellReady;
	  request();
	}
	function completeAll(request) {
	  safelyEmitEarlyPreloads(
	    request,
	    null === request.trackedPostpones
	      ? true
	      : null === request.completedRootSegment ||
	          5 !== request.completedRootSegment.status
	  );
	  preparePreamble(request);
	  request = request.onAllReady;
	  request();
	}
	function queueCompletedSegment(boundary, segment) {
	  if (
	    0 === segment.chunks.length &&
	    1 === segment.children.length &&
	    null === segment.children[0].boundary &&
	    -1 === segment.children[0].id
	  ) {
	    var childSegment = segment.children[0];
	    childSegment.id = segment.id;
	    childSegment.parentFlushed = true;
	    1 === childSegment.status && queueCompletedSegment(boundary, childSegment);
	  } else boundary.completedSegments.push(segment);
	}
	function finishedTask(request, boundary, segment) {
	  if (null === boundary) {
	    if (null !== segment && segment.parentFlushed) {
	      if (null !== request.completedRootSegment)
	        throw Error(
	          "There can only be one root segment. This is a bug in React."
	        );
	      request.completedRootSegment = segment;
	    }
	    request.pendingRootTasks--;
	    0 === request.pendingRootTasks && completeShell(request);
	  } else
	    boundary.pendingTasks--,
	      4 !== boundary.status &&
	        (0 === boundary.pendingTasks
	          ? (0 === boundary.status && (boundary.status = 1),
	            null !== segment &&
	              segment.parentFlushed &&
	              1 === segment.status &&
	              queueCompletedSegment(boundary, segment),
	            boundary.parentFlushed &&
	              request.completedBoundaries.push(boundary),
	            1 === boundary.status &&
	              (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request),
	              boundary.fallbackAbortableTasks.clear(),
	              0 === request.pendingRootTasks &&
	                null === request.trackedPostpones &&
	                null !== boundary.contentPreamble &&
	                preparePreamble(request)))
	          : null !== segment &&
	            segment.parentFlushed &&
	            1 === segment.status &&
	            (queueCompletedSegment(boundary, segment),
	            1 === boundary.completedSegments.length &&
	              boundary.parentFlushed &&
	              request.partialBoundaries.push(boundary)));
	  request.allPendingTasks--;
	  0 === request.allPendingTasks && completeAll(request);
	}
	function performWork(request$jscomp$2) {
	  if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
	    var prevContext = currentActiveSnapshot,
	      prevDispatcher = ReactSharedInternals.H;
	    ReactSharedInternals.H = HooksDispatcher;
	    var prevAsyncDispatcher = ReactSharedInternals.A;
	    ReactSharedInternals.A = DefaultAsyncDispatcher;
	    var prevRequest = currentRequest;
	    currentRequest = request$jscomp$2;
	    var prevResumableState = currentResumableState;
	    currentResumableState = request$jscomp$2.resumableState;
	    try {
	      var pingedTasks = request$jscomp$2.pingedTasks,
	        i;
	      for (i = 0; i < pingedTasks.length; i++) {
	        var task = pingedTasks[i],
	          request = request$jscomp$2,
	          segment = task.blockedSegment;
	        if (null === segment) {
	          var request$jscomp$0 = request;
	          if (0 !== task.replay.pendingTasks) {
	            switchContext(task.context);
	            try {
	              "number" === typeof task.replay.slots
	                ? resumeNode(
	                    request$jscomp$0,
	                    task,
	                    task.replay.slots,
	                    task.node,
	                    task.childIndex
	                  )
	                : retryNode(request$jscomp$0, task);
	              if (
	                1 === task.replay.pendingTasks &&
	                0 < task.replay.nodes.length
	              )
	                throw Error(
	                  "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
	                );
	              task.replay.pendingTasks--;
	              task.abortSet.delete(task);
	              finishedTask(request$jscomp$0, task.blockedBoundary, null);
	            } catch (thrownValue) {
	              resetHooksState();
	              var x =
	                thrownValue === SuspenseException
	                  ? getSuspendedThenable()
	                  : thrownValue;
	              if (
	                "object" === typeof x &&
	                null !== x &&
	                "function" === typeof x.then
	              ) {
	                var ping = task.ping;
	                x.then(ping, ping);
	                task.thenableState = getThenableStateAfterSuspending();
	              } else {
	                task.replay.pendingTasks--;
	                task.abortSet.delete(task);
	                var errorInfo = getThrownInfo(task.componentStack);
	                request = void 0;
	                var request$jscomp$1 = request$jscomp$0,
	                  boundary = task.blockedBoundary,
	                  error$jscomp$0 =
	                    12 === request$jscomp$0.status
	                      ? request$jscomp$0.fatalError
	                      : x,
	                  replayNodes = task.replay.nodes,
	                  resumeSlots = task.replay.slots;
	                request = logRecoverableError(
	                  request$jscomp$1,
	                  error$jscomp$0,
	                  errorInfo
	                );
	                abortRemainingReplayNodes(
	                  request$jscomp$1,
	                  boundary,
	                  replayNodes,
	                  resumeSlots,
	                  error$jscomp$0,
	                  request
	                );
	                request$jscomp$0.pendingRootTasks--;
	                0 === request$jscomp$0.pendingRootTasks &&
	                  completeShell(request$jscomp$0);
	                request$jscomp$0.allPendingTasks--;
	                0 === request$jscomp$0.allPendingTasks &&
	                  completeAll(request$jscomp$0);
	              }
	            } finally {
	            }
	          }
	        } else if (
	          ((request$jscomp$0 = void 0),
	          (request$jscomp$1 = segment),
	          0 === request$jscomp$1.status)
	        ) {
	          request$jscomp$1.status = 6;
	          switchContext(task.context);
	          var childrenLength = request$jscomp$1.children.length,
	            chunkLength = request$jscomp$1.chunks.length;
	          try {
	            retryNode(request, task),
	              request$jscomp$1.lastPushedText &&
	                request$jscomp$1.textEmbedded &&
	                request$jscomp$1.chunks.push(textSeparator),
	              task.abortSet.delete(task),
	              (request$jscomp$1.status = 1),
	              finishedTask(request, task.blockedBoundary, request$jscomp$1);
	          } catch (thrownValue) {
	            resetHooksState();
	            request$jscomp$1.children.length = childrenLength;
	            request$jscomp$1.chunks.length = chunkLength;
	            var x$jscomp$0 =
	              thrownValue === SuspenseException
	                ? getSuspendedThenable()
	                : 12 === request.status
	                  ? request.fatalError
	                  : thrownValue;
	            if (
	              "object" === typeof x$jscomp$0 &&
	              null !== x$jscomp$0 &&
	              "function" === typeof x$jscomp$0.then
	            ) {
	              request$jscomp$1.status = 0;
	              task.thenableState = getThenableStateAfterSuspending();
	              var ping$jscomp$0 = task.ping;
	              x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
	            } else {
	              var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
	              task.abortSet.delete(task);
	              request$jscomp$1.status = 4;
	              var boundary$jscomp$0 = task.blockedBoundary;
	              request$jscomp$0 = logRecoverableError(
	                request,
	                x$jscomp$0,
	                errorInfo$jscomp$0
	              );
	              null === boundary$jscomp$0
	                ? fatalError(request, x$jscomp$0)
	                : (boundary$jscomp$0.pendingTasks--,
	                  4 !== boundary$jscomp$0.status &&
	                    ((boundary$jscomp$0.status = 4),
	                    (boundary$jscomp$0.errorDigest = request$jscomp$0),
	                    untrackBoundary(request, boundary$jscomp$0),
	                    boundary$jscomp$0.parentFlushed &&
	                      request.clientRenderedBoundaries.push(boundary$jscomp$0),
	                    0 === request.pendingRootTasks &&
	                      null === request.trackedPostpones &&
	                      null !== boundary$jscomp$0.contentPreamble &&
	                      preparePreamble(request)));
	              request.allPendingTasks--;
	              0 === request.allPendingTasks && completeAll(request);
	            }
	          } finally {
	          }
	        }
	      }
	      pingedTasks.splice(0, i);
	      null !== request$jscomp$2.destination &&
	        flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
	    } catch (error) {
	      logRecoverableError(request$jscomp$2, error, {}),
	        fatalError(request$jscomp$2, error);
	    } finally {
	      (currentResumableState = prevResumableState),
	        (ReactSharedInternals.H = prevDispatcher),
	        (ReactSharedInternals.A = prevAsyncDispatcher),
	        prevDispatcher === HooksDispatcher && switchContext(prevContext),
	        (currentRequest = prevRequest);
	    }
	  }
	}
	function preparePreambleFromSubtree(
	  request,
	  segment,
	  collectedPreambleSegments
	) {
	  segment.preambleChildren.length &&
	    collectedPreambleSegments.push(segment.preambleChildren);
	  for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
	    pendingPreambles =
	      preparePreambleFromSegment(
	        request,
	        segment.children[i],
	        collectedPreambleSegments
	      ) || pendingPreambles;
	  return pendingPreambles;
	}
	function preparePreambleFromSegment(
	  request,
	  segment,
	  collectedPreambleSegments
	) {
	  var boundary = segment.boundary;
	  if (null === boundary)
	    return preparePreambleFromSubtree(
	      request,
	      segment,
	      collectedPreambleSegments
	    );
	  var preamble = boundary.contentPreamble,
	    fallbackPreamble = boundary.fallbackPreamble;
	  if (null === preamble || null === fallbackPreamble) return false;
	  switch (boundary.status) {
	    case 1:
	      hoistPreambleState(request.renderState, preamble);
	      segment = boundary.completedSegments[0];
	      if (!segment)
	        throw Error(
	          "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
	        );
	      return preparePreambleFromSubtree(
	        request,
	        segment,
	        collectedPreambleSegments
	      );
	    case 5:
	      if (null !== request.trackedPostpones) return true;
	    case 4:
	      if (1 === segment.status)
	        return (
	          hoistPreambleState(request.renderState, fallbackPreamble),
	          preparePreambleFromSubtree(
	            request,
	            segment,
	            collectedPreambleSegments
	          )
	        );
	    default:
	      return true;
	  }
	}
	function preparePreamble(request) {
	  if (
	    request.completedRootSegment &&
	    null === request.completedPreambleSegments
	  ) {
	    var collectedPreambleSegments = [],
	      hasPendingPreambles = preparePreambleFromSegment(
	        request,
	        request.completedRootSegment,
	        collectedPreambleSegments
	      ),
	      preamble = request.renderState.preamble;
	    if (
	      false === hasPendingPreambles ||
	      (preamble.headChunks && preamble.bodyChunks)
	    )
	      request.completedPreambleSegments = collectedPreambleSegments;
	  }
	}
	function flushSubtree(request, destination, segment, hoistableState) {
	  segment.parentFlushed = true;
	  switch (segment.status) {
	    case 0:
	      segment.id = request.nextSegmentId++;
	    case 5:
	      return (
	        (hoistableState = segment.id),
	        (segment.lastPushedText = false),
	        (segment.textEmbedded = false),
	        (request = request.renderState),
	        writeChunk(destination, placeholder1),
	        writeChunk(destination, request.placeholderPrefix),
	        (request = stringToChunk(hoistableState.toString(16))),
	        writeChunk(destination, request),
	        writeChunkAndReturn(destination, placeholder2)
	      );
	    case 1:
	      segment.status = 2;
	      var r = true,
	        chunks = segment.chunks,
	        chunkIdx = 0;
	      segment = segment.children;
	      for (var childIdx = 0; childIdx < segment.length; childIdx++) {
	        for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
	          writeChunk(destination, chunks[chunkIdx]);
	        r = flushSegment(request, destination, r, hoistableState);
	      }
	      for (; chunkIdx < chunks.length - 1; chunkIdx++)
	        writeChunk(destination, chunks[chunkIdx]);
	      chunkIdx < chunks.length &&
	        (r = writeChunkAndReturn(destination, chunks[chunkIdx]));
	      return r;
	    default:
	      throw Error(
	        "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React."
	      );
	  }
	}
	function flushSegment(request, destination, segment, hoistableState) {
	  var boundary = segment.boundary;
	  if (null === boundary)
	    return flushSubtree(request, destination, segment, hoistableState);
	  boundary.parentFlushed = true;
	  if (4 === boundary.status) {
	    var errorDigest = boundary.errorDigest;
	    writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
	    writeChunk(destination, clientRenderedSuspenseBoundaryError1);
	    errorDigest &&
	      (writeChunk(destination, clientRenderedSuspenseBoundaryError1A),
	      writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest))),
	      writeChunk(
	        destination,
	        clientRenderedSuspenseBoundaryErrorAttrInterstitial
	      ));
	    writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
	    flushSubtree(request, destination, segment, hoistableState);
	    (request = boundary.fallbackPreamble) &&
	      writePreambleContribution(destination, request);
	    return writeChunkAndReturn(destination, endSuspenseBoundary);
	  }
	  if (1 !== boundary.status)
	    return (
	      0 === boundary.status &&
	        (boundary.rootSegmentID = request.nextSegmentId++),
	      0 < boundary.completedSegments.length &&
	        request.partialBoundaries.push(boundary),
	      writeStartPendingSuspenseBoundary(
	        destination,
	        request.renderState,
	        boundary.rootSegmentID
	      ),
	      hoistableState &&
	        ((boundary = boundary.fallbackState),
	        boundary.styles.forEach(hoistStyleQueueDependency, hoistableState),
	        boundary.stylesheets.forEach(
	          hoistStylesheetDependency,
	          hoistableState
	        )),
	      flushSubtree(request, destination, segment, hoistableState),
	      writeChunkAndReturn(destination, endSuspenseBoundary)
	    );
	  if (boundary.byteSize > request.progressiveChunkSize)
	    return (
	      (boundary.rootSegmentID = request.nextSegmentId++),
	      request.completedBoundaries.push(boundary),
	      writeStartPendingSuspenseBoundary(
	        destination,
	        request.renderState,
	        boundary.rootSegmentID
	      ),
	      flushSubtree(request, destination, segment, hoistableState),
	      writeChunkAndReturn(destination, endSuspenseBoundary)
	    );
	  hoistableState &&
	    ((segment = boundary.contentState),
	    segment.styles.forEach(hoistStyleQueueDependency, hoistableState),
	    segment.stylesheets.forEach(hoistStylesheetDependency, hoistableState));
	  writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
	  segment = boundary.completedSegments;
	  if (1 !== segment.length)
	    throw Error(
	      "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
	    );
	  flushSegment(request, destination, segment[0], hoistableState);
	  (request = boundary.contentPreamble) &&
	    writePreambleContribution(destination, request);
	  return writeChunkAndReturn(destination, endSuspenseBoundary);
	}
	function flushSegmentContainer(request, destination, segment, hoistableState) {
	  writeStartSegment(
	    destination,
	    request.renderState,
	    segment.parentFormatContext,
	    segment.id
	  );
	  flushSegment(request, destination, segment, hoistableState);
	  return writeEndSegment(destination, segment.parentFormatContext);
	}
	function flushCompletedBoundary(request, destination, boundary) {
	  for (
	    var completedSegments = boundary.completedSegments, i = 0;
	    i < completedSegments.length;
	    i++
	  )
	    flushPartiallyCompletedSegment(
	      request,
	      destination,
	      boundary,
	      completedSegments[i]
	    );
	  completedSegments.length = 0;
	  writeHoistablesForBoundary(
	    destination,
	    boundary.contentState,
	    request.renderState
	  );
	  completedSegments = request.resumableState;
	  request = request.renderState;
	  i = boundary.rootSegmentID;
	  boundary = boundary.contentState;
	  var requiresStyleInsertion = request.stylesToHoist;
	  request.stylesToHoist = false;
	  writeChunk(destination, request.startInlineScript);
	  requiresStyleInsertion
	    ? 0 === (completedSegments.instructions & 2)
	      ? ((completedSegments.instructions |= 10),
	        writeChunk(destination, completeBoundaryWithStylesScript1FullBoth))
	      : 0 === (completedSegments.instructions & 8)
	        ? ((completedSegments.instructions |= 8),
	          writeChunk(destination, completeBoundaryWithStylesScript1FullPartial))
	        : writeChunk(destination, completeBoundaryWithStylesScript1Partial)
	    : 0 === (completedSegments.instructions & 2)
	      ? ((completedSegments.instructions |= 2),
	        writeChunk(destination, completeBoundaryScript1Full))
	      : writeChunk(destination, completeBoundaryScript1Partial);
	  completedSegments = stringToChunk(i.toString(16));
	  writeChunk(destination, request.boundaryPrefix);
	  writeChunk(destination, completedSegments);
	  writeChunk(destination, completeBoundaryScript2);
	  writeChunk(destination, request.segmentPrefix);
	  writeChunk(destination, completedSegments);
	  requiresStyleInsertion
	    ? (writeChunk(destination, completeBoundaryScript3a),
	      writeStyleResourceDependenciesInJS(destination, boundary))
	    : writeChunk(destination, completeBoundaryScript3b);
	  boundary = writeChunkAndReturn(destination, completeBoundaryScriptEnd);
	  return writeBootstrap(destination, request) && boundary;
	}
	function flushPartiallyCompletedSegment(
	  request,
	  destination,
	  boundary,
	  segment
	) {
	  if (2 === segment.status) return true;
	  var hoistableState = boundary.contentState,
	    segmentID = segment.id;
	  if (-1 === segmentID) {
	    if (-1 === (segment.id = boundary.rootSegmentID))
	      throw Error(
	        "A root segment ID must have been assigned by now. This is a bug in React."
	      );
	    return flushSegmentContainer(request, destination, segment, hoistableState);
	  }
	  if (segmentID === boundary.rootSegmentID)
	    return flushSegmentContainer(request, destination, segment, hoistableState);
	  flushSegmentContainer(request, destination, segment, hoistableState);
	  boundary = request.resumableState;
	  request = request.renderState;
	  writeChunk(destination, request.startInlineScript);
	  0 === (boundary.instructions & 1)
	    ? ((boundary.instructions |= 1),
	      writeChunk(destination, completeSegmentScript1Full))
	    : writeChunk(destination, completeSegmentScript1Partial);
	  writeChunk(destination, request.segmentPrefix);
	  segmentID = stringToChunk(segmentID.toString(16));
	  writeChunk(destination, segmentID);
	  writeChunk(destination, completeSegmentScript2);
	  writeChunk(destination, request.placeholderPrefix);
	  writeChunk(destination, segmentID);
	  destination = writeChunkAndReturn(destination, completeSegmentScriptEnd);
	  return destination;
	}
	function flushCompletedQueues(request, destination) {
	  currentView = new Uint8Array(2048);
	  writtenBytes = 0;
	  try {
	    if (!(0 < request.pendingRootTasks)) {
	      var i,
	        completedRootSegment = request.completedRootSegment;
	      if (null !== completedRootSegment) {
	        if (5 === completedRootSegment.status) return;
	        var completedPreambleSegments = request.completedPreambleSegments;
	        if (null === completedPreambleSegments) return;
	        var renderState = request.renderState,
	          preamble = renderState.preamble,
	          htmlChunks = preamble.htmlChunks,
	          headChunks = preamble.headChunks,
	          i$jscomp$0;
	        if (htmlChunks) {
	          for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
	            writeChunk(destination, htmlChunks[i$jscomp$0]);
	          if (headChunks)
	            for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
	              writeChunk(destination, headChunks[i$jscomp$0]);
	          else
	            writeChunk(destination, startChunkForTag("head")),
	              writeChunk(destination, endOfStartTag);
	        } else if (headChunks)
	          for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
	            writeChunk(destination, headChunks[i$jscomp$0]);
	        var charsetChunks = renderState.charsetChunks;
	        for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
	          writeChunk(destination, charsetChunks[i$jscomp$0]);
	        charsetChunks.length = 0;
	        renderState.preconnects.forEach(flushResource, destination);
	        renderState.preconnects.clear();
	        var viewportChunks = renderState.viewportChunks;
	        for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
	          writeChunk(destination, viewportChunks[i$jscomp$0]);
	        viewportChunks.length = 0;
	        renderState.fontPreloads.forEach(flushResource, destination);
	        renderState.fontPreloads.clear();
	        renderState.highImagePreloads.forEach(flushResource, destination);
	        renderState.highImagePreloads.clear();
	        renderState.styles.forEach(flushStylesInPreamble, destination);
	        var importMapChunks = renderState.importMapChunks;
	        for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
	          writeChunk(destination, importMapChunks[i$jscomp$0]);
	        importMapChunks.length = 0;
	        renderState.bootstrapScripts.forEach(flushResource, destination);
	        renderState.scripts.forEach(flushResource, destination);
	        renderState.scripts.clear();
	        renderState.bulkPreloads.forEach(flushResource, destination);
	        renderState.bulkPreloads.clear();
	        var hoistableChunks = renderState.hoistableChunks;
	        for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
	          writeChunk(destination, hoistableChunks[i$jscomp$0]);
	        for (
	          renderState = hoistableChunks.length = 0;
	          renderState < completedPreambleSegments.length;
	          renderState++
	        ) {
	          var segments = completedPreambleSegments[renderState];
	          for (preamble = 0; preamble < segments.length; preamble++)
	            flushSegment(request, destination, segments[preamble], null);
	        }
	        var preamble$jscomp$0 = request.renderState.preamble,
	          headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
	        (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) &&
	          writeChunk(destination, endChunkForTag("head"));
	        var bodyChunks = preamble$jscomp$0.bodyChunks;
	        if (bodyChunks)
	          for (
	            completedPreambleSegments = 0;
	            completedPreambleSegments < bodyChunks.length;
	            completedPreambleSegments++
	          )
	            writeChunk(destination, bodyChunks[completedPreambleSegments]);
	        flushSegment(request, destination, completedRootSegment, null);
	        request.completedRootSegment = null;
	        writeBootstrap(destination, request.renderState);
	      }
	      var renderState$jscomp$0 = request.renderState;
	      completedRootSegment = 0;
	      var viewportChunks$jscomp$0 = renderState$jscomp$0.viewportChunks;
	      for (
	        completedRootSegment = 0;
	        completedRootSegment < viewportChunks$jscomp$0.length;
	        completedRootSegment++
	      )
	        writeChunk(destination, viewportChunks$jscomp$0[completedRootSegment]);
	      viewportChunks$jscomp$0.length = 0;
	      renderState$jscomp$0.preconnects.forEach(flushResource, destination);
	      renderState$jscomp$0.preconnects.clear();
	      renderState$jscomp$0.fontPreloads.forEach(flushResource, destination);
	      renderState$jscomp$0.fontPreloads.clear();
	      renderState$jscomp$0.highImagePreloads.forEach(
	        flushResource,
	        destination
	      );
	      renderState$jscomp$0.highImagePreloads.clear();
	      renderState$jscomp$0.styles.forEach(preloadLateStyles, destination);
	      renderState$jscomp$0.scripts.forEach(flushResource, destination);
	      renderState$jscomp$0.scripts.clear();
	      renderState$jscomp$0.bulkPreloads.forEach(flushResource, destination);
	      renderState$jscomp$0.bulkPreloads.clear();
	      var hoistableChunks$jscomp$0 = renderState$jscomp$0.hoistableChunks;
	      for (
	        completedRootSegment = 0;
	        completedRootSegment < hoistableChunks$jscomp$0.length;
	        completedRootSegment++
	      )
	        writeChunk(destination, hoistableChunks$jscomp$0[completedRootSegment]);
	      hoistableChunks$jscomp$0.length = 0;
	      var clientRenderedBoundaries = request.clientRenderedBoundaries;
	      for (i = 0; i < clientRenderedBoundaries.length; i++) {
	        var boundary = clientRenderedBoundaries[i];
	        renderState$jscomp$0 = destination;
	        var resumableState = request.resumableState,
	          renderState$jscomp$1 = request.renderState,
	          id = boundary.rootSegmentID,
	          errorDigest = boundary.errorDigest;
	        writeChunk(
	          renderState$jscomp$0,
	          renderState$jscomp$1.startInlineScript
	        );
	        0 === (resumableState.instructions & 4)
	          ? ((resumableState.instructions |= 4),
	            writeChunk(renderState$jscomp$0, clientRenderScript1Full))
	          : writeChunk(renderState$jscomp$0, clientRenderScript1Partial);
	        writeChunk(renderState$jscomp$0, renderState$jscomp$1.boundaryPrefix);
	        writeChunk(renderState$jscomp$0, stringToChunk(id.toString(16)));
	        writeChunk(renderState$jscomp$0, clientRenderScript1A);
	        errorDigest &&
	          (writeChunk(
	            renderState$jscomp$0,
	            clientRenderErrorScriptArgInterstitial
	          ),
	          writeChunk(
	            renderState$jscomp$0,
	            stringToChunk(
	              escapeJSStringsForInstructionScripts(errorDigest || "")
	            )
	          ));
	        var JSCompiler_inline_result = writeChunkAndReturn(
	          renderState$jscomp$0,
	          clientRenderScriptEnd
	        );
	        if (!JSCompiler_inline_result) {
	          request.destination = null;
	          i++;
	          clientRenderedBoundaries.splice(0, i);
	          return;
	        }
	      }
	      clientRenderedBoundaries.splice(0, i);
	      var completedBoundaries = request.completedBoundaries;
	      for (i = 0; i < completedBoundaries.length; i++)
	        if (
	          !flushCompletedBoundary(request, destination, completedBoundaries[i])
	        ) {
	          request.destination = null;
	          i++;
	          completedBoundaries.splice(0, i);
	          return;
	        }
	      completedBoundaries.splice(0, i);
	      completeWriting(destination);
	      currentView = new Uint8Array(2048);
	      writtenBytes = 0;
	      var partialBoundaries = request.partialBoundaries;
	      for (i = 0; i < partialBoundaries.length; i++) {
	        var boundary$51 = partialBoundaries[i];
	        a: {
	          clientRenderedBoundaries = request;
	          boundary = destination;
	          var completedSegments = boundary$51.completedSegments;
	          for (
	            JSCompiler_inline_result = 0;
	            JSCompiler_inline_result < completedSegments.length;
	            JSCompiler_inline_result++
	          )
	            if (
	              !flushPartiallyCompletedSegment(
	                clientRenderedBoundaries,
	                boundary,
	                boundary$51,
	                completedSegments[JSCompiler_inline_result]
	              )
	            ) {
	              JSCompiler_inline_result++;
	              completedSegments.splice(0, JSCompiler_inline_result);
	              var JSCompiler_inline_result$jscomp$0 = !1;
	              break a;
	            }
	          completedSegments.splice(0, JSCompiler_inline_result);
	          JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
	            boundary,
	            boundary$51.contentState,
	            clientRenderedBoundaries.renderState
	          );
	        }
	        if (!JSCompiler_inline_result$jscomp$0) {
	          request.destination = null;
	          i++;
	          partialBoundaries.splice(0, i);
	          return;
	        }
	      }
	      partialBoundaries.splice(0, i);
	      var largeBoundaries = request.completedBoundaries;
	      for (i = 0; i < largeBoundaries.length; i++)
	        if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
	          request.destination = null;
	          i++;
	          largeBoundaries.splice(0, i);
	          return;
	        }
	      largeBoundaries.splice(0, i);
	    }
	  } finally {
	    0 === request.allPendingTasks &&
	    0 === request.pingedTasks.length &&
	    0 === request.clientRenderedBoundaries.length &&
	    0 === request.completedBoundaries.length
	      ? ((request.flushScheduled = false),
	        (i = request.resumableState),
	        i.hasBody && writeChunk(destination, endChunkForTag("body")),
	        i.hasHtml && writeChunk(destination, endChunkForTag("html")),
	        completeWriting(destination),
	        (request.status = 14),
	        destination.close(),
	        (request.destination = null))
	      : completeWriting(destination);
	  }
	}
	function startWork(request) {
	  request.flushScheduled = null !== request.destination;
	  supportsRequestStorage
	    ? scheduleMicrotask(function () {
	        return requestStorage.run(request, performWork, request);
	      })
	    : scheduleMicrotask(function () {
	        return performWork(request);
	      });
	  setTimeout(function () {
	    10 === request.status && (request.status = 11);
	    null === request.trackedPostpones &&
	      (supportsRequestStorage
	        ? requestStorage.run(
	            request,
	            enqueueEarlyPreloadsAfterInitialWork,
	            request
	          )
	        : enqueueEarlyPreloadsAfterInitialWork(request));
	  }, 0);
	}
	function enqueueEarlyPreloadsAfterInitialWork(request) {
	  safelyEmitEarlyPreloads(request, 0 === request.pendingRootTasks);
	}
	function enqueueFlush(request) {
	  false === request.flushScheduled &&
	    0 === request.pingedTasks.length &&
	    null !== request.destination &&
	    ((request.flushScheduled = true),
	    setTimeout(function () {
	      var destination = request.destination;
	      destination
	        ? flushCompletedQueues(request, destination)
	        : (request.flushScheduled = false);
	    }, 0));
	}
	function startFlowing(request, destination) {
	  if (13 === request.status)
	    (request.status = 14), closeWithError(destination, request.fatalError);
	  else if (14 !== request.status && null === request.destination) {
	    request.destination = destination;
	    try {
	      flushCompletedQueues(request, destination);
	    } catch (error) {
	      logRecoverableError(request, error, {}), fatalError(request, error);
	    }
	  }
	}
	function abort(request, reason) {
	  if (11 === request.status || 10 === request.status) request.status = 12;
	  try {
	    var abortableTasks = request.abortableTasks;
	    if (0 < abortableTasks.size) {
	      var error =
	        void 0 === reason
	          ? Error("The render was aborted by the server without a reason.")
	          : "object" === typeof reason &&
	              null !== reason &&
	              "function" === typeof reason.then
	            ? Error("The render was aborted by the server with a promise.")
	            : reason;
	      request.fatalError = error;
	      abortableTasks.forEach(function (task) {
	        return abortTask(task, request, error);
	      });
	      abortableTasks.clear();
	    }
	    null !== request.destination &&
	      flushCompletedQueues(request, request.destination);
	  } catch (error$53) {
	    logRecoverableError(request, error$53, {}), fatalError(request, error$53);
	  }
	}
	function ensureCorrectIsomorphicReactVersion() {
	  var isomorphicReactPackageVersion = React.version;
	  if ("19.1.0" !== isomorphicReactPackageVersion)
	    throw Error(
	      'Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:\n  - react:      ' +
	        (isomorphicReactPackageVersion +
	          "\n  - react-dom:  19.1.0\nLearn more: https://react.dev/warnings/version-mismatch")
	    );
	}
	ensureCorrectIsomorphicReactVersion();
	ensureCorrectIsomorphicReactVersion();
	reactDomServer_edge_production.prerender = function (children, options) {
	  return new Promise(function (resolve, reject) {
	    var onHeaders = options ? options.onHeaders : void 0,
	      onHeadersImpl;
	    onHeaders &&
	      (onHeadersImpl = function (headersDescriptor) {
	        onHeaders(new Headers(headersDescriptor));
	      });
	    var resources = createResumableState(
	        options ? options.identifierPrefix : void 0,
	        options ? options.unstable_externalRuntimeSrc : void 0,
	        options ? options.bootstrapScriptContent : void 0,
	        options ? options.bootstrapScripts : void 0,
	        options ? options.bootstrapModules : void 0
	      ),
	      request = createPrerenderRequest(
	        children,
	        resources,
	        createRenderState(
	          resources,
	          void 0,
	          options ? options.unstable_externalRuntimeSrc : void 0,
	          options ? options.importMap : void 0,
	          onHeadersImpl,
	          options ? options.maxHeadersLength : void 0
	        ),
	        createRootFormatContext(options ? options.namespaceURI : void 0),
	        options ? options.progressiveChunkSize : void 0,
	        options ? options.onError : void 0,
	        function () {
	          var result = {
	            prelude: new ReadableStream(
	              {
	                type: "bytes",
	                pull: function (controller) {
	                  startFlowing(request, controller);
	                },
	                cancel: function (reason) {
	                  request.destination = null;
	                  abort(request, reason);
	                }
	              },
	              { highWaterMark: 0 }
	            )
	          };
	          resolve(result);
	        },
	        void 0,
	        void 0,
	        reject,
	        options ? options.onPostpone : void 0
	      );
	    if (options && options.signal) {
	      var signal = options.signal;
	      if (signal.aborted) abort(request, signal.reason);
	      else {
	        var listener = function () {
	          abort(request, signal.reason);
	          signal.removeEventListener("abort", listener);
	        };
	        signal.addEventListener("abort", listener);
	      }
	    }
	    startWork(request);
	  });
	};
	reactDomServer_edge_production.renderToReadableStream = function (children, options) {
	  return new Promise(function (resolve, reject) {
	    var onFatalError,
	      onAllReady,
	      allReady = new Promise(function (res, rej) {
	        onAllReady = res;
	        onFatalError = rej;
	      }),
	      onHeaders = options ? options.onHeaders : void 0,
	      onHeadersImpl;
	    onHeaders &&
	      (onHeadersImpl = function (headersDescriptor) {
	        onHeaders(new Headers(headersDescriptor));
	      });
	    var resumableState = createResumableState(
	        options ? options.identifierPrefix : void 0,
	        options ? options.unstable_externalRuntimeSrc : void 0,
	        options ? options.bootstrapScriptContent : void 0,
	        options ? options.bootstrapScripts : void 0,
	        options ? options.bootstrapModules : void 0
	      ),
	      request = createRequest(
	        children,
	        resumableState,
	        createRenderState(
	          resumableState,
	          options ? options.nonce : void 0,
	          options ? options.unstable_externalRuntimeSrc : void 0,
	          options ? options.importMap : void 0,
	          onHeadersImpl,
	          options ? options.maxHeadersLength : void 0
	        ),
	        createRootFormatContext(options ? options.namespaceURI : void 0),
	        options ? options.progressiveChunkSize : void 0,
	        options ? options.onError : void 0,
	        onAllReady,
	        function () {
	          var stream = new ReadableStream(
	            {
	              type: "bytes",
	              pull: function (controller) {
	                startFlowing(request, controller);
	              },
	              cancel: function (reason) {
	                request.destination = null;
	                abort(request, reason);
	              }
	            },
	            { highWaterMark: 0 }
	          );
	          stream.allReady = allReady;
	          resolve(stream);
	        },
	        function (error) {
	          allReady.catch(function () {});
	          reject(error);
	        },
	        onFatalError,
	        options ? options.onPostpone : void 0,
	        options ? options.formState : void 0
	      );
	    if (options && options.signal) {
	      var signal = options.signal;
	      if (signal.aborted) abort(request, signal.reason);
	      else {
	        var listener = function () {
	          abort(request, signal.reason);
	          signal.removeEventListener("abort", listener);
	        };
	        signal.addEventListener("abort", listener);
	      }
	    }
	    startWork(request);
	  });
	};
	reactDomServer_edge_production.version = "19.1.0";
	return reactDomServer_edge_production;
}

var reactDomServerLegacy_browser_production = {};

/**
 * @license React
 * react-dom-server-legacy.browser.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactDomServerLegacy_browser_production;

function requireReactDomServerLegacy_browser_production () {
	if (hasRequiredReactDomServerLegacy_browser_production) return reactDomServerLegacy_browser_production;
	hasRequiredReactDomServerLegacy_browser_production = 1;
	var React = requireReact(),
	  ReactDOM = requireReactDom();
	function formatProdErrorMessage(code) {
	  var url = "https://react.dev/errors/" + code;
	  if (1 < arguments.length) {
	    url += "?args[]=" + encodeURIComponent(arguments[1]);
	    for (var i = 2; i < arguments.length; i++)
	      url += "&args[]=" + encodeURIComponent(arguments[i]);
	  }
	  return (
	    "Minified React error #" +
	    code +
	    "; visit " +
	    url +
	    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
	  );
	}
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
	  REACT_PROVIDER_TYPE = Symbol.for("react.provider"),
	  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	  REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
	  REACT_MEMO_TYPE = Symbol.for("react.memo"),
	  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
	  REACT_SCOPE_TYPE = Symbol.for("react.scope"),
	  REACT_ACTIVITY_TYPE = Symbol.for("react.activity"),
	  REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden"),
	  REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
	  REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"),
	  MAYBE_ITERATOR_SYMBOL = Symbol.iterator,
	  isArrayImpl = Array.isArray;
	function murmurhash3_32_gc(key, seed) {
	  var remainder = key.length & 3;
	  var bytes = key.length - remainder;
	  var h1 = seed;
	  for (seed = 0; seed < bytes; ) {
	    var k1 =
	      (key.charCodeAt(seed) & 255) |
	      ((key.charCodeAt(++seed) & 255) << 8) |
	      ((key.charCodeAt(++seed) & 255) << 16) |
	      ((key.charCodeAt(++seed) & 255) << 24);
	    ++seed;
	    k1 =
	      (3432918353 * (k1 & 65535) +
	        (((3432918353 * (k1 >>> 16)) & 65535) << 16)) &
	      4294967295;
	    k1 = (k1 << 15) | (k1 >>> 17);
	    k1 =
	      (461845907 * (k1 & 65535) + (((461845907 * (k1 >>> 16)) & 65535) << 16)) &
	      4294967295;
	    h1 ^= k1;
	    h1 = (h1 << 13) | (h1 >>> 19);
	    h1 = (5 * (h1 & 65535) + (((5 * (h1 >>> 16)) & 65535) << 16)) & 4294967295;
	    h1 = (h1 & 65535) + 27492 + ((((h1 >>> 16) + 58964) & 65535) << 16);
	  }
	  k1 = 0;
	  switch (remainder) {
	    case 3:
	      k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
	    case 2:
	      k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
	    case 1:
	      (k1 ^= key.charCodeAt(seed) & 255),
	        (k1 =
	          (3432918353 * (k1 & 65535) +
	            (((3432918353 * (k1 >>> 16)) & 65535) << 16)) &
	          4294967295),
	        (k1 = (k1 << 15) | (k1 >>> 17)),
	        (h1 ^=
	          (461845907 * (k1 & 65535) +
	            (((461845907 * (k1 >>> 16)) & 65535) << 16)) &
	          4294967295);
	  }
	  h1 ^= key.length;
	  h1 ^= h1 >>> 16;
	  h1 =
	    (2246822507 * (h1 & 65535) + (((2246822507 * (h1 >>> 16)) & 65535) << 16)) &
	    4294967295;
	  h1 ^= h1 >>> 13;
	  h1 =
	    (3266489909 * (h1 & 65535) + (((3266489909 * (h1 >>> 16)) & 65535) << 16)) &
	    4294967295;
	  return (h1 ^ (h1 >>> 16)) >>> 0;
	}
	var assign = Object.assign,
	  hasOwnProperty = Object.prototype.hasOwnProperty,
	  VALID_ATTRIBUTE_NAME_REGEX = RegExp(
	    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
	  ),
	  illegalAttributeNameCache = {},
	  validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
	  if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
	    return true;
	  if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
	  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
	    return (validatedAttributeNameCache[attributeName] = true);
	  illegalAttributeNameCache[attributeName] = true;
	  return false;
	}
	var unitlessNumbers = new Set(
	    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
	      " "
	    )
	  ),
	  aliases = new Map([
	    ["acceptCharset", "accept-charset"],
	    ["htmlFor", "for"],
	    ["httpEquiv", "http-equiv"],
	    ["crossOrigin", "crossorigin"],
	    ["accentHeight", "accent-height"],
	    ["alignmentBaseline", "alignment-baseline"],
	    ["arabicForm", "arabic-form"],
	    ["baselineShift", "baseline-shift"],
	    ["capHeight", "cap-height"],
	    ["clipPath", "clip-path"],
	    ["clipRule", "clip-rule"],
	    ["colorInterpolation", "color-interpolation"],
	    ["colorInterpolationFilters", "color-interpolation-filters"],
	    ["colorProfile", "color-profile"],
	    ["colorRendering", "color-rendering"],
	    ["dominantBaseline", "dominant-baseline"],
	    ["enableBackground", "enable-background"],
	    ["fillOpacity", "fill-opacity"],
	    ["fillRule", "fill-rule"],
	    ["floodColor", "flood-color"],
	    ["floodOpacity", "flood-opacity"],
	    ["fontFamily", "font-family"],
	    ["fontSize", "font-size"],
	    ["fontSizeAdjust", "font-size-adjust"],
	    ["fontStretch", "font-stretch"],
	    ["fontStyle", "font-style"],
	    ["fontVariant", "font-variant"],
	    ["fontWeight", "font-weight"],
	    ["glyphName", "glyph-name"],
	    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
	    ["glyphOrientationVertical", "glyph-orientation-vertical"],
	    ["horizAdvX", "horiz-adv-x"],
	    ["horizOriginX", "horiz-origin-x"],
	    ["imageRendering", "image-rendering"],
	    ["letterSpacing", "letter-spacing"],
	    ["lightingColor", "lighting-color"],
	    ["markerEnd", "marker-end"],
	    ["markerMid", "marker-mid"],
	    ["markerStart", "marker-start"],
	    ["overlinePosition", "overline-position"],
	    ["overlineThickness", "overline-thickness"],
	    ["paintOrder", "paint-order"],
	    ["panose-1", "panose-1"],
	    ["pointerEvents", "pointer-events"],
	    ["renderingIntent", "rendering-intent"],
	    ["shapeRendering", "shape-rendering"],
	    ["stopColor", "stop-color"],
	    ["stopOpacity", "stop-opacity"],
	    ["strikethroughPosition", "strikethrough-position"],
	    ["strikethroughThickness", "strikethrough-thickness"],
	    ["strokeDasharray", "stroke-dasharray"],
	    ["strokeDashoffset", "stroke-dashoffset"],
	    ["strokeLinecap", "stroke-linecap"],
	    ["strokeLinejoin", "stroke-linejoin"],
	    ["strokeMiterlimit", "stroke-miterlimit"],
	    ["strokeOpacity", "stroke-opacity"],
	    ["strokeWidth", "stroke-width"],
	    ["textAnchor", "text-anchor"],
	    ["textDecoration", "text-decoration"],
	    ["textRendering", "text-rendering"],
	    ["transformOrigin", "transform-origin"],
	    ["underlinePosition", "underline-position"],
	    ["underlineThickness", "underline-thickness"],
	    ["unicodeBidi", "unicode-bidi"],
	    ["unicodeRange", "unicode-range"],
	    ["unitsPerEm", "units-per-em"],
	    ["vAlphabetic", "v-alphabetic"],
	    ["vHanging", "v-hanging"],
	    ["vIdeographic", "v-ideographic"],
	    ["vMathematical", "v-mathematical"],
	    ["vectorEffect", "vector-effect"],
	    ["vertAdvY", "vert-adv-y"],
	    ["vertOriginX", "vert-origin-x"],
	    ["vertOriginY", "vert-origin-y"],
	    ["wordSpacing", "word-spacing"],
	    ["writingMode", "writing-mode"],
	    ["xmlnsXlink", "xmlns:xlink"],
	    ["xHeight", "x-height"]
	  ]),
	  matchHtmlRegExp = /["'&<>]/;
	function escapeTextForBrowser(text) {
	  if (
	    "boolean" === typeof text ||
	    "number" === typeof text ||
	    "bigint" === typeof text
	  )
	    return "" + text;
	  text = "" + text;
	  var match = matchHtmlRegExp.exec(text);
	  if (match) {
	    var html = "",
	      index,
	      lastIndex = 0;
	    for (index = match.index; index < text.length; index++) {
	      switch (text.charCodeAt(index)) {
	        case 34:
	          match = "&quot;";
	          break;
	        case 38:
	          match = "&amp;";
	          break;
	        case 39:
	          match = "&#x27;";
	          break;
	        case 60:
	          match = "&lt;";
	          break;
	        case 62:
	          match = "&gt;";
	          break;
	        default:
	          continue;
	      }
	      lastIndex !== index && (html += text.slice(lastIndex, index));
	      lastIndex = index + 1;
	      html += match;
	    }
	    text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
	  }
	  return text;
	}
	var uppercasePattern = /([A-Z])/g,
	  msPattern = /^ms-/,
	  isJavaScriptProtocol =
	    /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
	  return isJavaScriptProtocol.test("" + url)
	    ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
	    : url;
	}
	var ReactSharedInternals =
	    React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	  ReactDOMSharedInternals =
	    ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	  sharedNotPendingObject = {
	    pending: false,
	    data: null,
	    method: null,
	    action: null
	  },
	  previousDispatcher = ReactDOMSharedInternals.d;
	ReactDOMSharedInternals.d = {
	  f: previousDispatcher.f,
	  r: previousDispatcher.r,
	  D: prefetchDNS,
	  C: preconnect,
	  L: preload,
	  m: preloadModule,
	  X: preinitScript,
	  S: preinitStyle,
	  M: preinitModuleScript
	};
	var PRELOAD_NO_CREDS = [],
	  scriptRegex = /(<\/|<)(s)(cript)/gi;
	function scriptReplacer(match, prefix, s, suffix) {
	  return "" + prefix + ("s" === s ? "\\u0073" : "\\u0053") + suffix;
	}
	function createResumableState(
	  identifierPrefix,
	  externalRuntimeConfig,
	  bootstrapScriptContent,
	  bootstrapScripts,
	  bootstrapModules
	) {
	  return {
	    idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
	    nextFormID: 0,
	    streamingFormat: 0,
	    bootstrapScriptContent: bootstrapScriptContent,
	    bootstrapScripts: bootstrapScripts,
	    bootstrapModules: bootstrapModules,
	    instructions: 0,
	    hasBody: false,
	    hasHtml: false,
	    unknownResources: {},
	    dnsResources: {},
	    connectResources: { default: {}, anonymous: {}, credentials: {} },
	    imageResources: {},
	    styleResources: {},
	    scriptResources: {},
	    moduleUnknownResources: {},
	    moduleScriptResources: {}
	  };
	}
	function createPreambleState() {
	  return {
	    htmlChunks: null,
	    headChunks: null,
	    bodyChunks: null,
	    contribution: 0
	  };
	}
	function createFormatContext(insertionMode, selectedValue, tagScope) {
	  return {
	    insertionMode: insertionMode,
	    selectedValue: selectedValue,
	    tagScope: tagScope
	  };
	}
	function getChildFormatContext(parentContext, type, props) {
	  switch (type) {
	    case "noscript":
	      return createFormatContext(2, null, parentContext.tagScope | 1);
	    case "select":
	      return createFormatContext(
	        2,
	        null != props.value ? props.value : props.defaultValue,
	        parentContext.tagScope
	      );
	    case "svg":
	      return createFormatContext(4, null, parentContext.tagScope);
	    case "picture":
	      return createFormatContext(2, null, parentContext.tagScope | 2);
	    case "math":
	      return createFormatContext(5, null, parentContext.tagScope);
	    case "foreignObject":
	      return createFormatContext(2, null, parentContext.tagScope);
	    case "table":
	      return createFormatContext(6, null, parentContext.tagScope);
	    case "thead":
	    case "tbody":
	    case "tfoot":
	      return createFormatContext(7, null, parentContext.tagScope);
	    case "colgroup":
	      return createFormatContext(9, null, parentContext.tagScope);
	    case "tr":
	      return createFormatContext(8, null, parentContext.tagScope);
	    case "head":
	      if (2 > parentContext.insertionMode)
	        return createFormatContext(3, null, parentContext.tagScope);
	      break;
	    case "html":
	      if (0 === parentContext.insertionMode)
	        return createFormatContext(1, null, parentContext.tagScope);
	  }
	  return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode
	    ? createFormatContext(2, null, parentContext.tagScope)
	    : parentContext;
	}
	var styleNameCache = new Map();
	function pushStyleAttribute(target, style) {
	  if ("object" !== typeof style) throw Error(formatProdErrorMessage(62));
	  var isFirst = true,
	    styleName;
	  for (styleName in style)
	    if (hasOwnProperty.call(style, styleName)) {
	      var styleValue = style[styleName];
	      if (
	        null != styleValue &&
	        "boolean" !== typeof styleValue &&
	        "" !== styleValue
	      ) {
	        if (0 === styleName.indexOf("--")) {
	          var nameChunk = escapeTextForBrowser(styleName);
	          styleValue = escapeTextForBrowser(("" + styleValue).trim());
	        } else
	          (nameChunk = styleNameCache.get(styleName)),
	            void 0 === nameChunk &&
	              ((nameChunk = escapeTextForBrowser(
	                styleName
	                  .replace(uppercasePattern, "-$1")
	                  .toLowerCase()
	                  .replace(msPattern, "-ms-")
	              )),
	              styleNameCache.set(styleName, nameChunk)),
	            (styleValue =
	              "number" === typeof styleValue
	                ? 0 === styleValue || unitlessNumbers.has(styleName)
	                  ? "" + styleValue
	                  : styleValue + "px"
	                : escapeTextForBrowser(("" + styleValue).trim()));
	        isFirst
	          ? ((isFirst = false),
	            target.push(' style="', nameChunk, ":", styleValue))
	          : target.push(";", nameChunk, ":", styleValue);
	      }
	    }
	  isFirst || target.push('"');
	}
	function pushBooleanAttribute(target, name, value) {
	  value &&
	    "function" !== typeof value &&
	    "symbol" !== typeof value &&
	    target.push(" ", name, '=""');
	}
	function pushStringAttribute(target, name, value) {
	  "function" !== typeof value &&
	    "symbol" !== typeof value &&
	    "boolean" !== typeof value &&
	    target.push(" ", name, '="', escapeTextForBrowser(value), '"');
	}
	var actionJavaScriptURL = escapeTextForBrowser(
	  "javascript:throw new Error('React form unexpectedly submitted.')"
	);
	function pushAdditionalFormField(value, key) {
	  this.push('<input type="hidden"');
	  validateAdditionalFormField(value);
	  pushStringAttribute(this, "name", key);
	  pushStringAttribute(this, "value", value);
	  this.push("/>");
	}
	function validateAdditionalFormField(value) {
	  if ("string" !== typeof value) throw Error(formatProdErrorMessage(480));
	}
	function getCustomFormFields(resumableState, formAction) {
	  if ("function" === typeof formAction.$$FORM_ACTION) {
	    var id = resumableState.nextFormID++;
	    resumableState = resumableState.idPrefix + id;
	    try {
	      var customFields = formAction.$$FORM_ACTION(resumableState);
	      if (customFields) {
	        var formData = customFields.data;
	        null != formData && formData.forEach(validateAdditionalFormField);
	      }
	      return customFields;
	    } catch (x) {
	      if ("object" === typeof x && null !== x && "function" === typeof x.then)
	        throw x;
	    }
	  }
	  return null;
	}
	function pushFormActionAttribute(
	  target,
	  resumableState,
	  renderState,
	  formAction,
	  formEncType,
	  formMethod,
	  formTarget,
	  name
	) {
	  var formData = null;
	  if ("function" === typeof formAction) {
	    var customFields = getCustomFormFields(resumableState, formAction);
	    null !== customFields
	      ? ((name = customFields.name),
	        (formAction = customFields.action || ""),
	        (formEncType = customFields.encType),
	        (formMethod = customFields.method),
	        (formTarget = customFields.target),
	        (formData = customFields.data))
	      : (target.push(" ", "formAction", '="', actionJavaScriptURL, '"'),
	        (formTarget = formMethod = formEncType = formAction = name = null),
	        injectFormReplayingRuntime(resumableState, renderState));
	  }
	  null != name && pushAttribute(target, "name", name);
	  null != formAction && pushAttribute(target, "formAction", formAction);
	  null != formEncType && pushAttribute(target, "formEncType", formEncType);
	  null != formMethod && pushAttribute(target, "formMethod", formMethod);
	  null != formTarget && pushAttribute(target, "formTarget", formTarget);
	  return formData;
	}
	function pushAttribute(target, name, value) {
	  switch (name) {
	    case "className":
	      pushStringAttribute(target, "class", value);
	      break;
	    case "tabIndex":
	      pushStringAttribute(target, "tabindex", value);
	      break;
	    case "dir":
	    case "role":
	    case "viewBox":
	    case "width":
	    case "height":
	      pushStringAttribute(target, name, value);
	      break;
	    case "style":
	      pushStyleAttribute(target, value);
	      break;
	    case "src":
	    case "href":
	      if ("" === value) break;
	    case "action":
	    case "formAction":
	      if (
	        null == value ||
	        "function" === typeof value ||
	        "symbol" === typeof value ||
	        "boolean" === typeof value
	      )
	        break;
	      value = sanitizeURL("" + value);
	      target.push(" ", name, '="', escapeTextForBrowser(value), '"');
	      break;
	    case "defaultValue":
	    case "defaultChecked":
	    case "innerHTML":
	    case "suppressContentEditableWarning":
	    case "suppressHydrationWarning":
	    case "ref":
	      break;
	    case "autoFocus":
	    case "multiple":
	    case "muted":
	      pushBooleanAttribute(target, name.toLowerCase(), value);
	      break;
	    case "xlinkHref":
	      if (
	        "function" === typeof value ||
	        "symbol" === typeof value ||
	        "boolean" === typeof value
	      )
	        break;
	      value = sanitizeURL("" + value);
	      target.push(" ", "xlink:href", '="', escapeTextForBrowser(value), '"');
	      break;
	    case "contentEditable":
	    case "spellCheck":
	    case "draggable":
	    case "value":
	    case "autoReverse":
	    case "externalResourcesRequired":
	    case "focusable":
	    case "preserveAlpha":
	      "function" !== typeof value &&
	        "symbol" !== typeof value &&
	        target.push(" ", name, '="', escapeTextForBrowser(value), '"');
	      break;
	    case "inert":
	    case "allowFullScreen":
	    case "async":
	    case "autoPlay":
	    case "controls":
	    case "default":
	    case "defer":
	    case "disabled":
	    case "disablePictureInPicture":
	    case "disableRemotePlayback":
	    case "formNoValidate":
	    case "hidden":
	    case "loop":
	    case "noModule":
	    case "noValidate":
	    case "open":
	    case "playsInline":
	    case "readOnly":
	    case "required":
	    case "reversed":
	    case "scoped":
	    case "seamless":
	    case "itemScope":
	      value &&
	        "function" !== typeof value &&
	        "symbol" !== typeof value &&
	        target.push(" ", name, '=""');
	      break;
	    case "capture":
	    case "download":
	      true === value
	        ? target.push(" ", name, '=""')
	        : false !== value &&
	          "function" !== typeof value &&
	          "symbol" !== typeof value &&
	          target.push(" ", name, '="', escapeTextForBrowser(value), '"');
	      break;
	    case "cols":
	    case "rows":
	    case "size":
	    case "span":
	      "function" !== typeof value &&
	        "symbol" !== typeof value &&
	        !isNaN(value) &&
	        1 <= value &&
	        target.push(" ", name, '="', escapeTextForBrowser(value), '"');
	      break;
	    case "rowSpan":
	    case "start":
	      "function" === typeof value ||
	        "symbol" === typeof value ||
	        isNaN(value) ||
	        target.push(" ", name, '="', escapeTextForBrowser(value), '"');
	      break;
	    case "xlinkActuate":
	      pushStringAttribute(target, "xlink:actuate", value);
	      break;
	    case "xlinkArcrole":
	      pushStringAttribute(target, "xlink:arcrole", value);
	      break;
	    case "xlinkRole":
	      pushStringAttribute(target, "xlink:role", value);
	      break;
	    case "xlinkShow":
	      pushStringAttribute(target, "xlink:show", value);
	      break;
	    case "xlinkTitle":
	      pushStringAttribute(target, "xlink:title", value);
	      break;
	    case "xlinkType":
	      pushStringAttribute(target, "xlink:type", value);
	      break;
	    case "xmlBase":
	      pushStringAttribute(target, "xml:base", value);
	      break;
	    case "xmlLang":
	      pushStringAttribute(target, "xml:lang", value);
	      break;
	    case "xmlSpace":
	      pushStringAttribute(target, "xml:space", value);
	      break;
	    default:
	      if (
	        !(2 < name.length) ||
	        ("o" !== name[0] && "O" !== name[0]) ||
	        ("n" !== name[1] && "N" !== name[1])
	      )
	        if (((name = aliases.get(name) || name), isAttributeNameSafe(name))) {
	          switch (typeof value) {
	            case "function":
	            case "symbol":
	              return;
	            case "boolean":
	              var prefix$8 = name.toLowerCase().slice(0, 5);
	              if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
	          }
	          target.push(" ", name, '="', escapeTextForBrowser(value), '"');
	        }
	  }
	}
	function pushInnerHTML(target, innerHTML, children) {
	  if (null != innerHTML) {
	    if (null != children) throw Error(formatProdErrorMessage(60));
	    if ("object" !== typeof innerHTML || !("__html" in innerHTML))
	      throw Error(formatProdErrorMessage(61));
	    innerHTML = innerHTML.__html;
	    null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
	  }
	}
	function flattenOptionChildren(children) {
	  var content = "";
	  React.Children.forEach(children, function (child) {
	    null != child && (content += child);
	  });
	  return content;
	}
	function injectFormReplayingRuntime(resumableState, renderState) {
	  0 === (resumableState.instructions & 16) &&
	    ((resumableState.instructions |= 16),
	    renderState.bootstrapChunks.unshift(
	      renderState.startInlineScript,
	      'addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error(\'React form unexpectedly submitted.\')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});',
	      "\x3c/script>"
	    ));
	}
	function pushLinkImpl(target, props) {
	  target.push(startChunkForTag("link"));
	  for (var propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	          case "dangerouslySetInnerHTML":
	            throw Error(formatProdErrorMessage(399, "link"));
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push("/>");
	  return null;
	}
	var styleRegex = /(<\/|<)(s)(tyle)/gi;
	function styleReplacer(match, prefix, s, suffix) {
	  return "" + prefix + ("s" === s ? "\\73 " : "\\53 ") + suffix;
	}
	function pushSelfClosing(target, props, tag) {
	  target.push(startChunkForTag(tag));
	  for (var propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	          case "dangerouslySetInnerHTML":
	            throw Error(formatProdErrorMessage(399, tag));
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push("/>");
	  return null;
	}
	function pushTitleImpl(target, props) {
	  target.push(startChunkForTag("title"));
	  var children = null,
	    innerHTML = null,
	    propKey;
	  for (propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	            children = propValue;
	            break;
	          case "dangerouslySetInnerHTML":
	            innerHTML = propValue;
	            break;
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(">");
	  props = Array.isArray(children)
	    ? 2 > children.length
	      ? children[0]
	      : null
	    : children;
	  "function" !== typeof props &&
	    "symbol" !== typeof props &&
	    null !== props &&
	    void 0 !== props &&
	    target.push(escapeTextForBrowser("" + props));
	  pushInnerHTML(target, innerHTML, children);
	  target.push(endChunkForTag("title"));
	  return null;
	}
	function pushScriptImpl(target, props) {
	  target.push(startChunkForTag("script"));
	  var children = null,
	    innerHTML = null,
	    propKey;
	  for (propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	            children = propValue;
	            break;
	          case "dangerouslySetInnerHTML":
	            innerHTML = propValue;
	            break;
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(">");
	  pushInnerHTML(target, innerHTML, children);
	  "string" === typeof children &&
	    target.push(("" + children).replace(scriptRegex, scriptReplacer));
	  target.push(endChunkForTag("script"));
	  return null;
	}
	function pushStartSingletonElement(target, props, tag) {
	  target.push(startChunkForTag(tag));
	  var innerHTML = (tag = null),
	    propKey;
	  for (propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	            tag = propValue;
	            break;
	          case "dangerouslySetInnerHTML":
	            innerHTML = propValue;
	            break;
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(">");
	  pushInnerHTML(target, innerHTML, tag);
	  return tag;
	}
	function pushStartGenericElement(target, props, tag) {
	  target.push(startChunkForTag(tag));
	  var innerHTML = (tag = null),
	    propKey;
	  for (propKey in props)
	    if (hasOwnProperty.call(props, propKey)) {
	      var propValue = props[propKey];
	      if (null != propValue)
	        switch (propKey) {
	          case "children":
	            tag = propValue;
	            break;
	          case "dangerouslySetInnerHTML":
	            innerHTML = propValue;
	            break;
	          default:
	            pushAttribute(target, propKey, propValue);
	        }
	    }
	  target.push(">");
	  pushInnerHTML(target, innerHTML, tag);
	  return "string" === typeof tag
	    ? (target.push(escapeTextForBrowser(tag)), null)
	    : tag;
	}
	var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,
	  validatedTagCache = new Map();
	function startChunkForTag(tag) {
	  var tagStartChunk = validatedTagCache.get(tag);
	  if (void 0 === tagStartChunk) {
	    if (!VALID_TAG_REGEX.test(tag))
	      throw Error(formatProdErrorMessage(65, tag));
	    tagStartChunk = "<" + tag;
	    validatedTagCache.set(tag, tagStartChunk);
	  }
	  return tagStartChunk;
	}
	function pushStartInstance(
	  target$jscomp$0,
	  type,
	  props,
	  resumableState,
	  renderState,
	  preambleState,
	  hoistableState,
	  formatContext,
	  textEmbedded,
	  isFallback
	) {
	  switch (type) {
	    case "div":
	    case "span":
	    case "svg":
	    case "path":
	      break;
	    case "a":
	      target$jscomp$0.push(startChunkForTag("a"));
	      var children = null,
	        innerHTML = null,
	        propKey;
	      for (propKey in props)
	        if (hasOwnProperty.call(props, propKey)) {
	          var propValue = props[propKey];
	          if (null != propValue)
	            switch (propKey) {
	              case "children":
	                children = propValue;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML = propValue;
	                break;
	              case "href":
	                "" === propValue
	                  ? pushStringAttribute(target$jscomp$0, "href", "")
	                  : pushAttribute(target$jscomp$0, propKey, propValue);
	                break;
	              default:
	                pushAttribute(target$jscomp$0, propKey, propValue);
	            }
	        }
	      target$jscomp$0.push(">");
	      pushInnerHTML(target$jscomp$0, innerHTML, children);
	      if ("string" === typeof children) {
	        target$jscomp$0.push(escapeTextForBrowser(children));
	        var JSCompiler_inline_result = null;
	      } else JSCompiler_inline_result = children;
	      return JSCompiler_inline_result;
	    case "g":
	    case "p":
	    case "li":
	      break;
	    case "select":
	      target$jscomp$0.push(startChunkForTag("select"));
	      var children$jscomp$0 = null,
	        innerHTML$jscomp$0 = null,
	        propKey$jscomp$0;
	      for (propKey$jscomp$0 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$0)) {
	          var propValue$jscomp$0 = props[propKey$jscomp$0];
	          if (null != propValue$jscomp$0)
	            switch (propKey$jscomp$0) {
	              case "children":
	                children$jscomp$0 = propValue$jscomp$0;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$0 = propValue$jscomp$0;
	                break;
	              case "defaultValue":
	              case "value":
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$0,
	                  propValue$jscomp$0
	                );
	            }
	        }
	      target$jscomp$0.push(">");
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
	      return children$jscomp$0;
	    case "option":
	      var selectedValue = formatContext.selectedValue;
	      target$jscomp$0.push(startChunkForTag("option"));
	      var children$jscomp$1 = null,
	        value = null,
	        selected = null,
	        innerHTML$jscomp$1 = null,
	        propKey$jscomp$1;
	      for (propKey$jscomp$1 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$1)) {
	          var propValue$jscomp$1 = props[propKey$jscomp$1];
	          if (null != propValue$jscomp$1)
	            switch (propKey$jscomp$1) {
	              case "children":
	                children$jscomp$1 = propValue$jscomp$1;
	                break;
	              case "selected":
	                selected = propValue$jscomp$1;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$1 = propValue$jscomp$1;
	                break;
	              case "value":
	                value = propValue$jscomp$1;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$1,
	                  propValue$jscomp$1
	                );
	            }
	        }
	      if (null != selectedValue) {
	        var stringValue =
	          null !== value
	            ? "" + value
	            : flattenOptionChildren(children$jscomp$1);
	        if (isArrayImpl(selectedValue))
	          for (var i = 0; i < selectedValue.length; i++) {
	            if ("" + selectedValue[i] === stringValue) {
	              target$jscomp$0.push(' selected=""');
	              break;
	            }
	          }
	        else
	          "" + selectedValue === stringValue &&
	            target$jscomp$0.push(' selected=""');
	      } else selected && target$jscomp$0.push(' selected=""');
	      target$jscomp$0.push(">");
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
	      return children$jscomp$1;
	    case "textarea":
	      target$jscomp$0.push(startChunkForTag("textarea"));
	      var value$jscomp$0 = null,
	        defaultValue = null,
	        children$jscomp$2 = null,
	        propKey$jscomp$2;
	      for (propKey$jscomp$2 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$2)) {
	          var propValue$jscomp$2 = props[propKey$jscomp$2];
	          if (null != propValue$jscomp$2)
	            switch (propKey$jscomp$2) {
	              case "children":
	                children$jscomp$2 = propValue$jscomp$2;
	                break;
	              case "value":
	                value$jscomp$0 = propValue$jscomp$2;
	                break;
	              case "defaultValue":
	                defaultValue = propValue$jscomp$2;
	                break;
	              case "dangerouslySetInnerHTML":
	                throw Error(formatProdErrorMessage(91));
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$2,
	                  propValue$jscomp$2
	                );
	            }
	        }
	      null === value$jscomp$0 &&
	        null !== defaultValue &&
	        (value$jscomp$0 = defaultValue);
	      target$jscomp$0.push(">");
	      if (null != children$jscomp$2) {
	        if (null != value$jscomp$0) throw Error(formatProdErrorMessage(92));
	        if (isArrayImpl(children$jscomp$2)) {
	          if (1 < children$jscomp$2.length)
	            throw Error(formatProdErrorMessage(93));
	          value$jscomp$0 = "" + children$jscomp$2[0];
	        }
	        value$jscomp$0 = "" + children$jscomp$2;
	      }
	      "string" === typeof value$jscomp$0 &&
	        "\n" === value$jscomp$0[0] &&
	        target$jscomp$0.push("\n");
	      null !== value$jscomp$0 &&
	        target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
	      return null;
	    case "input":
	      target$jscomp$0.push(startChunkForTag("input"));
	      var name = null,
	        formAction = null,
	        formEncType = null,
	        formMethod = null,
	        formTarget = null,
	        value$jscomp$1 = null,
	        defaultValue$jscomp$0 = null,
	        checked = null,
	        defaultChecked = null,
	        propKey$jscomp$3;
	      for (propKey$jscomp$3 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$3)) {
	          var propValue$jscomp$3 = props[propKey$jscomp$3];
	          if (null != propValue$jscomp$3)
	            switch (propKey$jscomp$3) {
	              case "children":
	              case "dangerouslySetInnerHTML":
	                throw Error(formatProdErrorMessage(399, "input"));
	              case "name":
	                name = propValue$jscomp$3;
	                break;
	              case "formAction":
	                formAction = propValue$jscomp$3;
	                break;
	              case "formEncType":
	                formEncType = propValue$jscomp$3;
	                break;
	              case "formMethod":
	                formMethod = propValue$jscomp$3;
	                break;
	              case "formTarget":
	                formTarget = propValue$jscomp$3;
	                break;
	              case "defaultChecked":
	                defaultChecked = propValue$jscomp$3;
	                break;
	              case "defaultValue":
	                defaultValue$jscomp$0 = propValue$jscomp$3;
	                break;
	              case "checked":
	                checked = propValue$jscomp$3;
	                break;
	              case "value":
	                value$jscomp$1 = propValue$jscomp$3;
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$3,
	                  propValue$jscomp$3
	                );
	            }
	        }
	      var formData = pushFormActionAttribute(
	        target$jscomp$0,
	        resumableState,
	        renderState,
	        formAction,
	        formEncType,
	        formMethod,
	        formTarget,
	        name
	      );
	      null !== checked
	        ? pushBooleanAttribute(target$jscomp$0, "checked", checked)
	        : null !== defaultChecked &&
	          pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
	      null !== value$jscomp$1
	        ? pushAttribute(target$jscomp$0, "value", value$jscomp$1)
	        : null !== defaultValue$jscomp$0 &&
	          pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
	      target$jscomp$0.push("/>");
	      null != formData &&
	        formData.forEach(pushAdditionalFormField, target$jscomp$0);
	      return null;
	    case "button":
	      target$jscomp$0.push(startChunkForTag("button"));
	      var children$jscomp$3 = null,
	        innerHTML$jscomp$2 = null,
	        name$jscomp$0 = null,
	        formAction$jscomp$0 = null,
	        formEncType$jscomp$0 = null,
	        formMethod$jscomp$0 = null,
	        formTarget$jscomp$0 = null,
	        propKey$jscomp$4;
	      for (propKey$jscomp$4 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$4)) {
	          var propValue$jscomp$4 = props[propKey$jscomp$4];
	          if (null != propValue$jscomp$4)
	            switch (propKey$jscomp$4) {
	              case "children":
	                children$jscomp$3 = propValue$jscomp$4;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$2 = propValue$jscomp$4;
	                break;
	              case "name":
	                name$jscomp$0 = propValue$jscomp$4;
	                break;
	              case "formAction":
	                formAction$jscomp$0 = propValue$jscomp$4;
	                break;
	              case "formEncType":
	                formEncType$jscomp$0 = propValue$jscomp$4;
	                break;
	              case "formMethod":
	                formMethod$jscomp$0 = propValue$jscomp$4;
	                break;
	              case "formTarget":
	                formTarget$jscomp$0 = propValue$jscomp$4;
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$4,
	                  propValue$jscomp$4
	                );
	            }
	        }
	      var formData$jscomp$0 = pushFormActionAttribute(
	        target$jscomp$0,
	        resumableState,
	        renderState,
	        formAction$jscomp$0,
	        formEncType$jscomp$0,
	        formMethod$jscomp$0,
	        formTarget$jscomp$0,
	        name$jscomp$0
	      );
	      target$jscomp$0.push(">");
	      null != formData$jscomp$0 &&
	        formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
	      if ("string" === typeof children$jscomp$3) {
	        target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
	        var JSCompiler_inline_result$jscomp$0 = null;
	      } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
	      return JSCompiler_inline_result$jscomp$0;
	    case "form":
	      target$jscomp$0.push(startChunkForTag("form"));
	      var children$jscomp$4 = null,
	        innerHTML$jscomp$3 = null,
	        formAction$jscomp$1 = null,
	        formEncType$jscomp$1 = null,
	        formMethod$jscomp$1 = null,
	        formTarget$jscomp$1 = null,
	        propKey$jscomp$5;
	      for (propKey$jscomp$5 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$5)) {
	          var propValue$jscomp$5 = props[propKey$jscomp$5];
	          if (null != propValue$jscomp$5)
	            switch (propKey$jscomp$5) {
	              case "children":
	                children$jscomp$4 = propValue$jscomp$5;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$3 = propValue$jscomp$5;
	                break;
	              case "action":
	                formAction$jscomp$1 = propValue$jscomp$5;
	                break;
	              case "encType":
	                formEncType$jscomp$1 = propValue$jscomp$5;
	                break;
	              case "method":
	                formMethod$jscomp$1 = propValue$jscomp$5;
	                break;
	              case "target":
	                formTarget$jscomp$1 = propValue$jscomp$5;
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$5,
	                  propValue$jscomp$5
	                );
	            }
	        }
	      var formData$jscomp$1 = null,
	        formActionName = null;
	      if ("function" === typeof formAction$jscomp$1) {
	        var customFields = getCustomFormFields(
	          resumableState,
	          formAction$jscomp$1
	        );
	        null !== customFields
	          ? ((formAction$jscomp$1 = customFields.action || ""),
	            (formEncType$jscomp$1 = customFields.encType),
	            (formMethod$jscomp$1 = customFields.method),
	            (formTarget$jscomp$1 = customFields.target),
	            (formData$jscomp$1 = customFields.data),
	            (formActionName = customFields.name))
	          : (target$jscomp$0.push(
	              " ",
	              "action",
	              '="',
	              actionJavaScriptURL,
	              '"'
	            ),
	            (formTarget$jscomp$1 =
	              formMethod$jscomp$1 =
	              formEncType$jscomp$1 =
	              formAction$jscomp$1 =
	                null),
	            injectFormReplayingRuntime(resumableState, renderState));
	      }
	      null != formAction$jscomp$1 &&
	        pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
	      null != formEncType$jscomp$1 &&
	        pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
	      null != formMethod$jscomp$1 &&
	        pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
	      null != formTarget$jscomp$1 &&
	        pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
	      target$jscomp$0.push(">");
	      null !== formActionName &&
	        (target$jscomp$0.push('<input type="hidden"'),
	        pushStringAttribute(target$jscomp$0, "name", formActionName),
	        target$jscomp$0.push("/>"),
	        null != formData$jscomp$1 &&
	          formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
	      if ("string" === typeof children$jscomp$4) {
	        target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
	        var JSCompiler_inline_result$jscomp$1 = null;
	      } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
	      return JSCompiler_inline_result$jscomp$1;
	    case "menuitem":
	      target$jscomp$0.push(startChunkForTag("menuitem"));
	      for (var propKey$jscomp$6 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$6)) {
	          var propValue$jscomp$6 = props[propKey$jscomp$6];
	          if (null != propValue$jscomp$6)
	            switch (propKey$jscomp$6) {
	              case "children":
	              case "dangerouslySetInnerHTML":
	                throw Error(formatProdErrorMessage(400));
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$6,
	                  propValue$jscomp$6
	                );
	            }
	        }
	      target$jscomp$0.push(">");
	      return null;
	    case "object":
	      target$jscomp$0.push(startChunkForTag("object"));
	      var children$jscomp$5 = null,
	        innerHTML$jscomp$4 = null,
	        propKey$jscomp$7;
	      for (propKey$jscomp$7 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$7)) {
	          var propValue$jscomp$7 = props[propKey$jscomp$7];
	          if (null != propValue$jscomp$7)
	            switch (propKey$jscomp$7) {
	              case "children":
	                children$jscomp$5 = propValue$jscomp$7;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$4 = propValue$jscomp$7;
	                break;
	              case "data":
	                var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
	                if ("" === sanitizedValue) break;
	                target$jscomp$0.push(
	                  " ",
	                  "data",
	                  '="',
	                  escapeTextForBrowser(sanitizedValue),
	                  '"'
	                );
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$7,
	                  propValue$jscomp$7
	                );
	            }
	        }
	      target$jscomp$0.push(">");
	      pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
	      if ("string" === typeof children$jscomp$5) {
	        target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
	        var JSCompiler_inline_result$jscomp$2 = null;
	      } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
	      return JSCompiler_inline_result$jscomp$2;
	    case "title":
	      if (
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp
	      )
	        var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(
	          target$jscomp$0,
	          props
	        );
	      else
	        isFallback
	          ? (JSCompiler_inline_result$jscomp$3 = null)
	          : (pushTitleImpl(renderState.hoistableChunks, props),
	            (JSCompiler_inline_result$jscomp$3 = void 0));
	      return JSCompiler_inline_result$jscomp$3;
	    case "link":
	      var rel = props.rel,
	        href = props.href,
	        precedence = props.precedence;
	      if (
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp ||
	        "string" !== typeof rel ||
	        "string" !== typeof href ||
	        "" === href
	      ) {
	        pushLinkImpl(target$jscomp$0, props);
	        var JSCompiler_inline_result$jscomp$4 = null;
	      } else if ("stylesheet" === props.rel)
	        if (
	          "string" !== typeof precedence ||
	          null != props.disabled ||
	          props.onLoad ||
	          props.onError
	        )
	          JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
	            target$jscomp$0,
	            props
	          );
	        else {
	          var styleQueue = renderState.styles.get(precedence),
	            resourceState = resumableState.styleResources.hasOwnProperty(href)
	              ? resumableState.styleResources[href]
	              : void 0;
	          if (null !== resourceState) {
	            resumableState.styleResources[href] = null;
	            styleQueue ||
	              ((styleQueue = {
	                precedence: escapeTextForBrowser(precedence),
	                rules: [],
	                hrefs: [],
	                sheets: new Map()
	              }),
	              renderState.styles.set(precedence, styleQueue));
	            var resource = {
	              state: 0,
	              props: assign({}, props, {
	                "data-precedence": props.precedence,
	                precedence: null
	              })
	            };
	            if (resourceState) {
	              2 === resourceState.length &&
	                adoptPreloadCredentials(resource.props, resourceState);
	              var preloadResource = renderState.preloads.stylesheets.get(href);
	              preloadResource && 0 < preloadResource.length
	                ? (preloadResource.length = 0)
	                : (resource.state = 1);
	            }
	            styleQueue.sheets.set(href, resource);
	            hoistableState && hoistableState.stylesheets.add(resource);
	          } else if (styleQueue) {
	            var resource$9 = styleQueue.sheets.get(href);
	            resource$9 &&
	              hoistableState &&
	              hoistableState.stylesheets.add(resource$9);
	          }
	          textEmbedded && target$jscomp$0.push("\x3c!-- --\x3e");
	          JSCompiler_inline_result$jscomp$4 = null;
	        }
	      else
	        props.onLoad || props.onError
	          ? (JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
	              target$jscomp$0,
	              props
	            ))
	          : (textEmbedded && target$jscomp$0.push("\x3c!-- --\x3e"),
	            (JSCompiler_inline_result$jscomp$4 = isFallback
	              ? null
	              : pushLinkImpl(renderState.hoistableChunks, props)));
	      return JSCompiler_inline_result$jscomp$4;
	    case "script":
	      var asyncProp = props.async;
	      if (
	        "string" !== typeof props.src ||
	        !props.src ||
	        !asyncProp ||
	        "function" === typeof asyncProp ||
	        "symbol" === typeof asyncProp ||
	        props.onLoad ||
	        props.onError ||
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp
	      )
	        var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(
	          target$jscomp$0,
	          props
	        );
	      else {
	        var key = props.src;
	        if ("module" === props.type) {
	          var resources = resumableState.moduleScriptResources;
	          var preloads = renderState.preloads.moduleScripts;
	        } else
	          (resources = resumableState.scriptResources),
	            (preloads = renderState.preloads.scripts);
	        var resourceState$jscomp$0 = resources.hasOwnProperty(key)
	          ? resources[key]
	          : void 0;
	        if (null !== resourceState$jscomp$0) {
	          resources[key] = null;
	          var scriptProps = props;
	          if (resourceState$jscomp$0) {
	            2 === resourceState$jscomp$0.length &&
	              ((scriptProps = assign({}, props)),
	              adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
	            var preloadResource$jscomp$0 = preloads.get(key);
	            preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
	          }
	          var resource$jscomp$0 = [];
	          renderState.scripts.add(resource$jscomp$0);
	          pushScriptImpl(resource$jscomp$0, scriptProps);
	        }
	        textEmbedded && target$jscomp$0.push("\x3c!-- --\x3e");
	        JSCompiler_inline_result$jscomp$5 = null;
	      }
	      return JSCompiler_inline_result$jscomp$5;
	    case "style":
	      var precedence$jscomp$0 = props.precedence,
	        href$jscomp$0 = props.href;
	      if (
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp ||
	        "string" !== typeof precedence$jscomp$0 ||
	        "string" !== typeof href$jscomp$0 ||
	        "" === href$jscomp$0
	      ) {
	        target$jscomp$0.push(startChunkForTag("style"));
	        var children$jscomp$6 = null,
	          innerHTML$jscomp$5 = null,
	          propKey$jscomp$8;
	        for (propKey$jscomp$8 in props)
	          if (hasOwnProperty.call(props, propKey$jscomp$8)) {
	            var propValue$jscomp$8 = props[propKey$jscomp$8];
	            if (null != propValue$jscomp$8)
	              switch (propKey$jscomp$8) {
	                case "children":
	                  children$jscomp$6 = propValue$jscomp$8;
	                  break;
	                case "dangerouslySetInnerHTML":
	                  innerHTML$jscomp$5 = propValue$jscomp$8;
	                  break;
	                default:
	                  pushAttribute(
	                    target$jscomp$0,
	                    propKey$jscomp$8,
	                    propValue$jscomp$8
	                  );
	              }
	          }
	        target$jscomp$0.push(">");
	        var child = Array.isArray(children$jscomp$6)
	          ? 2 > children$jscomp$6.length
	            ? children$jscomp$6[0]
	            : null
	          : children$jscomp$6;
	        "function" !== typeof child &&
	          "symbol" !== typeof child &&
	          null !== child &&
	          void 0 !== child &&
	          target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
	        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
	        target$jscomp$0.push(endChunkForTag("style"));
	        var JSCompiler_inline_result$jscomp$6 = null;
	      } else {
	        var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
	        if (
	          null !==
	          (resumableState.styleResources.hasOwnProperty(href$jscomp$0)
	            ? resumableState.styleResources[href$jscomp$0]
	            : void 0)
	        ) {
	          resumableState.styleResources[href$jscomp$0] = null;
	          styleQueue$jscomp$0
	            ? styleQueue$jscomp$0.hrefs.push(
	                escapeTextForBrowser(href$jscomp$0)
	              )
	            : ((styleQueue$jscomp$0 = {
	                precedence: escapeTextForBrowser(precedence$jscomp$0),
	                rules: [],
	                hrefs: [escapeTextForBrowser(href$jscomp$0)],
	                sheets: new Map()
	              }),
	              renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
	          var target = styleQueue$jscomp$0.rules,
	            children$jscomp$7 = null,
	            innerHTML$jscomp$6 = null,
	            propKey$jscomp$9;
	          for (propKey$jscomp$9 in props)
	            if (hasOwnProperty.call(props, propKey$jscomp$9)) {
	              var propValue$jscomp$9 = props[propKey$jscomp$9];
	              if (null != propValue$jscomp$9)
	                switch (propKey$jscomp$9) {
	                  case "children":
	                    children$jscomp$7 = propValue$jscomp$9;
	                    break;
	                  case "dangerouslySetInnerHTML":
	                    innerHTML$jscomp$6 = propValue$jscomp$9;
	                }
	            }
	          var child$jscomp$0 = Array.isArray(children$jscomp$7)
	            ? 2 > children$jscomp$7.length
	              ? children$jscomp$7[0]
	              : null
	            : children$jscomp$7;
	          "function" !== typeof child$jscomp$0 &&
	            "symbol" !== typeof child$jscomp$0 &&
	            null !== child$jscomp$0 &&
	            void 0 !== child$jscomp$0 &&
	            target.push(
	              ("" + child$jscomp$0).replace(styleRegex, styleReplacer)
	            );
	          pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
	        }
	        styleQueue$jscomp$0 &&
	          hoistableState &&
	          hoistableState.styles.add(styleQueue$jscomp$0);
	        textEmbedded && target$jscomp$0.push("\x3c!-- --\x3e");
	        JSCompiler_inline_result$jscomp$6 = void 0;
	      }
	      return JSCompiler_inline_result$jscomp$6;
	    case "meta":
	      if (
	        4 === formatContext.insertionMode ||
	        formatContext.tagScope & 1 ||
	        null != props.itemProp
	      )
	        var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(
	          target$jscomp$0,
	          props,
	          "meta"
	        );
	      else
	        textEmbedded && target$jscomp$0.push("\x3c!-- --\x3e"),
	          (JSCompiler_inline_result$jscomp$7 = isFallback
	            ? null
	            : "string" === typeof props.charSet
	              ? pushSelfClosing(renderState.charsetChunks, props, "meta")
	              : "viewport" === props.name
	                ? pushSelfClosing(renderState.viewportChunks, props, "meta")
	                : pushSelfClosing(renderState.hoistableChunks, props, "meta"));
	      return JSCompiler_inline_result$jscomp$7;
	    case "listing":
	    case "pre":
	      target$jscomp$0.push(startChunkForTag(type));
	      var children$jscomp$8 = null,
	        innerHTML$jscomp$7 = null,
	        propKey$jscomp$10;
	      for (propKey$jscomp$10 in props)
	        if (hasOwnProperty.call(props, propKey$jscomp$10)) {
	          var propValue$jscomp$10 = props[propKey$jscomp$10];
	          if (null != propValue$jscomp$10)
	            switch (propKey$jscomp$10) {
	              case "children":
	                children$jscomp$8 = propValue$jscomp$10;
	                break;
	              case "dangerouslySetInnerHTML":
	                innerHTML$jscomp$7 = propValue$jscomp$10;
	                break;
	              default:
	                pushAttribute(
	                  target$jscomp$0,
	                  propKey$jscomp$10,
	                  propValue$jscomp$10
	                );
	            }
	        }
	      target$jscomp$0.push(">");
	      if (null != innerHTML$jscomp$7) {
	        if (null != children$jscomp$8) throw Error(formatProdErrorMessage(60));
	        if (
	          "object" !== typeof innerHTML$jscomp$7 ||
	          !("__html" in innerHTML$jscomp$7)
	        )
	          throw Error(formatProdErrorMessage(61));
	        var html = innerHTML$jscomp$7.__html;
	        null !== html &&
	          void 0 !== html &&
	          ("string" === typeof html && 0 < html.length && "\n" === html[0]
	            ? target$jscomp$0.push("\n", html)
	            : target$jscomp$0.push("" + html));
	      }
	      "string" === typeof children$jscomp$8 &&
	        "\n" === children$jscomp$8[0] &&
	        target$jscomp$0.push("\n");
	      return children$jscomp$8;
	    case "img":
	      var src = props.src,
	        srcSet = props.srcSet;
	      if (
	        !(
	          "lazy" === props.loading ||
	          (!src && !srcSet) ||
	          ("string" !== typeof src && null != src) ||
	          ("string" !== typeof srcSet && null != srcSet)
	        ) &&
	        "low" !== props.fetchPriority &&
	        false === !!(formatContext.tagScope & 3) &&
	        ("string" !== typeof src ||
	          ":" !== src[4] ||
	          ("d" !== src[0] && "D" !== src[0]) ||
	          ("a" !== src[1] && "A" !== src[1]) ||
	          ("t" !== src[2] && "T" !== src[2]) ||
	          ("a" !== src[3] && "A" !== src[3])) &&
	        ("string" !== typeof srcSet ||
	          ":" !== srcSet[4] ||
	          ("d" !== srcSet[0] && "D" !== srcSet[0]) ||
	          ("a" !== srcSet[1] && "A" !== srcSet[1]) ||
	          ("t" !== srcSet[2] && "T" !== srcSet[2]) ||
	          ("a" !== srcSet[3] && "A" !== srcSet[3]))
	      ) {
	        var sizes = "string" === typeof props.sizes ? props.sizes : void 0,
	          key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src,
	          promotablePreloads = renderState.preloads.images,
	          resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
	        if (resource$jscomp$1) {
	          if (
	            "high" === props.fetchPriority ||
	            10 > renderState.highImagePreloads.size
	          )
	            promotablePreloads.delete(key$jscomp$0),
	              renderState.highImagePreloads.add(resource$jscomp$1);
	        } else if (
	          !resumableState.imageResources.hasOwnProperty(key$jscomp$0)
	        ) {
	          resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
	          var input = props.crossOrigin;
	          var JSCompiler_inline_result$jscomp$8 =
	            "string" === typeof input
	              ? "use-credentials" === input
	                ? input
	                : ""
	              : void 0;
	          var headers = renderState.headers,
	            header;
	          headers &&
	          0 < headers.remainingCapacity &&
	          "string" !== typeof props.srcSet &&
	          ("high" === props.fetchPriority ||
	            500 > headers.highImagePreloads.length) &&
	          ((header = getPreloadAsHeader(src, "image", {
	            imageSrcSet: props.srcSet,
	            imageSizes: props.sizes,
	            crossOrigin: JSCompiler_inline_result$jscomp$8,
	            integrity: props.integrity,
	            nonce: props.nonce,
	            type: props.type,
	            fetchPriority: props.fetchPriority,
	            referrerPolicy: props.refererPolicy
	          })),
	          0 <= (headers.remainingCapacity -= header.length + 2))
	            ? ((renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS),
	              headers.highImagePreloads && (headers.highImagePreloads += ", "),
	              (headers.highImagePreloads += header))
	            : ((resource$jscomp$1 = []),
	              pushLinkImpl(resource$jscomp$1, {
	                rel: "preload",
	                as: "image",
	                href: srcSet ? void 0 : src,
	                imageSrcSet: srcSet,
	                imageSizes: sizes,
	                crossOrigin: JSCompiler_inline_result$jscomp$8,
	                integrity: props.integrity,
	                type: props.type,
	                fetchPriority: props.fetchPriority,
	                referrerPolicy: props.referrerPolicy
	              }),
	              "high" === props.fetchPriority ||
	              10 > renderState.highImagePreloads.size
	                ? renderState.highImagePreloads.add(resource$jscomp$1)
	                : (renderState.bulkPreloads.add(resource$jscomp$1),
	                  promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
	        }
	      }
	      return pushSelfClosing(target$jscomp$0, props, "img");
	    case "base":
	    case "area":
	    case "br":
	    case "col":
	    case "embed":
	    case "hr":
	    case "keygen":
	    case "param":
	    case "source":
	    case "track":
	    case "wbr":
	      return pushSelfClosing(target$jscomp$0, props, type);
	    case "annotation-xml":
	    case "color-profile":
	    case "font-face":
	    case "font-face-src":
	    case "font-face-uri":
	    case "font-face-format":
	    case "font-face-name":
	    case "missing-glyph":
	      break;
	    case "head":
	      if (2 > formatContext.insertionMode) {
	        var preamble = preambleState || renderState.preamble;
	        if (preamble.headChunks)
	          throw Error(formatProdErrorMessage(545, "`<head>`"));
	        preamble.headChunks = [];
	        var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
	          preamble.headChunks,
	          props,
	          "head"
	        );
	      } else
	        JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
	          target$jscomp$0,
	          props,
	          "head"
	        );
	      return JSCompiler_inline_result$jscomp$9;
	    case "body":
	      if (2 > formatContext.insertionMode) {
	        var preamble$jscomp$0 = preambleState || renderState.preamble;
	        if (preamble$jscomp$0.bodyChunks)
	          throw Error(formatProdErrorMessage(545, "`<body>`"));
	        preamble$jscomp$0.bodyChunks = [];
	        var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
	          preamble$jscomp$0.bodyChunks,
	          props,
	          "body"
	        );
	      } else
	        JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
	          target$jscomp$0,
	          props,
	          "body"
	        );
	      return JSCompiler_inline_result$jscomp$10;
	    case "html":
	      if (0 === formatContext.insertionMode) {
	        var preamble$jscomp$1 = preambleState || renderState.preamble;
	        if (preamble$jscomp$1.htmlChunks)
	          throw Error(formatProdErrorMessage(545, "`<html>`"));
	        preamble$jscomp$1.htmlChunks = [""];
	        var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
	          preamble$jscomp$1.htmlChunks,
	          props,
	          "html"
	        );
	      } else
	        JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
	          target$jscomp$0,
	          props,
	          "html"
	        );
	      return JSCompiler_inline_result$jscomp$11;
	    default:
	      if (-1 !== type.indexOf("-")) {
	        target$jscomp$0.push(startChunkForTag(type));
	        var children$jscomp$9 = null,
	          innerHTML$jscomp$8 = null,
	          propKey$jscomp$11;
	        for (propKey$jscomp$11 in props)
	          if (hasOwnProperty.call(props, propKey$jscomp$11)) {
	            var propValue$jscomp$11 = props[propKey$jscomp$11];
	            if (null != propValue$jscomp$11) {
	              var attributeName = propKey$jscomp$11;
	              switch (propKey$jscomp$11) {
	                case "children":
	                  children$jscomp$9 = propValue$jscomp$11;
	                  break;
	                case "dangerouslySetInnerHTML":
	                  innerHTML$jscomp$8 = propValue$jscomp$11;
	                  break;
	                case "style":
	                  pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
	                  break;
	                case "suppressContentEditableWarning":
	                case "suppressHydrationWarning":
	                case "ref":
	                  break;
	                case "className":
	                  attributeName = "class";
	                default:
	                  if (
	                    isAttributeNameSafe(propKey$jscomp$11) &&
	                    "function" !== typeof propValue$jscomp$11 &&
	                    "symbol" !== typeof propValue$jscomp$11 &&
	                    false !== propValue$jscomp$11
	                  ) {
	                    if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
	                    else if ("object" === typeof propValue$jscomp$11) continue;
	                    target$jscomp$0.push(
	                      " ",
	                      attributeName,
	                      '="',
	                      escapeTextForBrowser(propValue$jscomp$11),
	                      '"'
	                    );
	                  }
	              }
	            }
	          }
	        target$jscomp$0.push(">");
	        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
	        return children$jscomp$9;
	      }
	  }
	  return pushStartGenericElement(target$jscomp$0, props, type);
	}
	var endTagCache = new Map();
	function endChunkForTag(tag) {
	  var chunk = endTagCache.get(tag);
	  void 0 === chunk && ((chunk = "</" + tag + ">"), endTagCache.set(tag, chunk));
	  return chunk;
	}
	function hoistPreambleState(renderState, preambleState) {
	  renderState = renderState.preamble;
	  null === renderState.htmlChunks &&
	    preambleState.htmlChunks &&
	    ((renderState.htmlChunks = preambleState.htmlChunks),
	    (preambleState.contribution |= 1));
	  null === renderState.headChunks &&
	    preambleState.headChunks &&
	    ((renderState.headChunks = preambleState.headChunks),
	    (preambleState.contribution |= 4));
	  null === renderState.bodyChunks &&
	    preambleState.bodyChunks &&
	    ((renderState.bodyChunks = preambleState.bodyChunks),
	    (preambleState.contribution |= 2));
	}
	function writeBootstrap(destination, renderState) {
	  renderState = renderState.bootstrapChunks;
	  for (var i = 0; i < renderState.length - 1; i++)
	    destination.push(renderState[i]);
	  return i < renderState.length
	    ? ((i = renderState[i]), (renderState.length = 0), destination.push(i))
	    : true;
	}
	function writeStartPendingSuspenseBoundary(destination, renderState, id) {
	  destination.push('\x3c!--$?--\x3e<template id="');
	  if (null === id) throw Error(formatProdErrorMessage(395));
	  destination.push(renderState.boundaryPrefix);
	  renderState = id.toString(16);
	  destination.push(renderState);
	  return destination.push('"></template>');
	}
	function writePreambleContribution(destination, preambleState) {
	  preambleState = preambleState.contribution;
	  0 !== preambleState &&
	    (destination.push("\x3c!--"),
	    destination.push("" + preambleState),
	    destination.push("--\x3e"));
	}
	function writeStartSegment(destination, renderState, formatContext, id) {
	  switch (formatContext.insertionMode) {
	    case 0:
	    case 1:
	    case 3:
	    case 2:
	      return (
	        destination.push('<div hidden id="'),
	        destination.push(renderState.segmentPrefix),
	        (renderState = id.toString(16)),
	        destination.push(renderState),
	        destination.push('">')
	      );
	    case 4:
	      return (
	        destination.push('<svg aria-hidden="true" style="display:none" id="'),
	        destination.push(renderState.segmentPrefix),
	        (renderState = id.toString(16)),
	        destination.push(renderState),
	        destination.push('">')
	      );
	    case 5:
	      return (
	        destination.push('<math aria-hidden="true" style="display:none" id="'),
	        destination.push(renderState.segmentPrefix),
	        (renderState = id.toString(16)),
	        destination.push(renderState),
	        destination.push('">')
	      );
	    case 6:
	      return (
	        destination.push('<table hidden id="'),
	        destination.push(renderState.segmentPrefix),
	        (renderState = id.toString(16)),
	        destination.push(renderState),
	        destination.push('">')
	      );
	    case 7:
	      return (
	        destination.push('<table hidden><tbody id="'),
	        destination.push(renderState.segmentPrefix),
	        (renderState = id.toString(16)),
	        destination.push(renderState),
	        destination.push('">')
	      );
	    case 8:
	      return (
	        destination.push('<table hidden><tr id="'),
	        destination.push(renderState.segmentPrefix),
	        (renderState = id.toString(16)),
	        destination.push(renderState),
	        destination.push('">')
	      );
	    case 9:
	      return (
	        destination.push('<table hidden><colgroup id="'),
	        destination.push(renderState.segmentPrefix),
	        (renderState = id.toString(16)),
	        destination.push(renderState),
	        destination.push('">')
	      );
	    default:
	      throw Error(formatProdErrorMessage(397));
	  }
	}
	function writeEndSegment(destination, formatContext) {
	  switch (formatContext.insertionMode) {
	    case 0:
	    case 1:
	    case 3:
	    case 2:
	      return destination.push("</div>");
	    case 4:
	      return destination.push("</svg>");
	    case 5:
	      return destination.push("</math>");
	    case 6:
	      return destination.push("</table>");
	    case 7:
	      return destination.push("</tbody></table>");
	    case 8:
	      return destination.push("</tr></table>");
	    case 9:
	      return destination.push("</colgroup></table>");
	    default:
	      throw Error(formatProdErrorMessage(397));
	  }
	}
	var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
	function escapeJSStringsForInstructionScripts(input) {
	  return JSON.stringify(input).replace(
	    regexForJSStringsInInstructionScripts,
	    function (match) {
	      switch (match) {
	        case "<":
	          return "\\u003c";
	        case "\u2028":
	          return "\\u2028";
	        case "\u2029":
	          return "\\u2029";
	        default:
	          throw Error(
	            "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
	          );
	      }
	    }
	  );
	}
	var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
	function escapeJSObjectForInstructionScripts(input) {
	  return JSON.stringify(input).replace(
	    regexForJSStringsInScripts,
	    function (match) {
	      switch (match) {
	        case "&":
	          return "\\u0026";
	        case ">":
	          return "\\u003e";
	        case "<":
	          return "\\u003c";
	        case "\u2028":
	          return "\\u2028";
	        case "\u2029":
	          return "\\u2029";
	        default:
	          throw Error(
	            "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
	          );
	      }
	    }
	  );
	}
	var currentlyRenderingBoundaryHasStylesToHoist = false,
	  destinationHasCapacity = true;
	function flushStyleTagsLateForBoundary(styleQueue) {
	  var rules = styleQueue.rules,
	    hrefs = styleQueue.hrefs,
	    i = 0;
	  if (hrefs.length) {
	    this.push('<style media="not all" data-precedence="');
	    this.push(styleQueue.precedence);
	    for (this.push('" data-href="'); i < hrefs.length - 1; i++)
	      this.push(hrefs[i]), this.push(" ");
	    this.push(hrefs[i]);
	    this.push('">');
	    for (i = 0; i < rules.length; i++) this.push(rules[i]);
	    destinationHasCapacity = this.push("</style>");
	    currentlyRenderingBoundaryHasStylesToHoist = true;
	    rules.length = 0;
	    hrefs.length = 0;
	  }
	}
	function hasStylesToHoist(stylesheet) {
	  return 2 !== stylesheet.state
	    ? (currentlyRenderingBoundaryHasStylesToHoist = true)
	    : false;
	}
	function writeHoistablesForBoundary(destination, hoistableState, renderState) {
	  currentlyRenderingBoundaryHasStylesToHoist = false;
	  destinationHasCapacity = true;
	  hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
	  hoistableState.stylesheets.forEach(hasStylesToHoist);
	  currentlyRenderingBoundaryHasStylesToHoist &&
	    (renderState.stylesToHoist = true);
	  return destinationHasCapacity;
	}
	function flushResource(resource) {
	  for (var i = 0; i < resource.length; i++) this.push(resource[i]);
	  resource.length = 0;
	}
	var stylesheetFlushingQueue = [];
	function flushStyleInPreamble(stylesheet) {
	  pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
	  for (var i = 0; i < stylesheetFlushingQueue.length; i++)
	    this.push(stylesheetFlushingQueue[i]);
	  stylesheetFlushingQueue.length = 0;
	  stylesheet.state = 2;
	}
	function flushStylesInPreamble(styleQueue) {
	  var hasStylesheets = 0 < styleQueue.sheets.size;
	  styleQueue.sheets.forEach(flushStyleInPreamble, this);
	  styleQueue.sheets.clear();
	  var rules = styleQueue.rules,
	    hrefs = styleQueue.hrefs;
	  if (!hasStylesheets || hrefs.length) {
	    this.push('<style data-precedence="');
	    this.push(styleQueue.precedence);
	    styleQueue = 0;
	    if (hrefs.length) {
	      for (
	        this.push('" data-href="');
	        styleQueue < hrefs.length - 1;
	        styleQueue++
	      )
	        this.push(hrefs[styleQueue]), this.push(" ");
	      this.push(hrefs[styleQueue]);
	    }
	    this.push('">');
	    for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
	      this.push(rules[styleQueue]);
	    this.push("</style>");
	    rules.length = 0;
	    hrefs.length = 0;
	  }
	}
	function preloadLateStyle(stylesheet) {
	  if (0 === stylesheet.state) {
	    stylesheet.state = 1;
	    var props = stylesheet.props;
	    pushLinkImpl(stylesheetFlushingQueue, {
	      rel: "preload",
	      as: "style",
	      href: stylesheet.props.href,
	      crossOrigin: props.crossOrigin,
	      fetchPriority: props.fetchPriority,
	      integrity: props.integrity,
	      media: props.media,
	      hrefLang: props.hrefLang,
	      referrerPolicy: props.referrerPolicy
	    });
	    for (
	      stylesheet = 0;
	      stylesheet < stylesheetFlushingQueue.length;
	      stylesheet++
	    )
	      this.push(stylesheetFlushingQueue[stylesheet]);
	    stylesheetFlushingQueue.length = 0;
	  }
	}
	function preloadLateStyles(styleQueue) {
	  styleQueue.sheets.forEach(preloadLateStyle, this);
	  styleQueue.sheets.clear();
	}
	function writeStyleResourceDependenciesInJS(destination, hoistableState) {
	  destination.push("[");
	  var nextArrayOpenBrackChunk = "[";
	  hoistableState.stylesheets.forEach(function (resource) {
	    if (2 !== resource.state)
	      if (3 === resource.state)
	        destination.push(nextArrayOpenBrackChunk),
	          (resource = escapeJSObjectForInstructionScripts(
	            "" + resource.props.href
	          )),
	          destination.push(resource),
	          destination.push("]"),
	          (nextArrayOpenBrackChunk = ",[");
	      else {
	        destination.push(nextArrayOpenBrackChunk);
	        var precedence = resource.props["data-precedence"],
	          props = resource.props,
	          coercedHref = sanitizeURL("" + resource.props.href);
	        coercedHref = escapeJSObjectForInstructionScripts(coercedHref);
	        destination.push(coercedHref);
	        precedence = "" + precedence;
	        destination.push(",");
	        precedence = escapeJSObjectForInstructionScripts(precedence);
	        destination.push(precedence);
	        for (var propKey in props)
	          if (
	            hasOwnProperty.call(props, propKey) &&
	            ((precedence = props[propKey]), null != precedence)
	          )
	            switch (propKey) {
	              case "href":
	              case "rel":
	              case "precedence":
	              case "data-precedence":
	                break;
	              case "children":
	              case "dangerouslySetInnerHTML":
	                throw Error(formatProdErrorMessage(399, "link"));
	              default:
	                writeStyleResourceAttributeInJS(
	                  destination,
	                  propKey,
	                  precedence
	                );
	            }
	        destination.push("]");
	        nextArrayOpenBrackChunk = ",[";
	        resource.state = 3;
	      }
	  });
	  destination.push("]");
	}
	function writeStyleResourceAttributeInJS(destination, name, value) {
	  var attributeName = name.toLowerCase();
	  switch (typeof value) {
	    case "function":
	    case "symbol":
	      return;
	  }
	  switch (name) {
	    case "innerHTML":
	    case "dangerouslySetInnerHTML":
	    case "suppressContentEditableWarning":
	    case "suppressHydrationWarning":
	    case "style":
	    case "ref":
	      return;
	    case "className":
	      attributeName = "class";
	      name = "" + value;
	      break;
	    case "hidden":
	      if (false === value) return;
	      name = "";
	      break;
	    case "src":
	    case "href":
	      value = sanitizeURL(value);
	      name = "" + value;
	      break;
	    default:
	      if (
	        (2 < name.length &&
	          ("o" === name[0] || "O" === name[0]) &&
	          ("n" === name[1] || "N" === name[1])) ||
	        !isAttributeNameSafe(name)
	      )
	        return;
	      name = "" + value;
	  }
	  destination.push(",");
	  attributeName = escapeJSObjectForInstructionScripts(attributeName);
	  destination.push(attributeName);
	  destination.push(",");
	  attributeName = escapeJSObjectForInstructionScripts(name);
	  destination.push(attributeName);
	}
	function createHoistableState() {
	  return { styles: new Set(), stylesheets: new Set() };
	}
	function prefetchDNS(href) {
	  var request = currentRequest ? currentRequest : null;
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if ("string" === typeof href && href) {
	      if (!resumableState.dnsResources.hasOwnProperty(href)) {
	        resumableState.dnsResources[href] = null;
	        resumableState = renderState.headers;
	        var header, JSCompiler_temp;
	        if (
	          (JSCompiler_temp =
	            resumableState && 0 < resumableState.remainingCapacity)
	        )
	          JSCompiler_temp =
	            ((header =
	              "<" +
	              ("" + href).replace(
	                regexForHrefInLinkHeaderURLContext,
	                escapeHrefForLinkHeaderURLContextReplacer
	              ) +
	              ">; rel=dns-prefetch"),
	            0 <= (resumableState.remainingCapacity -= header.length + 2));
	        JSCompiler_temp
	          ? ((renderState.resets.dns[href] = null),
	            resumableState.preconnects && (resumableState.preconnects += ", "),
	            (resumableState.preconnects += header))
	          : ((header = []),
	            pushLinkImpl(header, { href: href, rel: "dns-prefetch" }),
	            renderState.preconnects.add(header));
	      }
	      enqueueFlush(request);
	    }
	  } else previousDispatcher.D(href);
	}
	function preconnect(href, crossOrigin) {
	  var request = currentRequest ? currentRequest : null;
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if ("string" === typeof href && href) {
	      var bucket =
	        "use-credentials" === crossOrigin
	          ? "credentials"
	          : "string" === typeof crossOrigin
	            ? "anonymous"
	            : "default";
	      if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
	        resumableState.connectResources[bucket][href] = null;
	        resumableState = renderState.headers;
	        var header, JSCompiler_temp;
	        if (
	          (JSCompiler_temp =
	            resumableState && 0 < resumableState.remainingCapacity)
	        ) {
	          JSCompiler_temp =
	            "<" +
	            ("" + href).replace(
	              regexForHrefInLinkHeaderURLContext,
	              escapeHrefForLinkHeaderURLContextReplacer
	            ) +
	            ">; rel=preconnect";
	          if ("string" === typeof crossOrigin) {
	            var escapedCrossOrigin = ("" + crossOrigin).replace(
	              regexForLinkHeaderQuotedParamValueContext,
	              escapeStringForLinkHeaderQuotedParamValueContextReplacer
	            );
	            JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
	          }
	          JSCompiler_temp =
	            ((header = JSCompiler_temp),
	            0 <= (resumableState.remainingCapacity -= header.length + 2));
	        }
	        JSCompiler_temp
	          ? ((renderState.resets.connect[bucket][href] = null),
	            resumableState.preconnects && (resumableState.preconnects += ", "),
	            (resumableState.preconnects += header))
	          : ((bucket = []),
	            pushLinkImpl(bucket, {
	              rel: "preconnect",
	              href: href,
	              crossOrigin: crossOrigin
	            }),
	            renderState.preconnects.add(bucket));
	      }
	      enqueueFlush(request);
	    }
	  } else previousDispatcher.C(href, crossOrigin);
	}
	function preload(href, as, options) {
	  var request = currentRequest ? currentRequest : null;
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (as && href) {
	      switch (as) {
	        case "image":
	          if (options) {
	            var imageSrcSet = options.imageSrcSet;
	            var imageSizes = options.imageSizes;
	            var fetchPriority = options.fetchPriority;
	          }
	          var key = imageSrcSet
	            ? imageSrcSet + "\n" + (imageSizes || "")
	            : href;
	          if (resumableState.imageResources.hasOwnProperty(key)) return;
	          resumableState.imageResources[key] = PRELOAD_NO_CREDS;
	          resumableState = renderState.headers;
	          var header;
	          resumableState &&
	          0 < resumableState.remainingCapacity &&
	          "string" !== typeof imageSrcSet &&
	          "high" === fetchPriority &&
	          ((header = getPreloadAsHeader(href, as, options)),
	          0 <= (resumableState.remainingCapacity -= header.length + 2))
	            ? ((renderState.resets.image[key] = PRELOAD_NO_CREDS),
	              resumableState.highImagePreloads &&
	                (resumableState.highImagePreloads += ", "),
	              (resumableState.highImagePreloads += header))
	            : ((resumableState = []),
	              pushLinkImpl(
	                resumableState,
	                assign(
	                  { rel: "preload", href: imageSrcSet ? void 0 : href, as: as },
	                  options
	                )
	              ),
	              "high" === fetchPriority
	                ? renderState.highImagePreloads.add(resumableState)
	                : (renderState.bulkPreloads.add(resumableState),
	                  renderState.preloads.images.set(key, resumableState)));
	          break;
	        case "style":
	          if (resumableState.styleResources.hasOwnProperty(href)) return;
	          imageSrcSet = [];
	          pushLinkImpl(
	            imageSrcSet,
	            assign({ rel: "preload", href: href, as: as }, options)
	          );
	          resumableState.styleResources[href] =
	            !options ||
	            ("string" !== typeof options.crossOrigin &&
	              "string" !== typeof options.integrity)
	              ? PRELOAD_NO_CREDS
	              : [options.crossOrigin, options.integrity];
	          renderState.preloads.stylesheets.set(href, imageSrcSet);
	          renderState.bulkPreloads.add(imageSrcSet);
	          break;
	        case "script":
	          if (resumableState.scriptResources.hasOwnProperty(href)) return;
	          imageSrcSet = [];
	          renderState.preloads.scripts.set(href, imageSrcSet);
	          renderState.bulkPreloads.add(imageSrcSet);
	          pushLinkImpl(
	            imageSrcSet,
	            assign({ rel: "preload", href: href, as: as }, options)
	          );
	          resumableState.scriptResources[href] =
	            !options ||
	            ("string" !== typeof options.crossOrigin &&
	              "string" !== typeof options.integrity)
	              ? PRELOAD_NO_CREDS
	              : [options.crossOrigin, options.integrity];
	          break;
	        default:
	          if (resumableState.unknownResources.hasOwnProperty(as)) {
	            if (
	              ((imageSrcSet = resumableState.unknownResources[as]),
	              imageSrcSet.hasOwnProperty(href))
	            )
	              return;
	          } else
	            (imageSrcSet = {}),
	              (resumableState.unknownResources[as] = imageSrcSet);
	          imageSrcSet[href] = PRELOAD_NO_CREDS;
	          if (
	            (resumableState = renderState.headers) &&
	            0 < resumableState.remainingCapacity &&
	            "font" === as &&
	            ((key = getPreloadAsHeader(href, as, options)),
	            0 <= (resumableState.remainingCapacity -= key.length + 2))
	          )
	            (renderState.resets.font[href] = PRELOAD_NO_CREDS),
	              resumableState.fontPreloads &&
	                (resumableState.fontPreloads += ", "),
	              (resumableState.fontPreloads += key);
	          else
	            switch (
	              ((resumableState = []),
	              (href = assign({ rel: "preload", href: href, as: as }, options)),
	              pushLinkImpl(resumableState, href),
	              as)
	            ) {
	              case "font":
	                renderState.fontPreloads.add(resumableState);
	                break;
	              default:
	                renderState.bulkPreloads.add(resumableState);
	            }
	      }
	      enqueueFlush(request);
	    }
	  } else previousDispatcher.L(href, as, options);
	}
	function preloadModule(href, options) {
	  var request = currentRequest ? currentRequest : null;
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (href) {
	      var as =
	        options && "string" === typeof options.as ? options.as : "script";
	      switch (as) {
	        case "script":
	          if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
	          as = [];
	          resumableState.moduleScriptResources[href] =
	            !options ||
	            ("string" !== typeof options.crossOrigin &&
	              "string" !== typeof options.integrity)
	              ? PRELOAD_NO_CREDS
	              : [options.crossOrigin, options.integrity];
	          renderState.preloads.moduleScripts.set(href, as);
	          break;
	        default:
	          if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
	            var resources = resumableState.unknownResources[as];
	            if (resources.hasOwnProperty(href)) return;
	          } else
	            (resources = {}),
	              (resumableState.moduleUnknownResources[as] = resources);
	          as = [];
	          resources[href] = PRELOAD_NO_CREDS;
	      }
	      pushLinkImpl(as, assign({ rel: "modulepreload", href: href }, options));
	      renderState.bulkPreloads.add(as);
	      enqueueFlush(request);
	    }
	  } else previousDispatcher.m(href, options);
	}
	function preinitStyle(href, precedence, options) {
	  var request = currentRequest ? currentRequest : null;
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (href) {
	      precedence = precedence || "default";
	      var styleQueue = renderState.styles.get(precedence),
	        resourceState = resumableState.styleResources.hasOwnProperty(href)
	          ? resumableState.styleResources[href]
	          : void 0;
	      null !== resourceState &&
	        ((resumableState.styleResources[href] = null),
	        styleQueue ||
	          ((styleQueue = {
	            precedence: escapeTextForBrowser(precedence),
	            rules: [],
	            hrefs: [],
	            sheets: new Map()
	          }),
	          renderState.styles.set(precedence, styleQueue)),
	        (precedence = {
	          state: 0,
	          props: assign(
	            { rel: "stylesheet", href: href, "data-precedence": precedence },
	            options
	          )
	        }),
	        resourceState &&
	          (2 === resourceState.length &&
	            adoptPreloadCredentials(precedence.props, resourceState),
	          (renderState = renderState.preloads.stylesheets.get(href)) &&
	          0 < renderState.length
	            ? (renderState.length = 0)
	            : (precedence.state = 1)),
	        styleQueue.sheets.set(href, precedence),
	        enqueueFlush(request));
	    }
	  } else previousDispatcher.S(href, precedence, options);
	}
	function preinitScript(src, options) {
	  var request = currentRequest ? currentRequest : null;
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (src) {
	      var resourceState = resumableState.scriptResources.hasOwnProperty(src)
	        ? resumableState.scriptResources[src]
	        : void 0;
	      null !== resourceState &&
	        ((resumableState.scriptResources[src] = null),
	        (options = assign({ src: src, async: true }, options)),
	        resourceState &&
	          (2 === resourceState.length &&
	            adoptPreloadCredentials(options, resourceState),
	          (src = renderState.preloads.scripts.get(src))) &&
	          (src.length = 0),
	        (src = []),
	        renderState.scripts.add(src),
	        pushScriptImpl(src, options),
	        enqueueFlush(request));
	    }
	  } else previousDispatcher.X(src, options);
	}
	function preinitModuleScript(src, options) {
	  var request = currentRequest ? currentRequest : null;
	  if (request) {
	    var resumableState = request.resumableState,
	      renderState = request.renderState;
	    if (src) {
	      var resourceState = resumableState.moduleScriptResources.hasOwnProperty(
	        src
	      )
	        ? resumableState.moduleScriptResources[src]
	        : void 0;
	      null !== resourceState &&
	        ((resumableState.moduleScriptResources[src] = null),
	        (options = assign({ src: src, type: "module", async: true }, options)),
	        resourceState &&
	          (2 === resourceState.length &&
	            adoptPreloadCredentials(options, resourceState),
	          (src = renderState.preloads.moduleScripts.get(src))) &&
	          (src.length = 0),
	        (src = []),
	        renderState.scripts.add(src),
	        pushScriptImpl(src, options),
	        enqueueFlush(request));
	    }
	  } else previousDispatcher.M(src, options);
	}
	function adoptPreloadCredentials(target, preloadState) {
	  null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
	  null == target.integrity && (target.integrity = preloadState[1]);
	}
	function getPreloadAsHeader(href, as, params) {
	  href = ("" + href).replace(
	    regexForHrefInLinkHeaderURLContext,
	    escapeHrefForLinkHeaderURLContextReplacer
	  );
	  as = ("" + as).replace(
	    regexForLinkHeaderQuotedParamValueContext,
	    escapeStringForLinkHeaderQuotedParamValueContextReplacer
	  );
	  as = "<" + href + '>; rel=preload; as="' + as + '"';
	  for (var paramName in params)
	    hasOwnProperty.call(params, paramName) &&
	      ((href = params[paramName]),
	      "string" === typeof href &&
	        (as +=
	          "; " +
	          paramName.toLowerCase() +
	          '="' +
	          ("" + href).replace(
	            regexForLinkHeaderQuotedParamValueContext,
	            escapeStringForLinkHeaderQuotedParamValueContextReplacer
	          ) +
	          '"'));
	  return as;
	}
	var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
	function escapeHrefForLinkHeaderURLContextReplacer(match) {
	  switch (match) {
	    case "<":
	      return "%3C";
	    case ">":
	      return "%3E";
	    case "\n":
	      return "%0A";
	    case "\r":
	      return "%0D";
	    default:
	      throw Error(
	        "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
	      );
	  }
	}
	var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
	function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
	  switch (match) {
	    case '"':
	      return "%22";
	    case "'":
	      return "%27";
	    case ";":
	      return "%3B";
	    case ",":
	      return "%2C";
	    case "\n":
	      return "%0A";
	    case "\r":
	      return "%0D";
	    default:
	      throw Error(
	        "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
	      );
	  }
	}
	function hoistStyleQueueDependency(styleQueue) {
	  this.styles.add(styleQueue);
	}
	function hoistStylesheetDependency(stylesheet) {
	  this.stylesheets.add(stylesheet);
	}
	function createRenderState(resumableState, generateStaticMarkup) {
	  var idPrefix = resumableState.idPrefix,
	    bootstrapChunks = [],
	    bootstrapScriptContent = resumableState.bootstrapScriptContent,
	    bootstrapScripts = resumableState.bootstrapScripts,
	    bootstrapModules = resumableState.bootstrapModules;
	  void 0 !== bootstrapScriptContent &&
	    bootstrapChunks.push(
	      "<script>",
	      ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer),
	      "\x3c/script>"
	    );
	  bootstrapScriptContent = idPrefix + "P:";
	  var JSCompiler_object_inline_segmentPrefix_1542 = idPrefix + "S:";
	  idPrefix += "B:";
	  var JSCompiler_object_inline_preamble_1545 = createPreambleState(),
	    JSCompiler_object_inline_preconnects_1555 = new Set(),
	    JSCompiler_object_inline_fontPreloads_1556 = new Set(),
	    JSCompiler_object_inline_highImagePreloads_1557 = new Set(),
	    JSCompiler_object_inline_styles_1558 = new Map(),
	    JSCompiler_object_inline_bootstrapScripts_1559 = new Set(),
	    JSCompiler_object_inline_scripts_1560 = new Set(),
	    JSCompiler_object_inline_bulkPreloads_1561 = new Set(),
	    JSCompiler_object_inline_preloads_1562 = {
	      images: new Map(),
	      stylesheets: new Map(),
	      scripts: new Map(),
	      moduleScripts: new Map()
	    };
	  if (void 0 !== bootstrapScripts)
	    for (var i = 0; i < bootstrapScripts.length; i++) {
	      var scriptConfig = bootstrapScripts[i],
	        src,
	        crossOrigin = void 0,
	        integrity = void 0,
	        props = {
	          rel: "preload",
	          as: "script",
	          fetchPriority: "low",
	          nonce: void 0
	        };
	      "string" === typeof scriptConfig
	        ? (props.href = src = scriptConfig)
	        : ((props.href = src = scriptConfig.src),
	          (props.integrity = integrity =
	            "string" === typeof scriptConfig.integrity
	              ? scriptConfig.integrity
	              : void 0),
	          (props.crossOrigin = crossOrigin =
	            "string" === typeof scriptConfig || null == scriptConfig.crossOrigin
	              ? void 0
	              : "use-credentials" === scriptConfig.crossOrigin
	                ? "use-credentials"
	                : ""));
	      scriptConfig = resumableState;
	      var href = src;
	      scriptConfig.scriptResources[href] = null;
	      scriptConfig.moduleScriptResources[href] = null;
	      scriptConfig = [];
	      pushLinkImpl(scriptConfig, props);
	      JSCompiler_object_inline_bootstrapScripts_1559.add(scriptConfig);
	      bootstrapChunks.push('<script src="', escapeTextForBrowser(src));
	      "string" === typeof integrity &&
	        bootstrapChunks.push('" integrity="', escapeTextForBrowser(integrity));
	      "string" === typeof crossOrigin &&
	        bootstrapChunks.push(
	          '" crossorigin="',
	          escapeTextForBrowser(crossOrigin)
	        );
	      bootstrapChunks.push('" async="">\x3c/script>');
	    }
	  if (void 0 !== bootstrapModules)
	    for (
	      bootstrapScripts = 0;
	      bootstrapScripts < bootstrapModules.length;
	      bootstrapScripts++
	    )
	      (props = bootstrapModules[bootstrapScripts]),
	        (crossOrigin = src = void 0),
	        (integrity = {
	          rel: "modulepreload",
	          fetchPriority: "low",
	          nonce: void 0
	        }),
	        "string" === typeof props
	          ? (integrity.href = i = props)
	          : ((integrity.href = i = props.src),
	            (integrity.integrity = crossOrigin =
	              "string" === typeof props.integrity ? props.integrity : void 0),
	            (integrity.crossOrigin = src =
	              "string" === typeof props || null == props.crossOrigin
	                ? void 0
	                : "use-credentials" === props.crossOrigin
	                  ? "use-credentials"
	                  : "")),
	        (props = resumableState),
	        (scriptConfig = i),
	        (props.scriptResources[scriptConfig] = null),
	        (props.moduleScriptResources[scriptConfig] = null),
	        (props = []),
	        pushLinkImpl(props, integrity),
	        JSCompiler_object_inline_bootstrapScripts_1559.add(props),
	        bootstrapChunks.push(
	          '<script type="module" src="',
	          escapeTextForBrowser(i)
	        ),
	        "string" === typeof crossOrigin &&
	          bootstrapChunks.push(
	            '" integrity="',
	            escapeTextForBrowser(crossOrigin)
	          ),
	        "string" === typeof src &&
	          bootstrapChunks.push('" crossorigin="', escapeTextForBrowser(src)),
	        bootstrapChunks.push('" async="">\x3c/script>');
	  return {
	    placeholderPrefix: bootstrapScriptContent,
	    segmentPrefix: JSCompiler_object_inline_segmentPrefix_1542,
	    boundaryPrefix: idPrefix,
	    startInlineScript: "<script>",
	    preamble: JSCompiler_object_inline_preamble_1545,
	    externalRuntimeScript: null,
	    bootstrapChunks: bootstrapChunks,
	    importMapChunks: [],
	    onHeaders: void 0,
	    headers: null,
	    resets: {
	      font: {},
	      dns: {},
	      connect: { default: {}, anonymous: {}, credentials: {} },
	      image: {},
	      style: {}
	    },
	    charsetChunks: [],
	    viewportChunks: [],
	    hoistableChunks: [],
	    preconnects: JSCompiler_object_inline_preconnects_1555,
	    fontPreloads: JSCompiler_object_inline_fontPreloads_1556,
	    highImagePreloads: JSCompiler_object_inline_highImagePreloads_1557,
	    styles: JSCompiler_object_inline_styles_1558,
	    bootstrapScripts: JSCompiler_object_inline_bootstrapScripts_1559,
	    scripts: JSCompiler_object_inline_scripts_1560,
	    bulkPreloads: JSCompiler_object_inline_bulkPreloads_1561,
	    preloads: JSCompiler_object_inline_preloads_1562,
	    stylesToHoist: false,
	    generateStaticMarkup: generateStaticMarkup
	  };
	}
	function pushTextInstance(target, text, renderState, textEmbedded) {
	  if (renderState.generateStaticMarkup)
	    return target.push(escapeTextForBrowser(text)), false;
	  "" === text
	    ? (target = textEmbedded)
	    : (textEmbedded && target.push("\x3c!-- --\x3e"),
	      target.push(escapeTextForBrowser(text)),
	      (target = true));
	  return target;
	}
	function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
	  renderState.generateStaticMarkup ||
	    (lastPushedText && textEmbedded && target.push("\x3c!-- --\x3e"));
	}
	var bind = Function.prototype.bind,
	  REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
	  if (null == type) return null;
	  if ("function" === typeof type)
	    return type.$$typeof === REACT_CLIENT_REFERENCE
	      ? null
	      : type.displayName || type.name || null;
	  if ("string" === typeof type) return type;
	  switch (type) {
	    case REACT_FRAGMENT_TYPE:
	      return "Fragment";
	    case REACT_PROFILER_TYPE:
	      return "Profiler";
	    case REACT_STRICT_MODE_TYPE:
	      return "StrictMode";
	    case REACT_SUSPENSE_TYPE:
	      return "Suspense";
	    case REACT_SUSPENSE_LIST_TYPE:
	      return "SuspenseList";
	    case REACT_ACTIVITY_TYPE:
	      return "Activity";
	  }
	  if ("object" === typeof type)
	    switch (type.$$typeof) {
	      case REACT_PORTAL_TYPE:
	        return "Portal";
	      case REACT_CONTEXT_TYPE:
	        return (type.displayName || "Context") + ".Provider";
	      case REACT_CONSUMER_TYPE:
	        return (type._context.displayName || "Context") + ".Consumer";
	      case REACT_FORWARD_REF_TYPE:
	        var innerType = type.render;
	        type = type.displayName;
	        type ||
	          ((type = innerType.displayName || innerType.name || ""),
	          (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
	        return type;
	      case REACT_MEMO_TYPE:
	        return (
	          (innerType = type.displayName || null),
	          null !== innerType
	            ? innerType
	            : getComponentNameFromType(type.type) || "Memo"
	        );
	      case REACT_LAZY_TYPE:
	        innerType = type._payload;
	        type = type._init;
	        try {
	          return getComponentNameFromType(type(innerType));
	        } catch (x) {}
	    }
	  return null;
	}
	var emptyContextObject = {},
	  currentActiveSnapshot = null;
	function popToNearestCommonAncestor(prev, next) {
	  if (prev !== next) {
	    prev.context._currentValue2 = prev.parentValue;
	    prev = prev.parent;
	    var parentNext = next.parent;
	    if (null === prev) {
	      if (null !== parentNext) throw Error(formatProdErrorMessage(401));
	    } else {
	      if (null === parentNext) throw Error(formatProdErrorMessage(401));
	      popToNearestCommonAncestor(prev, parentNext);
	    }
	    next.context._currentValue2 = next.value;
	  }
	}
	function popAllPrevious(prev) {
	  prev.context._currentValue2 = prev.parentValue;
	  prev = prev.parent;
	  null !== prev && popAllPrevious(prev);
	}
	function pushAllNext(next) {
	  var parentNext = next.parent;
	  null !== parentNext && pushAllNext(parentNext);
	  next.context._currentValue2 = next.value;
	}
	function popPreviousToCommonLevel(prev, next) {
	  prev.context._currentValue2 = prev.parentValue;
	  prev = prev.parent;
	  if (null === prev) throw Error(formatProdErrorMessage(402));
	  prev.depth === next.depth
	    ? popToNearestCommonAncestor(prev, next)
	    : popPreviousToCommonLevel(prev, next);
	}
	function popNextToCommonLevel(prev, next) {
	  var parentNext = next.parent;
	  if (null === parentNext) throw Error(formatProdErrorMessage(402));
	  prev.depth === parentNext.depth
	    ? popToNearestCommonAncestor(prev, parentNext)
	    : popNextToCommonLevel(prev, parentNext);
	  next.context._currentValue2 = next.value;
	}
	function switchContext(newSnapshot) {
	  var prev = currentActiveSnapshot;
	  prev !== newSnapshot &&
	    (null === prev
	      ? pushAllNext(newSnapshot)
	      : null === newSnapshot
	        ? popAllPrevious(prev)
	        : prev.depth === newSnapshot.depth
	          ? popToNearestCommonAncestor(prev, newSnapshot)
	          : prev.depth > newSnapshot.depth
	            ? popPreviousToCommonLevel(prev, newSnapshot)
	            : popNextToCommonLevel(prev, newSnapshot),
	    (currentActiveSnapshot = newSnapshot));
	}
	var classComponentUpdater = {
	    enqueueSetState: function (inst, payload) {
	      inst = inst._reactInternals;
	      null !== inst.queue && inst.queue.push(payload);
	    },
	    enqueueReplaceState: function (inst, payload) {
	      inst = inst._reactInternals;
	      inst.replace = true;
	      inst.queue = [payload];
	    },
	    enqueueForceUpdate: function () {}
	  },
	  emptyTreeContext = { id: 1, overflow: "" };
	function pushTreeContext(baseContext, totalChildren, index) {
	  var baseIdWithLeadingBit = baseContext.id;
	  baseContext = baseContext.overflow;
	  var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
	  baseIdWithLeadingBit &= ~(1 << baseLength);
	  index += 1;
	  var length = 32 - clz32(totalChildren) + baseLength;
	  if (30 < length) {
	    var numberOfOverflowBits = baseLength - (baseLength % 5);
	    length = (
	      baseIdWithLeadingBit &
	      ((1 << numberOfOverflowBits) - 1)
	    ).toString(32);
	    baseIdWithLeadingBit >>= numberOfOverflowBits;
	    baseLength -= numberOfOverflowBits;
	    return {
	      id:
	        (1 << (32 - clz32(totalChildren) + baseLength)) |
	        (index << baseLength) |
	        baseIdWithLeadingBit,
	      overflow: length + baseContext
	    };
	  }
	  return {
	    id: (1 << length) | (index << baseLength) | baseIdWithLeadingBit,
	    overflow: baseContext
	  };
	}
	var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback,
	  log = Math.log,
	  LN2 = Math.LN2;
	function clz32Fallback(x) {
	  x >>>= 0;
	  return 0 === x ? 32 : (31 - ((log(x) / LN2) | 0)) | 0;
	}
	var SuspenseException = Error(formatProdErrorMessage(460));
	function noop$2() {}
	function trackUsedThenable(thenableState, thenable, index) {
	  index = thenableState[index];
	  void 0 === index
	    ? thenableState.push(thenable)
	    : index !== thenable && (thenable.then(noop$2, noop$2), (thenable = index));
	  switch (thenable.status) {
	    case "fulfilled":
	      return thenable.value;
	    case "rejected":
	      throw thenable.reason;
	    default:
	      "string" === typeof thenable.status
	        ? thenable.then(noop$2, noop$2)
	        : ((thenableState = thenable),
	          (thenableState.status = "pending"),
	          thenableState.then(
	            function (fulfilledValue) {
	              if ("pending" === thenable.status) {
	                var fulfilledThenable = thenable;
	                fulfilledThenable.status = "fulfilled";
	                fulfilledThenable.value = fulfilledValue;
	              }
	            },
	            function (error) {
	              if ("pending" === thenable.status) {
	                var rejectedThenable = thenable;
	                rejectedThenable.status = "rejected";
	                rejectedThenable.reason = error;
	              }
	            }
	          ));
	      switch (thenable.status) {
	        case "fulfilled":
	          return thenable.value;
	        case "rejected":
	          throw thenable.reason;
	      }
	      suspendedThenable = thenable;
	      throw SuspenseException;
	  }
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
	  if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
	  var thenable = suspendedThenable;
	  suspendedThenable = null;
	  return thenable;
	}
	function is(x, y) {
	  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is,
	  currentlyRenderingComponent = null,
	  currentlyRenderingTask = null,
	  currentlyRenderingRequest = null,
	  currentlyRenderingKeyPath = null,
	  firstWorkInProgressHook = null,
	  workInProgressHook = null,
	  isReRender = false,
	  didScheduleRenderPhaseUpdate = false,
	  localIdCounter = 0,
	  actionStateCounter = 0,
	  actionStateMatchingIndex = -1,
	  thenableIndexCounter = 0,
	  thenableState = null,
	  renderPhaseUpdates = null,
	  numberOfReRenders = 0;
	function resolveCurrentlyRenderingComponent() {
	  if (null === currentlyRenderingComponent)
	    throw Error(formatProdErrorMessage(321));
	  return currentlyRenderingComponent;
	}
	function createHook() {
	  if (0 < numberOfReRenders) throw Error(formatProdErrorMessage(312));
	  return { memoizedState: null, queue: null, next: null };
	}
	function createWorkInProgressHook() {
	  null === workInProgressHook
	    ? null === firstWorkInProgressHook
	      ? ((isReRender = false),
	        (firstWorkInProgressHook = workInProgressHook = createHook()))
	      : ((isReRender = true), (workInProgressHook = firstWorkInProgressHook))
	    : null === workInProgressHook.next
	      ? ((isReRender = false),
	        (workInProgressHook = workInProgressHook.next = createHook()))
	      : ((isReRender = true), (workInProgressHook = workInProgressHook.next));
	  return workInProgressHook;
	}
	function getThenableStateAfterSuspending() {
	  var state = thenableState;
	  thenableState = null;
	  return state;
	}
	function resetHooksState() {
	  currentlyRenderingKeyPath =
	    currentlyRenderingRequest =
	    currentlyRenderingTask =
	    currentlyRenderingComponent =
	      null;
	  didScheduleRenderPhaseUpdate = false;
	  firstWorkInProgressHook = null;
	  numberOfReRenders = 0;
	  workInProgressHook = renderPhaseUpdates = null;
	}
	function basicStateReducer(state, action) {
	  return "function" === typeof action ? action(state) : action;
	}
	function useReducer(reducer, initialArg, init) {
	  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	  workInProgressHook = createWorkInProgressHook();
	  if (isReRender) {
	    var queue = workInProgressHook.queue;
	    initialArg = queue.dispatch;
	    if (
	      null !== renderPhaseUpdates &&
	      ((init = renderPhaseUpdates.get(queue)), void 0 !== init)
	    ) {
	      renderPhaseUpdates.delete(queue);
	      queue = workInProgressHook.memoizedState;
	      do (queue = reducer(queue, init.action)), (init = init.next);
	      while (null !== init);
	      workInProgressHook.memoizedState = queue;
	      return [queue, initialArg];
	    }
	    return [workInProgressHook.memoizedState, initialArg];
	  }
	  reducer =
	    reducer === basicStateReducer
	      ? "function" === typeof initialArg
	        ? initialArg()
	        : initialArg
	      : void 0 !== init
	        ? init(initialArg)
	        : initialArg;
	  workInProgressHook.memoizedState = reducer;
	  reducer = workInProgressHook.queue = { last: null, dispatch: null };
	  reducer = reducer.dispatch = dispatchAction.bind(
	    null,
	    currentlyRenderingComponent,
	    reducer
	  );
	  return [workInProgressHook.memoizedState, reducer];
	}
	function useMemo(nextCreate, deps) {
	  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	  workInProgressHook = createWorkInProgressHook();
	  deps = void 0 === deps ? null : deps;
	  if (null !== workInProgressHook) {
	    var prevState = workInProgressHook.memoizedState;
	    if (null !== prevState && null !== deps) {
	      var prevDeps = prevState[1];
	      a: if (null === prevDeps) prevDeps = false;
	      else {
	        for (var i = 0; i < prevDeps.length && i < deps.length; i++)
	          if (!objectIs(deps[i], prevDeps[i])) {
	            prevDeps = false;
	            break a;
	          }
	        prevDeps = true;
	      }
	      if (prevDeps) return prevState[0];
	    }
	  }
	  nextCreate = nextCreate();
	  workInProgressHook.memoizedState = [nextCreate, deps];
	  return nextCreate;
	}
	function dispatchAction(componentIdentity, queue, action) {
	  if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
	  if (componentIdentity === currentlyRenderingComponent)
	    if (
	      ((didScheduleRenderPhaseUpdate = true),
	      (componentIdentity = { action: action, next: null }),
	      null === renderPhaseUpdates && (renderPhaseUpdates = new Map()),
	      (action = renderPhaseUpdates.get(queue)),
	      void 0 === action)
	    )
	      renderPhaseUpdates.set(queue, componentIdentity);
	    else {
	      for (queue = action; null !== queue.next; ) queue = queue.next;
	      queue.next = componentIdentity;
	    }
	}
	function unsupportedStartTransition() {
	  throw Error(formatProdErrorMessage(394));
	}
	function unsupportedSetOptimisticState() {
	  throw Error(formatProdErrorMessage(479));
	}
	function useActionState(action, initialState, permalink) {
	  resolveCurrentlyRenderingComponent();
	  var actionStateHookIndex = actionStateCounter++,
	    request = currentlyRenderingRequest;
	  if ("function" === typeof action.$$FORM_ACTION) {
	    var nextPostbackStateKey = null,
	      componentKeyPath = currentlyRenderingKeyPath;
	    request = request.formState;
	    var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
	    if (null !== request && "function" === typeof isSignatureEqual) {
	      var postbackKey = request[1];
	      isSignatureEqual.call(action, request[2], request[3]) &&
	        ((nextPostbackStateKey =
	          void 0 !== permalink
	            ? "p" + permalink
	            : "k" +
	              murmurhash3_32_gc(
	                JSON.stringify([componentKeyPath, null, actionStateHookIndex]),
	                0
	              )),
	        postbackKey === nextPostbackStateKey &&
	          ((actionStateMatchingIndex = actionStateHookIndex),
	          (initialState = request[0])));
	    }
	    var boundAction = action.bind(null, initialState);
	    action = function (payload) {
	      boundAction(payload);
	    };
	    "function" === typeof boundAction.$$FORM_ACTION &&
	      (action.$$FORM_ACTION = function (prefix) {
	        prefix = boundAction.$$FORM_ACTION(prefix);
	        void 0 !== permalink &&
	          ((permalink += ""), (prefix.action = permalink));
	        var formData = prefix.data;
	        formData &&
	          (null === nextPostbackStateKey &&
	            (nextPostbackStateKey =
	              void 0 !== permalink
	                ? "p" + permalink
	                : "k" +
	                  murmurhash3_32_gc(
	                    JSON.stringify([
	                      componentKeyPath,
	                      null,
	                      actionStateHookIndex
	                    ]),
	                    0
	                  )),
	          formData.append("$ACTION_KEY", nextPostbackStateKey));
	        return prefix;
	      });
	    return [initialState, action, false];
	  }
	  var boundAction$22 = action.bind(null, initialState);
	  return [
	    initialState,
	    function (payload) {
	      boundAction$22(payload);
	    },
	    false
	  ];
	}
	function unwrapThenable(thenable) {
	  var index = thenableIndexCounter;
	  thenableIndexCounter += 1;
	  null === thenableState && (thenableState = []);
	  return trackUsedThenable(thenableState, thenable, index);
	}
	function unsupportedRefresh() {
	  throw Error(formatProdErrorMessage(393));
	}
	function noop$1() {}
	var HooksDispatcher = {
	    readContext: function (context) {
	      return context._currentValue2;
	    },
	    use: function (usable) {
	      if (null !== usable && "object" === typeof usable) {
	        if ("function" === typeof usable.then) return unwrapThenable(usable);
	        if (usable.$$typeof === REACT_CONTEXT_TYPE)
	          return usable._currentValue2;
	      }
	      throw Error(formatProdErrorMessage(438, String(usable)));
	    },
	    useContext: function (context) {
	      resolveCurrentlyRenderingComponent();
	      return context._currentValue2;
	    },
	    useMemo: useMemo,
	    useReducer: useReducer,
	    useRef: function (initialValue) {
	      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	      workInProgressHook = createWorkInProgressHook();
	      var previousRef = workInProgressHook.memoizedState;
	      return null === previousRef
	        ? ((initialValue = { current: initialValue }),
	          (workInProgressHook.memoizedState = initialValue))
	        : previousRef;
	    },
	    useState: function (initialState) {
	      return useReducer(basicStateReducer, initialState);
	    },
	    useInsertionEffect: noop$1,
	    useLayoutEffect: noop$1,
	    useCallback: function (callback, deps) {
	      return useMemo(function () {
	        return callback;
	      }, deps);
	    },
	    useImperativeHandle: noop$1,
	    useEffect: noop$1,
	    useDebugValue: noop$1,
	    useDeferredValue: function (value, initialValue) {
	      resolveCurrentlyRenderingComponent();
	      return void 0 !== initialValue ? initialValue : value;
	    },
	    useTransition: function () {
	      resolveCurrentlyRenderingComponent();
	      return [false, unsupportedStartTransition];
	    },
	    useId: function () {
	      var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
	      var overflow = JSCompiler_inline_result.overflow;
	      JSCompiler_inline_result = JSCompiler_inline_result.id;
	      JSCompiler_inline_result =
	        (
	          JSCompiler_inline_result &
	          ~(1 << (32 - clz32(JSCompiler_inline_result) - 1))
	        ).toString(32) + overflow;
	      var resumableState = currentResumableState;
	      if (null === resumableState) throw Error(formatProdErrorMessage(404));
	      overflow = localIdCounter++;
	      JSCompiler_inline_result =
	        "\u00ab" + resumableState.idPrefix + "R" + JSCompiler_inline_result;
	      0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
	      return JSCompiler_inline_result + "\u00bb";
	    },
	    useSyncExternalStore: function (subscribe, getSnapshot, getServerSnapshot) {
	      if (void 0 === getServerSnapshot)
	        throw Error(formatProdErrorMessage(407));
	      return getServerSnapshot();
	    },
	    useOptimistic: function (passthrough) {
	      resolveCurrentlyRenderingComponent();
	      return [passthrough, unsupportedSetOptimisticState];
	    },
	    useActionState: useActionState,
	    useFormState: useActionState,
	    useHostTransitionStatus: function () {
	      resolveCurrentlyRenderingComponent();
	      return sharedNotPendingObject;
	    },
	    useMemoCache: function (size) {
	      for (var data = Array(size), i = 0; i < size; i++)
	        data[i] = REACT_MEMO_CACHE_SENTINEL;
	      return data;
	    },
	    useCacheRefresh: function () {
	      return unsupportedRefresh;
	    }
	  },
	  currentResumableState = null,
	  DefaultAsyncDispatcher = {
	    getCacheForType: function () {
	      throw Error(formatProdErrorMessage(248));
	    }
	  },
	  prefix,
	  suffix;
	function describeBuiltInComponentFrame(name) {
	  if (void 0 === prefix)
	    try {
	      throw Error();
	    } catch (x) {
	      var match = x.stack.trim().match(/\n( *(at )?)/);
	      prefix = (match && match[1]) || "";
	      suffix =
	        -1 < x.stack.indexOf("\n    at")
	          ? " (<anonymous>)"
	          : -1 < x.stack.indexOf("@")
	            ? "@unknown:0:0"
	            : "";
	    }
	  return "\n" + prefix + name + suffix;
	}
	var reentry = false;
	function describeNativeComponentFrame(fn, construct) {
	  if (!fn || reentry) return "";
	  reentry = true;
	  var previousPrepareStackTrace = Error.prepareStackTrace;
	  Error.prepareStackTrace = void 0;
	  try {
	    var RunInRootFrame = {
	      DetermineComponentFrameRoot: function () {
	        try {
	          if (construct) {
	            var Fake = function () {
	              throw Error();
	            };
	            Object.defineProperty(Fake.prototype, "props", {
	              set: function () {
	                throw Error();
	              }
	            });
	            if ("object" === typeof Reflect && Reflect.construct) {
	              try {
	                Reflect.construct(Fake, []);
	              } catch (x) {
	                var control = x;
	              }
	              Reflect.construct(fn, [], Fake);
	            } else {
	              try {
	                Fake.call();
	              } catch (x$24) {
	                control = x$24;
	              }
	              fn.call(Fake.prototype);
	            }
	          } else {
	            try {
	              throw Error();
	            } catch (x$25) {
	              control = x$25;
	            }
	            (Fake = fn()) &&
	              "function" === typeof Fake.catch &&
	              Fake.catch(function () {});
	          }
	        } catch (sample) {
	          if (sample && control && "string" === typeof sample.stack)
	            return [sample.stack, control.stack];
	        }
	        return [null, null];
	      }
	    };
	    RunInRootFrame.DetermineComponentFrameRoot.displayName =
	      "DetermineComponentFrameRoot";
	    var namePropDescriptor = Object.getOwnPropertyDescriptor(
	      RunInRootFrame.DetermineComponentFrameRoot,
	      "name"
	    );
	    namePropDescriptor &&
	      namePropDescriptor.configurable &&
	      Object.defineProperty(
	        RunInRootFrame.DetermineComponentFrameRoot,
	        "name",
	        { value: "DetermineComponentFrameRoot" }
	      );
	    var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(),
	      sampleStack = _RunInRootFrame$Deter[0],
	      controlStack = _RunInRootFrame$Deter[1];
	    if (sampleStack && controlStack) {
	      var sampleLines = sampleStack.split("\n"),
	        controlLines = controlStack.split("\n");
	      for (
	        namePropDescriptor = RunInRootFrame = 0;
	        RunInRootFrame < sampleLines.length &&
	        !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");

	      )
	        RunInRootFrame++;
	      for (
	        ;
	        namePropDescriptor < controlLines.length &&
	        !controlLines[namePropDescriptor].includes(
	          "DetermineComponentFrameRoot"
	        );

	      )
	        namePropDescriptor++;
	      if (
	        RunInRootFrame === sampleLines.length ||
	        namePropDescriptor === controlLines.length
	      )
	        for (
	          RunInRootFrame = sampleLines.length - 1,
	            namePropDescriptor = controlLines.length - 1;
	          1 <= RunInRootFrame &&
	          0 <= namePropDescriptor &&
	          sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];

	        )
	          namePropDescriptor--;
	      for (
	        ;
	        1 <= RunInRootFrame && 0 <= namePropDescriptor;
	        RunInRootFrame--, namePropDescriptor--
	      )
	        if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
	          if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
	            do
	              if (
	                (RunInRootFrame--,
	                namePropDescriptor--,
	                0 > namePropDescriptor ||
	                  sampleLines[RunInRootFrame] !==
	                    controlLines[namePropDescriptor])
	              ) {
	                var frame =
	                  "\n" +
	                  sampleLines[RunInRootFrame].replace(" at new ", " at ");
	                fn.displayName &&
	                  frame.includes("<anonymous>") &&
	                  (frame = frame.replace("<anonymous>", fn.displayName));
	                return frame;
	              }
	            while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
	          }
	          break;
	        }
	    }
	  } finally {
	    (reentry = false), (Error.prepareStackTrace = previousPrepareStackTrace);
	  }
	  return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "")
	    ? describeBuiltInComponentFrame(previousPrepareStackTrace)
	    : "";
	}
	function describeComponentStackByType(type) {
	  if ("string" === typeof type) return describeBuiltInComponentFrame(type);
	  if ("function" === typeof type)
	    return type.prototype && type.prototype.isReactComponent
	      ? describeNativeComponentFrame(type, true)
	      : describeNativeComponentFrame(type, false);
	  if ("object" === typeof type && null !== type) {
	    switch (type.$$typeof) {
	      case REACT_FORWARD_REF_TYPE:
	        return describeNativeComponentFrame(type.render, false);
	      case REACT_MEMO_TYPE:
	        return describeNativeComponentFrame(type.type, false);
	      case REACT_LAZY_TYPE:
	        var lazyComponent = type,
	          payload = lazyComponent._payload;
	        lazyComponent = lazyComponent._init;
	        try {
	          type = lazyComponent(payload);
	        } catch (x) {
	          return describeBuiltInComponentFrame("Lazy");
	        }
	        return describeComponentStackByType(type);
	    }
	    if ("string" === typeof type.name)
	      return (
	        (payload = type.env),
	        describeBuiltInComponentFrame(
	          type.name + (payload ? " [" + payload + "]" : "")
	        )
	      );
	  }
	  switch (type) {
	    case REACT_SUSPENSE_LIST_TYPE:
	      return describeBuiltInComponentFrame("SuspenseList");
	    case REACT_SUSPENSE_TYPE:
	      return describeBuiltInComponentFrame("Suspense");
	  }
	  return "";
	}
	function defaultErrorHandler(error) {
	  if (
	    "object" === typeof error &&
	    null !== error &&
	    "string" === typeof error.environmentName
	  ) {
	    var JSCompiler_inline_result = error.environmentName;
	    error = [error].slice(0);
	    "string" === typeof error[0]
	      ? error.splice(
	          0,
	          1,
	          "[%s] " + error[0],
	          " " + JSCompiler_inline_result + " "
	        )
	      : error.splice(0, 0, "[%s] ", " " + JSCompiler_inline_result + " ");
	    error.unshift(console);
	    JSCompiler_inline_result = bind.apply(console.error, error);
	    JSCompiler_inline_result();
	  } else console.error(error);
	  return null;
	}
	function noop() {}
	function RequestInstance(
	  resumableState,
	  renderState,
	  rootFormatContext,
	  progressiveChunkSize,
	  onError,
	  onAllReady,
	  onShellReady,
	  onShellError,
	  onFatalError,
	  onPostpone,
	  formState
	) {
	  var abortSet = new Set();
	  this.destination = null;
	  this.flushScheduled = false;
	  this.resumableState = resumableState;
	  this.renderState = renderState;
	  this.rootFormatContext = rootFormatContext;
	  this.progressiveChunkSize =
	    void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
	  this.status = 10;
	  this.fatalError = null;
	  this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
	  this.completedPreambleSegments = this.completedRootSegment = null;
	  this.abortableTasks = abortSet;
	  this.pingedTasks = [];
	  this.clientRenderedBoundaries = [];
	  this.completedBoundaries = [];
	  this.partialBoundaries = [];
	  this.trackedPostpones = null;
	  this.onError = void 0 === onError ? defaultErrorHandler : onError;
	  this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
	  this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
	  this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
	  this.onShellError = void 0 === onShellError ? noop : onShellError;
	  this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
	  this.formState = void 0 === formState ? null : formState;
	}
	function createRequest(
	  children,
	  resumableState,
	  renderState,
	  rootFormatContext,
	  progressiveChunkSize,
	  onError,
	  onAllReady,
	  onShellReady,
	  onShellError,
	  onFatalError,
	  onPostpone,
	  formState
	) {
	  resumableState = new RequestInstance(
	    resumableState,
	    renderState,
	    rootFormatContext,
	    progressiveChunkSize,
	    onError,
	    onAllReady,
	    onShellReady,
	    onShellError,
	    onFatalError,
	    onPostpone,
	    formState
	  );
	  renderState = createPendingSegment(
	    resumableState,
	    0,
	    null,
	    rootFormatContext,
	    false,
	    false
	  );
	  renderState.parentFlushed = true;
	  children = createRenderTask(
	    resumableState,
	    null,
	    children,
	    -1,
	    null,
	    renderState,
	    null,
	    null,
	    resumableState.abortableTasks,
	    null,
	    rootFormatContext,
	    null,
	    emptyTreeContext,
	    null,
	    false
	  );
	  pushComponentStack(children);
	  resumableState.pingedTasks.push(children);
	  return resumableState;
	}
	var currentRequest = null;
	function pingTask(request, task) {
	  request.pingedTasks.push(task);
	  1 === request.pingedTasks.length &&
	    ((request.flushScheduled = null !== request.destination),
	    performWork(request));
	}
	function createSuspenseBoundary(
	  request,
	  fallbackAbortableTasks,
	  contentPreamble,
	  fallbackPreamble
	) {
	  return {
	    status: 0,
	    rootSegmentID: -1,
	    parentFlushed: false,
	    pendingTasks: 0,
	    completedSegments: [],
	    byteSize: 0,
	    fallbackAbortableTasks: fallbackAbortableTasks,
	    errorDigest: null,
	    contentState: createHoistableState(),
	    fallbackState: createHoistableState(),
	    contentPreamble: contentPreamble,
	    fallbackPreamble: fallbackPreamble,
	    trackedContentKeyPath: null,
	    trackedFallbackNode: null
	  };
	}
	function createRenderTask(
	  request,
	  thenableState,
	  node,
	  childIndex,
	  blockedBoundary,
	  blockedSegment,
	  blockedPreamble,
	  hoistableState,
	  abortSet,
	  keyPath,
	  formatContext,
	  context,
	  treeContext,
	  componentStack,
	  isFallback
	) {
	  request.allPendingTasks++;
	  null === blockedBoundary
	    ? request.pendingRootTasks++
	    : blockedBoundary.pendingTasks++;
	  var task = {
	    replay: null,
	    node: node,
	    childIndex: childIndex,
	    ping: function () {
	      return pingTask(request, task);
	    },
	    blockedBoundary: blockedBoundary,
	    blockedSegment: blockedSegment,
	    blockedPreamble: blockedPreamble,
	    hoistableState: hoistableState,
	    abortSet: abortSet,
	    keyPath: keyPath,
	    formatContext: formatContext,
	    context: context,
	    treeContext: treeContext,
	    componentStack: componentStack,
	    thenableState: thenableState,
	    isFallback: isFallback
	  };
	  abortSet.add(task);
	  return task;
	}
	function createReplayTask(
	  request,
	  thenableState,
	  replay,
	  node,
	  childIndex,
	  blockedBoundary,
	  hoistableState,
	  abortSet,
	  keyPath,
	  formatContext,
	  context,
	  treeContext,
	  componentStack,
	  isFallback
	) {
	  request.allPendingTasks++;
	  null === blockedBoundary
	    ? request.pendingRootTasks++
	    : blockedBoundary.pendingTasks++;
	  replay.pendingTasks++;
	  var task = {
	    replay: replay,
	    node: node,
	    childIndex: childIndex,
	    ping: function () {
	      return pingTask(request, task);
	    },
	    blockedBoundary: blockedBoundary,
	    blockedSegment: null,
	    blockedPreamble: null,
	    hoistableState: hoistableState,
	    abortSet: abortSet,
	    keyPath: keyPath,
	    formatContext: formatContext,
	    context: context,
	    treeContext: treeContext,
	    componentStack: componentStack,
	    thenableState: thenableState,
	    isFallback: isFallback
	  };
	  abortSet.add(task);
	  return task;
	}
	function createPendingSegment(
	  request,
	  index,
	  boundary,
	  parentFormatContext,
	  lastPushedText,
	  textEmbedded
	) {
	  return {
	    status: 0,
	    parentFlushed: false,
	    id: -1,
	    index: index,
	    chunks: [],
	    children: [],
	    preambleChildren: [],
	    parentFormatContext: parentFormatContext,
	    boundary: boundary,
	    lastPushedText: lastPushedText,
	    textEmbedded: textEmbedded
	  };
	}
	function pushComponentStack(task) {
	  var node = task.node;
	  if ("object" === typeof node && null !== node)
	    switch (node.$$typeof) {
	      case REACT_ELEMENT_TYPE:
	        task.componentStack = { parent: task.componentStack, type: node.type };
	    }
	}
	function getThrownInfo(node$jscomp$0) {
	  var errorInfo = {};
	  node$jscomp$0 &&
	    Object.defineProperty(errorInfo, "componentStack", {
	      configurable: true,
	      enumerable: true,
	      get: function () {
	        try {
	          var info = "",
	            node = node$jscomp$0;
	          do
	            (info += describeComponentStackByType(node.type)),
	              (node = node.parent);
	          while (node);
	          var JSCompiler_inline_result = info;
	        } catch (x) {
	          JSCompiler_inline_result =
	            "\nError generating stack: " + x.message + "\n" + x.stack;
	        }
	        Object.defineProperty(errorInfo, "componentStack", {
	          value: JSCompiler_inline_result
	        });
	        return JSCompiler_inline_result;
	      }
	    });
	  return errorInfo;
	}
	function logRecoverableError(request, error, errorInfo) {
	  request = request.onError;
	  error = request(error, errorInfo);
	  if (null == error || "string" === typeof error) return error;
	}
	function fatalError(request, error) {
	  var onShellError = request.onShellError,
	    onFatalError = request.onFatalError;
	  onShellError(error);
	  onFatalError(error);
	  null !== request.destination
	    ? ((request.status = 14), request.destination.destroy(error))
	    : ((request.status = 13), (request.fatalError = error));
	}
	function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
	  var prevThenableState = task.thenableState;
	  task.thenableState = null;
	  currentlyRenderingComponent = {};
	  currentlyRenderingTask = task;
	  currentlyRenderingRequest = request;
	  currentlyRenderingKeyPath = keyPath;
	  actionStateCounter = localIdCounter = 0;
	  actionStateMatchingIndex = -1;
	  thenableIndexCounter = 0;
	  thenableState = prevThenableState;
	  for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
	    (didScheduleRenderPhaseUpdate = false),
	      (actionStateCounter = localIdCounter = 0),
	      (actionStateMatchingIndex = -1),
	      (thenableIndexCounter = 0),
	      (numberOfReRenders += 1),
	      (workInProgressHook = null),
	      (request = Component(props, secondArg));
	  resetHooksState();
	  return request;
	}
	function finishFunctionComponent(
	  request,
	  task,
	  keyPath,
	  children,
	  hasId,
	  actionStateCount,
	  actionStateMatchingIndex
	) {
	  var didEmitActionStateMarkers = false;
	  if (0 !== actionStateCount && null !== request.formState) {
	    var segment = task.blockedSegment;
	    if (null !== segment) {
	      didEmitActionStateMarkers = true;
	      segment = segment.chunks;
	      for (var i = 0; i < actionStateCount; i++)
	        i === actionStateMatchingIndex
	          ? segment.push("\x3c!--F!--\x3e")
	          : segment.push("\x3c!--F--\x3e");
	    }
	  }
	  actionStateCount = task.keyPath;
	  task.keyPath = keyPath;
	  hasId
	    ? ((keyPath = task.treeContext),
	      (task.treeContext = pushTreeContext(keyPath, 1, 0)),
	      renderNode(request, task, children, -1),
	      (task.treeContext = keyPath))
	    : didEmitActionStateMarkers
	      ? renderNode(request, task, children, -1)
	      : renderNodeDestructive(request, task, children, -1);
	  task.keyPath = actionStateCount;
	}
	function renderElement(request, task, keyPath, type, props, ref) {
	  if ("function" === typeof type)
	    if (type.prototype && type.prototype.isReactComponent) {
	      var newProps = props;
	      if ("ref" in props) {
	        newProps = {};
	        for (var propName in props)
	          "ref" !== propName && (newProps[propName] = props[propName]);
	      }
	      var defaultProps = type.defaultProps;
	      if (defaultProps) {
	        newProps === props && (newProps = assign({}, newProps, props));
	        for (var propName$33 in defaultProps)
	          void 0 === newProps[propName$33] &&
	            (newProps[propName$33] = defaultProps[propName$33]);
	      }
	      props = newProps;
	      newProps = emptyContextObject;
	      defaultProps = type.contextType;
	      "object" === typeof defaultProps &&
	        null !== defaultProps &&
	        (newProps = defaultProps._currentValue2);
	      newProps = new type(props, newProps);
	      var initialState = void 0 !== newProps.state ? newProps.state : null;
	      newProps.updater = classComponentUpdater;
	      newProps.props = props;
	      newProps.state = initialState;
	      defaultProps = { queue: [], replace: false };
	      newProps._reactInternals = defaultProps;
	      ref = type.contextType;
	      newProps.context =
	        "object" === typeof ref && null !== ref
	          ? ref._currentValue2
	          : emptyContextObject;
	      ref = type.getDerivedStateFromProps;
	      "function" === typeof ref &&
	        ((ref = ref(props, initialState)),
	        (initialState =
	          null === ref || void 0 === ref
	            ? initialState
	            : assign({}, initialState, ref)),
	        (newProps.state = initialState));
	      if (
	        "function" !== typeof type.getDerivedStateFromProps &&
	        "function" !== typeof newProps.getSnapshotBeforeUpdate &&
	        ("function" === typeof newProps.UNSAFE_componentWillMount ||
	          "function" === typeof newProps.componentWillMount)
	      )
	        if (
	          ((type = newProps.state),
	          "function" === typeof newProps.componentWillMount &&
	            newProps.componentWillMount(),
	          "function" === typeof newProps.UNSAFE_componentWillMount &&
	            newProps.UNSAFE_componentWillMount(),
	          type !== newProps.state &&
	            classComponentUpdater.enqueueReplaceState(
	              newProps,
	              newProps.state,
	              null
	            ),
	          null !== defaultProps.queue && 0 < defaultProps.queue.length)
	        )
	          if (
	            ((type = defaultProps.queue),
	            (ref = defaultProps.replace),
	            (defaultProps.queue = null),
	            (defaultProps.replace = false),
	            ref && 1 === type.length)
	          )
	            newProps.state = type[0];
	          else {
	            defaultProps = ref ? type[0] : newProps.state;
	            initialState = true;
	            for (ref = ref ? 1 : 0; ref < type.length; ref++)
	              (propName$33 = type[ref]),
	                (propName$33 =
	                  "function" === typeof propName$33
	                    ? propName$33.call(newProps, defaultProps, props, void 0)
	                    : propName$33),
	                null != propName$33 &&
	                  (initialState
	                    ? ((initialState = false),
	                      (defaultProps = assign({}, defaultProps, propName$33)))
	                    : assign(defaultProps, propName$33));
	            newProps.state = defaultProps;
	          }
	        else defaultProps.queue = null;
	      type = newProps.render();
	      if (12 === request.status) throw null;
	      props = task.keyPath;
	      task.keyPath = keyPath;
	      renderNodeDestructive(request, task, type, -1);
	      task.keyPath = props;
	    } else {
	      type = renderWithHooks(request, task, keyPath, type, props, void 0);
	      if (12 === request.status) throw null;
	      finishFunctionComponent(
	        request,
	        task,
	        keyPath,
	        type,
	        0 !== localIdCounter,
	        actionStateCounter,
	        actionStateMatchingIndex
	      );
	    }
	  else if ("string" === typeof type)
	    if (((newProps = task.blockedSegment), null === newProps))
	      (newProps = props.children),
	        (defaultProps = task.formatContext),
	        (initialState = task.keyPath),
	        (task.formatContext = getChildFormatContext(defaultProps, type, props)),
	        (task.keyPath = keyPath),
	        renderNode(request, task, newProps, -1),
	        (task.formatContext = defaultProps),
	        (task.keyPath = initialState);
	    else {
	      ref = pushStartInstance(
	        newProps.chunks,
	        type,
	        props,
	        request.resumableState,
	        request.renderState,
	        task.blockedPreamble,
	        task.hoistableState,
	        task.formatContext,
	        newProps.lastPushedText,
	        task.isFallback
	      );
	      newProps.lastPushedText = false;
	      defaultProps = task.formatContext;
	      initialState = task.keyPath;
	      task.keyPath = keyPath;
	      3 ===
	      (task.formatContext = getChildFormatContext(defaultProps, type, props))
	        .insertionMode
	        ? ((keyPath = createPendingSegment(
	            request,
	            0,
	            null,
	            task.formatContext,
	            false,
	            false
	          )),
	          newProps.preambleChildren.push(keyPath),
	          (keyPath = createRenderTask(
	            request,
	            null,
	            ref,
	            -1,
	            task.blockedBoundary,
	            keyPath,
	            task.blockedPreamble,
	            task.hoistableState,
	            request.abortableTasks,
	            task.keyPath,
	            task.formatContext,
	            task.context,
	            task.treeContext,
	            task.componentStack,
	            task.isFallback
	          )),
	          pushComponentStack(keyPath),
	          request.pingedTasks.push(keyPath))
	        : renderNode(request, task, ref, -1);
	      task.formatContext = defaultProps;
	      task.keyPath = initialState;
	      a: {
	        task = newProps.chunks;
	        request = request.resumableState;
	        switch (type) {
	          case "title":
	          case "style":
	          case "script":
	          case "area":
	          case "base":
	          case "br":
	          case "col":
	          case "embed":
	          case "hr":
	          case "img":
	          case "input":
	          case "keygen":
	          case "link":
	          case "meta":
	          case "param":
	          case "source":
	          case "track":
	          case "wbr":
	            break a;
	          case "body":
	            if (1 >= defaultProps.insertionMode) {
	              request.hasBody = true;
	              break a;
	            }
	            break;
	          case "html":
	            if (0 === defaultProps.insertionMode) {
	              request.hasHtml = true;
	              break a;
	            }
	            break;
	          case "head":
	            if (1 >= defaultProps.insertionMode) break a;
	        }
	        task.push(endChunkForTag(type));
	      }
	      newProps.lastPushedText = false;
	    }
	  else {
	    switch (type) {
	      case REACT_LEGACY_HIDDEN_TYPE:
	      case REACT_STRICT_MODE_TYPE:
	      case REACT_PROFILER_TYPE:
	      case REACT_FRAGMENT_TYPE:
	        type = task.keyPath;
	        task.keyPath = keyPath;
	        renderNodeDestructive(request, task, props.children, -1);
	        task.keyPath = type;
	        return;
	      case REACT_ACTIVITY_TYPE:
	        "hidden" !== props.mode &&
	          ((type = task.keyPath),
	          (task.keyPath = keyPath),
	          renderNodeDestructive(request, task, props.children, -1),
	          (task.keyPath = type));
	        return;
	      case REACT_SUSPENSE_LIST_TYPE:
	        type = task.keyPath;
	        task.keyPath = keyPath;
	        renderNodeDestructive(request, task, props.children, -1);
	        task.keyPath = type;
	        return;
	      case REACT_VIEW_TRANSITION_TYPE:
	      case REACT_SCOPE_TYPE:
	        throw Error(formatProdErrorMessage(343));
	      case REACT_SUSPENSE_TYPE:
	        a: if (null !== task.replay) {
	          type = task.keyPath;
	          task.keyPath = keyPath;
	          keyPath = props.children;
	          try {
	            renderNode(request, task, keyPath, -1);
	          } finally {
	            task.keyPath = type;
	          }
	        } else {
	          type = task.keyPath;
	          var parentBoundary = task.blockedBoundary;
	          ref = task.blockedPreamble;
	          var parentHoistableState = task.hoistableState;
	          propName$33 = task.blockedSegment;
	          propName = props.fallback;
	          props = props.children;
	          var fallbackAbortSet = new Set();
	          var newBoundary =
	            2 > task.formatContext.insertionMode
	              ? createSuspenseBoundary(
	                  request,
	                  fallbackAbortSet,
	                  createPreambleState(),
	                  createPreambleState()
	                )
	              : createSuspenseBoundary(request, fallbackAbortSet, null, null);
	          null !== request.trackedPostpones &&
	            (newBoundary.trackedContentKeyPath = keyPath);
	          var boundarySegment = createPendingSegment(
	            request,
	            propName$33.chunks.length,
	            newBoundary,
	            task.formatContext,
	            false,
	            false
	          );
	          propName$33.children.push(boundarySegment);
	          propName$33.lastPushedText = false;
	          var contentRootSegment = createPendingSegment(
	            request,
	            0,
	            null,
	            task.formatContext,
	            false,
	            false
	          );
	          contentRootSegment.parentFlushed = true;
	          if (null !== request.trackedPostpones) {
	            newProps = [keyPath[0], "Suspense Fallback", keyPath[2]];
	            defaultProps = [newProps[1], newProps[2], [], null];
	            request.trackedPostpones.workingMap.set(newProps, defaultProps);
	            newBoundary.trackedFallbackNode = defaultProps;
	            task.blockedSegment = boundarySegment;
	            task.blockedPreamble = newBoundary.fallbackPreamble;
	            task.keyPath = newProps;
	            boundarySegment.status = 6;
	            try {
	              renderNode(request, task, propName, -1),
	                pushSegmentFinale(
	                  boundarySegment.chunks,
	                  request.renderState,
	                  boundarySegment.lastPushedText,
	                  boundarySegment.textEmbedded
	                ),
	                (boundarySegment.status = 1);
	            } catch (thrownValue) {
	              throw (
	                ((boundarySegment.status = 12 === request.status ? 3 : 4),
	                thrownValue)
	              );
	            } finally {
	              (task.blockedSegment = propName$33),
	                (task.blockedPreamble = ref),
	                (task.keyPath = type);
	            }
	            task = createRenderTask(
	              request,
	              null,
	              props,
	              -1,
	              newBoundary,
	              contentRootSegment,
	              newBoundary.contentPreamble,
	              newBoundary.contentState,
	              task.abortSet,
	              keyPath,
	              task.formatContext,
	              task.context,
	              task.treeContext,
	              task.componentStack,
	              task.isFallback
	            );
	            pushComponentStack(task);
	            request.pingedTasks.push(task);
	          } else {
	            task.blockedBoundary = newBoundary;
	            task.blockedPreamble = newBoundary.contentPreamble;
	            task.hoistableState = newBoundary.contentState;
	            task.blockedSegment = contentRootSegment;
	            task.keyPath = keyPath;
	            contentRootSegment.status = 6;
	            try {
	              if (
	                (renderNode(request, task, props, -1),
	                pushSegmentFinale(
	                  contentRootSegment.chunks,
	                  request.renderState,
	                  contentRootSegment.lastPushedText,
	                  contentRootSegment.textEmbedded
	                ),
	                (contentRootSegment.status = 1),
	                queueCompletedSegment(newBoundary, contentRootSegment),
	                0 === newBoundary.pendingTasks && 0 === newBoundary.status)
	              ) {
	                newBoundary.status = 1;
	                0 === request.pendingRootTasks &&
	                  task.blockedPreamble &&
	                  preparePreamble(request);
	                break a;
	              }
	            } catch (thrownValue$28) {
	              (newBoundary.status = 4),
	                12 === request.status
	                  ? ((contentRootSegment.status = 3),
	                    (newProps = request.fatalError))
	                  : ((contentRootSegment.status = 4),
	                    (newProps = thrownValue$28)),
	                (defaultProps = getThrownInfo(task.componentStack)),
	                (initialState = logRecoverableError(
	                  request,
	                  newProps,
	                  defaultProps
	                )),
	                (newBoundary.errorDigest = initialState),
	                untrackBoundary(request, newBoundary);
	            } finally {
	              (task.blockedBoundary = parentBoundary),
	                (task.blockedPreamble = ref),
	                (task.hoistableState = parentHoistableState),
	                (task.blockedSegment = propName$33),
	                (task.keyPath = type);
	            }
	            task = createRenderTask(
	              request,
	              null,
	              propName,
	              -1,
	              parentBoundary,
	              boundarySegment,
	              newBoundary.fallbackPreamble,
	              newBoundary.fallbackState,
	              fallbackAbortSet,
	              [keyPath[0], "Suspense Fallback", keyPath[2]],
	              task.formatContext,
	              task.context,
	              task.treeContext,
	              task.componentStack,
	              true
	            );
	            pushComponentStack(task);
	            request.pingedTasks.push(task);
	          }
	        }
	        return;
	    }
	    if ("object" === typeof type && null !== type)
	      switch (type.$$typeof) {
	        case REACT_FORWARD_REF_TYPE:
	          if ("ref" in props)
	            for (newBoundary in ((newProps = {}), props))
	              "ref" !== newBoundary &&
	                (newProps[newBoundary] = props[newBoundary]);
	          else newProps = props;
	          type = renderWithHooks(
	            request,
	            task,
	            keyPath,
	            type.render,
	            newProps,
	            ref
	          );
	          finishFunctionComponent(
	            request,
	            task,
	            keyPath,
	            type,
	            0 !== localIdCounter,
	            actionStateCounter,
	            actionStateMatchingIndex
	          );
	          return;
	        case REACT_MEMO_TYPE:
	          renderElement(request, task, keyPath, type.type, props, ref);
	          return;
	        case REACT_PROVIDER_TYPE:
	        case REACT_CONTEXT_TYPE:
	          defaultProps = props.children;
	          newProps = task.keyPath;
	          props = props.value;
	          initialState = type._currentValue2;
	          type._currentValue2 = props;
	          ref = currentActiveSnapshot;
	          currentActiveSnapshot = type = {
	            parent: ref,
	            depth: null === ref ? 0 : ref.depth + 1,
	            context: type,
	            parentValue: initialState,
	            value: props
	          };
	          task.context = type;
	          task.keyPath = keyPath;
	          renderNodeDestructive(request, task, defaultProps, -1);
	          request = currentActiveSnapshot;
	          if (null === request) throw Error(formatProdErrorMessage(403));
	          request.context._currentValue2 = request.parentValue;
	          request = currentActiveSnapshot = request.parent;
	          task.context = request;
	          task.keyPath = newProps;
	          return;
	        case REACT_CONSUMER_TYPE:
	          props = props.children;
	          type = props(type._context._currentValue2);
	          props = task.keyPath;
	          task.keyPath = keyPath;
	          renderNodeDestructive(request, task, type, -1);
	          task.keyPath = props;
	          return;
	        case REACT_LAZY_TYPE:
	          newProps = type._init;
	          type = newProps(type._payload);
	          if (12 === request.status) throw null;
	          renderElement(request, task, keyPath, type, props, ref);
	          return;
	      }
	    throw Error(
	      formatProdErrorMessage(130, null == type ? type : typeof type, "")
	    );
	  }
	}
	function resumeNode(request, task, segmentId, node, childIndex) {
	  var prevReplay = task.replay,
	    blockedBoundary = task.blockedBoundary,
	    resumedSegment = createPendingSegment(
	      request,
	      0,
	      null,
	      task.formatContext,
	      false,
	      false
	    );
	  resumedSegment.id = segmentId;
	  resumedSegment.parentFlushed = true;
	  try {
	    (task.replay = null),
	      (task.blockedSegment = resumedSegment),
	      renderNode(request, task, node, childIndex),
	      (resumedSegment.status = 1),
	      null === blockedBoundary
	        ? (request.completedRootSegment = resumedSegment)
	        : (queueCompletedSegment(blockedBoundary, resumedSegment),
	          blockedBoundary.parentFlushed &&
	            request.partialBoundaries.push(blockedBoundary));
	  } finally {
	    (task.replay = prevReplay), (task.blockedSegment = null);
	  }
	}
	function renderNodeDestructive(request, task, node, childIndex) {
	  null !== task.replay && "number" === typeof task.replay.slots
	    ? resumeNode(request, task, task.replay.slots, node, childIndex)
	    : ((task.node = node),
	      (task.childIndex = childIndex),
	      (node = task.componentStack),
	      pushComponentStack(task),
	      retryNode(request, task),
	      (task.componentStack = node));
	}
	function retryNode(request, task) {
	  var node = task.node,
	    childIndex = task.childIndex;
	  if (null !== node) {
	    if ("object" === typeof node) {
	      switch (node.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          var type = node.type,
	            key = node.key,
	            props = node.props;
	          node = props.ref;
	          var ref = void 0 !== node ? node : null,
	            name = getComponentNameFromType(type),
	            keyOrIndex =
	              null == key ? (-1 === childIndex ? 0 : childIndex) : key;
	          key = [task.keyPath, name, keyOrIndex];
	          if (null !== task.replay)
	            a: {
	              var replay = task.replay;
	              childIndex = replay.nodes;
	              for (node = 0; node < childIndex.length; node++) {
	                var node$jscomp$0 = childIndex[node];
	                if (keyOrIndex === node$jscomp$0[1]) {
	                  if (4 === node$jscomp$0.length) {
	                    if (null !== name && name !== node$jscomp$0[0])
	                      throw Error(
	                        formatProdErrorMessage(490, node$jscomp$0[0], name)
	                      );
	                    var childNodes = node$jscomp$0[2];
	                    name = node$jscomp$0[3];
	                    keyOrIndex = task.node;
	                    task.replay = {
	                      nodes: childNodes,
	                      slots: name,
	                      pendingTasks: 1
	                    };
	                    try {
	                      renderElement(request, task, key, type, props, ref);
	                      if (
	                        1 === task.replay.pendingTasks &&
	                        0 < task.replay.nodes.length
	                      )
	                        throw Error(formatProdErrorMessage(488));
	                      task.replay.pendingTasks--;
	                    } catch (x) {
	                      if (
	                        "object" === typeof x &&
	                        null !== x &&
	                        (x === SuspenseException ||
	                          "function" === typeof x.then)
	                      )
	                        throw (
	                          (task.node === keyOrIndex && (task.replay = replay),
	                          x)
	                        );
	                      task.replay.pendingTasks--;
	                      props = getThrownInfo(task.componentStack);
	                      key = task.blockedBoundary;
	                      type = x;
	                      props = logRecoverableError(request, type, props);
	                      abortRemainingReplayNodes(
	                        request,
	                        key,
	                        childNodes,
	                        name,
	                        type,
	                        props
	                      );
	                    }
	                    task.replay = replay;
	                  } else {
	                    if (type !== REACT_SUSPENSE_TYPE)
	                      throw Error(
	                        formatProdErrorMessage(
	                          490,
	                          "Suspense",
	                          getComponentNameFromType(type) || "Unknown"
	                        )
	                      );
	                    b: {
	                      replay = void 0;
	                      type = node$jscomp$0[5];
	                      ref = node$jscomp$0[2];
	                      name = node$jscomp$0[3];
	                      keyOrIndex =
	                        null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
	                      node$jscomp$0 =
	                        null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
	                      var prevKeyPath = task.keyPath,
	                        previousReplaySet = task.replay,
	                        parentBoundary = task.blockedBoundary,
	                        parentHoistableState = task.hoistableState,
	                        content = props.children,
	                        fallback = props.fallback,
	                        fallbackAbortSet = new Set();
	                      props =
	                        2 > task.formatContext.insertionMode
	                          ? createSuspenseBoundary(
	                              request,
	                              fallbackAbortSet,
	                              createPreambleState(),
	                              createPreambleState()
	                            )
	                          : createSuspenseBoundary(
	                              request,
	                              fallbackAbortSet,
	                              null,
	                              null
	                            );
	                      props.parentFlushed = true;
	                      props.rootSegmentID = type;
	                      task.blockedBoundary = props;
	                      task.hoistableState = props.contentState;
	                      task.keyPath = key;
	                      task.replay = {
	                        nodes: ref,
	                        slots: name,
	                        pendingTasks: 1
	                      };
	                      try {
	                        renderNode(request, task, content, -1);
	                        if (
	                          1 === task.replay.pendingTasks &&
	                          0 < task.replay.nodes.length
	                        )
	                          throw Error(formatProdErrorMessage(488));
	                        task.replay.pendingTasks--;
	                        if (0 === props.pendingTasks && 0 === props.status) {
	                          props.status = 1;
	                          request.completedBoundaries.push(props);
	                          break b;
	                        }
	                      } catch (error) {
	                        (props.status = 4),
	                          (childNodes = getThrownInfo(task.componentStack)),
	                          (replay = logRecoverableError(
	                            request,
	                            error,
	                            childNodes
	                          )),
	                          (props.errorDigest = replay),
	                          task.replay.pendingTasks--,
	                          request.clientRenderedBoundaries.push(props);
	                      } finally {
	                        (task.blockedBoundary = parentBoundary),
	                          (task.hoistableState = parentHoistableState),
	                          (task.replay = previousReplaySet),
	                          (task.keyPath = prevKeyPath);
	                      }
	                      task = createReplayTask(
	                        request,
	                        null,
	                        {
	                          nodes: keyOrIndex,
	                          slots: node$jscomp$0,
	                          pendingTasks: 0
	                        },
	                        fallback,
	                        -1,
	                        parentBoundary,
	                        props.fallbackState,
	                        fallbackAbortSet,
	                        [key[0], "Suspense Fallback", key[2]],
	                        task.formatContext,
	                        task.context,
	                        task.treeContext,
	                        task.componentStack,
	                        true
	                      );
	                      pushComponentStack(task);
	                      request.pingedTasks.push(task);
	                    }
	                  }
	                  childIndex.splice(node, 1);
	                  break a;
	                }
	              }
	            }
	          else renderElement(request, task, key, type, props, ref);
	          return;
	        case REACT_PORTAL_TYPE:
	          throw Error(formatProdErrorMessage(257));
	        case REACT_LAZY_TYPE:
	          childNodes = node._init;
	          node = childNodes(node._payload);
	          if (12 === request.status) throw null;
	          renderNodeDestructive(request, task, node, childIndex);
	          return;
	      }
	      if (isArrayImpl(node)) {
	        renderChildrenArray(request, task, node, childIndex);
	        return;
	      }
	      null === node || "object" !== typeof node
	        ? (childNodes = null)
	        : ((childNodes =
	            (MAYBE_ITERATOR_SYMBOL && node[MAYBE_ITERATOR_SYMBOL]) ||
	            node["@@iterator"]),
	          (childNodes = "function" === typeof childNodes ? childNodes : null));
	      if (childNodes && (childNodes = childNodes.call(node))) {
	        node = childNodes.next();
	        if (!node.done) {
	          props = [];
	          do props.push(node.value), (node = childNodes.next());
	          while (!node.done);
	          renderChildrenArray(request, task, props, childIndex);
	        }
	        return;
	      }
	      if ("function" === typeof node.then)
	        return (
	          (task.thenableState = null),
	          renderNodeDestructive(request, task, unwrapThenable(node), childIndex)
	        );
	      if (node.$$typeof === REACT_CONTEXT_TYPE)
	        return renderNodeDestructive(
	          request,
	          task,
	          node._currentValue2,
	          childIndex
	        );
	      childIndex = Object.prototype.toString.call(node);
	      throw Error(
	        formatProdErrorMessage(
	          31,
	          "[object Object]" === childIndex
	            ? "object with keys {" + Object.keys(node).join(", ") + "}"
	            : childIndex
	        )
	      );
	    }
	    if ("string" === typeof node)
	      (childIndex = task.blockedSegment),
	        null !== childIndex &&
	          (childIndex.lastPushedText = pushTextInstance(
	            childIndex.chunks,
	            node,
	            request.renderState,
	            childIndex.lastPushedText
	          ));
	    else if ("number" === typeof node || "bigint" === typeof node)
	      (childIndex = task.blockedSegment),
	        null !== childIndex &&
	          (childIndex.lastPushedText = pushTextInstance(
	            childIndex.chunks,
	            "" + node,
	            request.renderState,
	            childIndex.lastPushedText
	          ));
	  }
	}
	function renderChildrenArray(request, task, children, childIndex) {
	  var prevKeyPath = task.keyPath;
	  if (
	    -1 !== childIndex &&
	    ((task.keyPath = [task.keyPath, "Fragment", childIndex]),
	    null !== task.replay)
	  ) {
	    for (
	      var replay = task.replay, replayNodes = replay.nodes, j = 0;
	      j < replayNodes.length;
	      j++
	    ) {
	      var node = replayNodes[j];
	      if (node[1] === childIndex) {
	        childIndex = node[2];
	        node = node[3];
	        task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
	        try {
	          renderChildrenArray(request, task, children, -1);
	          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
	            throw Error(formatProdErrorMessage(488));
	          task.replay.pendingTasks--;
	        } catch (x) {
	          if (
	            "object" === typeof x &&
	            null !== x &&
	            (x === SuspenseException || "function" === typeof x.then)
	          )
	            throw x;
	          task.replay.pendingTasks--;
	          children = getThrownInfo(task.componentStack);
	          var boundary = task.blockedBoundary,
	            error = x;
	          children = logRecoverableError(request, error, children);
	          abortRemainingReplayNodes(
	            request,
	            boundary,
	            childIndex,
	            node,
	            error,
	            children
	          );
	        }
	        task.replay = replay;
	        replayNodes.splice(j, 1);
	        break;
	      }
	    }
	    task.keyPath = prevKeyPath;
	    return;
	  }
	  replay = task.treeContext;
	  replayNodes = children.length;
	  if (
	    null !== task.replay &&
	    ((j = task.replay.slots), null !== j && "object" === typeof j)
	  ) {
	    for (childIndex = 0; childIndex < replayNodes; childIndex++)
	      (node = children[childIndex]),
	        (task.treeContext = pushTreeContext(replay, replayNodes, childIndex)),
	        (boundary = j[childIndex]),
	        "number" === typeof boundary
	          ? (resumeNode(request, task, boundary, node, childIndex),
	            delete j[childIndex])
	          : renderNode(request, task, node, childIndex);
	    task.treeContext = replay;
	    task.keyPath = prevKeyPath;
	    return;
	  }
	  for (j = 0; j < replayNodes; j++)
	    (childIndex = children[j]),
	      (task.treeContext = pushTreeContext(replay, replayNodes, j)),
	      renderNode(request, task, childIndex, j);
	  task.treeContext = replay;
	  task.keyPath = prevKeyPath;
	}
	function untrackBoundary(request, boundary) {
	  request = request.trackedPostpones;
	  null !== request &&
	    ((boundary = boundary.trackedContentKeyPath),
	    null !== boundary &&
	      ((boundary = request.workingMap.get(boundary)),
	      void 0 !== boundary &&
	        ((boundary.length = 4), (boundary[2] = []), (boundary[3] = null))));
	}
	function spawnNewSuspendedReplayTask(request, task, thenableState) {
	  return createReplayTask(
	    request,
	    thenableState,
	    task.replay,
	    task.node,
	    task.childIndex,
	    task.blockedBoundary,
	    task.hoistableState,
	    task.abortSet,
	    task.keyPath,
	    task.formatContext,
	    task.context,
	    task.treeContext,
	    task.componentStack,
	    task.isFallback
	  );
	}
	function spawnNewSuspendedRenderTask(request, task, thenableState) {
	  var segment = task.blockedSegment,
	    newSegment = createPendingSegment(
	      request,
	      segment.chunks.length,
	      null,
	      task.formatContext,
	      segment.lastPushedText,
	      true
	    );
	  segment.children.push(newSegment);
	  segment.lastPushedText = false;
	  return createRenderTask(
	    request,
	    thenableState,
	    task.node,
	    task.childIndex,
	    task.blockedBoundary,
	    newSegment,
	    task.blockedPreamble,
	    task.hoistableState,
	    task.abortSet,
	    task.keyPath,
	    task.formatContext,
	    task.context,
	    task.treeContext,
	    task.componentStack,
	    task.isFallback
	  );
	}
	function renderNode(request, task, node, childIndex) {
	  var previousFormatContext = task.formatContext,
	    previousContext = task.context,
	    previousKeyPath = task.keyPath,
	    previousTreeContext = task.treeContext,
	    previousComponentStack = task.componentStack,
	    segment = task.blockedSegment;
	  if (null === segment)
	    try {
	      return renderNodeDestructive(request, task, node, childIndex);
	    } catch (thrownValue) {
	      if (
	        (resetHooksState(),
	        (node =
	          thrownValue === SuspenseException
	            ? getSuspendedThenable()
	            : thrownValue),
	        "object" === typeof node && null !== node)
	      ) {
	        if ("function" === typeof node.then) {
	          childIndex = getThenableStateAfterSuspending();
	          request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
	          node.then(request, request);
	          task.formatContext = previousFormatContext;
	          task.context = previousContext;
	          task.keyPath = previousKeyPath;
	          task.treeContext = previousTreeContext;
	          task.componentStack = previousComponentStack;
	          switchContext(previousContext);
	          return;
	        }
	        if ("Maximum call stack size exceeded" === node.message) {
	          node = getThenableStateAfterSuspending();
	          node = spawnNewSuspendedReplayTask(request, task, node);
	          request.pingedTasks.push(node);
	          task.formatContext = previousFormatContext;
	          task.context = previousContext;
	          task.keyPath = previousKeyPath;
	          task.treeContext = previousTreeContext;
	          task.componentStack = previousComponentStack;
	          switchContext(previousContext);
	          return;
	        }
	      }
	    }
	  else {
	    var childrenLength = segment.children.length,
	      chunkLength = segment.chunks.length;
	    try {
	      return renderNodeDestructive(request, task, node, childIndex);
	    } catch (thrownValue$48) {
	      if (
	        (resetHooksState(),
	        (segment.children.length = childrenLength),
	        (segment.chunks.length = chunkLength),
	        (node =
	          thrownValue$48 === SuspenseException
	            ? getSuspendedThenable()
	            : thrownValue$48),
	        "object" === typeof node && null !== node)
	      ) {
	        if ("function" === typeof node.then) {
	          childIndex = getThenableStateAfterSuspending();
	          request = spawnNewSuspendedRenderTask(request, task, childIndex).ping;
	          node.then(request, request);
	          task.formatContext = previousFormatContext;
	          task.context = previousContext;
	          task.keyPath = previousKeyPath;
	          task.treeContext = previousTreeContext;
	          task.componentStack = previousComponentStack;
	          switchContext(previousContext);
	          return;
	        }
	        if ("Maximum call stack size exceeded" === node.message) {
	          node = getThenableStateAfterSuspending();
	          node = spawnNewSuspendedRenderTask(request, task, node);
	          request.pingedTasks.push(node);
	          task.formatContext = previousFormatContext;
	          task.context = previousContext;
	          task.keyPath = previousKeyPath;
	          task.treeContext = previousTreeContext;
	          task.componentStack = previousComponentStack;
	          switchContext(previousContext);
	          return;
	        }
	      }
	    }
	  }
	  task.formatContext = previousFormatContext;
	  task.context = previousContext;
	  task.keyPath = previousKeyPath;
	  task.treeContext = previousTreeContext;
	  switchContext(previousContext);
	  throw node;
	}
	function abortTaskSoft(task) {
	  var boundary = task.blockedBoundary;
	  task = task.blockedSegment;
	  null !== task && ((task.status = 3), finishedTask(this, boundary, task));
	}
	function abortRemainingReplayNodes(
	  request$jscomp$0,
	  boundary,
	  nodes,
	  slots,
	  error,
	  errorDigest$jscomp$0
	) {
	  for (var i = 0; i < nodes.length; i++) {
	    var node = nodes[i];
	    if (4 === node.length)
	      abortRemainingReplayNodes(
	        request$jscomp$0,
	        boundary,
	        node[2],
	        node[3],
	        error,
	        errorDigest$jscomp$0
	      );
	    else {
	      node = node[5];
	      var request = request$jscomp$0,
	        errorDigest = errorDigest$jscomp$0,
	        resumedBoundary = createSuspenseBoundary(
	          request,
	          new Set(),
	          null,
	          null
	        );
	      resumedBoundary.parentFlushed = true;
	      resumedBoundary.rootSegmentID = node;
	      resumedBoundary.status = 4;
	      resumedBoundary.errorDigest = errorDigest;
	      resumedBoundary.parentFlushed &&
	        request.clientRenderedBoundaries.push(resumedBoundary);
	    }
	  }
	  nodes.length = 0;
	  if (null !== slots) {
	    if (null === boundary) throw Error(formatProdErrorMessage(487));
	    4 !== boundary.status &&
	      ((boundary.status = 4),
	      (boundary.errorDigest = errorDigest$jscomp$0),
	      boundary.parentFlushed &&
	        request$jscomp$0.clientRenderedBoundaries.push(boundary));
	    if ("object" === typeof slots) for (var index in slots) delete slots[index];
	  }
	}
	function abortTask(task, request, error) {
	  var boundary = task.blockedBoundary,
	    segment = task.blockedSegment;
	  if (null !== segment) {
	    if (6 === segment.status) return;
	    segment.status = 3;
	  }
	  segment = getThrownInfo(task.componentStack);
	  if (null === boundary) {
	    if (13 !== request.status && 14 !== request.status) {
	      boundary = task.replay;
	      if (null === boundary) {
	        logRecoverableError(request, error, segment);
	        fatalError(request, error);
	        return;
	      }
	      boundary.pendingTasks--;
	      0 === boundary.pendingTasks &&
	        0 < boundary.nodes.length &&
	        ((task = logRecoverableError(request, error, segment)),
	        abortRemainingReplayNodes(
	          request,
	          null,
	          boundary.nodes,
	          boundary.slots,
	          error,
	          task
	        ));
	      request.pendingRootTasks--;
	      0 === request.pendingRootTasks && completeShell(request);
	    }
	  } else
	    boundary.pendingTasks--,
	      4 !== boundary.status &&
	        ((boundary.status = 4),
	        (task = logRecoverableError(request, error, segment)),
	        (boundary.status = 4),
	        (boundary.errorDigest = task),
	        untrackBoundary(request, boundary),
	        boundary.parentFlushed &&
	          request.clientRenderedBoundaries.push(boundary)),
	      boundary.fallbackAbortableTasks.forEach(function (fallbackTask) {
	        return abortTask(fallbackTask, request, error);
	      }),
	      boundary.fallbackAbortableTasks.clear();
	  request.allPendingTasks--;
	  0 === request.allPendingTasks && completeAll(request);
	}
	function safelyEmitEarlyPreloads(request, shellComplete) {
	  try {
	    var renderState = request.renderState,
	      onHeaders = renderState.onHeaders;
	    if (onHeaders) {
	      var headers = renderState.headers;
	      if (headers) {
	        renderState.headers = null;
	        var linkHeader = headers.preconnects;
	        headers.fontPreloads &&
	          (linkHeader && (linkHeader += ", "),
	          (linkHeader += headers.fontPreloads));
	        headers.highImagePreloads &&
	          (linkHeader && (linkHeader += ", "),
	          (linkHeader += headers.highImagePreloads));
	        if (!shellComplete) {
	          var queueIter = renderState.styles.values(),
	            queueStep = queueIter.next();
	          b: for (
	            ;
	            0 < headers.remainingCapacity && !queueStep.done;
	            queueStep = queueIter.next()
	          )
	            for (
	              var sheetIter = queueStep.value.sheets.values(),
	                sheetStep = sheetIter.next();
	              0 < headers.remainingCapacity && !sheetStep.done;
	              sheetStep = sheetIter.next()
	            ) {
	              var sheet = sheetStep.value,
	                props = sheet.props,
	                key = props.href,
	                props$jscomp$0 = sheet.props,
	                header = getPreloadAsHeader(props$jscomp$0.href, "style", {
	                  crossOrigin: props$jscomp$0.crossOrigin,
	                  integrity: props$jscomp$0.integrity,
	                  nonce: props$jscomp$0.nonce,
	                  type: props$jscomp$0.type,
	                  fetchPriority: props$jscomp$0.fetchPriority,
	                  referrerPolicy: props$jscomp$0.referrerPolicy,
	                  media: props$jscomp$0.media
	                });
	              if (0 <= (headers.remainingCapacity -= header.length + 2))
	                (renderState.resets.style[key] = PRELOAD_NO_CREDS),
	                  linkHeader && (linkHeader += ", "),
	                  (linkHeader += header),
	                  (renderState.resets.style[key] =
	                    "string" === typeof props.crossOrigin ||
	                    "string" === typeof props.integrity
	                      ? [props.crossOrigin, props.integrity]
	                      : PRELOAD_NO_CREDS);
	              else break b;
	            }
	        }
	        linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
	      }
	    }
	  } catch (error) {
	    logRecoverableError(request, error, {});
	  }
	}
	function completeShell(request) {
	  null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
	  null === request.trackedPostpones && preparePreamble(request);
	  request.onShellError = noop;
	  request = request.onShellReady;
	  request();
	}
	function completeAll(request) {
	  safelyEmitEarlyPreloads(
	    request,
	    null === request.trackedPostpones
	      ? true
	      : null === request.completedRootSegment ||
	          5 !== request.completedRootSegment.status
	  );
	  preparePreamble(request);
	  request = request.onAllReady;
	  request();
	}
	function queueCompletedSegment(boundary, segment) {
	  if (
	    0 === segment.chunks.length &&
	    1 === segment.children.length &&
	    null === segment.children[0].boundary &&
	    -1 === segment.children[0].id
	  ) {
	    var childSegment = segment.children[0];
	    childSegment.id = segment.id;
	    childSegment.parentFlushed = true;
	    1 === childSegment.status && queueCompletedSegment(boundary, childSegment);
	  } else boundary.completedSegments.push(segment);
	}
	function finishedTask(request, boundary, segment) {
	  if (null === boundary) {
	    if (null !== segment && segment.parentFlushed) {
	      if (null !== request.completedRootSegment)
	        throw Error(formatProdErrorMessage(389));
	      request.completedRootSegment = segment;
	    }
	    request.pendingRootTasks--;
	    0 === request.pendingRootTasks && completeShell(request);
	  } else
	    boundary.pendingTasks--,
	      4 !== boundary.status &&
	        (0 === boundary.pendingTasks
	          ? (0 === boundary.status && (boundary.status = 1),
	            null !== segment &&
	              segment.parentFlushed &&
	              1 === segment.status &&
	              queueCompletedSegment(boundary, segment),
	            boundary.parentFlushed &&
	              request.completedBoundaries.push(boundary),
	            1 === boundary.status &&
	              (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request),
	              boundary.fallbackAbortableTasks.clear(),
	              0 === request.pendingRootTasks &&
	                null === request.trackedPostpones &&
	                null !== boundary.contentPreamble &&
	                preparePreamble(request)))
	          : null !== segment &&
	            segment.parentFlushed &&
	            1 === segment.status &&
	            (queueCompletedSegment(boundary, segment),
	            1 === boundary.completedSegments.length &&
	              boundary.parentFlushed &&
	              request.partialBoundaries.push(boundary)));
	  request.allPendingTasks--;
	  0 === request.allPendingTasks && completeAll(request);
	}
	function performWork(request$jscomp$2) {
	  if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
	    var prevContext = currentActiveSnapshot,
	      prevDispatcher = ReactSharedInternals.H;
	    ReactSharedInternals.H = HooksDispatcher;
	    var prevAsyncDispatcher = ReactSharedInternals.A;
	    ReactSharedInternals.A = DefaultAsyncDispatcher;
	    var prevRequest = currentRequest;
	    currentRequest = request$jscomp$2;
	    var prevResumableState = currentResumableState;
	    currentResumableState = request$jscomp$2.resumableState;
	    try {
	      var pingedTasks = request$jscomp$2.pingedTasks,
	        i;
	      for (i = 0; i < pingedTasks.length; i++) {
	        var task = pingedTasks[i],
	          request = request$jscomp$2,
	          segment = task.blockedSegment;
	        if (null === segment) {
	          var request$jscomp$0 = request;
	          if (0 !== task.replay.pendingTasks) {
	            switchContext(task.context);
	            try {
	              "number" === typeof task.replay.slots
	                ? resumeNode(
	                    request$jscomp$0,
	                    task,
	                    task.replay.slots,
	                    task.node,
	                    task.childIndex
	                  )
	                : retryNode(request$jscomp$0, task);
	              if (
	                1 === task.replay.pendingTasks &&
	                0 < task.replay.nodes.length
	              )
	                throw Error(formatProdErrorMessage(488));
	              task.replay.pendingTasks--;
	              task.abortSet.delete(task);
	              finishedTask(request$jscomp$0, task.blockedBoundary, null);
	            } catch (thrownValue) {
	              resetHooksState();
	              var x =
	                thrownValue === SuspenseException
	                  ? getSuspendedThenable()
	                  : thrownValue;
	              if (
	                "object" === typeof x &&
	                null !== x &&
	                "function" === typeof x.then
	              ) {
	                var ping = task.ping;
	                x.then(ping, ping);
	                task.thenableState = getThenableStateAfterSuspending();
	              } else {
	                task.replay.pendingTasks--;
	                task.abortSet.delete(task);
	                var errorInfo = getThrownInfo(task.componentStack);
	                request = void 0;
	                var request$jscomp$1 = request$jscomp$0,
	                  boundary = task.blockedBoundary,
	                  error$jscomp$0 =
	                    12 === request$jscomp$0.status
	                      ? request$jscomp$0.fatalError
	                      : x,
	                  replayNodes = task.replay.nodes,
	                  resumeSlots = task.replay.slots;
	                request = logRecoverableError(
	                  request$jscomp$1,
	                  error$jscomp$0,
	                  errorInfo
	                );
	                abortRemainingReplayNodes(
	                  request$jscomp$1,
	                  boundary,
	                  replayNodes,
	                  resumeSlots,
	                  error$jscomp$0,
	                  request
	                );
	                request$jscomp$0.pendingRootTasks--;
	                0 === request$jscomp$0.pendingRootTasks &&
	                  completeShell(request$jscomp$0);
	                request$jscomp$0.allPendingTasks--;
	                0 === request$jscomp$0.allPendingTasks &&
	                  completeAll(request$jscomp$0);
	              }
	            } finally {
	            }
	          }
	        } else if (
	          ((request$jscomp$0 = void 0),
	          (request$jscomp$1 = segment),
	          0 === request$jscomp$1.status)
	        ) {
	          request$jscomp$1.status = 6;
	          switchContext(task.context);
	          var childrenLength = request$jscomp$1.children.length,
	            chunkLength = request$jscomp$1.chunks.length;
	          try {
	            retryNode(request, task),
	              pushSegmentFinale(
	                request$jscomp$1.chunks,
	                request.renderState,
	                request$jscomp$1.lastPushedText,
	                request$jscomp$1.textEmbedded
	              ),
	              task.abortSet.delete(task),
	              (request$jscomp$1.status = 1),
	              finishedTask(request, task.blockedBoundary, request$jscomp$1);
	          } catch (thrownValue) {
	            resetHooksState();
	            request$jscomp$1.children.length = childrenLength;
	            request$jscomp$1.chunks.length = chunkLength;
	            var x$jscomp$0 =
	              thrownValue === SuspenseException
	                ? getSuspendedThenable()
	                : 12 === request.status
	                  ? request.fatalError
	                  : thrownValue;
	            if (
	              "object" === typeof x$jscomp$0 &&
	              null !== x$jscomp$0 &&
	              "function" === typeof x$jscomp$0.then
	            ) {
	              request$jscomp$1.status = 0;
	              task.thenableState = getThenableStateAfterSuspending();
	              var ping$jscomp$0 = task.ping;
	              x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
	            } else {
	              var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
	              task.abortSet.delete(task);
	              request$jscomp$1.status = 4;
	              var boundary$jscomp$0 = task.blockedBoundary;
	              request$jscomp$0 = logRecoverableError(
	                request,
	                x$jscomp$0,
	                errorInfo$jscomp$0
	              );
	              null === boundary$jscomp$0
	                ? fatalError(request, x$jscomp$0)
	                : (boundary$jscomp$0.pendingTasks--,
	                  4 !== boundary$jscomp$0.status &&
	                    ((boundary$jscomp$0.status = 4),
	                    (boundary$jscomp$0.errorDigest = request$jscomp$0),
	                    untrackBoundary(request, boundary$jscomp$0),
	                    boundary$jscomp$0.parentFlushed &&
	                      request.clientRenderedBoundaries.push(boundary$jscomp$0),
	                    0 === request.pendingRootTasks &&
	                      null === request.trackedPostpones &&
	                      null !== boundary$jscomp$0.contentPreamble &&
	                      preparePreamble(request)));
	              request.allPendingTasks--;
	              0 === request.allPendingTasks && completeAll(request);
	            }
	          } finally {
	          }
	        }
	      }
	      pingedTasks.splice(0, i);
	      null !== request$jscomp$2.destination &&
	        flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
	    } catch (error) {
	      logRecoverableError(request$jscomp$2, error, {}),
	        fatalError(request$jscomp$2, error);
	    } finally {
	      (currentResumableState = prevResumableState),
	        (ReactSharedInternals.H = prevDispatcher),
	        (ReactSharedInternals.A = prevAsyncDispatcher),
	        prevDispatcher === HooksDispatcher && switchContext(prevContext),
	        (currentRequest = prevRequest);
	    }
	  }
	}
	function preparePreambleFromSubtree(
	  request,
	  segment,
	  collectedPreambleSegments
	) {
	  segment.preambleChildren.length &&
	    collectedPreambleSegments.push(segment.preambleChildren);
	  for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
	    pendingPreambles =
	      preparePreambleFromSegment(
	        request,
	        segment.children[i],
	        collectedPreambleSegments
	      ) || pendingPreambles;
	  return pendingPreambles;
	}
	function preparePreambleFromSegment(
	  request,
	  segment,
	  collectedPreambleSegments
	) {
	  var boundary = segment.boundary;
	  if (null === boundary)
	    return preparePreambleFromSubtree(
	      request,
	      segment,
	      collectedPreambleSegments
	    );
	  var preamble = boundary.contentPreamble,
	    fallbackPreamble = boundary.fallbackPreamble;
	  if (null === preamble || null === fallbackPreamble) return false;
	  switch (boundary.status) {
	    case 1:
	      hoistPreambleState(request.renderState, preamble);
	      segment = boundary.completedSegments[0];
	      if (!segment) throw Error(formatProdErrorMessage(391));
	      return preparePreambleFromSubtree(
	        request,
	        segment,
	        collectedPreambleSegments
	      );
	    case 5:
	      if (null !== request.trackedPostpones) return true;
	    case 4:
	      if (1 === segment.status)
	        return (
	          hoistPreambleState(request.renderState, fallbackPreamble),
	          preparePreambleFromSubtree(
	            request,
	            segment,
	            collectedPreambleSegments
	          )
	        );
	    default:
	      return true;
	  }
	}
	function preparePreamble(request) {
	  if (
	    request.completedRootSegment &&
	    null === request.completedPreambleSegments
	  ) {
	    var collectedPreambleSegments = [],
	      hasPendingPreambles = preparePreambleFromSegment(
	        request,
	        request.completedRootSegment,
	        collectedPreambleSegments
	      ),
	      preamble = request.renderState.preamble;
	    if (
	      false === hasPendingPreambles ||
	      (preamble.headChunks && preamble.bodyChunks)
	    )
	      request.completedPreambleSegments = collectedPreambleSegments;
	  }
	}
	function flushSubtree(request, destination, segment, hoistableState) {
	  segment.parentFlushed = true;
	  switch (segment.status) {
	    case 0:
	      segment.id = request.nextSegmentId++;
	    case 5:
	      return (
	        (hoistableState = segment.id),
	        (segment.lastPushedText = false),
	        (segment.textEmbedded = false),
	        (request = request.renderState),
	        destination.push('<template id="'),
	        destination.push(request.placeholderPrefix),
	        (request = hoistableState.toString(16)),
	        destination.push(request),
	        destination.push('"></template>')
	      );
	    case 1:
	      segment.status = 2;
	      var r = true,
	        chunks = segment.chunks,
	        chunkIdx = 0;
	      segment = segment.children;
	      for (var childIdx = 0; childIdx < segment.length; childIdx++) {
	        for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
	          destination.push(chunks[chunkIdx]);
	        r = flushSegment(request, destination, r, hoistableState);
	      }
	      for (; chunkIdx < chunks.length - 1; chunkIdx++)
	        destination.push(chunks[chunkIdx]);
	      chunkIdx < chunks.length && (r = destination.push(chunks[chunkIdx]));
	      return r;
	    default:
	      throw Error(formatProdErrorMessage(390));
	  }
	}
	function flushSegment(request, destination, segment, hoistableState) {
	  var boundary = segment.boundary;
	  if (null === boundary)
	    return flushSubtree(request, destination, segment, hoistableState);
	  boundary.parentFlushed = true;
	  if (4 === boundary.status) {
	    if (!request.renderState.generateStaticMarkup) {
	      var errorDigest = boundary.errorDigest;
	      destination.push("\x3c!--$!--\x3e");
	      destination.push("<template");
	      errorDigest &&
	        (destination.push(' data-dgst="'),
	        (errorDigest = escapeTextForBrowser(errorDigest)),
	        destination.push(errorDigest),
	        destination.push('"'));
	      destination.push("></template>");
	    }
	    flushSubtree(request, destination, segment, hoistableState);
	    request.renderState.generateStaticMarkup
	      ? (destination = true)
	      : ((request = boundary.fallbackPreamble) &&
	          writePreambleContribution(destination, request),
	        (destination = destination.push("\x3c!--/$--\x3e")));
	    return destination;
	  }
	  if (1 !== boundary.status)
	    return (
	      0 === boundary.status &&
	        (boundary.rootSegmentID = request.nextSegmentId++),
	      0 < boundary.completedSegments.length &&
	        request.partialBoundaries.push(boundary),
	      writeStartPendingSuspenseBoundary(
	        destination,
	        request.renderState,
	        boundary.rootSegmentID
	      ),
	      hoistableState &&
	        ((boundary = boundary.fallbackState),
	        boundary.styles.forEach(hoistStyleQueueDependency, hoistableState),
	        boundary.stylesheets.forEach(
	          hoistStylesheetDependency,
	          hoistableState
	        )),
	      flushSubtree(request, destination, segment, hoistableState),
	      destination.push("\x3c!--/$--\x3e")
	    );
	  if (boundary.byteSize > request.progressiveChunkSize)
	    return (
	      (boundary.rootSegmentID = request.nextSegmentId++),
	      request.completedBoundaries.push(boundary),
	      writeStartPendingSuspenseBoundary(
	        destination,
	        request.renderState,
	        boundary.rootSegmentID
	      ),
	      flushSubtree(request, destination, segment, hoistableState),
	      destination.push("\x3c!--/$--\x3e")
	    );
	  hoistableState &&
	    ((segment = boundary.contentState),
	    segment.styles.forEach(hoistStyleQueueDependency, hoistableState),
	    segment.stylesheets.forEach(hoistStylesheetDependency, hoistableState));
	  request.renderState.generateStaticMarkup ||
	    destination.push("\x3c!--$--\x3e");
	  segment = boundary.completedSegments;
	  if (1 !== segment.length) throw Error(formatProdErrorMessage(391));
	  flushSegment(request, destination, segment[0], hoistableState);
	  request.renderState.generateStaticMarkup
	    ? (destination = true)
	    : ((request = boundary.contentPreamble) &&
	        writePreambleContribution(destination, request),
	      (destination = destination.push("\x3c!--/$--\x3e")));
	  return destination;
	}
	function flushSegmentContainer(request, destination, segment, hoistableState) {
	  writeStartSegment(
	    destination,
	    request.renderState,
	    segment.parentFormatContext,
	    segment.id
	  );
	  flushSegment(request, destination, segment, hoistableState);
	  return writeEndSegment(destination, segment.parentFormatContext);
	}
	function flushCompletedBoundary(request, destination, boundary) {
	  for (
	    var completedSegments = boundary.completedSegments, i = 0;
	    i < completedSegments.length;
	    i++
	  )
	    flushPartiallyCompletedSegment(
	      request,
	      destination,
	      boundary,
	      completedSegments[i]
	    );
	  completedSegments.length = 0;
	  writeHoistablesForBoundary(
	    destination,
	    boundary.contentState,
	    request.renderState
	  );
	  completedSegments = request.resumableState;
	  request = request.renderState;
	  i = boundary.rootSegmentID;
	  boundary = boundary.contentState;
	  var requiresStyleInsertion = request.stylesToHoist;
	  request.stylesToHoist = false;
	  destination.push(request.startInlineScript);
	  requiresStyleInsertion
	    ? 0 === (completedSegments.instructions & 2)
	      ? ((completedSegments.instructions |= 10),
	        destination.push(
	          '$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RM=new Map;\n$RR=function(t,u,y){function v(n){this._p=null;n()}for(var w=$RC,p=$RM,q=new Map,r=document,g,b,h=r.querySelectorAll("link[data-precedence],style[data-precedence]"),x=[],k=0;b=h[k++];)"not all"===b.getAttribute("media")?x.push(b):("LINK"===b.tagName&&p.set(b.getAttribute("href"),b),q.set(b.dataset.precedence,g=b));b=0;h=[];var l,a;for(k=!0;;){if(k){var e=y[b++];if(!e){k=!1;b=0;continue}var c=!1,m=0;var d=e[m++];if(a=p.get(d)){var f=a._p;c=!0}else{a=r.createElement("link");a.href=\nd;a.rel="stylesheet";for(a.dataset.precedence=l=e[m++];f=e[m++];)a.setAttribute(f,e[m++]);f=a._p=new Promise(function(n,z){a.onload=v.bind(a,n);a.onerror=v.bind(a,z)});p.set(d,a)}d=a.getAttribute("media");!f||d&&!matchMedia(d).matches||h.push(f);if(c)continue}else{a=x[b++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=q.get(l)||g;c===g&&(g=a);q.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=r.head,c.insertBefore(a,c.firstChild))}Promise.all(h).then(w.bind(null,\nt,u,""),w.bind(null,t,u,"Resource failed to load"))};$RR("'
	        ))
	      : 0 === (completedSegments.instructions & 8)
	        ? ((completedSegments.instructions |= 8),
	          destination.push(
	            '$RM=new Map;\n$RR=function(t,u,y){function v(n){this._p=null;n()}for(var w=$RC,p=$RM,q=new Map,r=document,g,b,h=r.querySelectorAll("link[data-precedence],style[data-precedence]"),x=[],k=0;b=h[k++];)"not all"===b.getAttribute("media")?x.push(b):("LINK"===b.tagName&&p.set(b.getAttribute("href"),b),q.set(b.dataset.precedence,g=b));b=0;h=[];var l,a;for(k=!0;;){if(k){var e=y[b++];if(!e){k=!1;b=0;continue}var c=!1,m=0;var d=e[m++];if(a=p.get(d)){var f=a._p;c=!0}else{a=r.createElement("link");a.href=\nd;a.rel="stylesheet";for(a.dataset.precedence=l=e[m++];f=e[m++];)a.setAttribute(f,e[m++]);f=a._p=new Promise(function(n,z){a.onload=v.bind(a,n);a.onerror=v.bind(a,z)});p.set(d,a)}d=a.getAttribute("media");!f||d&&!matchMedia(d).matches||h.push(f);if(c)continue}else{a=x[b++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=q.get(l)||g;c===g&&(g=a);q.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=r.head,c.insertBefore(a,c.firstChild))}Promise.all(h).then(w.bind(null,\nt,u,""),w.bind(null,t,u,"Resource failed to load"))};$RR("'
	          ))
	        : destination.push('$RR("')
	    : 0 === (completedSegments.instructions & 2)
	      ? ((completedSegments.instructions |= 2),
	        destination.push(
	          '$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RC("'
	        ))
	      : destination.push('$RC("');
	  completedSegments = i.toString(16);
	  destination.push(request.boundaryPrefix);
	  destination.push(completedSegments);
	  destination.push('","');
	  destination.push(request.segmentPrefix);
	  destination.push(completedSegments);
	  requiresStyleInsertion
	    ? (destination.push('",'),
	      writeStyleResourceDependenciesInJS(destination, boundary))
	    : destination.push('"');
	  boundary = destination.push(")\x3c/script>");
	  return writeBootstrap(destination, request) && boundary;
	}
	function flushPartiallyCompletedSegment(
	  request,
	  destination,
	  boundary,
	  segment
	) {
	  if (2 === segment.status) return true;
	  var hoistableState = boundary.contentState,
	    segmentID = segment.id;
	  if (-1 === segmentID) {
	    if (-1 === (segment.id = boundary.rootSegmentID))
	      throw Error(formatProdErrorMessage(392));
	    return flushSegmentContainer(request, destination, segment, hoistableState);
	  }
	  if (segmentID === boundary.rootSegmentID)
	    return flushSegmentContainer(request, destination, segment, hoistableState);
	  flushSegmentContainer(request, destination, segment, hoistableState);
	  boundary = request.resumableState;
	  request = request.renderState;
	  destination.push(request.startInlineScript);
	  0 === (boundary.instructions & 1)
	    ? ((boundary.instructions |= 1),
	      destination.push(
	        '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'
	      ))
	    : destination.push('$RS("');
	  destination.push(request.segmentPrefix);
	  segmentID = segmentID.toString(16);
	  destination.push(segmentID);
	  destination.push('","');
	  destination.push(request.placeholderPrefix);
	  destination.push(segmentID);
	  destination = destination.push('")\x3c/script>');
	  return destination;
	}
	function flushCompletedQueues(request, destination) {
	  try {
	    if (!(0 < request.pendingRootTasks)) {
	      var i,
	        completedRootSegment = request.completedRootSegment;
	      if (null !== completedRootSegment) {
	        if (5 === completedRootSegment.status) return;
	        var completedPreambleSegments = request.completedPreambleSegments;
	        if (null === completedPreambleSegments) return;
	        var renderState = request.renderState,
	          preamble = renderState.preamble,
	          htmlChunks = preamble.htmlChunks,
	          headChunks = preamble.headChunks,
	          i$jscomp$0;
	        if (htmlChunks) {
	          for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
	            destination.push(htmlChunks[i$jscomp$0]);
	          if (headChunks)
	            for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
	              destination.push(headChunks[i$jscomp$0]);
	          else {
	            var chunk = startChunkForTag("head");
	            destination.push(chunk);
	            destination.push(">");
	          }
	        } else if (headChunks)
	          for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
	            destination.push(headChunks[i$jscomp$0]);
	        var charsetChunks = renderState.charsetChunks;
	        for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
	          destination.push(charsetChunks[i$jscomp$0]);
	        charsetChunks.length = 0;
	        renderState.preconnects.forEach(flushResource, destination);
	        renderState.preconnects.clear();
	        var viewportChunks = renderState.viewportChunks;
	        for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
	          destination.push(viewportChunks[i$jscomp$0]);
	        viewportChunks.length = 0;
	        renderState.fontPreloads.forEach(flushResource, destination);
	        renderState.fontPreloads.clear();
	        renderState.highImagePreloads.forEach(flushResource, destination);
	        renderState.highImagePreloads.clear();
	        renderState.styles.forEach(flushStylesInPreamble, destination);
	        var importMapChunks = renderState.importMapChunks;
	        for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
	          destination.push(importMapChunks[i$jscomp$0]);
	        importMapChunks.length = 0;
	        renderState.bootstrapScripts.forEach(flushResource, destination);
	        renderState.scripts.forEach(flushResource, destination);
	        renderState.scripts.clear();
	        renderState.bulkPreloads.forEach(flushResource, destination);
	        renderState.bulkPreloads.clear();
	        var hoistableChunks = renderState.hoistableChunks;
	        for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
	          destination.push(hoistableChunks[i$jscomp$0]);
	        for (
	          renderState = hoistableChunks.length = 0;
	          renderState < completedPreambleSegments.length;
	          renderState++
	        ) {
	          var segments = completedPreambleSegments[renderState];
	          for (preamble = 0; preamble < segments.length; preamble++)
	            flushSegment(request, destination, segments[preamble], null);
	        }
	        var preamble$jscomp$0 = request.renderState.preamble,
	          headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
	        if (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) {
	          var chunk$jscomp$0 = endChunkForTag("head");
	          destination.push(chunk$jscomp$0);
	        }
	        var bodyChunks = preamble$jscomp$0.bodyChunks;
	        if (bodyChunks)
	          for (
	            completedPreambleSegments = 0;
	            completedPreambleSegments < bodyChunks.length;
	            completedPreambleSegments++
	          )
	            destination.push(bodyChunks[completedPreambleSegments]);
	        flushSegment(request, destination, completedRootSegment, null);
	        request.completedRootSegment = null;
	        writeBootstrap(destination, request.renderState);
	      }
	      var renderState$jscomp$0 = request.renderState;
	      completedRootSegment = 0;
	      var viewportChunks$jscomp$0 = renderState$jscomp$0.viewportChunks;
	      for (
	        completedRootSegment = 0;
	        completedRootSegment < viewportChunks$jscomp$0.length;
	        completedRootSegment++
	      )
	        destination.push(viewportChunks$jscomp$0[completedRootSegment]);
	      viewportChunks$jscomp$0.length = 0;
	      renderState$jscomp$0.preconnects.forEach(flushResource, destination);
	      renderState$jscomp$0.preconnects.clear();
	      renderState$jscomp$0.fontPreloads.forEach(flushResource, destination);
	      renderState$jscomp$0.fontPreloads.clear();
	      renderState$jscomp$0.highImagePreloads.forEach(
	        flushResource,
	        destination
	      );
	      renderState$jscomp$0.highImagePreloads.clear();
	      renderState$jscomp$0.styles.forEach(preloadLateStyles, destination);
	      renderState$jscomp$0.scripts.forEach(flushResource, destination);
	      renderState$jscomp$0.scripts.clear();
	      renderState$jscomp$0.bulkPreloads.forEach(flushResource, destination);
	      renderState$jscomp$0.bulkPreloads.clear();
	      var hoistableChunks$jscomp$0 = renderState$jscomp$0.hoistableChunks;
	      for (
	        completedRootSegment = 0;
	        completedRootSegment < hoistableChunks$jscomp$0.length;
	        completedRootSegment++
	      )
	        destination.push(hoistableChunks$jscomp$0[completedRootSegment]);
	      hoistableChunks$jscomp$0.length = 0;
	      var clientRenderedBoundaries = request.clientRenderedBoundaries;
	      for (i = 0; i < clientRenderedBoundaries.length; i++) {
	        var boundary = clientRenderedBoundaries[i];
	        renderState$jscomp$0 = destination;
	        var resumableState = request.resumableState,
	          renderState$jscomp$1 = request.renderState,
	          id = boundary.rootSegmentID,
	          errorDigest = boundary.errorDigest;
	        renderState$jscomp$0.push(renderState$jscomp$1.startInlineScript);
	        0 === (resumableState.instructions & 4)
	          ? ((resumableState.instructions |= 4),
	            renderState$jscomp$0.push(
	              '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("'
	            ))
	          : renderState$jscomp$0.push('$RX("');
	        renderState$jscomp$0.push(renderState$jscomp$1.boundaryPrefix);
	        var chunk$jscomp$1 = id.toString(16);
	        renderState$jscomp$0.push(chunk$jscomp$1);
	        renderState$jscomp$0.push('"');
	        if (errorDigest) {
	          renderState$jscomp$0.push(",");
	          var chunk$jscomp$2 = escapeJSStringsForInstructionScripts(
	            errorDigest || ""
	          );
	          renderState$jscomp$0.push(chunk$jscomp$2);
	        }
	        var JSCompiler_inline_result =
	          renderState$jscomp$0.push(")\x3c/script>");
	        if (!JSCompiler_inline_result) {
	          request.destination = null;
	          i++;
	          clientRenderedBoundaries.splice(0, i);
	          return;
	        }
	      }
	      clientRenderedBoundaries.splice(0, i);
	      var completedBoundaries = request.completedBoundaries;
	      for (i = 0; i < completedBoundaries.length; i++)
	        if (
	          !flushCompletedBoundary(request, destination, completedBoundaries[i])
	        ) {
	          request.destination = null;
	          i++;
	          completedBoundaries.splice(0, i);
	          return;
	        }
	      completedBoundaries.splice(0, i);
	      var partialBoundaries = request.partialBoundaries;
	      for (i = 0; i < partialBoundaries.length; i++) {
	        var boundary$51 = partialBoundaries[i];
	        a: {
	          clientRenderedBoundaries = request;
	          boundary = destination;
	          var completedSegments = boundary$51.completedSegments;
	          for (
	            JSCompiler_inline_result = 0;
	            JSCompiler_inline_result < completedSegments.length;
	            JSCompiler_inline_result++
	          )
	            if (
	              !flushPartiallyCompletedSegment(
	                clientRenderedBoundaries,
	                boundary,
	                boundary$51,
	                completedSegments[JSCompiler_inline_result]
	              )
	            ) {
	              JSCompiler_inline_result++;
	              completedSegments.splice(0, JSCompiler_inline_result);
	              var JSCompiler_inline_result$jscomp$0 = !1;
	              break a;
	            }
	          completedSegments.splice(0, JSCompiler_inline_result);
	          JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
	            boundary,
	            boundary$51.contentState,
	            clientRenderedBoundaries.renderState
	          );
	        }
	        if (!JSCompiler_inline_result$jscomp$0) {
	          request.destination = null;
	          i++;
	          partialBoundaries.splice(0, i);
	          return;
	        }
	      }
	      partialBoundaries.splice(0, i);
	      var largeBoundaries = request.completedBoundaries;
	      for (i = 0; i < largeBoundaries.length; i++)
	        if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
	          request.destination = null;
	          i++;
	          largeBoundaries.splice(0, i);
	          return;
	        }
	      largeBoundaries.splice(0, i);
	    }
	  } finally {
	    0 === request.allPendingTasks &&
	      0 === request.pingedTasks.length &&
	      0 === request.clientRenderedBoundaries.length &&
	      0 === request.completedBoundaries.length &&
	      ((request.flushScheduled = false),
	      (i = request.resumableState),
	      i.hasBody &&
	        ((partialBoundaries = endChunkForTag("body")),
	        destination.push(partialBoundaries)),
	      i.hasHtml && ((i = endChunkForTag("html")), destination.push(i)),
	      (request.status = 14),
	      destination.push(null),
	      (request.destination = null));
	  }
	}
	function enqueueFlush(request) {
	  if (
	    false === request.flushScheduled &&
	    0 === request.pingedTasks.length &&
	    null !== request.destination
	  ) {
	    request.flushScheduled = true;
	    var destination = request.destination;
	    destination
	      ? flushCompletedQueues(request, destination)
	      : (request.flushScheduled = false);
	  }
	}
	function startFlowing(request, destination) {
	  if (13 === request.status)
	    (request.status = 14), destination.destroy(request.fatalError);
	  else if (14 !== request.status && null === request.destination) {
	    request.destination = destination;
	    try {
	      flushCompletedQueues(request, destination);
	    } catch (error) {
	      logRecoverableError(request, error, {}), fatalError(request, error);
	    }
	  }
	}
	function abort(request, reason) {
	  if (11 === request.status || 10 === request.status) request.status = 12;
	  try {
	    var abortableTasks = request.abortableTasks;
	    if (0 < abortableTasks.size) {
	      var error =
	        void 0 === reason
	          ? Error(formatProdErrorMessage(432))
	          : "object" === typeof reason &&
	              null !== reason &&
	              "function" === typeof reason.then
	            ? Error(formatProdErrorMessage(530))
	            : reason;
	      request.fatalError = error;
	      abortableTasks.forEach(function (task) {
	        return abortTask(task, request, error);
	      });
	      abortableTasks.clear();
	    }
	    null !== request.destination &&
	      flushCompletedQueues(request, request.destination);
	  } catch (error$53) {
	    logRecoverableError(request, error$53, {}), fatalError(request, error$53);
	  }
	}
	function onError() {}
	function renderToStringImpl(
	  children,
	  options,
	  generateStaticMarkup,
	  abortReason
	) {
	  var didFatal = false,
	    fatalError = null,
	    result = "",
	    readyToStream = false;
	  options = createResumableState(options ? options.identifierPrefix : void 0);
	  children = createRequest(
	    children,
	    options,
	    createRenderState(options, generateStaticMarkup),
	    createFormatContext(0, null, 0),
	    Infinity,
	    onError,
	    void 0,
	    function () {
	      readyToStream = true;
	    },
	    void 0,
	    void 0,
	    void 0
	  );
	  children.flushScheduled = null !== children.destination;
	  performWork(children);
	  10 === children.status && (children.status = 11);
	  null === children.trackedPostpones &&
	    safelyEmitEarlyPreloads(children, 0 === children.pendingRootTasks);
	  abort(children, abortReason);
	  startFlowing(children, {
	    push: function (chunk) {
	      null !== chunk && (result += chunk);
	      return true;
	    },
	    destroy: function (error) {
	      didFatal = true;
	      fatalError = error;
	    }
	  });
	  if (didFatal && fatalError !== abortReason) throw fatalError;
	  if (!readyToStream) throw Error(formatProdErrorMessage(426));
	  return result;
	}
	reactDomServerLegacy_browser_production.renderToStaticMarkup = function (children, options) {
	  return renderToStringImpl(
	    children,
	    options,
	    true,
	    'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server'
	  );
	};
	reactDomServerLegacy_browser_production.renderToString = function (children, options) {
	  return renderToStringImpl(
	    children,
	    options,
	    false,
	    'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server'
	  );
	};
	reactDomServerLegacy_browser_production.version = "19.1.0";
	return reactDomServerLegacy_browser_production;
}

var hasRequiredServer_edge;

function requireServer_edge () {
	if (hasRequiredServer_edge) return server_edge;
	hasRequiredServer_edge = 1;
	var b;
	var l;
	{
	  b = requireReactDomServer_edge_production();
	  l = requireReactDomServerLegacy_browser_production();
	}
	server_edge.version = b.version;
	server_edge.renderToReadableStream = b.renderToReadableStream;
	server_edge.renderToString = l.renderToString;
	server_edge.renderToStaticMarkup = l.renderToStaticMarkup;
	if (b.resume) {
	  server_edge.resume = b.resume;
	}
	return server_edge;
}

var server_edgeExports = requireServer_edge();
const ReactDOM$1 = /*@__PURE__*/getDefaultExportFromCjs(server_edgeExports);

const contexts = /* @__PURE__ */ new WeakMap();
const ID_PREFIX = "r";
function getContext(rendererContextResult) {
  if (contexts.has(rendererContextResult)) {
    return contexts.get(rendererContextResult);
  }
  const ctx = {
    currentIndex: 0,
    get id() {
      return ID_PREFIX + this.currentIndex.toString();
    }
  };
  contexts.set(rendererContextResult, ctx);
  return ctx;
}
function incrementId(rendererContextResult) {
  const ctx = getContext(rendererContextResult);
  const id = ctx.id;
  ctx.currentIndex++;
  return id;
}

const StaticHtml = ({
  value,
  name,
  hydrate = true
}) => {
  if (!value) return null;
  const tagName = hydrate ? "astro-slot" : "astro-static-slot";
  return reactExports.createElement(tagName, {
    name,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: value }
  });
};
StaticHtml.shouldComponentUpdate = () => false;
var static_html_default = StaticHtml;

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for("react.element");
const reactTransitionalTypeof = Symbol.for("react.transitional.element");
async function check(Component, props, children) {
  if (typeof Component === "object") {
    return Component["$$typeof"].toString().slice("Symbol(".length).startsWith("react");
  }
  if (typeof Component !== "function") return false;
  if (Component.name === "QwikComponent") return false;
  if (typeof Component === "function" && Component["$$typeof"] === Symbol.for("react.forward_ref"))
    return false;
  if (Component.prototype != null && typeof Component.prototype.render === "function") {
    return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
  }
  let isReactComponent = false;
  function Tester(...args) {
    try {
      const vnode = Component(...args);
      if (vnode && (vnode["$$typeof"] === reactTypeof || vnode["$$typeof"] === reactTransitionalTypeof)) {
        isReactComponent = true;
      }
    } catch {
    }
    return React.createElement("div");
  }
  await renderToStaticMarkup.call(this, Tester, props, children);
  return isReactComponent;
}
async function getNodeWritable() {
  let nodeStreamBuiltinModuleName = "node:stream";
  let { Writable } = await import(
    /* @vite-ignore */
    nodeStreamBuiltinModuleName
  );
  return Writable;
}
function needsHydration(metadata) {
  return metadata?.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
  let prefix;
  if (this && this.result) {
    prefix = incrementId(this.result);
  }
  const attrs = { prefix };
  delete props["class"];
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = React.createElement(static_html_default, {
      hydrate: needsHydration(metadata),
      value,
      name
    });
  }
  const newProps = {
    ...props,
    ...slots
  };
  const newChildren = children ?? props.children;
  if (newChildren != null) {
    newProps.children = React.createElement(static_html_default, {
      hydrate: needsHydration(metadata),
      value: newChildren
    });
  }
  const formState = this ? await getFormState(this) : void 0;
  if (formState) {
    attrs["data-action-result"] = JSON.stringify(formState[0]);
    attrs["data-action-key"] = formState[1];
    attrs["data-action-name"] = formState[2];
  }
  const vnode = React.createElement(Component, newProps);
  const renderOptions = {
    identifierPrefix: prefix,
    formState
  };
  let html;
  if ("renderToReadableStream" in ReactDOM$1) {
    html = await renderToReadableStreamAsync(vnode, renderOptions);
  } else {
    html = await renderToPipeableStreamAsync(vnode, renderOptions);
  }
  return { html, attrs };
}
async function getFormState({
  result
}) {
  const { request, actionResult } = result;
  if (!actionResult) return void 0;
  if (!isFormRequest(request.headers.get("content-type"))) return void 0;
  const { searchParams } = new URL(request.url);
  const formData = await request.clone().formData();
  const actionKey = formData.get("$ACTION_KEY")?.toString();
  const actionName = searchParams.get("_action");
  if (!actionKey || !actionName) return void 0;
  return [actionResult, actionKey, actionName];
}
async function renderToPipeableStreamAsync(vnode, options) {
  const Writable = await getNodeWritable();
  let html = "";
  return new Promise((resolve, reject) => {
    let error = void 0;
    let stream = ReactDOM$1.renderToPipeableStream(vnode, {
      ...options,
      onError(err) {
        error = err;
        reject(error);
      },
      onAllReady() {
        stream.pipe(
          new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString("utf-8");
              callback();
            },
            destroy() {
              resolve(html);
            }
          })
        );
      }
    });
  });
}
async function readResult(stream) {
  const reader = stream.getReader();
  let result = "";
  const decoder = new TextDecoder("utf-8");
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (value) {
        result += decoder.decode(value);
      } else {
        decoder.decode(new Uint8Array());
      }
      return result;
    }
    result += decoder.decode(value, { stream: true });
  }
}
async function renderToReadableStreamAsync(vnode, options) {
  return await readResult(await ReactDOM$1.renderToReadableStream(vnode, options));
}
const formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function isFormRequest(contentType) {
  const type = contentType?.split(";")[0].toLowerCase();
  return formContentTypes.some((t) => type === t);
}
const renderer = {
  name: "@astrojs/react",
  check,
  renderToStaticMarkup,
  supportsAstroStaticSlot: true
};
var server_default = renderer;

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

/**
   * table-core
   *
   * Copyright (c) TanStack
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   */
function createColumnHelper() {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === "function" ? {
        ...column,
        accessorFn: accessor
      } : {
        ...column,
        accessorKey: accessor
      };
    },
    display: (column) => column,
    group: (column) => column
  };
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function makeStateUpdater(key, instance) {
  return (updater) => {
    instance.setState((old) => {
      return {
        ...old,
        [key]: functionalUpdate(updater, old[key])
      };
    });
  };
}
function isFunction$2(d) {
  return d instanceof Function;
}
function isNumberArray(d) {
  return Array.isArray(d) && d.every((val) => typeof val === "number");
}
function flattenBy(arr, getChildren) {
  const flat = [];
  const recurse = (subArr) => {
    subArr.forEach((item) => {
      flat.push(item);
      const children = getChildren(item);
      if (children != null && children.length) {
        recurse(children);
      }
    });
  };
  recurse(arr);
  return flat;
}
function memo(getDeps, fn, opts) {
  let deps = [];
  let result;
  return (depArgs) => {
    let depTime;
    if (opts.key && opts.debug) depTime = Date.now();
    const newDeps = getDeps(depArgs);
    const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
    if (!depsChanged) {
      return result;
    }
    deps = newDeps;
    let resultTime;
    if (opts.key && opts.debug) resultTime = Date.now();
    result = fn(...newDeps);
    opts == null || opts.onChange == null || opts.onChange(result);
    if (opts.key && opts.debug) {
      if (opts != null && opts.debug()) {
        const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
        const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
        const resultFpsPercentage = resultEndTime / 16;
        const pad = (str, num) => {
          str = String(str);
          while (str.length < num) {
            str = " " + str;
          }
          return str;
        };
        console.info(`%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * resultFpsPercentage, 120))}deg 100% 31%);`, opts == null ? void 0 : opts.key);
      }
    }
    return result;
  };
}
function getMemoOptions(tableOptions, debugLevel, key, onChange) {
  return {
    debug: () => {
      var _tableOptions$debugAl;
      return (_tableOptions$debugAl = tableOptions == null ? void 0 : tableOptions.debugAll) != null ? _tableOptions$debugAl : tableOptions[debugLevel];
    },
    key: false,
    onChange
  };
}
function createCell(table, row, column, columnId) {
  const getRenderValue = () => {
    var _cell$getValue;
    return (_cell$getValue = cell.getValue()) != null ? _cell$getValue : table.options.renderFallbackValue;
  };
  const cell = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: memo(() => [table, column, row, cell], (table2, column2, row2, cell2) => ({
      table: table2,
      column: column2,
      row: row2,
      cell: cell2,
      getValue: cell2.getValue,
      renderValue: cell2.renderValue
    }), getMemoOptions(table.options, "debugCells"))
  };
  table._features.forEach((feature) => {
    feature.createCell == null || feature.createCell(cell, column, row, table);
  }, {});
  return cell;
}
function createColumn(table, columnDef, depth, parent) {
  var _ref, _resolvedColumnDef$id;
  const defaultColumn = table._getDefaultColumnDef();
  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef
  };
  const accessorKey = resolvedColumnDef.accessorKey;
  let id = (_ref = (_resolvedColumnDef$id = resolvedColumnDef.id) != null ? _resolvedColumnDef$id : accessorKey ? typeof String.prototype.replaceAll === "function" ? accessorKey.replaceAll(".", "_") : accessorKey.replace(/\./g, "_") : void 0) != null ? _ref : typeof resolvedColumnDef.header === "string" ? resolvedColumnDef.header : void 0;
  let accessorFn;
  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn;
  } else if (accessorKey) {
    if (accessorKey.includes(".")) {
      accessorFn = (originalRow) => {
        let result = originalRow;
        for (const key of accessorKey.split(".")) {
          var _result;
          result = (_result = result) == null ? void 0 : _result[key];
        }
        return result;
      };
    } else {
      accessorFn = (originalRow) => originalRow[resolvedColumnDef.accessorKey];
    }
  }
  if (!id) {
    throw new Error();
  }
  let column = {
    id: `${String(id)}`,
    accessorFn,
    parent,
    depth,
    columnDef: resolvedColumnDef,
    columns: [],
    getFlatColumns: memo(() => [true], () => {
      var _column$columns;
      return [column, ...(_column$columns = column.columns) == null ? void 0 : _column$columns.flatMap((d) => d.getFlatColumns())];
    }, getMemoOptions(table.options, "debugColumns")),
    getLeafColumns: memo(() => [table._getOrderColumnsFn()], (orderColumns2) => {
      var _column$columns2;
      if ((_column$columns2 = column.columns) != null && _column$columns2.length) {
        let leafColumns = column.columns.flatMap((column2) => column2.getLeafColumns());
        return orderColumns2(leafColumns);
      }
      return [column];
    }, getMemoOptions(table.options, "debugColumns"))
  };
  for (const feature of table._features) {
    feature.createColumn == null || feature.createColumn(column, table);
  }
  return column;
}
const debug = "debugHeaders";
function createHeader(table, column, options) {
  var _options$id;
  const id = (_options$id = options.id) != null ? _options$id : column.id;
  let header = {
    id,
    column,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    depth: options.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const leafHeaders = [];
      const recurseHeader = (h) => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader);
        }
        leafHeaders.push(h);
      };
      recurseHeader(header);
      return leafHeaders;
    },
    getContext: () => ({
      table,
      header,
      column
    })
  };
  table._features.forEach((feature) => {
    feature.createHeader == null || feature.createHeader(header, table);
  });
  return header;
}
const Headers$1 = {
  createTable: (table) => {
    table.getHeaderGroups = memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
      var _left$map$filter, _right$map$filter;
      const leftColumns = (_left$map$filter = left == null ? void 0 : left.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter : [];
      const rightColumns = (_right$map$filter = right == null ? void 0 : right.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter : [];
      const centerColumns = leafColumns.filter((column) => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
      const headerGroups = buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], table);
      return headerGroups;
    }, getMemoOptions(table.options, debug));
    table.getCenterHeaderGroups = memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
      leafColumns = leafColumns.filter((column) => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
      return buildHeaderGroups(allColumns, leafColumns, table, "center");
    }, getMemoOptions(table.options, debug));
    table.getLeftHeaderGroups = memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left], (allColumns, leafColumns, left) => {
      var _left$map$filter2;
      const orderedLeafColumns = (_left$map$filter2 = left == null ? void 0 : left.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter2 : [];
      return buildHeaderGroups(allColumns, orderedLeafColumns, table, "left");
    }, getMemoOptions(table.options, debug));
    table.getRightHeaderGroups = memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.right], (allColumns, leafColumns, right) => {
      var _right$map$filter2;
      const orderedLeafColumns = (_right$map$filter2 = right == null ? void 0 : right.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter2 : [];
      return buildHeaderGroups(allColumns, orderedLeafColumns, table, "right");
    }, getMemoOptions(table.options, debug));
    table.getFooterGroups = memo(() => [table.getHeaderGroups()], (headerGroups) => {
      return [...headerGroups].reverse();
    }, getMemoOptions(table.options, debug));
    table.getLeftFooterGroups = memo(() => [table.getLeftHeaderGroups()], (headerGroups) => {
      return [...headerGroups].reverse();
    }, getMemoOptions(table.options, debug));
    table.getCenterFooterGroups = memo(() => [table.getCenterHeaderGroups()], (headerGroups) => {
      return [...headerGroups].reverse();
    }, getMemoOptions(table.options, debug));
    table.getRightFooterGroups = memo(() => [table.getRightHeaderGroups()], (headerGroups) => {
      return [...headerGroups].reverse();
    }, getMemoOptions(table.options, debug));
    table.getFlatHeaders = memo(() => [table.getHeaderGroups()], (headerGroups) => {
      return headerGroups.map((headerGroup) => {
        return headerGroup.headers;
      }).flat();
    }, getMemoOptions(table.options, debug));
    table.getLeftFlatHeaders = memo(() => [table.getLeftHeaderGroups()], (left) => {
      return left.map((headerGroup) => {
        return headerGroup.headers;
      }).flat();
    }, getMemoOptions(table.options, debug));
    table.getCenterFlatHeaders = memo(() => [table.getCenterHeaderGroups()], (left) => {
      return left.map((headerGroup) => {
        return headerGroup.headers;
      }).flat();
    }, getMemoOptions(table.options, debug));
    table.getRightFlatHeaders = memo(() => [table.getRightHeaderGroups()], (left) => {
      return left.map((headerGroup) => {
        return headerGroup.headers;
      }).flat();
    }, getMemoOptions(table.options, debug));
    table.getCenterLeafHeaders = memo(() => [table.getCenterFlatHeaders()], (flatHeaders) => {
      return flatHeaders.filter((header) => {
        var _header$subHeaders;
        return !((_header$subHeaders = header.subHeaders) != null && _header$subHeaders.length);
      });
    }, getMemoOptions(table.options, debug));
    table.getLeftLeafHeaders = memo(() => [table.getLeftFlatHeaders()], (flatHeaders) => {
      return flatHeaders.filter((header) => {
        var _header$subHeaders2;
        return !((_header$subHeaders2 = header.subHeaders) != null && _header$subHeaders2.length);
      });
    }, getMemoOptions(table.options, debug));
    table.getRightLeafHeaders = memo(() => [table.getRightFlatHeaders()], (flatHeaders) => {
      return flatHeaders.filter((header) => {
        var _header$subHeaders3;
        return !((_header$subHeaders3 = header.subHeaders) != null && _header$subHeaders3.length);
      });
    }, getMemoOptions(table.options, debug));
    table.getLeafHeaders = memo(() => [table.getLeftHeaderGroups(), table.getCenterHeaderGroups(), table.getRightHeaderGroups()], (left, center, right) => {
      var _left$0$headers, _left$, _center$0$headers, _center$, _right$0$headers, _right$;
      return [...(_left$0$headers = (_left$ = left[0]) == null ? void 0 : _left$.headers) != null ? _left$0$headers : [], ...(_center$0$headers = (_center$ = center[0]) == null ? void 0 : _center$.headers) != null ? _center$0$headers : [], ...(_right$0$headers = (_right$ = right[0]) == null ? void 0 : _right$.headers) != null ? _right$0$headers : []].map((header) => {
        return header.getLeafHeaders();
      }).flat();
    }, getMemoOptions(table.options, debug));
  }
};
function buildHeaderGroups(allColumns, columnsToGroup, table, headerFamily) {
  var _headerGroups$0$heade, _headerGroups$;
  let maxDepth = 0;
  const findMaxDepth = function(columns, depth) {
    if (depth === void 0) {
      depth = 1;
    }
    maxDepth = Math.max(maxDepth, depth);
    columns.filter((column) => column.getIsVisible()).forEach((column) => {
      var _column$columns;
      if ((_column$columns = column.columns) != null && _column$columns.length) {
        findMaxDepth(column.columns, depth + 1);
      }
    }, 0);
  };
  findMaxDepth(allColumns);
  let headerGroups = [];
  const createHeaderGroup = (headersToGroup, depth) => {
    const headerGroup = {
      depth,
      id: [headerFamily, `${depth}`].filter(Boolean).join("_"),
      headers: []
    };
    const pendingParentHeaders = [];
    headersToGroup.forEach((headerToGroup) => {
      const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0];
      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth;
      let column;
      let isPlaceholder = false;
      if (isLeafHeader && headerToGroup.column.parent) {
        column = headerToGroup.column.parent;
      } else {
        column = headerToGroup.column;
        isPlaceholder = true;
      }
      if (latestPendingParentHeader && (latestPendingParentHeader == null ? void 0 : latestPendingParentHeader.column) === column) {
        latestPendingParentHeader.subHeaders.push(headerToGroup);
      } else {
        const header = createHeader(table, column, {
          id: [headerFamily, depth, column.id, headerToGroup == null ? void 0 : headerToGroup.id].filter(Boolean).join("_"),
          isPlaceholder,
          placeholderId: isPlaceholder ? `${pendingParentHeaders.filter((d) => d.column === column).length}` : void 0,
          depth,
          index: pendingParentHeaders.length
        });
        header.subHeaders.push(headerToGroup);
        pendingParentHeaders.push(header);
      }
      headerGroup.headers.push(headerToGroup);
      headerToGroup.headerGroup = headerGroup;
    });
    headerGroups.push(headerGroup);
    if (depth > 0) {
      createHeaderGroup(pendingParentHeaders, depth - 1);
    }
  };
  const bottomHeaders = columnsToGroup.map((column, index) => createHeader(table, column, {
    depth: maxDepth,
    index
  }));
  createHeaderGroup(bottomHeaders, maxDepth - 1);
  headerGroups.reverse();
  const recurseHeadersForSpans = (headers) => {
    const filteredHeaders = headers.filter((header) => header.column.getIsVisible());
    return filteredHeaders.map((header) => {
      let colSpan = 0;
      let rowSpan = 0;
      let childRowSpans = [0];
      if (header.subHeaders && header.subHeaders.length) {
        childRowSpans = [];
        recurseHeadersForSpans(header.subHeaders).forEach((_ref) => {
          let {
            colSpan: childColSpan,
            rowSpan: childRowSpan
          } = _ref;
          colSpan += childColSpan;
          childRowSpans.push(childRowSpan);
        });
      } else {
        colSpan = 1;
      }
      const minChildRowSpan = Math.min(...childRowSpans);
      rowSpan = rowSpan + minChildRowSpan;
      header.colSpan = colSpan;
      header.rowSpan = rowSpan;
      return {
        colSpan,
        rowSpan
      };
    });
  };
  recurseHeadersForSpans((_headerGroups$0$heade = (_headerGroups$ = headerGroups[0]) == null ? void 0 : _headerGroups$.headers) != null ? _headerGroups$0$heade : []);
  return headerGroups;
}
const createRow = (table, id, original, rowIndex, depth, subRows, parentId) => {
  let row = {
    id,
    index: rowIndex,
    original,
    depth,
    parentId,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: (columnId) => {
      if (row._valuesCache.hasOwnProperty(columnId)) {
        return row._valuesCache[columnId];
      }
      const column = table.getColumn(columnId);
      if (!(column != null && column.accessorFn)) {
        return void 0;
      }
      row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex);
      return row._valuesCache[columnId];
    },
    getUniqueValues: (columnId) => {
      if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
        return row._uniqueValuesCache[columnId];
      }
      const column = table.getColumn(columnId);
      if (!(column != null && column.accessorFn)) {
        return void 0;
      }
      if (!column.columnDef.getUniqueValues) {
        row._uniqueValuesCache[columnId] = [row.getValue(columnId)];
        return row._uniqueValuesCache[columnId];
      }
      row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(row.original, rowIndex);
      return row._uniqueValuesCache[columnId];
    },
    renderValue: (columnId) => {
      var _row$getValue;
      return (_row$getValue = row.getValue(columnId)) != null ? _row$getValue : table.options.renderFallbackValue;
    },
    subRows: [],
    getLeafRows: () => flattenBy(row.subRows, (d) => d.subRows),
    getParentRow: () => row.parentId ? table.getRow(row.parentId, true) : void 0,
    getParentRows: () => {
      let parentRows = [];
      let currentRow = row;
      while (true) {
        const parentRow = currentRow.getParentRow();
        if (!parentRow) break;
        parentRows.push(parentRow);
        currentRow = parentRow;
      }
      return parentRows.reverse();
    },
    getAllCells: memo(() => [table.getAllLeafColumns()], (leafColumns) => {
      return leafColumns.map((column) => {
        return createCell(table, row, column, column.id);
      });
    }, getMemoOptions(table.options, "debugRows")),
    _getAllCellsByColumnId: memo(() => [row.getAllCells()], (allCells) => {
      return allCells.reduce((acc, cell) => {
        acc[cell.column.id] = cell;
        return acc;
      }, {});
    }, getMemoOptions(table.options, "debugRows"))
  };
  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i];
    feature == null || feature.createRow == null || feature.createRow(row, table);
  }
  return row;
};
const ColumnFaceting = {
  createColumn: (column, table) => {
    column._getFacetedRowModel = table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, column.id);
    column.getFacetedRowModel = () => {
      if (!column._getFacetedRowModel) {
        return table.getPreFilteredRowModel();
      }
      return column._getFacetedRowModel();
    };
    column._getFacetedUniqueValues = table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, column.id);
    column.getFacetedUniqueValues = () => {
      if (!column._getFacetedUniqueValues) {
        return /* @__PURE__ */ new Map();
      }
      return column._getFacetedUniqueValues();
    };
    column._getFacetedMinMaxValues = table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, column.id);
    column.getFacetedMinMaxValues = () => {
      if (!column._getFacetedMinMaxValues) {
        return void 0;
      }
      return column._getFacetedMinMaxValues();
    };
  }
};
const includesString = (row, columnId, filterValue) => {
  var _filterValue$toString, _row$getValue;
  const search = filterValue == null || (_filterValue$toString = filterValue.toString()) == null ? void 0 : _filterValue$toString.toLowerCase();
  return Boolean((_row$getValue = row.getValue(columnId)) == null || (_row$getValue = _row$getValue.toString()) == null || (_row$getValue = _row$getValue.toLowerCase()) == null ? void 0 : _row$getValue.includes(search));
};
includesString.autoRemove = (val) => testFalsey(val);
const includesStringSensitive = (row, columnId, filterValue) => {
  var _row$getValue2;
  return Boolean((_row$getValue2 = row.getValue(columnId)) == null || (_row$getValue2 = _row$getValue2.toString()) == null ? void 0 : _row$getValue2.includes(filterValue));
};
includesStringSensitive.autoRemove = (val) => testFalsey(val);
const equalsString = (row, columnId, filterValue) => {
  var _row$getValue3;
  return ((_row$getValue3 = row.getValue(columnId)) == null || (_row$getValue3 = _row$getValue3.toString()) == null ? void 0 : _row$getValue3.toLowerCase()) === (filterValue == null ? void 0 : filterValue.toLowerCase());
};
equalsString.autoRemove = (val) => testFalsey(val);
const arrIncludes = (row, columnId, filterValue) => {
  var _row$getValue4;
  return (_row$getValue4 = row.getValue(columnId)) == null ? void 0 : _row$getValue4.includes(filterValue);
};
arrIncludes.autoRemove = (val) => testFalsey(val);
const arrIncludesAll = (row, columnId, filterValue) => {
  return !filterValue.some((val) => {
    var _row$getValue5;
    return !((_row$getValue5 = row.getValue(columnId)) != null && _row$getValue5.includes(val));
  });
};
arrIncludesAll.autoRemove = (val) => testFalsey(val) || !(val != null && val.length);
const arrIncludesSome = (row, columnId, filterValue) => {
  return filterValue.some((val) => {
    var _row$getValue6;
    return (_row$getValue6 = row.getValue(columnId)) == null ? void 0 : _row$getValue6.includes(val);
  });
};
arrIncludesSome.autoRemove = (val) => testFalsey(val) || !(val != null && val.length);
const equals = (row, columnId, filterValue) => {
  return row.getValue(columnId) === filterValue;
};
equals.autoRemove = (val) => testFalsey(val);
const weakEquals = (row, columnId, filterValue) => {
  return row.getValue(columnId) == filterValue;
};
weakEquals.autoRemove = (val) => testFalsey(val);
const inNumberRange = (row, columnId, filterValue) => {
  let [min2, max2] = filterValue;
  const rowValue = row.getValue(columnId);
  return rowValue >= min2 && rowValue <= max2;
};
inNumberRange.resolveFilterValue = (val) => {
  let [unsafeMin, unsafeMax] = val;
  let parsedMin = typeof unsafeMin !== "number" ? parseFloat(unsafeMin) : unsafeMin;
  let parsedMax = typeof unsafeMax !== "number" ? parseFloat(unsafeMax) : unsafeMax;
  let min2 = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
  let max2 = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;
  if (min2 > max2) {
    const temp = min2;
    min2 = max2;
    max2 = temp;
  }
  return [min2, max2];
};
inNumberRange.autoRemove = (val) => testFalsey(val) || testFalsey(val[0]) && testFalsey(val[1]);
const filterFns = {
  includesString,
  includesStringSensitive,
  equalsString,
  arrIncludes,
  arrIncludesAll,
  arrIncludesSome,
  equals,
  weakEquals,
  inNumberRange
};
function testFalsey(val) {
  return val === void 0 || val === null || val === "";
}
const ColumnFiltering = {
  getDefaultColumnDef: () => {
    return {
      filterFn: "auto"
    };
  },
  getInitialState: (state) => {
    return {
      columnFilters: [],
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnFiltersChange: makeStateUpdater("columnFilters", table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100
    };
  },
  createColumn: (column, table) => {
    column.getAutoFilterFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0];
      const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
      if (typeof value === "string") {
        return filterFns.includesString;
      }
      if (typeof value === "number") {
        return filterFns.inNumberRange;
      }
      if (typeof value === "boolean") {
        return filterFns.equals;
      }
      if (value !== null && typeof value === "object") {
        return filterFns.equals;
      }
      if (Array.isArray(value)) {
        return filterFns.arrIncludes;
      }
      return filterFns.weakEquals;
    };
    column.getFilterFn = () => {
      var _table$options$filter, _table$options$filter2;
      return isFunction$2(column.columnDef.filterFn) ? column.columnDef.filterFn : column.columnDef.filterFn === "auto" ? column.getAutoFilterFn() : (
        // @ts-ignore
        (_table$options$filter = (_table$options$filter2 = table.options.filterFns) == null ? void 0 : _table$options$filter2[column.columnDef.filterFn]) != null ? _table$options$filter : filterFns[column.columnDef.filterFn]
      );
    };
    column.getCanFilter = () => {
      var _column$columnDef$ena, _table$options$enable, _table$options$enable2;
      return ((_column$columnDef$ena = column.columnDef.enableColumnFilter) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableColumnFilters) != null ? _table$options$enable : true) && ((_table$options$enable2 = table.options.enableFilters) != null ? _table$options$enable2 : true) && !!column.accessorFn;
    };
    column.getIsFiltered = () => column.getFilterIndex() > -1;
    column.getFilterValue = () => {
      var _table$getState$colum;
      return (_table$getState$colum = table.getState().columnFilters) == null || (_table$getState$colum = _table$getState$colum.find((d) => d.id === column.id)) == null ? void 0 : _table$getState$colum.value;
    };
    column.getFilterIndex = () => {
      var _table$getState$colum2, _table$getState$colum3;
      return (_table$getState$colum2 = (_table$getState$colum3 = table.getState().columnFilters) == null ? void 0 : _table$getState$colum3.findIndex((d) => d.id === column.id)) != null ? _table$getState$colum2 : -1;
    };
    column.setFilterValue = (value) => {
      table.setColumnFilters((old) => {
        const filterFn = column.getFilterFn();
        const previousFilter = old == null ? void 0 : old.find((d) => d.id === column.id);
        const newFilter = functionalUpdate(value, previousFilter ? previousFilter.value : void 0);
        if (shouldAutoRemoveFilter(filterFn, newFilter, column)) {
          var _old$filter;
          return (_old$filter = old == null ? void 0 : old.filter((d) => d.id !== column.id)) != null ? _old$filter : [];
        }
        const newFilterObj = {
          id: column.id,
          value: newFilter
        };
        if (previousFilter) {
          var _old$map;
          return (_old$map = old == null ? void 0 : old.map((d) => {
            if (d.id === column.id) {
              return newFilterObj;
            }
            return d;
          })) != null ? _old$map : [];
        }
        if (old != null && old.length) {
          return [...old, newFilterObj];
        }
        return [newFilterObj];
      });
    };
  },
  createRow: (row, _table) => {
    row.columnFilters = {};
    row.columnFiltersMeta = {};
  },
  createTable: (table) => {
    table.setColumnFilters = (updater) => {
      const leafColumns = table.getAllLeafColumns();
      const updateFn = (old) => {
        var _functionalUpdate;
        return (_functionalUpdate = functionalUpdate(updater, old)) == null ? void 0 : _functionalUpdate.filter((filter) => {
          const column = leafColumns.find((d) => d.id === filter.id);
          if (column) {
            const filterFn = column.getFilterFn();
            if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
              return false;
            }
          }
          return true;
        });
      };
      table.options.onColumnFiltersChange == null || table.options.onColumnFiltersChange(updateFn);
    };
    table.resetColumnFilters = (defaultState) => {
      var _table$initialState$c, _table$initialState;
      table.setColumnFilters(defaultState ? [] : (_table$initialState$c = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnFilters) != null ? _table$initialState$c : []);
    };
    table.getPreFilteredRowModel = () => table.getCoreRowModel();
    table.getFilteredRowModel = () => {
      if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
        table._getFilteredRowModel = table.options.getFilteredRowModel(table);
      }
      if (table.options.manualFiltering || !table._getFilteredRowModel) {
        return table.getPreFilteredRowModel();
      }
      return table._getFilteredRowModel();
    };
  }
};
function shouldAutoRemoveFilter(filterFn, value, column) {
  return (filterFn && filterFn.autoRemove ? filterFn.autoRemove(value, column) : false) || typeof value === "undefined" || typeof value === "string" && !value;
}
const sum = (columnId, _leafRows, childRows) => {
  return childRows.reduce((sum2, next) => {
    const nextValue = next.getValue(columnId);
    return sum2 + (typeof nextValue === "number" ? nextValue : 0);
  }, 0);
};
const min$1 = (columnId, _leafRows, childRows) => {
  let min2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null && (min2 > value || min2 === void 0 && value >= value)) {
      min2 = value;
    }
  });
  return min2;
};
const max$1 = (columnId, _leafRows, childRows) => {
  let max2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null && (max2 < value || max2 === void 0 && value >= value)) {
      max2 = value;
    }
  });
  return max2;
};
const extent = (columnId, _leafRows, childRows) => {
  let min2;
  let max2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null) {
      if (min2 === void 0) {
        if (value >= value) min2 = max2 = value;
      } else {
        if (min2 > value) min2 = value;
        if (max2 < value) max2 = value;
      }
    }
  });
  return [min2, max2];
};
const mean = (columnId, leafRows) => {
  let count2 = 0;
  let sum2 = 0;
  leafRows.forEach((row) => {
    let value = row.getValue(columnId);
    if (value != null && (value = +value) >= value) {
      ++count2, sum2 += value;
    }
  });
  if (count2) return sum2 / count2;
  return;
};
const median = (columnId, leafRows) => {
  if (!leafRows.length) {
    return;
  }
  const values = leafRows.map((row) => row.getValue(columnId));
  if (!isNumberArray(values)) {
    return;
  }
  if (values.length === 1) {
    return values[0];
  }
  const mid = Math.floor(values.length / 2);
  const nums = values.sort((a, b) => a - b);
  return values.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
const unique = (columnId, leafRows) => {
  return Array.from(new Set(leafRows.map((d) => d.getValue(columnId))).values());
};
const uniqueCount = (columnId, leafRows) => {
  return new Set(leafRows.map((d) => d.getValue(columnId))).size;
};
const count$2 = (_columnId, leafRows) => {
  return leafRows.length;
};
const aggregationFns = {
  sum,
  min: min$1,
  max: max$1,
  extent,
  mean,
  median,
  unique,
  uniqueCount,
  count: count$2
};
const ColumnGrouping = {
  getDefaultColumnDef: () => {
    return {
      aggregatedCell: (props) => {
        var _toString, _props$getValue;
        return (_toString = (_props$getValue = props.getValue()) == null || _props$getValue.toString == null ? void 0 : _props$getValue.toString()) != null ? _toString : null;
      },
      aggregationFn: "auto"
    };
  },
  getInitialState: (state) => {
    return {
      grouping: [],
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onGroupingChange: makeStateUpdater("grouping", table),
      groupedColumnMode: "reorder"
    };
  },
  createColumn: (column, table) => {
    column.toggleGrouping = () => {
      table.setGrouping((old) => {
        if (old != null && old.includes(column.id)) {
          return old.filter((d) => d !== column.id);
        }
        return [...old != null ? old : [], column.id];
      });
    };
    column.getCanGroup = () => {
      var _column$columnDef$ena, _table$options$enable;
      return ((_column$columnDef$ena = column.columnDef.enableGrouping) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableGrouping) != null ? _table$options$enable : true) && (!!column.accessorFn || !!column.columnDef.getGroupingValue);
    };
    column.getIsGrouped = () => {
      var _table$getState$group;
      return (_table$getState$group = table.getState().grouping) == null ? void 0 : _table$getState$group.includes(column.id);
    };
    column.getGroupedIndex = () => {
      var _table$getState$group2;
      return (_table$getState$group2 = table.getState().grouping) == null ? void 0 : _table$getState$group2.indexOf(column.id);
    };
    column.getToggleGroupingHandler = () => {
      const canGroup = column.getCanGroup();
      return () => {
        if (!canGroup) return;
        column.toggleGrouping();
      };
    };
    column.getAutoAggregationFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0];
      const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
      if (typeof value === "number") {
        return aggregationFns.sum;
      }
      if (Object.prototype.toString.call(value) === "[object Date]") {
        return aggregationFns.extent;
      }
    };
    column.getAggregationFn = () => {
      var _table$options$aggreg, _table$options$aggreg2;
      if (!column) {
        throw new Error();
      }
      return isFunction$2(column.columnDef.aggregationFn) ? column.columnDef.aggregationFn : column.columnDef.aggregationFn === "auto" ? column.getAutoAggregationFn() : (_table$options$aggreg = (_table$options$aggreg2 = table.options.aggregationFns) == null ? void 0 : _table$options$aggreg2[column.columnDef.aggregationFn]) != null ? _table$options$aggreg : aggregationFns[column.columnDef.aggregationFn];
    };
  },
  createTable: (table) => {
    table.setGrouping = (updater) => table.options.onGroupingChange == null ? void 0 : table.options.onGroupingChange(updater);
    table.resetGrouping = (defaultState) => {
      var _table$initialState$g, _table$initialState;
      table.setGrouping(defaultState ? [] : (_table$initialState$g = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.grouping) != null ? _table$initialState$g : []);
    };
    table.getPreGroupedRowModel = () => table.getFilteredRowModel();
    table.getGroupedRowModel = () => {
      if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
        table._getGroupedRowModel = table.options.getGroupedRowModel(table);
      }
      if (table.options.manualGrouping || !table._getGroupedRowModel) {
        return table.getPreGroupedRowModel();
      }
      return table._getGroupedRowModel();
    };
  },
  createRow: (row, table) => {
    row.getIsGrouped = () => !!row.groupingColumnId;
    row.getGroupingValue = (columnId) => {
      if (row._groupingValuesCache.hasOwnProperty(columnId)) {
        return row._groupingValuesCache[columnId];
      }
      const column = table.getColumn(columnId);
      if (!(column != null && column.columnDef.getGroupingValue)) {
        return row.getValue(columnId);
      }
      row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(row.original);
      return row._groupingValuesCache[columnId];
    };
    row._groupingValuesCache = {};
  },
  createCell: (cell, column, row, table) => {
    cell.getIsGrouped = () => column.getIsGrouped() && column.id === row.groupingColumnId;
    cell.getIsPlaceholder = () => !cell.getIsGrouped() && column.getIsGrouped();
    cell.getIsAggregated = () => {
      var _row$subRows;
      return !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!((_row$subRows = row.subRows) != null && _row$subRows.length);
    };
  }
};
function orderColumns(leafColumns, grouping, groupedColumnMode) {
  if (!(grouping != null && grouping.length) || !groupedColumnMode) {
    return leafColumns;
  }
  const nonGroupingColumns = leafColumns.filter((col) => !grouping.includes(col.id));
  if (groupedColumnMode === "remove") {
    return nonGroupingColumns;
  }
  const groupingColumns = grouping.map((g) => leafColumns.find((col) => col.id === g)).filter(Boolean);
  return [...groupingColumns, ...nonGroupingColumns];
}
const ColumnOrdering = {
  getInitialState: (state) => {
    return {
      columnOrder: [],
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnOrderChange: makeStateUpdater("columnOrder", table)
    };
  },
  createColumn: (column, table) => {
    column.getIndex = memo((position) => [_getVisibleLeafColumns(table, position)], (columns) => columns.findIndex((d) => d.id === column.id), getMemoOptions(table.options, "debugColumns"));
    column.getIsFirstColumn = (position) => {
      var _columns$;
      const columns = _getVisibleLeafColumns(table, position);
      return ((_columns$ = columns[0]) == null ? void 0 : _columns$.id) === column.id;
    };
    column.getIsLastColumn = (position) => {
      var _columns;
      const columns = _getVisibleLeafColumns(table, position);
      return ((_columns = columns[columns.length - 1]) == null ? void 0 : _columns.id) === column.id;
    };
  },
  createTable: (table) => {
    table.setColumnOrder = (updater) => table.options.onColumnOrderChange == null ? void 0 : table.options.onColumnOrderChange(updater);
    table.resetColumnOrder = (defaultState) => {
      var _table$initialState$c;
      table.setColumnOrder(defaultState ? [] : (_table$initialState$c = table.initialState.columnOrder) != null ? _table$initialState$c : []);
    };
    table._getOrderColumnsFn = memo(() => [table.getState().columnOrder, table.getState().grouping, table.options.groupedColumnMode], (columnOrder, grouping, groupedColumnMode) => (columns) => {
      let orderedColumns = [];
      if (!(columnOrder != null && columnOrder.length)) {
        orderedColumns = columns;
      } else {
        const columnOrderCopy = [...columnOrder];
        const columnsCopy = [...columns];
        while (columnsCopy.length && columnOrderCopy.length) {
          const targetColumnId = columnOrderCopy.shift();
          const foundIndex = columnsCopy.findIndex((d) => d.id === targetColumnId);
          if (foundIndex > -1) {
            orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]);
          }
        }
        orderedColumns = [...orderedColumns, ...columnsCopy];
      }
      return orderColumns(orderedColumns, grouping, groupedColumnMode);
    }, getMemoOptions(table.options, "debugTable"));
  }
};
const getDefaultColumnPinningState = () => ({
  left: [],
  right: []
});
const ColumnPinning = {
  getInitialState: (state) => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnPinningChange: makeStateUpdater("columnPinning", table)
    };
  },
  createColumn: (column, table) => {
    column.pin = (position) => {
      const columnIds = column.getLeafColumns().map((d) => d.id).filter(Boolean);
      table.setColumnPinning((old) => {
        var _old$left3, _old$right3;
        if (position === "right") {
          var _old$left, _old$right;
          return {
            left: ((_old$left = old == null ? void 0 : old.left) != null ? _old$left : []).filter((d) => !(columnIds != null && columnIds.includes(d))),
            right: [...((_old$right = old == null ? void 0 : old.right) != null ? _old$right : []).filter((d) => !(columnIds != null && columnIds.includes(d))), ...columnIds]
          };
        }
        if (position === "left") {
          var _old$left2, _old$right2;
          return {
            left: [...((_old$left2 = old == null ? void 0 : old.left) != null ? _old$left2 : []).filter((d) => !(columnIds != null && columnIds.includes(d))), ...columnIds],
            right: ((_old$right2 = old == null ? void 0 : old.right) != null ? _old$right2 : []).filter((d) => !(columnIds != null && columnIds.includes(d)))
          };
        }
        return {
          left: ((_old$left3 = old == null ? void 0 : old.left) != null ? _old$left3 : []).filter((d) => !(columnIds != null && columnIds.includes(d))),
          right: ((_old$right3 = old == null ? void 0 : old.right) != null ? _old$right3 : []).filter((d) => !(columnIds != null && columnIds.includes(d)))
        };
      });
    };
    column.getCanPin = () => {
      const leafColumns = column.getLeafColumns();
      return leafColumns.some((d) => {
        var _d$columnDef$enablePi, _ref, _table$options$enable;
        return ((_d$columnDef$enablePi = d.columnDef.enablePinning) != null ? _d$columnDef$enablePi : true) && ((_ref = (_table$options$enable = table.options.enableColumnPinning) != null ? _table$options$enable : table.options.enablePinning) != null ? _ref : true);
      });
    };
    column.getIsPinned = () => {
      const leafColumnIds = column.getLeafColumns().map((d) => d.id);
      const {
        left,
        right
      } = table.getState().columnPinning;
      const isLeft = leafColumnIds.some((d) => left == null ? void 0 : left.includes(d));
      const isRight = leafColumnIds.some((d) => right == null ? void 0 : right.includes(d));
      return isLeft ? "left" : isRight ? "right" : false;
    };
    column.getPinnedIndex = () => {
      var _table$getState$colum, _table$getState$colum2;
      const position = column.getIsPinned();
      return position ? (_table$getState$colum = (_table$getState$colum2 = table.getState().columnPinning) == null || (_table$getState$colum2 = _table$getState$colum2[position]) == null ? void 0 : _table$getState$colum2.indexOf(column.id)) != null ? _table$getState$colum : -1 : 0;
    };
  },
  createRow: (row, table) => {
    row.getCenterVisibleCells = memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allCells, left, right) => {
      const leftAndRight = [...left != null ? left : [], ...right != null ? right : []];
      return allCells.filter((d) => !leftAndRight.includes(d.column.id));
    }, getMemoOptions(table.options, "debugRows"));
    row.getLeftVisibleCells = memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left], (allCells, left) => {
      const cells = (left != null ? left : []).map((columnId) => allCells.find((cell) => cell.column.id === columnId)).filter(Boolean).map((d) => ({
        ...d,
        position: "left"
      }));
      return cells;
    }, getMemoOptions(table.options, "debugRows"));
    row.getRightVisibleCells = memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.right], (allCells, right) => {
      const cells = (right != null ? right : []).map((columnId) => allCells.find((cell) => cell.column.id === columnId)).filter(Boolean).map((d) => ({
        ...d,
        position: "right"
      }));
      return cells;
    }, getMemoOptions(table.options, "debugRows"));
  },
  createTable: (table) => {
    table.setColumnPinning = (updater) => table.options.onColumnPinningChange == null ? void 0 : table.options.onColumnPinningChange(updater);
    table.resetColumnPinning = (defaultState) => {
      var _table$initialState$c, _table$initialState;
      return table.setColumnPinning(defaultState ? getDefaultColumnPinningState() : (_table$initialState$c = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnPinning) != null ? _table$initialState$c : getDefaultColumnPinningState());
    };
    table.getIsSomeColumnsPinned = (position) => {
      var _pinningState$positio;
      const pinningState = table.getState().columnPinning;
      if (!position) {
        var _pinningState$left, _pinningState$right;
        return Boolean(((_pinningState$left = pinningState.left) == null ? void 0 : _pinningState$left.length) || ((_pinningState$right = pinningState.right) == null ? void 0 : _pinningState$right.length));
      }
      return Boolean((_pinningState$positio = pinningState[position]) == null ? void 0 : _pinningState$positio.length);
    };
    table.getLeftLeafColumns = memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left], (allColumns, left) => {
      return (left != null ? left : []).map((columnId) => allColumns.find((column) => column.id === columnId)).filter(Boolean);
    }, getMemoOptions(table.options, "debugColumns"));
    table.getRightLeafColumns = memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.right], (allColumns, right) => {
      return (right != null ? right : []).map((columnId) => allColumns.find((column) => column.id === columnId)).filter(Boolean);
    }, getMemoOptions(table.options, "debugColumns"));
    table.getCenterLeafColumns = memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, left, right) => {
      const leftAndRight = [...left != null ? left : [], ...right != null ? right : []];
      return allColumns.filter((d) => !leftAndRight.includes(d.id));
    }, getMemoOptions(table.options, "debugColumns"));
  }
};
function safelyAccessDocument(_document) {
  return _document || (typeof document !== "undefined" ? document : null);
}
const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER
};
const getDefaultColumnSizingInfoState = () => ({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: []
});
const ColumnSizing = {
  getDefaultColumnDef: () => {
    return defaultColumnSizing;
  },
  getInitialState: (state) => {
    return {
      columnSizing: {},
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      columnResizeMode: "onEnd",
      columnResizeDirection: "ltr",
      onColumnSizingChange: makeStateUpdater("columnSizing", table),
      onColumnSizingInfoChange: makeStateUpdater("columnSizingInfo", table)
    };
  },
  createColumn: (column, table) => {
    column.getSize = () => {
      var _column$columnDef$min, _ref, _column$columnDef$max;
      const columnSize = table.getState().columnSizing[column.id];
      return Math.min(Math.max((_column$columnDef$min = column.columnDef.minSize) != null ? _column$columnDef$min : defaultColumnSizing.minSize, (_ref = columnSize != null ? columnSize : column.columnDef.size) != null ? _ref : defaultColumnSizing.size), (_column$columnDef$max = column.columnDef.maxSize) != null ? _column$columnDef$max : defaultColumnSizing.maxSize);
    };
    column.getStart = memo((position) => [position, _getVisibleLeafColumns(table, position), table.getState().columnSizing], (position, columns) => columns.slice(0, column.getIndex(position)).reduce((sum2, column2) => sum2 + column2.getSize(), 0), getMemoOptions(table.options, "debugColumns"));
    column.getAfter = memo((position) => [position, _getVisibleLeafColumns(table, position), table.getState().columnSizing], (position, columns) => columns.slice(column.getIndex(position) + 1).reduce((sum2, column2) => sum2 + column2.getSize(), 0), getMemoOptions(table.options, "debugColumns"));
    column.resetSize = () => {
      table.setColumnSizing((_ref2) => {
        let {
          [column.id]: _,
          ...rest
        } = _ref2;
        return rest;
      });
    };
    column.getCanResize = () => {
      var _column$columnDef$ena, _table$options$enable;
      return ((_column$columnDef$ena = column.columnDef.enableResizing) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableColumnResizing) != null ? _table$options$enable : true);
    };
    column.getIsResizing = () => {
      return table.getState().columnSizingInfo.isResizingColumn === column.id;
    };
  },
  createHeader: (header, table) => {
    header.getSize = () => {
      let sum2 = 0;
      const recurse = (header2) => {
        if (header2.subHeaders.length) {
          header2.subHeaders.forEach(recurse);
        } else {
          var _header$column$getSiz;
          sum2 += (_header$column$getSiz = header2.column.getSize()) != null ? _header$column$getSiz : 0;
        }
      };
      recurse(header);
      return sum2;
    };
    header.getStart = () => {
      if (header.index > 0) {
        const prevSiblingHeader = header.headerGroup.headers[header.index - 1];
        return prevSiblingHeader.getStart() + prevSiblingHeader.getSize();
      }
      return 0;
    };
    header.getResizeHandler = (_contextDocument) => {
      const column = table.getColumn(header.column.id);
      const canResize = column == null ? void 0 : column.getCanResize();
      return (e) => {
        if (!column || !canResize) {
          return;
        }
        e.persist == null || e.persist();
        if (isTouchStartEvent(e)) {
          if (e.touches && e.touches.length > 1) {
            return;
          }
        }
        const startSize = header.getSize();
        const columnSizingStart = header ? header.getLeafHeaders().map((d) => [d.column.id, d.column.getSize()]) : [[column.id, column.getSize()]];
        const clientX = isTouchStartEvent(e) ? Math.round(e.touches[0].clientX) : e.clientX;
        const newColumnSizing = {};
        const updateOffset = (eventType, clientXPos) => {
          if (typeof clientXPos !== "number") {
            return;
          }
          table.setColumnSizingInfo((old) => {
            var _old$startOffset, _old$startSize;
            const deltaDirection = table.options.columnResizeDirection === "rtl" ? -1 : 1;
            const deltaOffset = (clientXPos - ((_old$startOffset = old == null ? void 0 : old.startOffset) != null ? _old$startOffset : 0)) * deltaDirection;
            const deltaPercentage = Math.max(deltaOffset / ((_old$startSize = old == null ? void 0 : old.startSize) != null ? _old$startSize : 0), -0.999999);
            old.columnSizingStart.forEach((_ref3) => {
              let [columnId, headerSize] = _ref3;
              newColumnSizing[columnId] = Math.round(Math.max(headerSize + headerSize * deltaPercentage, 0) * 100) / 100;
            });
            return {
              ...old,
              deltaOffset,
              deltaPercentage
            };
          });
          if (table.options.columnResizeMode === "onChange" || eventType === "end") {
            table.setColumnSizing((old) => ({
              ...old,
              ...newColumnSizing
            }));
          }
        };
        const onMove = (clientXPos) => updateOffset("move", clientXPos);
        const onEnd = (clientXPos) => {
          updateOffset("end", clientXPos);
          table.setColumnSizingInfo((old) => ({
            ...old,
            isResizingColumn: false,
            startOffset: null,
            startSize: null,
            deltaOffset: null,
            deltaPercentage: null,
            columnSizingStart: []
          }));
        };
        const contextDocument = safelyAccessDocument(_contextDocument);
        const mouseEvents = {
          moveHandler: (e2) => onMove(e2.clientX),
          upHandler: (e2) => {
            contextDocument == null || contextDocument.removeEventListener("mousemove", mouseEvents.moveHandler);
            contextDocument == null || contextDocument.removeEventListener("mouseup", mouseEvents.upHandler);
            onEnd(e2.clientX);
          }
        };
        const touchEvents = {
          moveHandler: (e2) => {
            if (e2.cancelable) {
              e2.preventDefault();
              e2.stopPropagation();
            }
            onMove(e2.touches[0].clientX);
            return false;
          },
          upHandler: (e2) => {
            var _e$touches$;
            contextDocument == null || contextDocument.removeEventListener("touchmove", touchEvents.moveHandler);
            contextDocument == null || contextDocument.removeEventListener("touchend", touchEvents.upHandler);
            if (e2.cancelable) {
              e2.preventDefault();
              e2.stopPropagation();
            }
            onEnd((_e$touches$ = e2.touches[0]) == null ? void 0 : _e$touches$.clientX);
          }
        };
        const passiveIfSupported = passiveEventSupported() ? {
          passive: false
        } : false;
        if (isTouchStartEvent(e)) {
          contextDocument == null || contextDocument.addEventListener("touchmove", touchEvents.moveHandler, passiveIfSupported);
          contextDocument == null || contextDocument.addEventListener("touchend", touchEvents.upHandler, passiveIfSupported);
        } else {
          contextDocument == null || contextDocument.addEventListener("mousemove", mouseEvents.moveHandler, passiveIfSupported);
          contextDocument == null || contextDocument.addEventListener("mouseup", mouseEvents.upHandler, passiveIfSupported);
        }
        table.setColumnSizingInfo((old) => ({
          ...old,
          startOffset: clientX,
          startSize,
          deltaOffset: 0,
          deltaPercentage: 0,
          columnSizingStart,
          isResizingColumn: column.id
        }));
      };
    };
  },
  createTable: (table) => {
    table.setColumnSizing = (updater) => table.options.onColumnSizingChange == null ? void 0 : table.options.onColumnSizingChange(updater);
    table.setColumnSizingInfo = (updater) => table.options.onColumnSizingInfoChange == null ? void 0 : table.options.onColumnSizingInfoChange(updater);
    table.resetColumnSizing = (defaultState) => {
      var _table$initialState$c;
      table.setColumnSizing(defaultState ? {} : (_table$initialState$c = table.initialState.columnSizing) != null ? _table$initialState$c : {});
    };
    table.resetHeaderSizeInfo = (defaultState) => {
      var _table$initialState$c2;
      table.setColumnSizingInfo(defaultState ? getDefaultColumnSizingInfoState() : (_table$initialState$c2 = table.initialState.columnSizingInfo) != null ? _table$initialState$c2 : getDefaultColumnSizingInfoState());
    };
    table.getTotalSize = () => {
      var _table$getHeaderGroup, _table$getHeaderGroup2;
      return (_table$getHeaderGroup = (_table$getHeaderGroup2 = table.getHeaderGroups()[0]) == null ? void 0 : _table$getHeaderGroup2.headers.reduce((sum2, header) => {
        return sum2 + header.getSize();
      }, 0)) != null ? _table$getHeaderGroup : 0;
    };
    table.getLeftTotalSize = () => {
      var _table$getLeftHeaderG, _table$getLeftHeaderG2;
      return (_table$getLeftHeaderG = (_table$getLeftHeaderG2 = table.getLeftHeaderGroups()[0]) == null ? void 0 : _table$getLeftHeaderG2.headers.reduce((sum2, header) => {
        return sum2 + header.getSize();
      }, 0)) != null ? _table$getLeftHeaderG : 0;
    };
    table.getCenterTotalSize = () => {
      var _table$getCenterHeade, _table$getCenterHeade2;
      return (_table$getCenterHeade = (_table$getCenterHeade2 = table.getCenterHeaderGroups()[0]) == null ? void 0 : _table$getCenterHeade2.headers.reduce((sum2, header) => {
        return sum2 + header.getSize();
      }, 0)) != null ? _table$getCenterHeade : 0;
    };
    table.getRightTotalSize = () => {
      var _table$getRightHeader, _table$getRightHeader2;
      return (_table$getRightHeader = (_table$getRightHeader2 = table.getRightHeaderGroups()[0]) == null ? void 0 : _table$getRightHeader2.headers.reduce((sum2, header) => {
        return sum2 + header.getSize();
      }, 0)) != null ? _table$getRightHeader : 0;
    };
  }
};
let passiveSupported$1 = null;
function passiveEventSupported() {
  if (typeof passiveSupported$1 === "boolean") return passiveSupported$1;
  let supported = false;
  try {
    const options = {
      get passive() {
        supported = true;
        return false;
      }
    };
    const noop2 = () => {
    };
    window.addEventListener("test", noop2, options);
    window.removeEventListener("test", noop2);
  } catch (err) {
    supported = false;
  }
  passiveSupported$1 = supported;
  return passiveSupported$1;
}
function isTouchStartEvent(e) {
  return e.type === "touchstart";
}
const ColumnVisibility = {
  getInitialState: (state) => {
    return {
      columnVisibility: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnVisibilityChange: makeStateUpdater("columnVisibility", table)
    };
  },
  createColumn: (column, table) => {
    column.toggleVisibility = (value) => {
      if (column.getCanHide()) {
        table.setColumnVisibility((old) => ({
          ...old,
          [column.id]: value != null ? value : !column.getIsVisible()
        }));
      }
    };
    column.getIsVisible = () => {
      var _ref, _table$getState$colum;
      const childColumns = column.columns;
      return (_ref = childColumns.length ? childColumns.some((c) => c.getIsVisible()) : (_table$getState$colum = table.getState().columnVisibility) == null ? void 0 : _table$getState$colum[column.id]) != null ? _ref : true;
    };
    column.getCanHide = () => {
      var _column$columnDef$ena, _table$options$enable;
      return ((_column$columnDef$ena = column.columnDef.enableHiding) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableHiding) != null ? _table$options$enable : true);
    };
    column.getToggleVisibilityHandler = () => {
      return (e) => {
        column.toggleVisibility == null || column.toggleVisibility(e.target.checked);
      };
    };
  },
  createRow: (row, table) => {
    row._getAllVisibleCells = memo(() => [row.getAllCells(), table.getState().columnVisibility], (cells) => {
      return cells.filter((cell) => cell.column.getIsVisible());
    }, getMemoOptions(table.options, "debugRows"));
    row.getVisibleCells = memo(() => [row.getLeftVisibleCells(), row.getCenterVisibleCells(), row.getRightVisibleCells()], (left, center, right) => [...left, ...center, ...right], getMemoOptions(table.options, "debugRows"));
  },
  createTable: (table) => {
    const makeVisibleColumnsMethod = (key, getColumns) => {
      return memo(() => [getColumns(), getColumns().filter((d) => d.getIsVisible()).map((d) => d.id).join("_")], (columns) => {
        return columns.filter((d) => d.getIsVisible == null ? void 0 : d.getIsVisible());
      }, getMemoOptions(table.options, "debugColumns"));
    };
    table.getVisibleFlatColumns = makeVisibleColumnsMethod("getVisibleFlatColumns", () => table.getAllFlatColumns());
    table.getVisibleLeafColumns = makeVisibleColumnsMethod("getVisibleLeafColumns", () => table.getAllLeafColumns());
    table.getLeftVisibleLeafColumns = makeVisibleColumnsMethod("getLeftVisibleLeafColumns", () => table.getLeftLeafColumns());
    table.getRightVisibleLeafColumns = makeVisibleColumnsMethod("getRightVisibleLeafColumns", () => table.getRightLeafColumns());
    table.getCenterVisibleLeafColumns = makeVisibleColumnsMethod("getCenterVisibleLeafColumns", () => table.getCenterLeafColumns());
    table.setColumnVisibility = (updater) => table.options.onColumnVisibilityChange == null ? void 0 : table.options.onColumnVisibilityChange(updater);
    table.resetColumnVisibility = (defaultState) => {
      var _table$initialState$c;
      table.setColumnVisibility(defaultState ? {} : (_table$initialState$c = table.initialState.columnVisibility) != null ? _table$initialState$c : {});
    };
    table.toggleAllColumnsVisible = (value) => {
      var _value;
      value = (_value = value) != null ? _value : !table.getIsAllColumnsVisible();
      table.setColumnVisibility(table.getAllLeafColumns().reduce((obj, column) => ({
        ...obj,
        [column.id]: !value ? !(column.getCanHide != null && column.getCanHide()) : value
      }), {}));
    };
    table.getIsAllColumnsVisible = () => !table.getAllLeafColumns().some((column) => !(column.getIsVisible != null && column.getIsVisible()));
    table.getIsSomeColumnsVisible = () => table.getAllLeafColumns().some((column) => column.getIsVisible == null ? void 0 : column.getIsVisible());
    table.getToggleAllColumnsVisibilityHandler = () => {
      return (e) => {
        var _target;
        table.toggleAllColumnsVisible((_target = e.target) == null ? void 0 : _target.checked);
      };
    };
  }
};
function _getVisibleLeafColumns(table, position) {
  return !position ? table.getVisibleLeafColumns() : position === "center" ? table.getCenterVisibleLeafColumns() : position === "left" ? table.getLeftVisibleLeafColumns() : table.getRightVisibleLeafColumns();
}
const GlobalFaceting = {
  createTable: (table) => {
    table._getGlobalFacetedRowModel = table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, "__global__");
    table.getGlobalFacetedRowModel = () => {
      if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
        return table.getPreFilteredRowModel();
      }
      return table._getGlobalFacetedRowModel();
    };
    table._getGlobalFacetedUniqueValues = table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, "__global__");
    table.getGlobalFacetedUniqueValues = () => {
      if (!table._getGlobalFacetedUniqueValues) {
        return /* @__PURE__ */ new Map();
      }
      return table._getGlobalFacetedUniqueValues();
    };
    table._getGlobalFacetedMinMaxValues = table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, "__global__");
    table.getGlobalFacetedMinMaxValues = () => {
      if (!table._getGlobalFacetedMinMaxValues) {
        return;
      }
      return table._getGlobalFacetedMinMaxValues();
    };
  }
};
const GlobalFiltering = {
  getInitialState: (state) => {
    return {
      globalFilter: void 0,
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onGlobalFilterChange: makeStateUpdater("globalFilter", table),
      globalFilterFn: "auto",
      getColumnCanGlobalFilter: (column) => {
        var _table$getCoreRowMode;
        const value = (_table$getCoreRowMode = table.getCoreRowModel().flatRows[0]) == null || (_table$getCoreRowMode = _table$getCoreRowMode._getAllCellsByColumnId()[column.id]) == null ? void 0 : _table$getCoreRowMode.getValue();
        return typeof value === "string" || typeof value === "number";
      }
    };
  },
  createColumn: (column, table) => {
    column.getCanGlobalFilter = () => {
      var _column$columnDef$ena, _table$options$enable, _table$options$enable2, _table$options$getCol;
      return ((_column$columnDef$ena = column.columnDef.enableGlobalFilter) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableGlobalFilter) != null ? _table$options$enable : true) && ((_table$options$enable2 = table.options.enableFilters) != null ? _table$options$enable2 : true) && ((_table$options$getCol = table.options.getColumnCanGlobalFilter == null ? void 0 : table.options.getColumnCanGlobalFilter(column)) != null ? _table$options$getCol : true) && !!column.accessorFn;
    };
  },
  createTable: (table) => {
    table.getGlobalAutoFilterFn = () => {
      return filterFns.includesString;
    };
    table.getGlobalFilterFn = () => {
      var _table$options$filter, _table$options$filter2;
      const {
        globalFilterFn
      } = table.options;
      return isFunction$2(globalFilterFn) ? globalFilterFn : globalFilterFn === "auto" ? table.getGlobalAutoFilterFn() : (_table$options$filter = (_table$options$filter2 = table.options.filterFns) == null ? void 0 : _table$options$filter2[globalFilterFn]) != null ? _table$options$filter : filterFns[globalFilterFn];
    };
    table.setGlobalFilter = (updater) => {
      table.options.onGlobalFilterChange == null || table.options.onGlobalFilterChange(updater);
    };
    table.resetGlobalFilter = (defaultState) => {
      table.setGlobalFilter(defaultState ? void 0 : table.initialState.globalFilter);
    };
  }
};
const RowExpanding = {
  getInitialState: (state) => {
    return {
      expanded: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onExpandedChange: makeStateUpdater("expanded", table),
      paginateExpandedRows: true
    };
  },
  createTable: (table) => {
    let registered = false;
    let queued = false;
    table._autoResetExpanded = () => {
      var _ref, _table$options$autoRe;
      if (!registered) {
        table._queue(() => {
          registered = true;
        });
        return;
      }
      if ((_ref = (_table$options$autoRe = table.options.autoResetAll) != null ? _table$options$autoRe : table.options.autoResetExpanded) != null ? _ref : !table.options.manualExpanding) {
        if (queued) return;
        queued = true;
        table._queue(() => {
          table.resetExpanded();
          queued = false;
        });
      }
    };
    table.setExpanded = (updater) => table.options.onExpandedChange == null ? void 0 : table.options.onExpandedChange(updater);
    table.toggleAllRowsExpanded = (expanded) => {
      if (expanded != null ? expanded : !table.getIsAllRowsExpanded()) {
        table.setExpanded(true);
      } else {
        table.setExpanded({});
      }
    };
    table.resetExpanded = (defaultState) => {
      var _table$initialState$e, _table$initialState;
      table.setExpanded(defaultState ? {} : (_table$initialState$e = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.expanded) != null ? _table$initialState$e : {});
    };
    table.getCanSomeRowsExpand = () => {
      return table.getPrePaginationRowModel().flatRows.some((row) => row.getCanExpand());
    };
    table.getToggleAllRowsExpandedHandler = () => {
      return (e) => {
        e.persist == null || e.persist();
        table.toggleAllRowsExpanded();
      };
    };
    table.getIsSomeRowsExpanded = () => {
      const expanded = table.getState().expanded;
      return expanded === true || Object.values(expanded).some(Boolean);
    };
    table.getIsAllRowsExpanded = () => {
      const expanded = table.getState().expanded;
      if (typeof expanded === "boolean") {
        return expanded === true;
      }
      if (!Object.keys(expanded).length) {
        return false;
      }
      if (table.getRowModel().flatRows.some((row) => !row.getIsExpanded())) {
        return false;
      }
      return true;
    };
    table.getExpandedDepth = () => {
      let maxDepth = 0;
      const rowIds = table.getState().expanded === true ? Object.keys(table.getRowModel().rowsById) : Object.keys(table.getState().expanded);
      rowIds.forEach((id) => {
        const splitId = id.split(".");
        maxDepth = Math.max(maxDepth, splitId.length);
      });
      return maxDepth;
    };
    table.getPreExpandedRowModel = () => table.getSortedRowModel();
    table.getExpandedRowModel = () => {
      if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
        table._getExpandedRowModel = table.options.getExpandedRowModel(table);
      }
      if (table.options.manualExpanding || !table._getExpandedRowModel) {
        return table.getPreExpandedRowModel();
      }
      return table._getExpandedRowModel();
    };
  },
  createRow: (row, table) => {
    row.toggleExpanded = (expanded) => {
      table.setExpanded((old) => {
        var _expanded;
        const exists = old === true ? true : !!(old != null && old[row.id]);
        let oldExpanded = {};
        if (old === true) {
          Object.keys(table.getRowModel().rowsById).forEach((rowId) => {
            oldExpanded[rowId] = true;
          });
        } else {
          oldExpanded = old;
        }
        expanded = (_expanded = expanded) != null ? _expanded : !exists;
        if (!exists && expanded) {
          return {
            ...oldExpanded,
            [row.id]: true
          };
        }
        if (exists && !expanded) {
          const {
            [row.id]: _,
            ...rest
          } = oldExpanded;
          return rest;
        }
        return old;
      });
    };
    row.getIsExpanded = () => {
      var _table$options$getIsR;
      const expanded = table.getState().expanded;
      return !!((_table$options$getIsR = table.options.getIsRowExpanded == null ? void 0 : table.options.getIsRowExpanded(row)) != null ? _table$options$getIsR : expanded === true || (expanded == null ? void 0 : expanded[row.id]));
    };
    row.getCanExpand = () => {
      var _table$options$getRow, _table$options$enable, _row$subRows;
      return (_table$options$getRow = table.options.getRowCanExpand == null ? void 0 : table.options.getRowCanExpand(row)) != null ? _table$options$getRow : ((_table$options$enable = table.options.enableExpanding) != null ? _table$options$enable : true) && !!((_row$subRows = row.subRows) != null && _row$subRows.length);
    };
    row.getIsAllParentsExpanded = () => {
      let isFullyExpanded = true;
      let currentRow = row;
      while (isFullyExpanded && currentRow.parentId) {
        currentRow = table.getRow(currentRow.parentId, true);
        isFullyExpanded = currentRow.getIsExpanded();
      }
      return isFullyExpanded;
    };
    row.getToggleExpandedHandler = () => {
      const canExpand = row.getCanExpand();
      return () => {
        if (!canExpand) return;
        row.toggleExpanded();
      };
    };
  }
};
const defaultPageIndex = 0;
const defaultPageSize = 10;
const getDefaultPaginationState = () => ({
  pageIndex: defaultPageIndex,
  pageSize: defaultPageSize
});
const RowPagination = {
  getInitialState: (state) => {
    return {
      ...state,
      pagination: {
        ...getDefaultPaginationState(),
        ...state == null ? void 0 : state.pagination
      }
    };
  },
  getDefaultOptions: (table) => {
    return {
      onPaginationChange: makeStateUpdater("pagination", table)
    };
  },
  createTable: (table) => {
    let registered = false;
    let queued = false;
    table._autoResetPageIndex = () => {
      var _ref, _table$options$autoRe;
      if (!registered) {
        table._queue(() => {
          registered = true;
        });
        return;
      }
      if ((_ref = (_table$options$autoRe = table.options.autoResetAll) != null ? _table$options$autoRe : table.options.autoResetPageIndex) != null ? _ref : !table.options.manualPagination) {
        if (queued) return;
        queued = true;
        table._queue(() => {
          table.resetPageIndex();
          queued = false;
        });
      }
    };
    table.setPagination = (updater) => {
      const safeUpdater = (old) => {
        let newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onPaginationChange == null ? void 0 : table.options.onPaginationChange(safeUpdater);
    };
    table.resetPagination = (defaultState) => {
      var _table$initialState$p;
      table.setPagination(defaultState ? getDefaultPaginationState() : (_table$initialState$p = table.initialState.pagination) != null ? _table$initialState$p : getDefaultPaginationState());
    };
    table.setPageIndex = (updater) => {
      table.setPagination((old) => {
        let pageIndex = functionalUpdate(updater, old.pageIndex);
        const maxPageIndex = typeof table.options.pageCount === "undefined" || table.options.pageCount === -1 ? Number.MAX_SAFE_INTEGER : table.options.pageCount - 1;
        pageIndex = Math.max(0, Math.min(pageIndex, maxPageIndex));
        return {
          ...old,
          pageIndex
        };
      });
    };
    table.resetPageIndex = (defaultState) => {
      var _table$initialState$p2, _table$initialState;
      table.setPageIndex(defaultState ? defaultPageIndex : (_table$initialState$p2 = (_table$initialState = table.initialState) == null || (_table$initialState = _table$initialState.pagination) == null ? void 0 : _table$initialState.pageIndex) != null ? _table$initialState$p2 : defaultPageIndex);
    };
    table.resetPageSize = (defaultState) => {
      var _table$initialState$p3, _table$initialState2;
      table.setPageSize(defaultState ? defaultPageSize : (_table$initialState$p3 = (_table$initialState2 = table.initialState) == null || (_table$initialState2 = _table$initialState2.pagination) == null ? void 0 : _table$initialState2.pageSize) != null ? _table$initialState$p3 : defaultPageSize);
    };
    table.setPageSize = (updater) => {
      table.setPagination((old) => {
        const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize));
        const topRowIndex = old.pageSize * old.pageIndex;
        const pageIndex = Math.floor(topRowIndex / pageSize);
        return {
          ...old,
          pageIndex,
          pageSize
        };
      });
    };
    table.setPageCount = (updater) => table.setPagination((old) => {
      var _table$options$pageCo;
      let newPageCount = functionalUpdate(updater, (_table$options$pageCo = table.options.pageCount) != null ? _table$options$pageCo : -1);
      if (typeof newPageCount === "number") {
        newPageCount = Math.max(-1, newPageCount);
      }
      return {
        ...old,
        pageCount: newPageCount
      };
    });
    table.getPageOptions = memo(() => [table.getPageCount()], (pageCount) => {
      let pageOptions = [];
      if (pageCount && pageCount > 0) {
        pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i);
      }
      return pageOptions;
    }, getMemoOptions(table.options, "debugTable"));
    table.getCanPreviousPage = () => table.getState().pagination.pageIndex > 0;
    table.getCanNextPage = () => {
      const {
        pageIndex
      } = table.getState().pagination;
      const pageCount = table.getPageCount();
      if (pageCount === -1) {
        return true;
      }
      if (pageCount === 0) {
        return false;
      }
      return pageIndex < pageCount - 1;
    };
    table.previousPage = () => {
      return table.setPageIndex((old) => old - 1);
    };
    table.nextPage = () => {
      return table.setPageIndex((old) => {
        return old + 1;
      });
    };
    table.firstPage = () => {
      return table.setPageIndex(0);
    };
    table.lastPage = () => {
      return table.setPageIndex(table.getPageCount() - 1);
    };
    table.getPrePaginationRowModel = () => table.getExpandedRowModel();
    table.getPaginationRowModel = () => {
      if (!table._getPaginationRowModel && table.options.getPaginationRowModel) {
        table._getPaginationRowModel = table.options.getPaginationRowModel(table);
      }
      if (table.options.manualPagination || !table._getPaginationRowModel) {
        return table.getPrePaginationRowModel();
      }
      return table._getPaginationRowModel();
    };
    table.getPageCount = () => {
      var _table$options$pageCo2;
      return (_table$options$pageCo2 = table.options.pageCount) != null ? _table$options$pageCo2 : Math.ceil(table.getRowCount() / table.getState().pagination.pageSize);
    };
    table.getRowCount = () => {
      var _table$options$rowCou;
      return (_table$options$rowCou = table.options.rowCount) != null ? _table$options$rowCou : table.getPrePaginationRowModel().rows.length;
    };
  }
};
const getDefaultRowPinningState = () => ({
  top: [],
  bottom: []
});
const RowPinning = {
  getInitialState: (state) => {
    return {
      rowPinning: getDefaultRowPinningState(),
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onRowPinningChange: makeStateUpdater("rowPinning", table)
    };
  },
  createRow: (row, table) => {
    row.pin = (position, includeLeafRows, includeParentRows) => {
      const leafRowIds = includeLeafRows ? row.getLeafRows().map((_ref) => {
        let {
          id
        } = _ref;
        return id;
      }) : [];
      const parentRowIds = includeParentRows ? row.getParentRows().map((_ref2) => {
        let {
          id
        } = _ref2;
        return id;
      }) : [];
      const rowIds = /* @__PURE__ */ new Set([...parentRowIds, row.id, ...leafRowIds]);
      table.setRowPinning((old) => {
        var _old$top3, _old$bottom3;
        if (position === "bottom") {
          var _old$top, _old$bottom;
          return {
            top: ((_old$top = old == null ? void 0 : old.top) != null ? _old$top : []).filter((d) => !(rowIds != null && rowIds.has(d))),
            bottom: [...((_old$bottom = old == null ? void 0 : old.bottom) != null ? _old$bottom : []).filter((d) => !(rowIds != null && rowIds.has(d))), ...Array.from(rowIds)]
          };
        }
        if (position === "top") {
          var _old$top2, _old$bottom2;
          return {
            top: [...((_old$top2 = old == null ? void 0 : old.top) != null ? _old$top2 : []).filter((d) => !(rowIds != null && rowIds.has(d))), ...Array.from(rowIds)],
            bottom: ((_old$bottom2 = old == null ? void 0 : old.bottom) != null ? _old$bottom2 : []).filter((d) => !(rowIds != null && rowIds.has(d)))
          };
        }
        return {
          top: ((_old$top3 = old == null ? void 0 : old.top) != null ? _old$top3 : []).filter((d) => !(rowIds != null && rowIds.has(d))),
          bottom: ((_old$bottom3 = old == null ? void 0 : old.bottom) != null ? _old$bottom3 : []).filter((d) => !(rowIds != null && rowIds.has(d)))
        };
      });
    };
    row.getCanPin = () => {
      var _ref3;
      const {
        enableRowPinning,
        enablePinning
      } = table.options;
      if (typeof enableRowPinning === "function") {
        return enableRowPinning(row);
      }
      return (_ref3 = enableRowPinning != null ? enableRowPinning : enablePinning) != null ? _ref3 : true;
    };
    row.getIsPinned = () => {
      const rowIds = [row.id];
      const {
        top,
        bottom
      } = table.getState().rowPinning;
      const isTop = rowIds.some((d) => top == null ? void 0 : top.includes(d));
      const isBottom = rowIds.some((d) => bottom == null ? void 0 : bottom.includes(d));
      return isTop ? "top" : isBottom ? "bottom" : false;
    };
    row.getPinnedIndex = () => {
      var _ref4, _visiblePinnedRowIds$;
      const position = row.getIsPinned();
      if (!position) return -1;
      const visiblePinnedRowIds = (_ref4 = position === "top" ? table.getTopRows() : table.getBottomRows()) == null ? void 0 : _ref4.map((_ref5) => {
        let {
          id
        } = _ref5;
        return id;
      });
      return (_visiblePinnedRowIds$ = visiblePinnedRowIds == null ? void 0 : visiblePinnedRowIds.indexOf(row.id)) != null ? _visiblePinnedRowIds$ : -1;
    };
  },
  createTable: (table) => {
    table.setRowPinning = (updater) => table.options.onRowPinningChange == null ? void 0 : table.options.onRowPinningChange(updater);
    table.resetRowPinning = (defaultState) => {
      var _table$initialState$r, _table$initialState;
      return table.setRowPinning(defaultState ? getDefaultRowPinningState() : (_table$initialState$r = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.rowPinning) != null ? _table$initialState$r : getDefaultRowPinningState());
    };
    table.getIsSomeRowsPinned = (position) => {
      var _pinningState$positio;
      const pinningState = table.getState().rowPinning;
      if (!position) {
        var _pinningState$top, _pinningState$bottom;
        return Boolean(((_pinningState$top = pinningState.top) == null ? void 0 : _pinningState$top.length) || ((_pinningState$bottom = pinningState.bottom) == null ? void 0 : _pinningState$bottom.length));
      }
      return Boolean((_pinningState$positio = pinningState[position]) == null ? void 0 : _pinningState$positio.length);
    };
    table._getPinnedRows = (visibleRows, pinnedRowIds, position) => {
      var _table$options$keepPi;
      const rows = ((_table$options$keepPi = table.options.keepPinnedRows) != null ? _table$options$keepPi : true) ? (
        //get all rows that are pinned even if they would not be otherwise visible
        //account for expanded parent rows, but not pagination or filtering
        (pinnedRowIds != null ? pinnedRowIds : []).map((rowId) => {
          const row = table.getRow(rowId, true);
          return row.getIsAllParentsExpanded() ? row : null;
        })
      ) : (
        //else get only visible rows that are pinned
        (pinnedRowIds != null ? pinnedRowIds : []).map((rowId) => visibleRows.find((row) => row.id === rowId))
      );
      return rows.filter(Boolean).map((d) => ({
        ...d,
        position
      }));
    };
    table.getTopRows = memo(() => [table.getRowModel().rows, table.getState().rowPinning.top], (allRows, topPinnedRowIds) => table._getPinnedRows(allRows, topPinnedRowIds, "top"), getMemoOptions(table.options, "debugRows"));
    table.getBottomRows = memo(() => [table.getRowModel().rows, table.getState().rowPinning.bottom], (allRows, bottomPinnedRowIds) => table._getPinnedRows(allRows, bottomPinnedRowIds, "bottom"), getMemoOptions(table.options, "debugRows"));
    table.getCenterRows = memo(() => [table.getRowModel().rows, table.getState().rowPinning.top, table.getState().rowPinning.bottom], (allRows, top, bottom) => {
      const topAndBottom = /* @__PURE__ */ new Set([...top != null ? top : [], ...bottom != null ? bottom : []]);
      return allRows.filter((d) => !topAndBottom.has(d.id));
    }, getMemoOptions(table.options, "debugRows"));
  }
};
const RowSelection = {
  getInitialState: (state) => {
    return {
      rowSelection: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onRowSelectionChange: makeStateUpdater("rowSelection", table),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true
      // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
    };
  },
  createTable: (table) => {
    table.setRowSelection = (updater) => table.options.onRowSelectionChange == null ? void 0 : table.options.onRowSelectionChange(updater);
    table.resetRowSelection = (defaultState) => {
      var _table$initialState$r;
      return table.setRowSelection(defaultState ? {} : (_table$initialState$r = table.initialState.rowSelection) != null ? _table$initialState$r : {});
    };
    table.toggleAllRowsSelected = (value) => {
      table.setRowSelection((old) => {
        value = typeof value !== "undefined" ? value : !table.getIsAllRowsSelected();
        const rowSelection = {
          ...old
        };
        const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows;
        if (value) {
          preGroupedFlatRows.forEach((row) => {
            if (!row.getCanSelect()) {
              return;
            }
            rowSelection[row.id] = true;
          });
        } else {
          preGroupedFlatRows.forEach((row) => {
            delete rowSelection[row.id];
          });
        }
        return rowSelection;
      });
    };
    table.toggleAllPageRowsSelected = (value) => table.setRowSelection((old) => {
      const resolvedValue = typeof value !== "undefined" ? value : !table.getIsAllPageRowsSelected();
      const rowSelection = {
        ...old
      };
      table.getRowModel().rows.forEach((row) => {
        mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table);
      });
      return rowSelection;
    });
    table.getPreSelectedRowModel = () => table.getCoreRowModel();
    table.getSelectedRowModel = memo(() => [table.getState().rowSelection, table.getCoreRowModel()], (rowSelection, rowModel) => {
      if (!Object.keys(rowSelection).length) {
        return {
          rows: [],
          flatRows: [],
          rowsById: {}
        };
      }
      return selectRowsFn(table, rowModel);
    }, getMemoOptions(table.options, "debugTable"));
    table.getFilteredSelectedRowModel = memo(() => [table.getState().rowSelection, table.getFilteredRowModel()], (rowSelection, rowModel) => {
      if (!Object.keys(rowSelection).length) {
        return {
          rows: [],
          flatRows: [],
          rowsById: {}
        };
      }
      return selectRowsFn(table, rowModel);
    }, getMemoOptions(table.options, "debugTable"));
    table.getGroupedSelectedRowModel = memo(() => [table.getState().rowSelection, table.getSortedRowModel()], (rowSelection, rowModel) => {
      if (!Object.keys(rowSelection).length) {
        return {
          rows: [],
          flatRows: [],
          rowsById: {}
        };
      }
      return selectRowsFn(table, rowModel);
    }, getMemoOptions(table.options, "debugTable"));
    table.getIsAllRowsSelected = () => {
      const preGroupedFlatRows = table.getFilteredRowModel().flatRows;
      const {
        rowSelection
      } = table.getState();
      let isAllRowsSelected = Boolean(preGroupedFlatRows.length && Object.keys(rowSelection).length);
      if (isAllRowsSelected) {
        if (preGroupedFlatRows.some((row) => row.getCanSelect() && !rowSelection[row.id])) {
          isAllRowsSelected = false;
        }
      }
      return isAllRowsSelected;
    };
    table.getIsAllPageRowsSelected = () => {
      const paginationFlatRows = table.getPaginationRowModel().flatRows.filter((row) => row.getCanSelect());
      const {
        rowSelection
      } = table.getState();
      let isAllPageRowsSelected = !!paginationFlatRows.length;
      if (isAllPageRowsSelected && paginationFlatRows.some((row) => !rowSelection[row.id])) {
        isAllPageRowsSelected = false;
      }
      return isAllPageRowsSelected;
    };
    table.getIsSomeRowsSelected = () => {
      var _table$getState$rowSe;
      const totalSelected = Object.keys((_table$getState$rowSe = table.getState().rowSelection) != null ? _table$getState$rowSe : {}).length;
      return totalSelected > 0 && totalSelected < table.getFilteredRowModel().flatRows.length;
    };
    table.getIsSomePageRowsSelected = () => {
      const paginationFlatRows = table.getPaginationRowModel().flatRows;
      return table.getIsAllPageRowsSelected() ? false : paginationFlatRows.filter((row) => row.getCanSelect()).some((d) => d.getIsSelected() || d.getIsSomeSelected());
    };
    table.getToggleAllRowsSelectedHandler = () => {
      return (e) => {
        table.toggleAllRowsSelected(e.target.checked);
      };
    };
    table.getToggleAllPageRowsSelectedHandler = () => {
      return (e) => {
        table.toggleAllPageRowsSelected(e.target.checked);
      };
    };
  },
  createRow: (row, table) => {
    row.toggleSelected = (value, opts) => {
      const isSelected = row.getIsSelected();
      table.setRowSelection((old) => {
        var _opts$selectChildren;
        value = typeof value !== "undefined" ? value : !isSelected;
        if (row.getCanSelect() && isSelected === value) {
          return old;
        }
        const selectedRowIds = {
          ...old
        };
        mutateRowIsSelected(selectedRowIds, row.id, value, (_opts$selectChildren = opts == null ? void 0 : opts.selectChildren) != null ? _opts$selectChildren : true, table);
        return selectedRowIds;
      });
    };
    row.getIsSelected = () => {
      const {
        rowSelection
      } = table.getState();
      return isRowSelected(row, rowSelection);
    };
    row.getIsSomeSelected = () => {
      const {
        rowSelection
      } = table.getState();
      return isSubRowSelected(row, rowSelection) === "some";
    };
    row.getIsAllSubRowsSelected = () => {
      const {
        rowSelection
      } = table.getState();
      return isSubRowSelected(row, rowSelection) === "all";
    };
    row.getCanSelect = () => {
      var _table$options$enable;
      if (typeof table.options.enableRowSelection === "function") {
        return table.options.enableRowSelection(row);
      }
      return (_table$options$enable = table.options.enableRowSelection) != null ? _table$options$enable : true;
    };
    row.getCanSelectSubRows = () => {
      var _table$options$enable2;
      if (typeof table.options.enableSubRowSelection === "function") {
        return table.options.enableSubRowSelection(row);
      }
      return (_table$options$enable2 = table.options.enableSubRowSelection) != null ? _table$options$enable2 : true;
    };
    row.getCanMultiSelect = () => {
      var _table$options$enable3;
      if (typeof table.options.enableMultiRowSelection === "function") {
        return table.options.enableMultiRowSelection(row);
      }
      return (_table$options$enable3 = table.options.enableMultiRowSelection) != null ? _table$options$enable3 : true;
    };
    row.getToggleSelectedHandler = () => {
      const canSelect = row.getCanSelect();
      return (e) => {
        var _target;
        if (!canSelect) return;
        row.toggleSelected((_target = e.target) == null ? void 0 : _target.checked);
      };
    };
  }
};
const mutateRowIsSelected = (selectedRowIds, id, value, includeChildren, table) => {
  var _row$subRows;
  const row = table.getRow(id, true);
  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key]);
    }
    if (row.getCanSelect()) {
      selectedRowIds[id] = true;
    }
  } else {
    delete selectedRowIds[id];
  }
  if (includeChildren && (_row$subRows = row.subRows) != null && _row$subRows.length && row.getCanSelectSubRows()) {
    row.subRows.forEach((row2) => mutateRowIsSelected(selectedRowIds, row2.id, value, includeChildren, table));
  }
};
function selectRowsFn(table, rowModel) {
  const rowSelection = table.getState().rowSelection;
  const newSelectedFlatRows = [];
  const newSelectedRowsById = {};
  const recurseRows = function(rows, depth) {
    return rows.map((row) => {
      var _row$subRows2;
      const isSelected = isRowSelected(row, rowSelection);
      if (isSelected) {
        newSelectedFlatRows.push(row);
        newSelectedRowsById[row.id] = row;
      }
      if ((_row$subRows2 = row.subRows) != null && _row$subRows2.length) {
        row = {
          ...row,
          subRows: recurseRows(row.subRows)
        };
      }
      if (isSelected) {
        return row;
      }
    }).filter(Boolean);
  };
  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById
  };
}
function isRowSelected(row, selection) {
  var _selection$row$id;
  return (_selection$row$id = selection[row.id]) != null ? _selection$row$id : false;
}
function isSubRowSelected(row, selection, table) {
  var _row$subRows3;
  if (!((_row$subRows3 = row.subRows) != null && _row$subRows3.length)) return false;
  let allChildrenSelected = true;
  let someSelected = false;
  row.subRows.forEach((subRow) => {
    if (someSelected && !allChildrenSelected) {
      return;
    }
    if (subRow.getCanSelect()) {
      if (isRowSelected(subRow, selection)) {
        someSelected = true;
      } else {
        allChildrenSelected = false;
      }
    }
    if (subRow.subRows && subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow, selection);
      if (subRowChildrenSelected === "all") {
        someSelected = true;
      } else if (subRowChildrenSelected === "some") {
        someSelected = true;
        allChildrenSelected = false;
      } else {
        allChildrenSelected = false;
      }
    }
  });
  return allChildrenSelected ? "all" : someSelected ? "some" : false;
}
const reSplitAlphaNumeric = /([0-9]+)/gm;
const alphanumeric = (rowA, rowB, columnId) => {
  return compareAlphanumeric(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase());
};
const alphanumericCaseSensitive = (rowA, rowB, columnId) => {
  return compareAlphanumeric(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId)));
};
const text = (rowA, rowB, columnId) => {
  return compareBasic(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase());
};
const textCaseSensitive = (rowA, rowB, columnId) => {
  return compareBasic(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId)));
};
const datetime = (rowA, rowB, columnId) => {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);
  return a > b ? 1 : a < b ? -1 : 0;
};
const basic = (rowA, rowB, columnId) => {
  return compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));
};
function compareBasic(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
function toString(a) {
  if (typeof a === "number") {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return "";
    }
    return String(a);
  }
  if (typeof a === "string") {
    return a;
  }
  return "";
}
function compareAlphanumeric(aStr, bStr) {
  const a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
  const b = bStr.split(reSplitAlphaNumeric).filter(Boolean);
  while (a.length && b.length) {
    const aa = a.shift();
    const bb = b.shift();
    const an = parseInt(aa, 10);
    const bn = parseInt(bb, 10);
    const combo = [an, bn].sort();
    if (isNaN(combo[0])) {
      if (aa > bb) {
        return 1;
      }
      if (bb > aa) {
        return -1;
      }
      continue;
    }
    if (isNaN(combo[1])) {
      return isNaN(an) ? -1 : 1;
    }
    if (an > bn) {
      return 1;
    }
    if (bn > an) {
      return -1;
    }
  }
  return a.length - b.length;
}
const sortingFns = {
  alphanumeric,
  alphanumericCaseSensitive,
  text,
  textCaseSensitive,
  datetime,
  basic
};
const RowSorting = {
  getInitialState: (state) => {
    return {
      sorting: [],
      ...state
    };
  },
  getDefaultColumnDef: () => {
    return {
      sortingFn: "auto",
      sortUndefined: 1
    };
  },
  getDefaultOptions: (table) => {
    return {
      onSortingChange: makeStateUpdater("sorting", table),
      isMultiSortEvent: (e) => {
        return e.shiftKey;
      }
    };
  },
  createColumn: (column, table) => {
    column.getAutoSortingFn = () => {
      const firstRows = table.getFilteredRowModel().flatRows.slice(10);
      let isString = false;
      for (const row of firstRows) {
        const value = row == null ? void 0 : row.getValue(column.id);
        if (Object.prototype.toString.call(value) === "[object Date]") {
          return sortingFns.datetime;
        }
        if (typeof value === "string") {
          isString = true;
          if (value.split(reSplitAlphaNumeric).length > 1) {
            return sortingFns.alphanumeric;
          }
        }
      }
      if (isString) {
        return sortingFns.text;
      }
      return sortingFns.basic;
    };
    column.getAutoSortDir = () => {
      const firstRow = table.getFilteredRowModel().flatRows[0];
      const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
      if (typeof value === "string") {
        return "asc";
      }
      return "desc";
    };
    column.getSortingFn = () => {
      var _table$options$sortin, _table$options$sortin2;
      if (!column) {
        throw new Error();
      }
      return isFunction$2(column.columnDef.sortingFn) ? column.columnDef.sortingFn : column.columnDef.sortingFn === "auto" ? column.getAutoSortingFn() : (_table$options$sortin = (_table$options$sortin2 = table.options.sortingFns) == null ? void 0 : _table$options$sortin2[column.columnDef.sortingFn]) != null ? _table$options$sortin : sortingFns[column.columnDef.sortingFn];
    };
    column.toggleSorting = (desc, multi) => {
      const nextSortingOrder = column.getNextSortingOrder();
      const hasManualValue = typeof desc !== "undefined" && desc !== null;
      table.setSorting((old) => {
        const existingSorting = old == null ? void 0 : old.find((d) => d.id === column.id);
        const existingIndex = old == null ? void 0 : old.findIndex((d) => d.id === column.id);
        let newSorting = [];
        let sortAction;
        let nextDesc = hasManualValue ? desc : nextSortingOrder === "desc";
        if (old != null && old.length && column.getCanMultiSort() && multi) {
          if (existingSorting) {
            sortAction = "toggle";
          } else {
            sortAction = "add";
          }
        } else {
          if (old != null && old.length && existingIndex !== old.length - 1) {
            sortAction = "replace";
          } else if (existingSorting) {
            sortAction = "toggle";
          } else {
            sortAction = "replace";
          }
        }
        if (sortAction === "toggle") {
          if (!hasManualValue) {
            if (!nextSortingOrder) {
              sortAction = "remove";
            }
          }
        }
        if (sortAction === "add") {
          var _table$options$maxMul;
          newSorting = [...old, {
            id: column.id,
            desc: nextDesc
          }];
          newSorting.splice(0, newSorting.length - ((_table$options$maxMul = table.options.maxMultiSortColCount) != null ? _table$options$maxMul : Number.MAX_SAFE_INTEGER));
        } else if (sortAction === "toggle") {
          newSorting = old.map((d) => {
            if (d.id === column.id) {
              return {
                ...d,
                desc: nextDesc
              };
            }
            return d;
          });
        } else if (sortAction === "remove") {
          newSorting = old.filter((d) => d.id !== column.id);
        } else {
          newSorting = [{
            id: column.id,
            desc: nextDesc
          }];
        }
        return newSorting;
      });
    };
    column.getFirstSortDir = () => {
      var _ref, _column$columnDef$sor;
      const sortDescFirst = (_ref = (_column$columnDef$sor = column.columnDef.sortDescFirst) != null ? _column$columnDef$sor : table.options.sortDescFirst) != null ? _ref : column.getAutoSortDir() === "desc";
      return sortDescFirst ? "desc" : "asc";
    };
    column.getNextSortingOrder = (multi) => {
      var _table$options$enable, _table$options$enable2;
      const firstSortDirection = column.getFirstSortDir();
      const isSorted = column.getIsSorted();
      if (!isSorted) {
        return firstSortDirection;
      }
      if (isSorted !== firstSortDirection && ((_table$options$enable = table.options.enableSortingRemoval) != null ? _table$options$enable : true) && // If enableSortRemove, enable in general
      (multi ? (_table$options$enable2 = table.options.enableMultiRemove) != null ? _table$options$enable2 : true : true)) {
        return false;
      }
      return isSorted === "desc" ? "asc" : "desc";
    };
    column.getCanSort = () => {
      var _column$columnDef$ena, _table$options$enable3;
      return ((_column$columnDef$ena = column.columnDef.enableSorting) != null ? _column$columnDef$ena : true) && ((_table$options$enable3 = table.options.enableSorting) != null ? _table$options$enable3 : true) && !!column.accessorFn;
    };
    column.getCanMultiSort = () => {
      var _ref2, _column$columnDef$ena2;
      return (_ref2 = (_column$columnDef$ena2 = column.columnDef.enableMultiSort) != null ? _column$columnDef$ena2 : table.options.enableMultiSort) != null ? _ref2 : !!column.accessorFn;
    };
    column.getIsSorted = () => {
      var _table$getState$sorti;
      const columnSort = (_table$getState$sorti = table.getState().sorting) == null ? void 0 : _table$getState$sorti.find((d) => d.id === column.id);
      return !columnSort ? false : columnSort.desc ? "desc" : "asc";
    };
    column.getSortIndex = () => {
      var _table$getState$sorti2, _table$getState$sorti3;
      return (_table$getState$sorti2 = (_table$getState$sorti3 = table.getState().sorting) == null ? void 0 : _table$getState$sorti3.findIndex((d) => d.id === column.id)) != null ? _table$getState$sorti2 : -1;
    };
    column.clearSorting = () => {
      table.setSorting((old) => old != null && old.length ? old.filter((d) => d.id !== column.id) : []);
    };
    column.getToggleSortingHandler = () => {
      const canSort = column.getCanSort();
      return (e) => {
        if (!canSort) return;
        e.persist == null || e.persist();
        column.toggleSorting == null || column.toggleSorting(void 0, column.getCanMultiSort() ? table.options.isMultiSortEvent == null ? void 0 : table.options.isMultiSortEvent(e) : false);
      };
    };
  },
  createTable: (table) => {
    table.setSorting = (updater) => table.options.onSortingChange == null ? void 0 : table.options.onSortingChange(updater);
    table.resetSorting = (defaultState) => {
      var _table$initialState$s, _table$initialState;
      table.setSorting(defaultState ? [] : (_table$initialState$s = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.sorting) != null ? _table$initialState$s : []);
    };
    table.getPreSortedRowModel = () => table.getGroupedRowModel();
    table.getSortedRowModel = () => {
      if (!table._getSortedRowModel && table.options.getSortedRowModel) {
        table._getSortedRowModel = table.options.getSortedRowModel(table);
      }
      if (table.options.manualSorting || !table._getSortedRowModel) {
        return table.getPreSortedRowModel();
      }
      return table._getSortedRowModel();
    };
  }
};
const builtInFeatures = [
  Headers$1,
  ColumnVisibility,
  ColumnOrdering,
  ColumnPinning,
  ColumnFaceting,
  ColumnFiltering,
  GlobalFaceting,
  //depends on ColumnFaceting
  GlobalFiltering,
  //depends on ColumnFiltering
  RowSorting,
  ColumnGrouping,
  //depends on RowSorting
  RowExpanding,
  RowPagination,
  RowPinning,
  RowSelection,
  ColumnSizing
];
function createTable(options) {
  var _options$_features, _options$initialState;
  const _features = [...builtInFeatures, ...(_options$_features = options._features) != null ? _options$_features : []];
  let table = {
    _features
  };
  const defaultOptions = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions == null ? void 0 : feature.getDefaultOptions(table));
  }, {});
  const mergeOptions = (options2) => {
    if (table.options.mergeOptions) {
      return table.options.mergeOptions(defaultOptions, options2);
    }
    return {
      ...defaultOptions,
      ...options2
    };
  };
  const coreInitialState = {};
  let initialState = {
    ...coreInitialState,
    ...(_options$initialState = options.initialState) != null ? _options$initialState : {}
  };
  table._features.forEach((feature) => {
    var _feature$getInitialSt;
    initialState = (_feature$getInitialSt = feature.getInitialState == null ? void 0 : feature.getInitialState(initialState)) != null ? _feature$getInitialSt : initialState;
  });
  const queued = [];
  let queuedTimeout = false;
  const coreInstance = {
    _features,
    options: {
      ...defaultOptions,
      ...options
    },
    initialState,
    _queue: (cb) => {
      queued.push(cb);
      if (!queuedTimeout) {
        queuedTimeout = true;
        Promise.resolve().then(() => {
          while (queued.length) {
            queued.shift()();
          }
          queuedTimeout = false;
        }).catch((error) => setTimeout(() => {
          throw error;
        }));
      }
    },
    reset: () => {
      table.setState(table.initialState);
    },
    setOptions: (updater) => {
      const newOptions = functionalUpdate(updater, table.options);
      table.options = mergeOptions(newOptions);
    },
    getState: () => {
      return table.options.state;
    },
    setState: (updater) => {
      table.options.onStateChange == null || table.options.onStateChange(updater);
    },
    _getRowId: (row, index, parent) => {
      var _table$options$getRow;
      return (_table$options$getRow = table.options.getRowId == null ? void 0 : table.options.getRowId(row, index, parent)) != null ? _table$options$getRow : `${parent ? [parent.id, index].join(".") : index}`;
    },
    getCoreRowModel: () => {
      if (!table._getCoreRowModel) {
        table._getCoreRowModel = table.options.getCoreRowModel(table);
      }
      return table._getCoreRowModel();
    },
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => {
      return table.getPaginationRowModel();
    },
    //in next version, we should just pass in the row model as the optional 2nd arg
    getRow: (id, searchAll) => {
      let row = (searchAll ? table.getPrePaginationRowModel() : table.getRowModel()).rowsById[id];
      if (!row) {
        row = table.getCoreRowModel().rowsById[id];
        if (!row) {
          throw new Error();
        }
      }
      return row;
    },
    _getDefaultColumnDef: memo(() => [table.options.defaultColumn], (defaultColumn) => {
      var _defaultColumn;
      defaultColumn = (_defaultColumn = defaultColumn) != null ? _defaultColumn : {};
      return {
        header: (props) => {
          const resolvedColumnDef = props.header.column.columnDef;
          if (resolvedColumnDef.accessorKey) {
            return resolvedColumnDef.accessorKey;
          }
          if (resolvedColumnDef.accessorFn) {
            return resolvedColumnDef.id;
          }
          return null;
        },
        // footer: props => props.header.column.id,
        cell: (props) => {
          var _props$renderValue$to, _props$renderValue;
          return (_props$renderValue$to = (_props$renderValue = props.renderValue()) == null || _props$renderValue.toString == null ? void 0 : _props$renderValue.toString()) != null ? _props$renderValue$to : null;
        },
        ...table._features.reduce((obj, feature) => {
          return Object.assign(obj, feature.getDefaultColumnDef == null ? void 0 : feature.getDefaultColumnDef());
        }, {}),
        ...defaultColumn
      };
    }, getMemoOptions(options, "debugColumns")),
    _getColumnDefs: () => table.options.columns,
    getAllColumns: memo(() => [table._getColumnDefs()], (columnDefs) => {
      const recurseColumns = function(columnDefs2, parent, depth) {
        if (depth === void 0) {
          depth = 0;
        }
        return columnDefs2.map((columnDef) => {
          const column = createColumn(table, columnDef, depth, parent);
          const groupingColumnDef = columnDef;
          column.columns = groupingColumnDef.columns ? recurseColumns(groupingColumnDef.columns, column, depth + 1) : [];
          return column;
        });
      };
      return recurseColumns(columnDefs);
    }, getMemoOptions(options, "debugColumns")),
    getAllFlatColumns: memo(() => [table.getAllColumns()], (allColumns) => {
      return allColumns.flatMap((column) => {
        return column.getFlatColumns();
      });
    }, getMemoOptions(options, "debugColumns")),
    _getAllFlatColumnsById: memo(() => [table.getAllFlatColumns()], (flatColumns) => {
      return flatColumns.reduce((acc, column) => {
        acc[column.id] = column;
        return acc;
      }, {});
    }, getMemoOptions(options, "debugColumns")),
    getAllLeafColumns: memo(() => [table.getAllColumns(), table._getOrderColumnsFn()], (allColumns, orderColumns2) => {
      let leafColumns = allColumns.flatMap((column) => column.getLeafColumns());
      return orderColumns2(leafColumns);
    }, getMemoOptions(options, "debugColumns")),
    getColumn: (columnId) => {
      const column = table._getAllFlatColumnsById()[columnId];
      return column;
    }
  };
  Object.assign(table, coreInstance);
  for (let index = 0; index < table._features.length; index++) {
    const feature = table._features[index];
    feature == null || feature.createTable == null || feature.createTable(table);
  }
  return table;
}
function getCoreRowModel() {
  return (table) => memo(() => [table.options.data], (data) => {
    const rowModel = {
      rows: [],
      flatRows: [],
      rowsById: {}
    };
    const accessRows = function(originalRows, depth, parentRow) {
      if (depth === void 0) {
        depth = 0;
      }
      const rows = [];
      for (let i = 0; i < originalRows.length; i++) {
        const row = createRow(table, table._getRowId(originalRows[i], i, parentRow), originalRows[i], i, depth, void 0, parentRow == null ? void 0 : parentRow.id);
        rowModel.flatRows.push(row);
        rowModel.rowsById[row.id] = row;
        rows.push(row);
        if (table.options.getSubRows) {
          var _row$originalSubRows;
          row.originalSubRows = table.options.getSubRows(originalRows[i], i);
          if ((_row$originalSubRows = row.originalSubRows) != null && _row$originalSubRows.length) {
            row.subRows = accessRows(row.originalSubRows, depth + 1, row);
          }
        }
      }
      return rows;
    };
    rowModel.rows = accessRows(data);
    return rowModel;
  }, getMemoOptions(table.options, "debugTable", "getRowModel", () => table._autoResetPageIndex()));
}

/**
   * react-table
   *
   * Copyright (c) TanStack
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   */

//

/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
 */
function flexRender(Comp, props) {
  return !Comp ? null : isReactComponent(Comp) ? /*#__PURE__*/reactExports.createElement(Comp, props) : Comp;
}
function isReactComponent(component) {
  return isClassComponent(component) || typeof component === 'function' || isExoticComponent(component);
}
function isClassComponent(component) {
  return typeof component === 'function' && (() => {
    const proto = Object.getPrototypeOf(component);
    return proto.prototype && proto.prototype.isReactComponent;
  })();
}
function isExoticComponent(component) {
  return typeof component === 'object' && typeof component.$$typeof === 'symbol' && ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description);
}
function useReactTable(options) {
  // Compose in the generic options to the user options
  const resolvedOptions = {
    state: {},
    // Dummy state
    onStateChange: () => {},
    // noop
    renderFallbackValue: null,
    ...options
  };

  // Create a new table and store it in state
  const [tableRef] = reactExports.useState(() => ({
    current: createTable(resolvedOptions)
  }));

  // By default, manage table state here using the table's initial state
  const [state, setState] = reactExports.useState(() => tableRef.current.initialState);

  // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.
  tableRef.current.setOptions(prev => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: updater => {
      setState(updater);
      options.onStateChange == null || options.onStateChange(updater);
    }
  }));
  return tableRef.current;
}

// packages/react/compose-refs/src/compose-refs.tsx
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}

// src/slot.tsx
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot$3 = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef$1(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef$1(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

var reactDomExports = requireReactDom();
const ReactDOM = /*@__PURE__*/getDefaultExportFromCjs(reactDomExports);

// src/primitive.tsx
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) reactDomExports.flushSync(() => target.dispatchEvent(event));
}

var NAME$2 = "Label";
var Label$2 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        props.onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$2.displayName = NAME$2;
var Root$5 = Label$2;

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Icon$1 = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon$1, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$K = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$K);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$J = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$J);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$I = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$I);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$H = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$H);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$G = [
  [
    "path",
    {
      d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
      key: "l5xja"
    }
  ],
  [
    "path",
    {
      d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
      key: "ep3f8r"
    }
  ],
  ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", key: "1p4c4q" }],
  ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", key: "tmeiqw" }],
  ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
  ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
  ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396", key: "1qfode" }],
  ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
  ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18", key: "159ez6" }]
];
const Brain = createLucideIcon("brain", __iconNode$G);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$F = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$F);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$E = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$E);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$D = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$D);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$C = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$C);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$B = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$B);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$A = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$A);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$z = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$z);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$y = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$y);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$x = [
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Clock = createLucideIcon("clock", __iconNode$x);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$w = [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
];
const Cloud = createLucideIcon("cloud", __iconNode$w);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$v = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$v);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$u = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$u);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$t = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$t);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$s = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$s);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$r = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$r);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$q = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$q);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$p = [
  ["path", { d: "M10 12.5 8 15l2 2.5", key: "1tg20x" }],
  ["path", { d: "m14 12.5 2 2.5-2 2.5", key: "yinavb" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z", key: "1mlx9k" }]
];
const FileCode = createLucideIcon("file-code", __iconNode$p);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$o = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "10", cy: "12", r: "2", key: "737tya" }],
  ["path", { d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22", key: "wt3hpn" }]
];
const FileImage = createLucideIcon("file-image", __iconNode$o);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$n = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M9 15h6", key: "cctwl0" }],
  ["path", { d: "M12 18v-6", key: "17g6i2" }]
];
const FilePlus = createLucideIcon("file-plus", __iconNode$n);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$m = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$m);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$l = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode$l);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$k = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$k);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$j = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$j);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$i = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$i);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$h = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$h);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$g = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu$1 = createLucideIcon("menu", __iconNode$g);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$f = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$f);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$e = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$e);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$d = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$d);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$c = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$c);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$b = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$b);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$a = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$a);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$9 = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode$9);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$8 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$8);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$7 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$7);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$6 = [
  ["path", { d: "M11 2v2", key: "1539x4" }],
  ["path", { d: "M5 2v2", key: "1yf1q8" }],
  ["path", { d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1", key: "rb5t3r" }],
  ["path", { d: "M8 15a6 6 0 0 0 12 0v-3", key: "x18d4x" }],
  ["circle", { cx: "20", cy: "10", r: "2", key: "ts1r5v" }]
];
const Stethoscope = createLucideIcon("stethoscope", __iconNode$6);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$5 = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$5);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$4 = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode$4);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$3);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$2);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode$1);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);

// packages/react/context/src/create-context.tsx
function createContext2(rootComponentName, defaultContext) {
  const Context = reactExports.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = reactExports.useMemo(() => context, Object.values(context));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
  };
  Provider.displayName = rootComponentName + "Provider";
  function useContext2(consumerName) {
    const context = reactExports.useContext(Context);
    if (context) return context;
    if (defaultContext !== void 0) return defaultContext;
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }
  return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

// packages/react/use-layout-effect/src/use-layout-effect.tsx
var useLayoutEffect2 = globalThis?.document ? reactExports.useLayoutEffect : () => {
};

// src/use-controllable-state.tsx
var useInsertionEffect = React$1[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  },
  caller
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  {
    const isControlledRef = reactExports.useRef(prop !== void 0);
    reactExports.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = reactExports.useCallback(
    (nextValue) => {
      if (isControlled) {
        const value2 = isFunction$1(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          onChangeRef.current?.(value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const [value, setValue] = reactExports.useState(defaultProp);
  const prevValueRef = reactExports.useRef(value);
  const onChangeRef = reactExports.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  reactExports.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction$1(value) {
  return typeof value === "function";
}

// packages/react/use-previous/src/use-previous.tsx
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

// packages/react/use-size/src/use-size.tsx
function useSize(element) {
  const [size, setSize] = reactExports.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}

function useStateMachine$1(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}

// src/presence.tsx
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : reactExports.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? reactExports.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = reactExports.useState();
  const stylesRef = reactExports.useRef(null);
  const prevPresentRef = reactExports.useRef(present);
  const prevAnimationNameRef = reactExports.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine$1(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  reactExports.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(event.animationName);
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: reactExports.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return styles?.animationName || "none";
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate$1(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME$6 = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME$6, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control?.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate$1(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState$3(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate$1(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME$6;
var Checkbox = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox.displayName = CHECKBOX_NAME;
var INDICATOR_NAME$1 = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME$1, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate$1(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState$3(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME$1;
var BUBBLE_INPUT_NAME$1 = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME$1, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate$1(checked);
        setChecked.call(input, isIndeterminate$1(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate$1(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME$1;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate$1(checked) {
  return checked === "indeterminate";
}
function getState$3(checked) {
  return isIndeterminate$1(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}

function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = React.useRef(null);
    const itemMap = React.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      React.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = React.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection,
    createCollectionScope
  ];
}

// packages/react/direction/src/direction.tsx
var DirectionContext = reactExports.createContext(void 0);
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}

// packages/react/use-callback-ref/src/use-callback-ref.tsx
function useCallbackRef$1(callback) {
  const callbackRef = reactExports.useRef(callback);
  reactExports.useEffect(() => {
    callbackRef.current = callback;
  });
  return reactExports.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}

// packages/react/use-escape-keydown/src/use-escape-keydown.tsx
function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
  const onEscapeKeyDown = useCallbackRef$1(onEscapeKeyDownProp);
  reactExports.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, ownerDocument]);
}

var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = reactExports.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      ...layerProps
    } = props;
    const context = reactExports.useContext(DismissableLayerContext);
    const [node, setNode] = reactExports.useState(null);
    const ownerDocument = node?.ownerDocument ?? globalThis?.document;
    const [, force] = reactExports.useState({});
    const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    const index = node ? layers.indexOf(node) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = usePointerDownOutside((event) => {
      const target = event.target;
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    const focusOutside = useFocusOutside((event) => {
      const target = event.target;
      const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
      if (isFocusInBranch) return;
      onFocusOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    useEscapeKeydown((event) => {
      const isHighestLayer = index === context.layers.size - 1;
      if (!isHighestLayer) return;
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    reactExports.useEffect(() => {
      if (!node) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(node);
      }
      context.layers.add(node);
      dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }, [node, ownerDocument, disableOutsidePointerEvents, context]);
    reactExports.useEffect(() => {
      return () => {
        if (!node) return;
        context.layers.delete(node);
        context.layersWithOutsidePointerEventsDisabled.delete(node);
        dispatchUpdate();
      };
    }, [node, context]);
    reactExports.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener(CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        ...layerProps,
        ref: composedRefs,
        style: {
          pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
          ...props.style
        },
        onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
        onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
        onPointerDownCapture: composeEventHandlers(
          props.onPointerDownCapture,
          pointerDownOutside.onPointerDownCapture
        )
      }
    );
  }
);
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = reactExports.forwardRef((props, forwardedRef) => {
  const context = reactExports.useContext(DismissableLayerContext);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...props, ref: composedRefs });
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
  const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
  const isPointerInsideReactTreeRef = reactExports.useRef(false);
  const handleClickRef = reactExports.useRef(() => {
  });
  reactExports.useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        let handleAndDispatchPointerDownOutsideEvent2 = function() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true }
          );
        };
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
          ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
        } else {
          handleAndDispatchPointerDownOutsideEvent2();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);
  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
  };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
  const handleFocusOutside = useCallbackRef$1(onFocusOutside);
  const isFocusInsideReactTreeRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const handleFocus = (event) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false
        });
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);
  return {
    onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
    onBlurCapture: () => isFocusInsideReactTreeRef.current = false
  };
}
function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
  if (handler) target.addEventListener(name, handler, { once: true });
  if (discrete) {
    dispatchDiscreteCustomEvent(target, event);
  } else {
    target.dispatchEvent(event);
  }
}

var count$1 = 0;
function useFocusGuards() {
  reactExports.useEffect(() => {
    const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
    document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
    count$1++;
    return () => {
      if (count$1 === 1) {
        document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
      }
      count$1--;
    };
  }, []);
}
function createFocusGuard() {
  const element = document.createElement("span");
  element.setAttribute("data-radix-focus-guard", "");
  element.tabIndex = 0;
  element.style.outline = "none";
  element.style.opacity = "0";
  element.style.position = "fixed";
  element.style.pointerEvents = "none";
  return element;
}

var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS$1 = { bubbles: false, cancelable: true };
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = reactExports.forwardRef((props, forwardedRef) => {
  const {
    loop = false,
    trapped = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...scopeProps
  } = props;
  const [container, setContainer] = reactExports.useState(null);
  const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
  const lastFocusedElementRef = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
  const focusScope = reactExports.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    }
  }).current;
  reactExports.useEffect(() => {
    if (trapped) {
      let handleFocusIn2 = function(event) {
        if (focusScope.paused || !container) return;
        const target = event.target;
        if (container.contains(target)) {
          lastFocusedElementRef.current = target;
        } else {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleFocusOut2 = function(event) {
        if (focusScope.paused || !container) return;
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) return;
        if (!container.contains(relatedTarget)) {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleMutations2 = function(mutations) {
        const focusedElement = document.activeElement;
        if (focusedElement !== document.body) return;
        for (const mutation of mutations) {
          if (mutation.removedNodes.length > 0) focus(container);
        }
      };
      document.addEventListener("focusin", handleFocusIn2);
      document.addEventListener("focusout", handleFocusOut2);
      const mutationObserver = new MutationObserver(handleMutations2);
      if (container) mutationObserver.observe(container, { childList: true, subtree: true });
      return () => {
        document.removeEventListener("focusin", handleFocusIn2);
        document.removeEventListener("focusout", handleFocusOut2);
        mutationObserver.disconnect();
      };
    }
  }, [trapped, container, focusScope.paused]);
  reactExports.useEffect(() => {
    if (container) {
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = document.activeElement;
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);
      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS$1);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst$2(removeLinks(getTabbableCandidates(container)), { select: true });
          if (document.activeElement === previouslyFocusedElement) {
            focus(container);
          }
        }
      }
      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        setTimeout(() => {
          const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS$1);
          container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          container.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true });
          }
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          focusScopesStack.remove(focusScope);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
  const handleKeyDown = reactExports.useCallback(
    (event) => {
      if (!loop && !trapped) return;
      if (focusScope.paused) return;
      const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = document.activeElement;
      if (isTabKey && focusedElement) {
        const container2 = event.currentTarget;
        const [first, last] = getTabbableEdges(container2);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container2) event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop) focus(first, { select: true });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop) focus(last, { select: true });
          }
        }
      }
    },
    [loop, trapped, focusScope.paused]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst$2(candidates, { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
}
function getTabbableEdges(container) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last];
}
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function findVisible(elements, container) {
  for (const element of elements) {
    if (!isHidden(element, { upTo: container })) return element;
  }
}
function isHidden(node, { upTo }) {
  if (getComputedStyle(node).visibility === "hidden") return true;
  while (node) {
    if (upTo !== void 0 && node === upTo) return false;
    if (getComputedStyle(node).display === "none") return true;
    node = node.parentElement;
  }
  return false;
}
function isSelectableInput(element) {
  return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    element.focus({ preventScroll: true });
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
      element.select();
  }
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
  let stack = [];
  return {
    add(focusScope) {
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause();
      }
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },
    remove(focusScope) {
      stack = arrayRemove(stack, focusScope);
      stack[0]?.resume();
    }
  };
}
function arrayRemove(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}
function removeLinks(items) {
  return items.filter((item) => item.tagName !== "A");
}

// packages/react/id/src/id.tsx
var useReactId = React$1[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = reactExports.useState(useReactId());
  useLayoutEffect2(() => {
    setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return (id ? `radix-${id}` : "");
}

/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
const yAxisSides = /*#__PURE__*/new Set(['top', 'bottom']);
function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}

function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$3 = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = clamp(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => d.overflows[0] > 0 && getSideAxis(d.placement) === initialSideAxis)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset$2 = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};

function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
const invalidOverflowDisplayValues = /*#__PURE__*/new Set(['inline', 'contents']);
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
}
const tableElements = /*#__PURE__*/new Set(['table', 'td', 'th']);
function isTableElement(element) {
  return tableElements.has(getNodeName(element));
}
const topLayerSelectors = [':popover-open', ':modal'];
function isTopLayer(element) {
  return topLayerSelectors.some(selector => {
    try {
      return element.matches(selector);
    } catch (_e) {
      return false;
    }
  });
}
const transformProperties = ['transform', 'translate', 'scale', 'rotate', 'perspective'];
const willChangeValues = ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'];
const containValues = ['paint', 'layout', 'strict', 'content'];
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return transformProperties.some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || willChangeValues.some(value => (css.willChange || '').includes(value)) || containValues.some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
const lastTraversableNodeNames = /*#__PURE__*/new Set(['html', 'body', '#document']);
function isLastTraversableNode(node) {
  return lastTraversableNodeNames.has(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}

function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 :
  // RTL <body> scrollbar.
  getWindowScrollBarX(documentElement, htmlRect));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === 'rtl') {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

const absoluteOrFixed = /*#__PURE__*/new Set(['absolute', 'fixed']);
// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return getComputedStyle$1(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        // It's possible that even though the ratio is reported as 1, the
        // element is not actually fully within the IntersectionObserver's root
        // area anymore. This can happen under performance constraints. This may
        // be a bug in the browser's IntersectionObserver implementation. To
        // work around this, we compare the element's bounding rect now with
        // what it was at the time we created the IntersectionObserver. If they
        // are not equal then the element moved, so we refresh.
        refresh();
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset$1 = offset$2;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift$1 = shift$2;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip$1 = flip$2;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size$1 = size$2;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide$1 = hide$2;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$2 = arrow$3;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift$1 = limitShift$2;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

var isClient = typeof document !== 'undefined';

var noop = function noop() {};
var index = isClient ? reactExports.useLayoutEffect : noop;

// Fork of `fast-deep-equal` that only does the comparisons we need and compares
// functions
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === 'function' && a.toString() === b.toString()) {
    return true;
  }
  let length;
  let i;
  let keys;
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0;) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (i = length; i-- !== 0;) {
      if (!{}.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0;) {
      const key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        continue;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}

function getDPR(element) {
  if (typeof window === 'undefined') {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}

function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}

function useLatestRef(value) {
  const ref = reactExports.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}

/**
 * Provides data to position a floating element.
 * @see https://floating-ui.com/docs/useFloating
 */
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = true,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = reactExports.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = reactExports.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const [_reference, _setReference] = reactExports.useState(null);
  const [_floating, _setFloating] = reactExports.useState(null);
  const setReference = reactExports.useCallback(node => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = reactExports.useCallback(node => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const referenceRef = reactExports.useRef(null);
  const floatingRef = reactExports.useRef(null);
  const dataRef = reactExports.useRef(data);
  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const platformRef = useLatestRef(platform);
  const openRef = useLatestRef(open);
  const update = reactExports.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config.platform = platformRef.current;
    }
    computePosition(referenceRef.current, floatingRef.current, config).then(data => {
      const fullData = {
        ...data,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== false
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        reactDomExports.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData(data => ({
        ...data,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = reactExports.useRef(false);
  index(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = reactExports.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = reactExports.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]);
  const floatingStyles = reactExports.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating) {
      return initialStyles;
    }
    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);
    if (transform) {
      return {
        ...initialStyles,
        transform: "translate(" + x + "px, " + y + "px)",
        ...(getDPR(elements.floating) >= 1.5 && {
          willChange: 'transform'
        })
      };
    }
    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return reactExports.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$1 = options => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, 'current');
  }
  return {
    name: 'arrow',
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options === 'function' ? options(state) : options;
      if (element && isRef(element)) {
        if (element.current != null) {
          return arrow$2({
            element: element.current,
            padding
          }).fn(state);
        }
        return {};
      }
      if (element) {
        return arrow$2({
          element,
          padding
        }).fn(state);
      }
      return {};
    }
  };
};

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = (options, deps) => ({
  ...offset$1(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = (options, deps) => ({
  ...shift$1(options),
  options: [options, deps]
});

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = (options, deps) => ({
  ...limitShift$1(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = (options, deps) => ({
  ...flip$1(options),
  options: [options, deps]
});

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = (options, deps) => ({
  ...size$1(options),
  options: [options, deps]
});

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = (options, deps) => ({
  ...hide$1(options),
  options: [options, deps]
});

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = (options, deps) => ({
  ...arrow$1(options),
  options: [options, deps]
});

// src/arrow.tsx
var NAME$1 = "Arrow";
var Arrow$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.svg,
    {
      ...arrowProps,
      ref: forwardedRef,
      width,
      height,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: props.asChild ? children : /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Arrow$1.displayName = NAME$1;
var Root$4 = Arrow$1;

var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
  const { __scopePopper, children } = props;
  const [anchor, setAnchor] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME$1 = "PopperAnchor";
var PopperAnchor = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props;
    const context = usePopperContext(ANCHOR_NAME$1, __scopePopper);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    reactExports.useEffect(() => {
      context.onAnchorChange(virtualRef?.current || ref.current);
    });
    return virtualRef ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...anchorProps, ref: composedRefs });
  }
);
PopperAnchor.displayName = ANCHOR_NAME$1;
var CONTENT_NAME$7 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$7);
var PopperContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopePopper,
      side = "bottom",
      sideOffset = 0,
      align = "center",
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = "partial",
      hideWhenDetached = false,
      updatePositionStrategy = "optimized",
      onPlaced,
      ...contentProps
    } = props;
    const context = usePopperContext(CONTENT_NAME$7, __scopePopper);
    const [content, setContent] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [arrow$1, setArrow] = reactExports.useState(null);
    const arrowSize = useSize(arrow$1);
    const arrowWidth = arrowSize?.width ?? 0;
    const arrowHeight = arrowSize?.height ?? 0;
    const desiredPlacement = side + (align !== "center" ? "-" + align : "");
    const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;
    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter(isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries
    };
    const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        const cleanup = autoUpdate(...args, {
          animationFrame: updatePositionStrategy === "always"
        });
        return cleanup;
      },
      elements: {
        reference: context.anchor
      },
      middleware: [
        offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions && shift({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === "partial" ? limitShift() : void 0,
          ...detectOverflowOptions
        }),
        avoidCollisions && flip({ ...detectOverflowOptions }),
        size({
          ...detectOverflowOptions,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
            contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
            contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
            contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
          }
        }),
        arrow$1 && arrow({ element: arrow$1, padding: arrowPadding }),
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions })
      ]
    });
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const handlePlaced = useCallbackRef$1(onPlaced);
    useLayoutEffect2(() => {
      if (isPositioned) {
        handlePlaced?.();
      }
    }, [isPositioned, handlePlaced]);
    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const [contentZIndex, setContentZIndex] = reactExports.useState();
    useLayoutEffect2(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: refs.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: contentZIndex,
          ["--radix-popper-transform-origin"]: [
            middlewareData.transformOrigin?.x,
            middlewareData.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...middlewareData.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: props.dir,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PopperContentProvider,
          {
            scope: __scopePopper,
            placedSide,
            onArrowChange: setArrow,
            arrowX,
            arrowY,
            shouldHideArrow: cannotCenterArrow,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                "data-side": placedSide,
                "data-align": placedAlign,
                ...contentProps,
                ref: composedRefs,
                style: {
                  ...contentProps.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: !isPositioned ? "none" : void 0
                }
              }
            )
          }
        )
      }
    );
  }
);
PopperContent.displayName = CONTENT_NAME$7;
var ARROW_NAME$3 = "PopperArrow";
var OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
var PopperArrow = reactExports.forwardRef(function PopperArrow2(props, forwardedRef) {
  const { __scopePopper, ...arrowProps } = props;
  const contentContext = useContentContext(ARROW_NAME$3, __scopePopper);
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        ref: contentContext.onArrowChange,
        style: {
          position: "absolute",
          left: contentContext.arrowX,
          top: contentContext.arrowY,
          [baseSide]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[contentContext.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: `rotate(180deg)`,
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[contentContext.placedSide],
          visibility: contentContext.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root$4,
          {
            ...arrowProps,
            ref: forwardedRef,
            style: {
              ...arrowProps.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
PopperArrow.displayName = ARROW_NAME$3;
function isNotNull(value) {
  return value !== null;
}
var transformOrigin = (options) => ({
  name: "transformOrigin",
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const isArrowHidden = cannotCenterArrow;
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
    let x = "";
    let y = "";
    if (placedSide === "bottom") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (placedSide === "top") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (placedSide === "right") {
      x = `${-arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    } else if (placedSide === "left") {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    }
    return { data: { x, y } };
  }
});
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
var Root2$4 = Popper;
var Anchor = PopperAnchor;
var Content$3 = PopperContent;
var Arrow = PopperArrow;

var PORTAL_NAME$4 = "Portal";
var Portal$3 = reactExports.forwardRef((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = reactExports.useState(false);
  useLayoutEffect2(() => setMounted(true), []);
  const container = containerProp || mounted && globalThis?.document?.body;
  return container ? ReactDOM.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal$3.displayName = PORTAL_NAME$4;

// src/visually-hidden.tsx
var VISUALLY_HIDDEN_STYLES = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
});
var NAME = "VisuallyHidden";
var VisuallyHidden = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...props,
        ref: forwardedRef,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
      }
    );
  }
);
VisuallyHidden.displayName = NAME;

var getDefaultParent = function (originalTarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
};
var counterMap = new WeakMap();
var uncontrolledNodes = new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function (node) {
    return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function (parent, targets) {
    return targets
        .map(function (target) {
        if (parent.contains(target)) {
            return target;
        }
        var correctedTarget = unwrapHost(target);
        if (correctedTarget && parent.contains(correctedTarget)) {
            return correctedTarget;
        }
        console.error('aria-hidden', target, 'in not contained inside', parent, '. Doing nothing');
        return null;
    })
        .filter(function (x) { return Boolean(x); });
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @param {String} [controlAttribute] - html Attribute to control
 * @return {Undo} undo command
 */
var applyAttributeToOthers = function (originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
        markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function (el) {
        if (!el || elementsToKeep.has(el)) {
            return;
        }
        elementsToKeep.add(el);
        keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function (parent) {
        if (!parent || elementsToStop.has(parent)) {
            return;
        }
        Array.prototype.forEach.call(parent.children, function (node) {
            if (elementsToKeep.has(node)) {
                deep(node);
            }
            else {
                try {
                    var attr = node.getAttribute(controlAttribute);
                    var alreadyHidden = attr !== null && attr !== 'false';
                    var counterValue = (counterMap.get(node) || 0) + 1;
                    var markerValue = (markerCounter.get(node) || 0) + 1;
                    counterMap.set(node, counterValue);
                    markerCounter.set(node, markerValue);
                    hiddenNodes.push(node);
                    if (counterValue === 1 && alreadyHidden) {
                        uncontrolledNodes.set(node, true);
                    }
                    if (markerValue === 1) {
                        node.setAttribute(markerName, 'true');
                    }
                    if (!alreadyHidden) {
                        node.setAttribute(controlAttribute, 'true');
                    }
                }
                catch (e) {
                    console.error('aria-hidden: cannot operate on ', node, e);
                }
            }
        });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function () {
        hiddenNodes.forEach(function (node) {
            var counterValue = counterMap.get(node) - 1;
            var markerValue = markerCounter.get(node) - 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            if (!counterValue) {
                if (!uncontrolledNodes.has(node)) {
                    node.removeAttribute(controlAttribute);
                }
                uncontrolledNodes.delete(node);
            }
            if (!markerValue) {
                node.removeAttribute(markerName);
            }
        });
        lockCount--;
        if (!lockCount) {
            // clear
            counterMap = new WeakMap();
            counterMap = new WeakMap();
            uncontrolledNodes = new WeakMap();
            markerMap = {};
        }
    };
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @return {Undo} undo command
 */
var hideOthers = function (originalTarget, parentNode, markerName) {
    if (markerName === void 0) { markerName = 'data-aria-hidden'; }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function () { return null; };
    }
    // we should not hide aria-live elements - https://github.com/theKashey/aria-hidden/issues/10
    // and script elements, as they have no impact on accessibility.
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll('[aria-live], script')));
    return applyAttributeToOthers(targets, activeParentNode, markerName, 'aria-hidden');
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var zeroRightClassName = 'right-scroll-bar-position';
var fullWidthClassName = 'width-before-scroll-bar';
var noScrollbarsClassName = 'with-scroll-bars-hidden';
/**
 * Name of a CSS variable containing the amount of "hidden" scrollbar
 * ! might be undefined ! use will fallback!
 */
var removedBarSizeVariable = '--removed-body-scroll-bar-size';

/**
 * Assigns a value for a given ref, no matter of the ref format
 * @param {RefObject} ref - a callback function or ref object
 * @param value - a new value
 *
 * @see https://github.com/theKashey/use-callback-ref#assignref
 * @example
 * const refObject = useRef();
 * const refFn = (ref) => {....}
 *
 * assignRef(refObject, "refValue");
 * assignRef(refFn, "refValue");
 */
function assignRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    }
    else if (ref) {
        ref.current = value;
    }
    return ref;
}

/**
 * creates a MutableRef with ref change callback
 * @param initialValue - initial ref value
 * @param {Function} callback - a callback to run when value changes
 *
 * @example
 * const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
 * ref.current = 1;
 * // prints 0 -> 1
 *
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 * @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
 * @returns {MutableRefObject}
 */
function useCallbackRef(initialValue, callback) {
    var ref = reactExports.useState(function () { return ({
        // value
        value: initialValue,
        // last callback
        callback: callback,
        // "memoized" public interface
        facade: {
            get current() {
                return ref.value;
            },
            set current(value) {
                var last = ref.value;
                if (last !== value) {
                    ref.value = value;
                    ref.callback(value, last);
                }
            },
        },
    }); })[0];
    // update callback
    ref.callback = callback;
    return ref.facade;
}

var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? reactExports.useLayoutEffect : reactExports.useEffect;
var currentValues = new WeakMap();
/**
 * Merges two or more refs together providing a single interface to set their value
 * @param {RefObject|Ref} refs
 * @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
 *
 * @see {@link mergeRefs} a version without buit-in memoization
 * @see https://github.com/theKashey/use-callback-ref#usemergerefs
 * @example
 * const Component = React.forwardRef((props, ref) => {
 *   const ownRef = useRef();
 *   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
 *   return <div ref={domRef}>...</div>
 * }
 */
function useMergeRefs(refs, defaultValue) {
    var callbackRef = useCallbackRef(null, function (newValue) {
        return refs.forEach(function (ref) { return assignRef(ref, newValue); });
    });
    // handle refs changes - added or removed
    useIsomorphicLayoutEffect(function () {
        var oldValue = currentValues.get(callbackRef);
        if (oldValue) {
            var prevRefs_1 = new Set(oldValue);
            var nextRefs_1 = new Set(refs);
            var current_1 = callbackRef.current;
            prevRefs_1.forEach(function (ref) {
                if (!nextRefs_1.has(ref)) {
                    assignRef(ref, null);
                }
            });
            nextRefs_1.forEach(function (ref) {
                if (!prevRefs_1.has(ref)) {
                    assignRef(ref, current_1);
                }
            });
        }
        currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
}

function ItoI(a) {
    return a;
}
function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) { middleware = ItoI; }
    var buffer = [];
    var assigned = false;
    var medium = {
        read: function () {
            if (assigned) {
                throw new Error('Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.');
            }
            if (buffer.length) {
                return buffer[buffer.length - 1];
            }
            return defaults;
        },
        useMedium: function (data) {
            var item = middleware(data, assigned);
            buffer.push(item);
            return function () {
                buffer = buffer.filter(function (x) { return x !== item; });
            };
        },
        assignSyncMedium: function (cb) {
            assigned = true;
            while (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
            }
            buffer = {
                push: function (x) { return cb(x); },
                filter: function () { return buffer; },
            };
        },
        assignMedium: function (cb) {
            assigned = true;
            var pendingQueue = [];
            if (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
                pendingQueue = buffer;
            }
            var executeQueue = function () {
                var cbs = pendingQueue;
                pendingQueue = [];
                cbs.forEach(cb);
            };
            var cycle = function () { return Promise.resolve().then(executeQueue); };
            cycle();
            buffer = {
                push: function (x) {
                    pendingQueue.push(x);
                    cycle();
                },
                filter: function (filter) {
                    pendingQueue = pendingQueue.filter(filter);
                    return buffer;
                },
            };
        },
    };
    return medium;
}
// eslint-disable-next-line @typescript-eslint/ban-types
function createSidecarMedium(options) {
    if (options === void 0) { options = {}; }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
    return medium;
}

var SideCar$1 = function (_a) {
    var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
        throw new Error('Sidecar: please provide `sideCar` property to import the right car');
    }
    var Target = sideCar.read();
    if (!Target) {
        throw new Error('Sidecar medium not found');
    }
    return reactExports.createElement(Target, __assign({}, rest));
};
SideCar$1.isSideCarExport = true;
function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar$1;
}

var effectCar = createSidecarMedium();

var nothing = function () {
    return;
};
/**
 * Removes scrollbar from the page and contain the scroll within the Lock
 */
var RemoveScroll = reactExports.forwardRef(function (props, parentRef) {
    var ref = reactExports.useRef(null);
    var _a = reactExports.useState({
        onScrollCapture: nothing,
        onWheelCapture: nothing,
        onTouchMoveCapture: nothing,
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? 'div' : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return (reactExports.createElement(reactExports.Fragment, null,
        enabled && (reactExports.createElement(SideCar, { sideCar: effectCar, removeScrollBar: removeScrollBar, shards: shards, noRelative: noRelative, noIsolation: noIsolation, inert: inert, setCallbacks: setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode: gapMode })),
        forwardProps ? (reactExports.cloneElement(reactExports.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef }))) : (reactExports.createElement(Container, __assign({}, containerProps, { className: className, ref: containerRef }), children))));
});
RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false,
};
RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName,
};

var getNonce = function () {
    if (typeof __webpack_nonce__ !== 'undefined') {
        return __webpack_nonce__;
    }
    return undefined;
};

function makeStyleTag() {
    if (!document)
        return null;
    var tag = document.createElement('style');
    tag.type = 'text/css';
    var nonce = getNonce();
    if (nonce) {
        tag.setAttribute('nonce', nonce);
    }
    return tag;
}
function injectStyles(tag, css) {
    // @ts-ignore
    if (tag.styleSheet) {
        // @ts-ignore
        tag.styleSheet.cssText = css;
    }
    else {
        tag.appendChild(document.createTextNode(css));
    }
}
function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(tag);
}
var stylesheetSingleton = function () {
    var counter = 0;
    var stylesheet = null;
    return {
        add: function (style) {
            if (counter == 0) {
                if ((stylesheet = makeStyleTag())) {
                    injectStyles(stylesheet, style);
                    insertStyleTag(stylesheet);
                }
            }
            counter++;
        },
        remove: function () {
            counter--;
            if (!counter && stylesheet) {
                stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
                stylesheet = null;
            }
        },
    };
};

/**
 * creates a hook to control style singleton
 * @see {@link styleSingleton} for a safer component version
 * @example
 * ```tsx
 * const useStyle = styleHookSingleton();
 * ///
 * useStyle('body { overflow: hidden}');
 */
var styleHookSingleton = function () {
    var sheet = stylesheetSingleton();
    return function (styles, isDynamic) {
        reactExports.useEffect(function () {
            sheet.add(styles);
            return function () {
                sheet.remove();
            };
        }, [styles && isDynamic]);
    };
};

/**
 * create a Component to add styles on demand
 * - styles are added when first instance is mounted
 * - styles are removed when the last instance is unmounted
 * - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
 */
var styleSingleton = function () {
    var useStyle = styleHookSingleton();
    var Sheet = function (_a) {
        var styles = _a.styles, dynamic = _a.dynamic;
        useStyle(styles, dynamic);
        return null;
    };
    return Sheet;
};

var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0,
};
var parse = function (x) { return parseInt(x || '', 10) || 0; };
var getOffset = function (gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === 'padding' ? 'paddingLeft' : 'marginLeft'];
    var top = cs[gapMode === 'padding' ? 'paddingTop' : 'marginTop'];
    var right = cs[gapMode === 'padding' ? 'paddingRight' : 'marginRight'];
    return [parse(left), parse(top), parse(right)];
};
var getGapWidth = function (gapMode) {
    if (gapMode === void 0) { gapMode = 'margin'; }
    if (typeof window === 'undefined') {
        return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
        left: offsets[0],
        top: offsets[1],
        right: offsets[2],
        gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0]),
    };
};

var Style = styleSingleton();
var lockAttribute = 'data-scroll-locked';
// important tip - once we measure scrollBar width and remove them
// we could not repeat this operation
// thus we are using style-singleton - only the first "yet correct" style will be applied.
var getStyles = function (_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) { gapMode = 'margin'; }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
        allowRelative && "position: relative ".concat(important, ";"),
        gapMode === 'margin' &&
            "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
        gapMode === 'padding' && "padding-right: ".concat(gap, "px ").concat(important, ";"),
    ]
        .filter(Boolean)
        .join(''), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function () {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || '0', 10);
    return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function () {
    reactExports.useEffect(function () {
        document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
        return function () {
            var newCounter = getCurrentUseCounter() - 1;
            if (newCounter <= 0) {
                document.body.removeAttribute(lockAttribute);
            }
            else {
                document.body.setAttribute(lockAttribute, newCounter.toString());
            }
        };
    }, []);
};
/**
 * Removes page scrollbar and blocks page scroll when mounted
 */
var RemoveScrollBar = function (_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? 'margin' : _b;
    useLockAttribute();
    /*
     gap will be measured on every component mount
     however it will be used only by the "first" invocation
     due to singleton nature of <Style
     */
    var gap = reactExports.useMemo(function () { return getGapWidth(gapMode); }, [gapMode]);
    return reactExports.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? '!important' : '') });
};

var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
                return true;
            },
        });
        // @ts-ignore
        window.addEventListener('test', options, options);
        // @ts-ignore
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
var nonPassive = passiveSupported ? { passive: false } : false;

var alwaysContainsScroll = function (node) {
    // textarea will always _contain_ scroll inside self. It only can be hidden
    return node.tagName === 'TEXTAREA';
};
var elementCanBeScrolled = function (node, overflow) {
    if (!(node instanceof Element)) {
        return false;
    }
    var styles = window.getComputedStyle(node);
    return (
    // not-not-scrollable
    styles[overflow] !== 'hidden' &&
        // contains scroll inside self
        !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === 'visible'));
};
var elementCouldBeVScrolled = function (node) { return elementCanBeScrolled(node, 'overflowY'); };
var elementCouldBeHScrolled = function (node) { return elementCanBeScrolled(node, 'overflowX'); };
var locationCouldBeScrolled = function (axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
        // Skip over shadow root
        if (typeof ShadowRoot !== 'undefined' && current instanceof ShadowRoot) {
            current = current.host;
        }
        var isScrollable = elementCouldBeScrolled(axis, current);
        if (isScrollable) {
            var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
            if (scrollHeight > clientHeight) {
                return true;
            }
        }
        current = current.parentNode;
    } while (current && current !== ownerDocument.body);
    return false;
};
var getVScrollVariables = function (_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
        scrollTop,
        scrollHeight,
        clientHeight,
    ];
};
var getHScrollVariables = function (_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
        scrollLeft,
        scrollWidth,
        clientWidth,
    ];
};
var elementCouldBeScrolled = function (axis, node) {
    return axis === 'v' ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function (axis, node) {
    return axis === 'v' ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function (axis, direction) {
    /**
     * If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
     * and then increasingly negative as you scroll towards the end of the content.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
     */
    return axis === 'h' && direction === 'rtl' ? -1 : 1;
};
var handleScroll = function (axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    // find scrollable target
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
        if (!target) {
            break;
        }
        var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
        var elementScroll = scroll_1 - capacity - directionFactor * position;
        if (position || elementScroll) {
            if (elementCouldBeScrolled(axis, target)) {
                availableScroll += elementScroll;
                availableScrollTop += position;
            }
        }
        var parent_1 = target.parentNode;
        // we will "bubble" from ShadowDom in case we are, or just to the parent in normal case
        // this is the same logic used in focus-lock
        target = (parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1);
    } while (
    // portaled content
    (!targetInLock && target !== document.body) ||
        // self content
        (targetInLock && (endTarget.contains(target) || endTarget === target)));
    // handle epsilon around 0 (non standard zoom levels)
    if (isDeltaPositive &&
        ((Math.abs(availableScroll) < 1) || (false))) {
        shouldCancelScroll = true;
    }
    else if (!isDeltaPositive &&
        ((Math.abs(availableScrollTop) < 1) || (false))) {
        shouldCancelScroll = true;
    }
    return shouldCancelScroll;
};

var getTouchXY = function (event) {
    return 'changedTouches' in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function (event) { return [event.deltaX, event.deltaY]; };
var extractRef = function (ref) {
    return ref && 'current' in ref ? ref.current : ref;
};
var deltaCompare = function (x, y) { return x[0] === y[0] && x[1] === y[1]; };
var generateStyle = function (id) { return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n"); };
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
    var shouldPreventQueue = reactExports.useRef([]);
    var touchStartRef = reactExports.useRef([0, 0]);
    var activeAxis = reactExports.useRef();
    var id = reactExports.useState(idCounter++)[0];
    var Style = reactExports.useState(styleSingleton)[0];
    var lastProps = reactExports.useRef(props);
    reactExports.useEffect(function () {
        lastProps.current = props;
    }, [props]);
    reactExports.useEffect(function () {
        if (props.inert) {
            document.body.classList.add("block-interactivity-".concat(id));
            var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
            allow_1.forEach(function (el) { return el.classList.add("allow-interactivity-".concat(id)); });
            return function () {
                document.body.classList.remove("block-interactivity-".concat(id));
                allow_1.forEach(function (el) { return el.classList.remove("allow-interactivity-".concat(id)); });
            };
        }
        return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = reactExports.useCallback(function (event, parent) {
        if (('touches' in event && event.touches.length === 2) || (event.type === 'wheel' && event.ctrlKey)) {
            return !lastProps.current.allowPinchZoom;
        }
        var touch = getTouchXY(event);
        var touchStart = touchStartRef.current;
        var deltaX = 'deltaX' in event ? event.deltaX : touchStart[0] - touch[0];
        var deltaY = 'deltaY' in event ? event.deltaY : touchStart[1] - touch[1];
        var currentAxis;
        var target = event.target;
        var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';
        // allow horizontal touch move on Range inputs. They will not cause any scroll
        if ('touches' in event && moveDirection === 'h' && target.type === 'range') {
            return false;
        }
        var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
        if (!canBeScrolledInMainDirection) {
            return true;
        }
        if (canBeScrolledInMainDirection) {
            currentAxis = moveDirection;
        }
        else {
            currentAxis = moveDirection === 'v' ? 'h' : 'v';
            canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
            // other axis might be not scrollable
        }
        if (!canBeScrolledInMainDirection) {
            return false;
        }
        if (!activeAxis.current && 'changedTouches' in event && (deltaX || deltaY)) {
            activeAxis.current = currentAxis;
        }
        if (!currentAxis) {
            return true;
        }
        var cancelingAxis = activeAxis.current || currentAxis;
        return handleScroll(cancelingAxis, parent, event, cancelingAxis === 'h' ? deltaX : deltaY);
    }, []);
    var shouldPrevent = reactExports.useCallback(function (_event) {
        var event = _event;
        if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) {
            // not the last active
            return;
        }
        var delta = 'deltaY' in event ? getDeltaXY(event) : getTouchXY(event);
        var sourceEvent = shouldPreventQueue.current.filter(function (e) { return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta); })[0];
        // self event, and should be canceled
        if (sourceEvent && sourceEvent.should) {
            if (event.cancelable) {
                event.preventDefault();
            }
            return;
        }
        // outside or shard event
        if (!sourceEvent) {
            var shardNodes = (lastProps.current.shards || [])
                .map(extractRef)
                .filter(Boolean)
                .filter(function (node) { return node.contains(event.target); });
            var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
            if (shouldStop) {
                if (event.cancelable) {
                    event.preventDefault();
                }
            }
        }
    }, []);
    var shouldCancel = reactExports.useCallback(function (name, delta, target, should) {
        var event = { name: name, delta: delta, target: target, should: should, shadowParent: getOutermostShadowParent(target) };
        shouldPreventQueue.current.push(event);
        setTimeout(function () {
            shouldPreventQueue.current = shouldPreventQueue.current.filter(function (e) { return e !== event; });
        }, 1);
    }, []);
    var scrollTouchStart = reactExports.useCallback(function (event) {
        touchStartRef.current = getTouchXY(event);
        activeAxis.current = undefined;
    }, []);
    var scrollWheel = reactExports.useCallback(function (event) {
        shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = reactExports.useCallback(function (event) {
        shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    reactExports.useEffect(function () {
        lockStack.push(Style);
        props.setCallbacks({
            onScrollCapture: scrollWheel,
            onWheelCapture: scrollWheel,
            onTouchMoveCapture: scrollTouchMove,
        });
        document.addEventListener('wheel', shouldPrevent, nonPassive);
        document.addEventListener('touchmove', shouldPrevent, nonPassive);
        document.addEventListener('touchstart', scrollTouchStart, nonPassive);
        return function () {
            lockStack = lockStack.filter(function (inst) { return inst !== Style; });
            document.removeEventListener('wheel', shouldPrevent, nonPassive);
            document.removeEventListener('touchmove', shouldPrevent, nonPassive);
            document.removeEventListener('touchstart', scrollTouchStart, nonPassive);
        };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return (reactExports.createElement(reactExports.Fragment, null,
        inert ? reactExports.createElement(Style, { styles: generateStyle(id) }) : null,
        removeScrollBar ? reactExports.createElement(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null));
}
function getOutermostShadowParent(node) {
    var shadowParent = null;
    while (node !== null) {
        if (node instanceof ShadowRoot) {
            shadowParent = node.host;
            node = node.host;
        }
        node = node.parentNode;
    }
    return shadowParent;
}

const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);

var ReactRemoveScroll = reactExports.forwardRef(function (props, ref) { return (reactExports.createElement(RemoveScroll, __assign({}, props, { ref: ref, sideCar: SideCar }))); });
ReactRemoveScroll.classNames = RemoveScroll.classNames;

var OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
var SELECTION_KEYS$1 = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection$3, useCollection$3, createCollectionScope$3] = createCollection(SELECT_NAME);
var [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
  createCollectionScope$3,
  createPopperScope
]);
var usePopperScope$1 = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select = (props) => {
  const {
    __scopeSelect,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    dir,
    name,
    autoComplete,
    disabled,
    required,
    form
  } = props;
  const popperScope = usePopperScope$1(__scopeSelect);
  const [trigger, setTrigger] = reactExports.useState(null);
  const [valueNode, setValueNode] = reactExports.useState(null);
  const [valueNodeHasChildren, setValueNodeHasChildren] = reactExports.useState(false);
  const direction = useDirection(dir);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SELECT_NAME
  });
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: SELECT_NAME
  });
  const triggerPointerDownPosRef = reactExports.useRef(null);
  const isFormControl = trigger ? form || !!trigger.closest("form") : true;
  const [nativeOptionsSet, setNativeOptionsSet] = reactExports.useState(/* @__PURE__ */ new Set());
  const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$4, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectProvider,
    {
      required,
      scope: __scopeSelect,
      trigger,
      onTriggerChange: setTrigger,
      valueNode,
      onValueNodeChange: setValueNode,
      valueNodeHasChildren,
      onValueNodeHasChildrenChange: setValueNodeHasChildren,
      contentId: useId(),
      value,
      onValueChange: setValue,
      open,
      onOpenChange: setOpen,
      dir: direction,
      triggerPointerDownPosRef,
      disabled,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$3.Provider, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectNativeOptionsProvider,
          {
            scope: props.__scopeSelect,
            onNativeOptionAdd: reactExports.useCallback((option) => {
              setNativeOptionsSet((prev) => new Set(prev).add(option));
            }, []),
            onNativeOptionRemove: reactExports.useCallback((option) => {
              setNativeOptionsSet((prev) => {
                const optionsSet = new Set(prev);
                optionsSet.delete(option);
                return optionsSet;
              });
            }, []),
            children
          }
        ) }),
        isFormControl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectBubbleInput,
          {
            "aria-hidden": true,
            required,
            tabIndex: -1,
            name,
            autoComplete,
            value,
            onChange: (event) => setValue(event.target.value),
            disabled,
            form,
            children: [
              value === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "" }) : null,
              Array.from(nativeOptionsSet)
            ]
          },
          nativeSelectKey
        ) : null
      ]
    }
  ) });
};
Select.displayName = SELECT_NAME;
var TRIGGER_NAME$5 = "SelectTrigger";
var SelectTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, disabled = false, ...triggerProps } = props;
    const popperScope = usePopperScope$1(__scopeSelect);
    const context = useSelectContext(TRIGGER_NAME$5, __scopeSelect);
    const isDisabled = context.disabled || disabled;
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
    const getItems = useCollection$3(__scopeSelect);
    const pointerTypeRef = reactExports.useRef("touch");
    const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.value === context.value);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem !== void 0) {
        context.onValueChange(nextItem.value);
      }
    });
    const handleOpen = (pointerEvent) => {
      if (!isDisabled) {
        context.onOpenChange(true);
        resetTypeahead();
      }
      if (pointerEvent) {
        context.triggerPointerDownPosRef.current = {
          x: Math.round(pointerEvent.pageX),
          y: Math.round(pointerEvent.pageY)
        };
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": context.contentId,
        "aria-expanded": context.open,
        "aria-required": context.required,
        "aria-autocomplete": "none",
        dir: context.dir,
        "data-state": context.open ? "open" : "closed",
        disabled: isDisabled,
        "data-disabled": isDisabled ? "" : void 0,
        "data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
        ...triggerProps,
        ref: composedRefs,
        onClick: composeEventHandlers(triggerProps.onClick, (event) => {
          event.currentTarget.focus();
          if (pointerTypeRef.current !== "mouse") {
            handleOpen(event);
          }
        }),
        onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
          pointerTypeRef.current = event.pointerType;
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
          }
          if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
            handleOpen(event);
            event.preventDefault();
          }
        }),
        onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
          const isTypingAhead = searchRef.current !== "";
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
          if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
          if (isTypingAhead && event.key === " ") return;
          if (OPEN_KEYS.includes(event.key)) {
            handleOpen();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
SelectTrigger.displayName = TRIGGER_NAME$5;
var VALUE_NAME = "SelectValue";
var SelectValue = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
    const context = useSelectContext(VALUE_NAME, __scopeSelect);
    const { onValueNodeHasChildrenChange } = context;
    const hasChildren = children !== void 0;
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
    useLayoutEffect2(() => {
      onValueNodeHasChildrenChange(hasChildren);
    }, [onValueNodeHasChildrenChange, hasChildren]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...valueProps,
        ref: composedRefs,
        style: { pointerEvents: "none" },
        children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: placeholder }) : children
      }
    );
  }
);
SelectValue.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...iconProps, ref: forwardedRef, children: children || "\u25BC" });
  }
);
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME$3 = "SelectPortal";
var SelectPortal = (props) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$3, { asChild: true, ...props });
};
SelectPortal.displayName = PORTAL_NAME$3;
var CONTENT_NAME$6 = "SelectContent";
var SelectContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME$6, props.__scopeSelect);
    const [fragment, setFragment] = reactExports.useState();
    useLayoutEffect2(() => {
      setFragment(new DocumentFragment());
    }, []);
    if (!context.open) {
      const frag = fragment;
      return frag ? reactDomExports.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentProvider, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$3.Slot, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: props.children }) }) }),
        frag
      ) : null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentImpl, { ...props, ref: forwardedRef });
  }
);
SelectContent.displayName = CONTENT_NAME$6;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME$6);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot$2 = createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      position = "item-aligned",
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      //
      // PopperContent props
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions,
      //
      ...contentProps
    } = props;
    const context = useSelectContext(CONTENT_NAME$6, __scopeSelect);
    const [content, setContent] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [selectedItem, setSelectedItem] = reactExports.useState(null);
    const [selectedItemText, setSelectedItemText] = reactExports.useState(
      null
    );
    const getItems = useCollection$3(__scopeSelect);
    const [isPositioned, setIsPositioned] = reactExports.useState(false);
    const firstValidItemFoundRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      if (content) return hideOthers(content);
    }, [content]);
    useFocusGuards();
    const focusFirst = reactExports.useCallback(
      (candidates) => {
        const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
        const [lastItem] = restItems.slice(-1);
        const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
        for (const candidate of candidates) {
          if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
          candidate?.scrollIntoView({ block: "nearest" });
          if (candidate === firstItem && viewport) viewport.scrollTop = 0;
          if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
          candidate?.focus();
          if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
        }
      },
      [getItems, viewport]
    );
    const focusSelectedItem = reactExports.useCallback(
      () => focusFirst([selectedItem, content]),
      [focusFirst, selectedItem, content]
    );
    reactExports.useEffect(() => {
      if (isPositioned) {
        focusSelectedItem();
      }
    }, [isPositioned, focusSelectedItem]);
    const { onOpenChange, triggerPointerDownPosRef } = context;
    reactExports.useEffect(() => {
      if (content) {
        let pointerMoveDelta = { x: 0, y: 0 };
        const handlePointerMove = (event) => {
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
            y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0))
          };
        };
        const handlePointerUp = (event) => {
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
            event.preventDefault();
          } else {
            if (!content.contains(event.target)) {
              onOpenChange(false);
            }
          }
          document.removeEventListener("pointermove", handlePointerMove);
          triggerPointerDownPosRef.current = null;
        };
        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener("pointermove", handlePointerMove);
          document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });
        }
        return () => {
          document.removeEventListener("pointermove", handlePointerMove);
          document.removeEventListener("pointerup", handlePointerUp, { capture: true });
        };
      }
    }, [content, onOpenChange, triggerPointerDownPosRef]);
    reactExports.useEffect(() => {
      const close = () => onOpenChange(false);
      window.addEventListener("blur", close);
      window.addEventListener("resize", close);
      return () => {
        window.removeEventListener("blur", close);
        window.removeEventListener("resize", close);
      };
    }, [onOpenChange]);
    const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.ref.current === document.activeElement);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem) {
        setTimeout(() => nextItem.ref.current.focus());
      }
    });
    const itemRefCallback = reactExports.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItem(node);
          if (isFirstValidItem) firstValidItemFoundRef.current = true;
        }
      },
      [context.value]
    );
    const handleItemLeave = reactExports.useCallback(() => content?.focus(), [content]);
    const itemTextRefCallback = reactExports.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItemText(node);
        }
      },
      [context.value]
    );
    const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
    const popperContentProps = SelectPosition === SelectPopperPosition ? {
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions
    } : {};
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectContentProvider,
      {
        scope: __scopeSelect,
        content,
        viewport,
        onViewportChange: setViewport,
        itemRefCallback,
        selectedItem,
        onItemLeave: handleItemLeave,
        itemTextRefCallback,
        focusSelectedItem,
        selectedItemText,
        position,
        isPositioned,
        searchRef,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot$2, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: context.open,
            onMountAutoFocus: (event) => {
              event.preventDefault();
            },
            onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
              context.trigger?.focus({ preventScroll: true });
              event.preventDefault();
            }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents: true,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside: (event) => event.preventDefault(),
                onDismiss: () => context.onOpenChange(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectPosition,
                  {
                    role: "listbox",
                    id: context.contentId,
                    "data-state": context.open ? "open" : "closed",
                    dir: context.dir,
                    onContextMenu: (event) => event.preventDefault(),
                    ...contentProps,
                    ...popperContentProps,
                    onPlaced: () => setIsPositioned(true),
                    ref: composedRefs,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...contentProps.style
                    },
                    onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                      if (event.key === "Tab") event.preventDefault();
                      if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
                      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                        const items = getItems().filter((item) => !item.disabled);
                        let candidateNodes = items.map((item) => item.ref.current);
                        if (["ArrowUp", "End"].includes(event.key)) {
                          candidateNodes = candidateNodes.slice().reverse();
                        }
                        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                          const currentElement = event.target;
                          const currentIndex = candidateNodes.indexOf(currentElement);
                          candidateNodes = candidateNodes.slice(currentIndex + 1);
                        }
                        setTimeout(() => focusFirst(candidateNodes));
                        event.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onPlaced, ...popperProps } = props;
  const context = useSelectContext(CONTENT_NAME$6, __scopeSelect);
  const contentContext = useSelectContentContext(CONTENT_NAME$6, __scopeSelect);
  const [contentWrapper, setContentWrapper] = reactExports.useState(null);
  const [content, setContent] = reactExports.useState(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
  const getItems = useCollection$3(__scopeSelect);
  const shouldExpandOnScrollRef = reactExports.useRef(false);
  const shouldRepositionRef = reactExports.useRef(true);
  const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
  const position = reactExports.useCallback(() => {
    if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
      const triggerRect = context.trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const valueNodeRect = context.valueNode.getBoundingClientRect();
      const itemTextRect = selectedItemText.getBoundingClientRect();
      if (context.dir !== "rtl") {
        const itemTextOffset = itemTextRect.left - contentRect.left;
        const left = valueNodeRect.left - itemTextOffset;
        const leftDelta = triggerRect.left - left;
        const minContentWidth = triggerRect.width + leftDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const rightEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedLeft = clamp$1(left, [
          CONTENT_MARGIN,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(CONTENT_MARGIN, rightEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.left = clampedLeft + "px";
      } else {
        const itemTextOffset = contentRect.right - itemTextRect.right;
        const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
        const rightDelta = window.innerWidth - triggerRect.right - right;
        const minContentWidth = triggerRect.width + rightDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const leftEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedRight = clamp$1(right, [
          CONTENT_MARGIN,
          Math.max(CONTENT_MARGIN, leftEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.right = clampedRight + "px";
      }
      const items = getItems();
      const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
      const itemsHeight = viewport.scrollHeight;
      const contentStyles = window.getComputedStyle(content);
      const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
      const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
      const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
      const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
      const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
      const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
      const viewportStyles = window.getComputedStyle(viewport);
      const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
      const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
      const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
      const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
      const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
      const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
      const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
      const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
      const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
      if (willAlignWithoutTopOverflow) {
        const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
        contentWrapper.style.bottom = "0px";
        const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
        const clampedTriggerMiddleToBottomEdge = Math.max(
          triggerMiddleToBottomEdge,
          selectedItemHalfHeight + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth
        );
        const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
        contentWrapper.style.height = height + "px";
      } else {
        const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
        contentWrapper.style.top = "0px";
        const clampedTopEdgeToTriggerMiddle = Math.max(
          topEdgeToTriggerMiddle,
          contentBorderTopWidth + viewport.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight
        );
        const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
        contentWrapper.style.height = height + "px";
        viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
      }
      contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
      contentWrapper.style.minHeight = minContentHeight + "px";
      contentWrapper.style.maxHeight = availableHeight + "px";
      onPlaced?.();
      requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
    }
  }, [
    getItems,
    context.trigger,
    context.valueNode,
    contentWrapper,
    content,
    viewport,
    selectedItem,
    selectedItemText,
    context.dir,
    onPlaced
  ]);
  useLayoutEffect2(() => position(), [position]);
  const [contentZIndex, setContentZIndex] = reactExports.useState();
  useLayoutEffect2(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
  }, [content]);
  const handleScrollButtonChange = reactExports.useCallback(
    (node) => {
      if (node && shouldRepositionRef.current === true) {
        position();
        focusSelectedItem?.();
        shouldRepositionRef.current = false;
      }
    },
    [position, focusSelectedItem]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectViewportProvider,
    {
      scope: __scopeSelect,
      contentWrapper,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: setContentWrapper,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: contentZIndex
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              ...popperProps,
              ref: composedRefs,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...popperProps.style
              }
            }
          )
        }
      )
    }
  );
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeSelect,
    align = "start",
    collisionPadding = CONTENT_MARGIN,
    ...popperProps
  } = props;
  const popperScope = usePopperScope$1(__scopeSelect);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content$3,
    {
      ...popperScope,
      ...popperProps,
      ref: forwardedRef,
      align,
      collisionPadding,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...popperProps.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-select-content-available-width": "var(--radix-popper-available-width)",
          "--radix-select-content-available-height": "var(--radix-popper-available-height)",
          "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME$6, {});
var VIEWPORT_NAME$1 = "SelectViewport";
var SelectViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, nonce, ...viewportProps } = props;
    const contentContext = useSelectContentContext(VIEWPORT_NAME$1, __scopeSelect);
    const viewportContext = useSelectViewportContext(VIEWPORT_NAME$1, __scopeSelect);
    const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
    const prevScrollTopRef = reactExports.useRef(0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$3.Slot, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...viewportProps,
          ref: composedRefs,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...viewportProps.style
          },
          onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
            const viewport = event.currentTarget;
            const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
            if (shouldExpandOnScrollRef?.current && contentWrapper) {
              const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
              if (scrolledBy > 0) {
                const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
                const cssHeight = parseFloat(contentWrapper.style.height);
                const prevHeight = Math.max(cssMinHeight, cssHeight);
                if (prevHeight < availableHeight) {
                  const nextHeight = prevHeight + scrolledBy;
                  const clampedNextHeight = Math.min(availableHeight, nextHeight);
                  const heightDiff = nextHeight - clampedNextHeight;
                  contentWrapper.style.height = clampedNextHeight + "px";
                  if (contentWrapper.style.bottom === "0px") {
                    viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                    contentWrapper.style.justifyContent = "flex-end";
                  }
                }
              }
            }
            prevScrollTopRef.current = viewport.scrollTop;
          })
        }
      ) })
    ] });
  }
);
SelectViewport.displayName = VIEWPORT_NAME$1;
var GROUP_NAME$3 = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME$3);
var SelectGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props;
    const groupId = useId();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectGroupContextProvider, { scope: __scopeSelect, id: groupId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", "aria-labelledby": groupId, ...groupProps, ref: forwardedRef }) });
  }
);
SelectGroup.displayName = GROUP_NAME$3;
var LABEL_NAME$2 = "SelectLabel";
var SelectLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props;
    const groupContext = useSelectGroupContext(LABEL_NAME$2, __scopeSelect);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { id: groupContext.id, ...labelProps, ref: forwardedRef });
  }
);
SelectLabel.displayName = LABEL_NAME$2;
var ITEM_NAME$4 = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME$4);
var SelectItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const context = useSelectContext(ITEM_NAME$4, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_NAME$4, __scopeSelect);
    const isSelected = context.value === value;
    const [textValue, setTextValue] = reactExports.useState(textValueProp ?? "");
    const [isFocused, setIsFocused] = reactExports.useState(false);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => contentContext.itemRefCallback?.(node, value, disabled)
    );
    const textId = useId();
    const pointerTypeRef = reactExports.useRef("touch");
    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value);
        context.onOpenChange(false);
      }
    };
    if (value === "") {
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectItemContextProvider,
      {
        scope: __scopeSelect,
        value,
        disabled,
        textId,
        isSelected,
        onItemTextChange: reactExports.useCallback((node) => {
          setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? "").trim());
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Collection$3.ItemSlot,
          {
            scope: __scopeSelect,
            value,
            disabled,
            textValue,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "option",
                "aria-labelledby": textId,
                "data-highlighted": isFocused ? "" : void 0,
                "aria-selected": isSelected && isFocused,
                "data-state": isSelected ? "checked" : "unchecked",
                "aria-disabled": disabled || void 0,
                "data-disabled": disabled ? "" : void 0,
                tabIndex: disabled ? void 0 : -1,
                ...itemProps,
                ref: composedRefs,
                onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
                onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
                onClick: composeEventHandlers(itemProps.onClick, () => {
                  if (pointerTypeRef.current !== "mouse") handleSelect();
                }),
                onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
                  if (pointerTypeRef.current === "mouse") handleSelect();
                }),
                onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
                  pointerTypeRef.current = event.pointerType;
                }),
                onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
                  pointerTypeRef.current = event.pointerType;
                  if (disabled) {
                    contentContext.onItemLeave?.();
                  } else if (pointerTypeRef.current === "mouse") {
                    event.currentTarget.focus({ preventScroll: true });
                  }
                }),
                onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
                  if (event.currentTarget === document.activeElement) {
                    contentContext.onItemLeave?.();
                  }
                }),
                onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
                  const isTypingAhead = contentContext.searchRef?.current !== "";
                  if (isTypingAhead && event.key === " ") return;
                  if (SELECTION_KEYS$1.includes(event.key)) handleSelect();
                  if (event.key === " ") event.preventDefault();
                })
              }
            )
          }
        )
      }
    );
  }
);
SelectItem.displayName = ITEM_NAME$4;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, ...itemTextProps } = props;
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
    const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
    const [itemTextNode, setItemTextNode] = reactExports.useState(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => setItemTextNode(node),
      itemContext.onItemTextChange,
      (node) => contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled)
    );
    const textContent = itemTextNode?.textContent;
    const nativeOption = reactExports.useMemo(
      () => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: itemContext.value, disabled: itemContext.disabled, children: textContent }, itemContext.value),
      [itemContext.disabled, itemContext.value, textContent]
    );
    const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
    useLayoutEffect2(() => {
      onNativeOptionAdd(nativeOption);
      return () => onNativeOptionRemove(nativeOption);
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { id: itemContext.textId, ...itemTextProps, ref: composedRefs }),
      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? reactDomExports.createPortal(itemTextProps.children, context.valueNode) : null
    ] });
  }
);
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME$1 = "SelectItemIndicator";
var SelectItemIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props;
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME$1, __scopeSelect);
    return itemContext.isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...itemIndicatorProps, ref: forwardedRef }) : null;
  }
);
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME$1;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton = reactExports.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const [canScrollUp, setCanScrollUp] = reactExports.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const canScrollUp2 = viewport.scrollTop > 0;
        setCanScrollUp(canScrollUp2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollUpButton.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton = reactExports.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const [canScrollDown, setCanScrollDown] = reactExports.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const canScrollDown2 = Math.ceil(viewport.scrollTop) < maxScroll;
        setCanScrollDown(canScrollDown2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollDown ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
  const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
  const autoScrollTimerRef = reactExports.useRef(null);
  const getItems = useCollection$3(__scopeSelect);
  const clearAutoScrollTimer = reactExports.useCallback(() => {
    if (autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);
  reactExports.useEffect(() => {
    return () => clearAutoScrollTimer();
  }, [clearAutoScrollTimer]);
  useLayoutEffect2(() => {
    const activeItem = getItems().find((item) => item.ref.current === document.activeElement);
    activeItem?.ref.current?.scrollIntoView({ block: "nearest" });
  }, [getItems]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "aria-hidden": true,
      ...scrollIndicatorProps,
      ref: forwardedRef,
      style: { flexShrink: 0, ...scrollIndicatorProps.style },
      onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
        contentContext.onItemLeave?.();
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
        clearAutoScrollTimer();
      })
    }
  );
});
var SEPARATOR_NAME$2 = "SelectSeparator";
var SelectSeparator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { "aria-hidden": true, ...separatorProps, ref: forwardedRef });
  }
);
SelectSeparator.displayName = SEPARATOR_NAME$2;
var ARROW_NAME$2 = "SelectArrow";
var SelectArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props;
    const popperScope = usePopperScope$1(__scopeSelect);
    const context = useSelectContext(ARROW_NAME$2, __scopeSelect);
    const contentContext = useSelectContentContext(ARROW_NAME$2, __scopeSelect);
    return context.open && contentContext.position === "popper" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef }) : null;
  }
);
SelectArrow.displayName = ARROW_NAME$2;
var BUBBLE_INPUT_NAME = "SelectBubbleInput";
var SelectBubbleInput = reactExports.forwardRef(
  ({ __scopeSelect, value, ...props }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const prevValue = usePrevious(value);
    reactExports.useEffect(() => {
      const select = ref.current;
      if (!select) return;
      const selectProto = window.HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        selectProto,
        "value"
      );
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("change", { bubbles: true });
        setValue.call(select, value);
        select.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.select,
      {
        ...props,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style },
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME;
function shouldShowPlaceholder(value) {
  return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
  const handleSearchChange = useCallbackRef$1(onSearchChange);
  const searchRef = reactExports.useRef("");
  const timerRef = reactExports.useRef(0);
  const handleTypeaheadSearch = reactExports.useCallback(
    (key) => {
      const search = searchRef.current + key;
      handleSearchChange(search);
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
    },
    [handleSearchChange]
  );
  const resetTypeahead = reactExports.useCallback(() => {
    searchRef.current = "";
    window.clearTimeout(timerRef.current);
  }, []);
  reactExports.useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);
  return [searchRef, handleTypeaheadSearch, resetTypeahead];
}
function findNextItem(items, search, currentItem) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
  let wrappedItems = wrapArray$2(items, Math.max(currentItemIndex, 0));
  const excludeCurrentItem = normalizedSearch.length === 1;
  if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
  const nextItem = wrappedItems.find(
    (item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray$2(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root2$3 = Select;
var Trigger$3 = SelectTrigger;
var Value = SelectValue;
var Icon = SelectIcon;
var Portal$2 = SelectPortal;
var Content2$3 = SelectContent;
var Viewport$1 = SelectViewport;
var Label$1 = SelectLabel;
var Item$2 = SelectItem;
var ItemText = SelectItemText;
var ItemIndicator$1 = SelectItemIndicator;
var ScrollUpButton = SelectScrollUpButton;
var ScrollDownButton = SelectScrollDownButton;
var Separator$1 = SelectSeparator;

var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME$2 = "RovingFocusGroup";
var [Collection$2, useCollection$2, createCollectionScope$2] = createCollection(GROUP_NAME$2);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME$2,
  [createCollectionScope$2]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME$2);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$2.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$2.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME$2;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME$2
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef$1(onEntryFocus);
  const getItems = useCollection$2(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst$1(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME$3 = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME$3, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection$2(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection$2.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray$1(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst$1(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME$3;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst$1(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray$1(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root$3 = RovingFocusGroup;
var Item$1 = RovingFocusGroupItem;

var TABS_NAME = "Tabs";
var [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope$1 = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root$3,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList.displayName = TAB_LIST_NAME;
var TRIGGER_NAME$4 = "TabsTrigger";
var TabsTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME$4, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item$1,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger.displayName = TRIGGER_NAME$4;
var CONTENT_NAME$5 = "TabsContent";
var TabsContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME$5, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent.displayName = CONTENT_NAME$5;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2$2 = Tabs;
var List = TabsList;
var Trigger$2 = TabsTrigger;
var Content$2 = TabsContent;

var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen,
      disabled,
      onOpenChange,
      ...collapsibleProps
    } = props;
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: COLLAPSIBLE_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CollapsibleProvider,
      {
        scope: __scopeCollapsible,
        disabled,
        contentId: useId(),
        open,
        onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-state": getState$2(open),
            "data-disabled": disabled ? "" : void 0,
            ...collapsibleProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Collapsible.displayName = COLLAPSIBLE_NAME;
var TRIGGER_NAME$3 = "CollapsibleTrigger";
var CollapsibleTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME$3, __scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-controls": context.contentId,
        "aria-expanded": context.open || false,
        "data-state": getState$2(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        disabled: context.disabled,
        ...triggerProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
CollapsibleTrigger.displayName = TRIGGER_NAME$3;
var CONTENT_NAME$4 = "CollapsibleContent";
var CollapsibleContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME$4, props.__scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }) });
  }
);
CollapsibleContent.displayName = CONTENT_NAME$4;
var CollapsibleContentImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME$4, __scopeCollapsible);
  const [isPresent, setIsPresent] = reactExports.useState(present);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const heightRef = reactExports.useRef(0);
  const height = heightRef.current;
  const widthRef = reactExports.useRef(0);
  const width = widthRef.current;
  const isOpen = context.open || isPresent;
  const isMountAnimationPreventedRef = reactExports.useRef(isOpen);
  const originalStylesRef = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
    return () => cancelAnimationFrame(rAF);
  }, []);
  useLayoutEffect2(() => {
    const node = ref.current;
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName
      };
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration = originalStylesRef.current.transitionDuration;
        node.style.animationName = originalStylesRef.current.animationName;
      }
      setIsPresent(present);
    }
  }, [context.open, present]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-state": getState$2(context.open),
      "data-disabled": context.disabled ? "" : void 0,
      id: context.contentId,
      hidden: !isOpen,
      ...contentProps,
      ref: composedRefs,
      style: {
        [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
        [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
        ...props.style
      },
      children: isOpen && children
    }
  );
});
function getState$2(open) {
  return open ? "open" : "closed";
}
var Root$2 = Collapsible;
var Trigger$1 = CollapsibleTrigger;
var Content$1 = CollapsibleContent;

var ACCORDION_NAME = "Accordion";
var ACCORDION_KEYS = ["Home", "End", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(ACCORDION_NAME);
var [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME, [
  createCollectionScope$1,
  createCollapsibleScope
]);
var useCollapsibleScope = createCollapsibleScope();
var Accordion = React.forwardRef(
  (props, forwardedRef) => {
    const { type, ...accordionProps } = props;
    const singleProps = accordionProps;
    const multipleProps = accordionProps;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Provider, { scope: props.__scopeAccordion, children: type === "multiple" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImplMultiple, { ...multipleProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImplSingle, { ...singleProps, ref: forwardedRef }) });
  }
);
Accordion.displayName = ACCORDION_NAME;
var [AccordionValueProvider, useAccordionValueContext] = createAccordionContext(ACCORDION_NAME);
var [AccordionCollapsibleProvider, useAccordionCollapsibleContext] = createAccordionContext(
  ACCORDION_NAME,
  { collapsible: false }
);
var AccordionImplSingle = React.forwardRef(
  (props, forwardedRef) => {
    const {
      value: valueProp,
      defaultValue,
      onValueChange = () => {
      },
      collapsible = false,
      ...accordionSingleProps
    } = props;
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? "",
      onChange: onValueChange,
      caller: ACCORDION_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionValueProvider,
      {
        scope: props.__scopeAccordion,
        value: React.useMemo(() => value ? [value] : [], [value]),
        onItemOpen: setValue,
        onItemClose: React.useCallback(() => collapsible && setValue(""), [collapsible, setValue]),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImpl, { ...accordionSingleProps, ref: forwardedRef }) })
      }
    );
  }
);
var AccordionImplMultiple = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {
    },
    ...accordionMultipleProps
  } = props;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
    caller: ACCORDION_NAME
  });
  const handleItemOpen = React.useCallback(
    (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );
  const handleItemClose = React.useCallback(
    (itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)),
    [setValue]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AccordionValueProvider,
    {
      scope: props.__scopeAccordion,
      value,
      onItemOpen: handleItemOpen,
      onItemClose: handleItemClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImpl, { ...accordionMultipleProps, ref: forwardedRef }) })
    }
  );
});
var [AccordionImplProvider, useAccordionContext] = createAccordionContext(ACCORDION_NAME);
var AccordionImpl = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, disabled, dir, orientation = "vertical", ...accordionProps } = props;
    const accordionRef = React.useRef(null);
    const composedRefs = useComposedRefs(accordionRef, forwardedRef);
    const getItems = useCollection$1(__scopeAccordion);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
      if (!ACCORDION_KEYS.includes(event.key)) return;
      const target = event.target;
      const triggerCollection = getItems().filter((item) => !item.ref.current?.disabled);
      const triggerIndex = triggerCollection.findIndex((item) => item.ref.current === target);
      const triggerCount = triggerCollection.length;
      if (triggerIndex === -1) return;
      event.preventDefault();
      let nextIndex = triggerIndex;
      const homeIndex = 0;
      const endIndex = triggerCount - 1;
      const moveNext = () => {
        nextIndex = triggerIndex + 1;
        if (nextIndex > endIndex) {
          nextIndex = homeIndex;
        }
      };
      const movePrev = () => {
        nextIndex = triggerIndex - 1;
        if (nextIndex < homeIndex) {
          nextIndex = endIndex;
        }
      };
      switch (event.key) {
        case "Home":
          nextIndex = homeIndex;
          break;
        case "End":
          nextIndex = endIndex;
          break;
        case "ArrowRight":
          if (orientation === "horizontal") {
            if (isDirectionLTR) {
              moveNext();
            } else {
              movePrev();
            }
          }
          break;
        case "ArrowDown":
          if (orientation === "vertical") {
            moveNext();
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal") {
            if (isDirectionLTR) {
              movePrev();
            } else {
              moveNext();
            }
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical") {
            movePrev();
          }
          break;
      }
      const clampedIndex = nextIndex % triggerCount;
      triggerCollection[clampedIndex].ref.current?.focus();
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionImplProvider,
      {
        scope: __scopeAccordion,
        disabled,
        direction: dir,
        orientation,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: __scopeAccordion, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            ...accordionProps,
            "data-orientation": orientation,
            ref: composedRefs,
            onKeyDown: disabled ? void 0 : handleKeyDown
          }
        ) })
      }
    );
  }
);
var ITEM_NAME$2 = "AccordionItem";
var [AccordionItemProvider, useAccordionItemContext] = createAccordionContext(ITEM_NAME$2);
var AccordionItem = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, value, ...accordionItemProps } = props;
    const accordionContext = useAccordionContext(ITEM_NAME$2, __scopeAccordion);
    const valueContext = useAccordionValueContext(ITEM_NAME$2, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    const triggerId = useId();
    const open = value && valueContext.value.includes(value) || false;
    const disabled = accordionContext.disabled || props.disabled;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionItemProvider,
      {
        scope: __scopeAccordion,
        open,
        disabled,
        triggerId,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root$2,
          {
            "data-orientation": accordionContext.orientation,
            "data-state": getState$1(open),
            ...collapsibleScope,
            ...accordionItemProps,
            ref: forwardedRef,
            disabled,
            open,
            onOpenChange: (open2) => {
              if (open2) {
                valueContext.onItemOpen(value);
              } else {
                valueContext.onItemClose(value);
              }
            }
          }
        )
      }
    );
  }
);
AccordionItem.displayName = ITEM_NAME$2;
var HEADER_NAME = "AccordionHeader";
var AccordionHeader = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...headerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(HEADER_NAME, __scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.h3,
      {
        "data-orientation": accordionContext.orientation,
        "data-state": getState$1(itemContext.open),
        "data-disabled": itemContext.disabled ? "" : void 0,
        ...headerProps,
        ref: forwardedRef
      }
    );
  }
);
AccordionHeader.displayName = HEADER_NAME;
var TRIGGER_NAME$2 = "AccordionTrigger";
var AccordionTrigger = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...triggerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(TRIGGER_NAME$2, __scopeAccordion);
    const collapsibleContext = useAccordionCollapsibleContext(TRIGGER_NAME$2, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.ItemSlot, { scope: __scopeAccordion, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Trigger$1,
      {
        "aria-disabled": itemContext.open && !collapsibleContext.collapsible || void 0,
        "data-orientation": accordionContext.orientation,
        id: itemContext.triggerId,
        ...collapsibleScope,
        ...triggerProps,
        ref: forwardedRef
      }
    ) });
  }
);
AccordionTrigger.displayName = TRIGGER_NAME$2;
var CONTENT_NAME$3 = "AccordionContent";
var AccordionContent = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...contentProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(CONTENT_NAME$3, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content$1,
      {
        role: "region",
        "aria-labelledby": itemContext.triggerId,
        "data-orientation": accordionContext.orientation,
        ...collapsibleScope,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ["--radix-accordion-content-height"]: "var(--radix-collapsible-content-height)",
          ["--radix-accordion-content-width"]: "var(--radix-collapsible-content-width)",
          ...props.style
        }
      }
    );
  }
);
AccordionContent.displayName = CONTENT_NAME$3;
function getState$1(open) {
  return open ? "open" : "closed";
}
var Root2$1 = Accordion;
var Item = AccordionItem;
var Header = AccordionHeader;
var Trigger2 = AccordionTrigger;
var Content2$2 = AccordionContent;

function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext, createScrollAreaScope] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const [content, setContent] = reactExports.useState(null);
    const [scrollbarX, setScrollbarX] = reactExports.useState(null);
    const [scrollbarY, setScrollbarY] = reactExports.useState(null);
    const [cornerWidth, setCornerWidth] = reactExports.useState(0);
    const [cornerHeight, setCornerHeight] = reactExports.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = reactExports.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = reactExports.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME = "ScrollAreaViewport";
var ScrollAreaViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    reactExports.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  reactExports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  reactExports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = reactExports.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = reactExports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = reactExports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = reactExports.useRef(null);
  const pointerOffsetRef = reactExports.useRef(0);
  const [sizes, setSizes] = reactExports.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = reactExports.useState(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = reactExports.useRef(null);
  const prevWebkitUserSelectRef = reactExports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef$1(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef$1(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  reactExports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar?.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  reactExports.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef$1(onThumbChange),
      onThumbPointerUp: useCallbackRef$1(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef$1(onThumbPointerDown),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...scrollbarProps,
          ref: composeRefs,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = reactExports.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    reactExports.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = reactExports.useState(0);
  const [height, setHeight] = reactExports.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver(context.scrollbarX, () => {
    const height2 = context.scrollbarX?.offsetHeight || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver(context.scrollbarY, () => {
    const width2 = context.scrollbarY?.offsetWidth || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp$1(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef$1(callback);
  const debounceTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return reactExports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef$1(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
var Root$1 = ScrollArea;
var Viewport = ScrollAreaViewport;
var Corner = ScrollAreaCorner;

var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME$1 = "DialogTrigger";
var DialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME$1, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME$1;
var PORTAL_NAME$2 = "DialogPortal";
var [PortalProvider$1, usePortalContext$1] = createDialogContext(PORTAL_NAME$2, {
  forceMount: void 0
});
var DialogPortal = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME$2, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider$1, { scope: __scopeDialog, forceMount, children: reactExports.Children.map(children, (child) => /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$3, { asChild: true, container, children: child }) })) });
};
DialogPortal.displayName = PORTAL_NAME$2;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext$1(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay.displayName = OVERLAY_NAME;
var Slot$1 = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot$1, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": getState(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME$2 = "DialogContent";
var DialogContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext$1(CONTENT_NAME$2, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME$2, props.__scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent.displayName = CONTENT_NAME$2;
var DialogContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME$2, props.__scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    reactExports.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME$2, props.__scopeDialog);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    const hasPointerDownOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          props.onCloseAutoFocus?.(event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          props.onInteractOutside?.(event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME$2, __scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME$2,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  reactExports.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  reactExports.useEffect(() => {
    const describedById = contentRef.current?.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog;
var Portal$1 = DialogPortal;
var Overlay = DialogOverlay;
var Content = DialogContent;
var Title = DialogTitle;
var Description = DialogDescription;
var Close = DialogClose;

var SELECTION_KEYS = ["Enter", " "];
var FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
var LAST_KEYS = ["ArrowUp", "PageDown", "End"];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var SUB_OPEN_KEYS = {
  ltr: [...SELECTION_KEYS, "ArrowRight"],
  rtl: [...SELECTION_KEYS, "ArrowLeft"]
};
var SUB_CLOSE_KEYS = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
var MENU_NAME = "Menu";
var [Collection, useCollection, createCollectionScope] = createCollection(MENU_NAME);
var [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
  createCollectionScope,
  createPopperScope,
  createRovingFocusGroupScope
]);
var usePopperScope = createPopperScope();
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
var Menu = (props) => {
  const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
  const popperScope = usePopperScope(__scopeMenu);
  const [content, setContent] = reactExports.useState(null);
  const isUsingKeyboardRef = reactExports.useRef(false);
  const handleOpenChange = useCallbackRef$1(onOpenChange);
  const direction = useDirection(dir);
  reactExports.useEffect(() => {
    const handleKeyDown = () => {
      isUsingKeyboardRef.current = true;
      document.addEventListener("pointerdown", handlePointer, { capture: true, once: true });
      document.addEventListener("pointermove", handlePointer, { capture: true, once: true });
    };
    const handlePointer = () => isUsingKeyboardRef.current = false;
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("pointerdown", handlePointer, { capture: true });
      document.removeEventListener("pointermove", handlePointer, { capture: true });
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$4, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuProvider,
    {
      scope: __scopeMenu,
      open,
      onOpenChange: handleOpenChange,
      content,
      onContentChange: setContent,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuRootProvider,
        {
          scope: __scopeMenu,
          onClose: reactExports.useCallback(() => handleOpenChange(false), [handleOpenChange]),
          isUsingKeyboardRef,
          dir: direction,
          modal,
          children
        }
      )
    }
  ) });
};
Menu.displayName = MENU_NAME;
var ANCHOR_NAME = "MenuAnchor";
var MenuAnchor = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...anchorProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
MenuAnchor.displayName = ANCHOR_NAME;
var PORTAL_NAME$1 = "MenuPortal";
var [PortalProvider, usePortalContext] = createMenuContext(PORTAL_NAME$1, {
  forceMount: void 0
});
var MenuPortal = (props) => {
  const { __scopeMenu, forceMount, children, container } = props;
  const context = useMenuContext(PORTAL_NAME$1, __scopeMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeMenu, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$3, { asChild: true, container, children }) }) });
};
MenuPortal.displayName = PORTAL_NAME$1;
var CONTENT_NAME$1 = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME$1);
var MenuContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeMenu, children: rootContext.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentNonModal, { ...contentProps, ref: forwardedRef }) }) }) });
  }
);
var MenuRootContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    reactExports.useEffect(() => {
      const content = ref.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: context.open,
        disableOutsideScroll: true,
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        ),
        onDismiss: () => context.onOpenChange(false)
      }
    );
  }
);
var MenuRootContentNonModal = reactExports.forwardRef((props, forwardedRef) => {
  const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuContentImpl,
    {
      ...props,
      ref: forwardedRef,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      disableOutsideScroll: false,
      onDismiss: () => context.onOpenChange(false)
    }
  );
});
var Slot = createSlot("MenuContent.ScrollLock");
var MenuContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeMenu,
      loop = false,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEntryFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      ...contentProps
    } = props;
    const context = useMenuContext(CONTENT_NAME$1, __scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const getItems = useCollection(__scopeMenu);
    const [currentItemId, setCurrentItemId] = reactExports.useState(null);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
    const timerRef = reactExports.useRef(0);
    const searchRef = reactExports.useRef("");
    const pointerGraceTimerRef = reactExports.useRef(0);
    const pointerGraceIntentRef = reactExports.useRef(null);
    const pointerDirRef = reactExports.useRef("right");
    const lastPointerXRef = reactExports.useRef(0);
    const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : reactExports.Fragment;
    const scrollLockWrapperProps = disableOutsideScroll ? { as: Slot, allowPinchZoom: true } : void 0;
    const handleTypeaheadSearch = (key) => {
      const search = searchRef.current + key;
      const items = getItems().filter((item) => !item.disabled);
      const currentItem = document.activeElement;
      const currentMatch = items.find((item) => item.ref.current === currentItem)?.textValue;
      const values = items.map((item) => item.textValue);
      const nextMatch = getNextMatch(values, search, currentMatch);
      const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current;
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
      if (newItem) {
        setTimeout(() => newItem.focus());
      }
    };
    reactExports.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);
    useFocusGuards();
    const isPointerMovingToSubmenu = reactExports.useCallback((event) => {
      const isMovingTowards = pointerDirRef.current === pointerGraceIntentRef.current?.side;
      return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentProvider,
      {
        scope: __scopeMenu,
        searchRef,
        onItemEnter: reactExports.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        onItemLeave: reactExports.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) return;
            contentRef.current?.focus();
            setCurrentItemId(null);
          },
          [isPointerMovingToSubmenu]
        ),
        onTriggerLeave: reactExports.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        pointerGraceTimerRef,
        onPointerGraceIntentChange: reactExports.useCallback((intent) => {
          pointerGraceIntentRef.current = intent;
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollLockWrapper, { ...scrollLockWrapperProps, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: trapFocus,
            onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
              event.preventDefault();
              contentRef.current?.focus({ preventScroll: true });
            }),
            onUnmountAutoFocus: onCloseAutoFocus,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside,
                onInteractOutside,
                onDismiss,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Root$3,
                  {
                    asChild: true,
                    ...rovingFocusGroupScope,
                    dir: rootContext.dir,
                    orientation: "vertical",
                    loop,
                    currentTabStopId: currentItemId,
                    onCurrentTabStopIdChange: setCurrentItemId,
                    onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
                      if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
                    }),
                    preventScrollOnEntryFocus: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Content$3,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": getOpenState(context.open),
                        "data-radix-menu-content": "",
                        dir: rootContext.dir,
                        ...popperScope,
                        ...contentProps,
                        ref: composedRefs,
                        style: { outline: "none", ...contentProps.style },
                        onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                          const target = event.target;
                          const isKeyDownInside = target.closest("[data-radix-menu-content]") === event.currentTarget;
                          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                          const isCharacterKey = event.key.length === 1;
                          if (isKeyDownInside) {
                            if (event.key === "Tab") event.preventDefault();
                            if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
                          }
                          const content = contentRef.current;
                          if (event.target !== content) return;
                          if (!FIRST_LAST_KEYS.includes(event.key)) return;
                          event.preventDefault();
                          const items = getItems().filter((item) => !item.disabled);
                          const candidateNodes = items.map((item) => item.ref.current);
                          if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
                          focusFirst(candidateNodes);
                        }),
                        onBlur: composeEventHandlers(props.onBlur, (event) => {
                          if (!event.currentTarget.contains(event.target)) {
                            window.clearTimeout(timerRef.current);
                            searchRef.current = "";
                          }
                        }),
                        onPointerMove: composeEventHandlers(
                          props.onPointerMove,
                          whenMouse((event) => {
                            const target = event.target;
                            const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
                            if (event.currentTarget.contains(target) && pointerXHasChanged) {
                              const newDir = event.clientX > lastPointerXRef.current ? "right" : "left";
                              pointerDirRef.current = newDir;
                              lastPointerXRef.current = event.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
MenuContent.displayName = CONTENT_NAME$1;
var GROUP_NAME$1 = "MenuGroup";
var MenuGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...groupProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", ...groupProps, ref: forwardedRef });
  }
);
MenuGroup.displayName = GROUP_NAME$1;
var LABEL_NAME$1 = "MenuLabel";
var MenuLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...labelProps, ref: forwardedRef });
  }
);
MenuLabel.displayName = LABEL_NAME$1;
var ITEM_NAME$1 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { disabled = false, onSelect, ...itemProps } = props;
    const ref = reactExports.useRef(null);
    const rootContext = useMenuRootContext(ITEM_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(ITEM_NAME$1, props.__scopeMenu);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const isPointerDownRef = reactExports.useRef(false);
    const handleSelect = () => {
      const menuItem = ref.current;
      if (!disabled && menuItem) {
        const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true });
        menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true });
        dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
        if (itemSelectEvent.defaultPrevented) {
          isPointerDownRef.current = false;
        } else {
          rootContext.onClose();
        }
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemImpl,
      {
        ...itemProps,
        ref: composedRefs,
        disabled,
        onClick: composeEventHandlers(props.onClick, handleSelect),
        onPointerDown: (event) => {
          props.onPointerDown?.(event);
          isPointerDownRef.current = true;
        },
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          if (!isPointerDownRef.current) event.currentTarget?.click();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (disabled || isTypingAhead && event.key === " ") return;
          if (SELECTION_KEYS.includes(event.key)) {
            event.currentTarget.click();
            event.preventDefault();
          }
        })
      }
    );
  }
);
MenuItem.displayName = ITEM_NAME$1;
var MenuItemImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
    const contentContext = useMenuContentContext(ITEM_NAME$1, __scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [isFocused, setIsFocused] = reactExports.useState(false);
    const [textContent, setTextContent] = reactExports.useState("");
    reactExports.useEffect(() => {
      const menuItem = ref.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? "").trim());
      }
    }, [itemProps.children]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeMenu,
        disabled,
        textValue: textValue ?? textContent,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Item$1, { asChild: true, ...rovingFocusGroupScope, focusable: !disabled, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "menuitem",
            "data-highlighted": isFocused ? "" : void 0,
            "aria-disabled": disabled || void 0,
            "data-disabled": disabled ? "" : void 0,
            ...itemProps,
            ref: composedRefs,
            onPointerMove: composeEventHandlers(
              props.onPointerMove,
              whenMouse((event) => {
                if (disabled) {
                  contentContext.onItemLeave(event);
                } else {
                  contentContext.onItemEnter(event);
                  if (!event.defaultPrevented) {
                    const item = event.currentTarget;
                    item.focus({ preventScroll: true });
                  }
                }
              })
            ),
            onPointerLeave: composeEventHandlers(
              props.onPointerLeave,
              whenMouse((event) => contentContext.onItemLeave(event))
            ),
            onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
            onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
          }
        ) })
      }
    );
  }
);
var CHECKBOX_ITEM_NAME$1 = "MenuCheckboxItem";
var MenuCheckboxItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItem,
      {
        role: "menuitemcheckbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        ...checkboxItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          checkboxItemProps.onSelect,
          () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME$1;
var RADIO_GROUP_NAME$1 = "MenuRadioGroup";
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(
  RADIO_GROUP_NAME$1,
  { value: void 0, onValueChange: () => {
  } }
);
var MenuRadioGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { value, onValueChange, ...groupProps } = props;
    const handleValueChange = useCallbackRef$1(onValueChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupProvider, { scope: props.__scopeMenu, value, onValueChange: handleValueChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuGroup, { ...groupProps, ref: forwardedRef }) });
  }
);
MenuRadioGroup.displayName = RADIO_GROUP_NAME$1;
var RADIO_ITEM_NAME$1 = "MenuRadioItem";
var MenuRadioItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { value, ...radioItemProps } = props;
    const context = useRadioGroupContext(RADIO_ITEM_NAME$1, props.__scopeMenu);
    const checked = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItem,
      {
        role: "menuitemradio",
        "aria-checked": checked,
        ...radioItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          radioItemProps.onSelect,
          () => context.onValueChange?.(value),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuRadioItem.displayName = RADIO_ITEM_NAME$1;
var ITEM_INDICATOR_NAME = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(
  ITEM_INDICATOR_NAME,
  { checked: false }
);
var MenuItemIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
    const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            ...itemIndicatorProps,
            ref: forwardedRef,
            "data-state": getCheckedState(indicatorContext.checked)
          }
        )
      }
    );
  }
);
MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SEPARATOR_NAME$1 = "MenuSeparator";
var MenuSeparator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...separatorProps,
        ref: forwardedRef
      }
    );
  }
);
MenuSeparator.displayName = SEPARATOR_NAME$1;
var ARROW_NAME$1 = "MenuArrow";
var MenuArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
MenuArrow.displayName = ARROW_NAME$1;
var SUB_NAME = "MenuSub";
var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
var SUB_TRIGGER_NAME$1 = "MenuSubTrigger";
var MenuSubTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const openTimerRef = reactExports.useRef(null);
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
    const scope = { __scopeMenu: props.__scopeMenu };
    const clearOpenTimer = reactExports.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }, []);
    reactExports.useEffect(() => clearOpenTimer, [clearOpenTimer]);
    reactExports.useEffect(() => {
      const pointerGraceTimer = pointerGraceTimerRef.current;
      return () => {
        window.clearTimeout(pointerGraceTimer);
        onPointerGraceIntentChange(null);
      };
    }, [pointerGraceTimerRef, onPointerGraceIntentChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuAnchor, { asChild: true, ...scope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemImpl,
      {
        id: subContext.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": context.open,
        "aria-controls": subContext.contentId,
        "data-state": getOpenState(context.open),
        ...props,
        ref: composeRefs(forwardedRef, subContext.onTriggerChange),
        onClick: (event) => {
          props.onClick?.(event);
          if (props.disabled || event.defaultPrevented) return;
          event.currentTarget.focus();
          if (!context.open) context.onOpenChange(true);
        },
        onPointerMove: composeEventHandlers(
          props.onPointerMove,
          whenMouse((event) => {
            contentContext.onItemEnter(event);
            if (event.defaultPrevented) return;
            if (!props.disabled && !context.open && !openTimerRef.current) {
              contentContext.onPointerGraceIntentChange(null);
              openTimerRef.current = window.setTimeout(() => {
                context.onOpenChange(true);
                clearOpenTimer();
              }, 100);
            }
          })
        ),
        onPointerLeave: composeEventHandlers(
          props.onPointerLeave,
          whenMouse((event) => {
            clearOpenTimer();
            const contentRect = context.content?.getBoundingClientRect();
            if (contentRect) {
              const side = context.content?.dataset.side;
              const rightSide = side === "right";
              const bleed = rightSide ? -5 : 5;
              const contentNearEdge = contentRect[rightSide ? "left" : "right"];
              const contentFarEdge = contentRect[rightSide ? "right" : "left"];
              contentContext.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: event.clientX + bleed, y: event.clientY },
                  { x: contentNearEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.bottom },
                  { x: contentNearEdge, y: contentRect.bottom }
                ],
                side
              });
              window.clearTimeout(pointerGraceTimerRef.current);
              pointerGraceTimerRef.current = window.setTimeout(
                () => contentContext.onPointerGraceIntentChange(null),
                300
              );
            } else {
              contentContext.onTriggerLeave(event);
              if (event.defaultPrevented) return;
              contentContext.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (props.disabled || isTypingAhead && event.key === " ") return;
          if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
            context.onOpenChange(true);
            context.content?.focus();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
MenuSubTrigger.displayName = SUB_TRIGGER_NAME$1;
var SUB_CONTENT_NAME$1 = "MenuSubContent";
var MenuSubContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...subContentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_CONTENT_NAME$1, props.__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        id: subContext.contentId,
        "aria-labelledby": subContext.triggerId,
        ...subContentProps,
        ref: composedRefs,
        align: "start",
        side: rootContext.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: false,
        disableOutsideScroll: false,
        trapFocus: false,
        onOpenAutoFocus: (event) => {
          if (rootContext.isUsingKeyboardRef.current) ref.current?.focus();
          event.preventDefault();
        },
        onCloseAutoFocus: (event) => event.preventDefault(),
        onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
          if (event.target !== subContext.trigger) context.onOpenChange(false);
        }),
        onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
          rootContext.onClose();
          event.preventDefault();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isKeyDownInside = event.currentTarget.contains(event.target);
          const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
          if (isKeyDownInside && isCloseKey) {
            context.onOpenChange(false);
            subContext.trigger?.focus();
            event.preventDefault();
          }
        })
      }
    ) }) }) });
  }
);
MenuSubContent.displayName = SUB_CONTENT_NAME$1;
function getOpenState(open) {
  return open ? "open" : "closed";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getCheckedState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function focusFirst(candidates) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus();
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
function getNextMatch(values, search, currentMatch) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
  const excludeCurrentMatch = normalizedSearch.length === 1;
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
  const nextMatch = wrappedValues.find(
    (value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextMatch !== currentMatch ? nextMatch : void 0;
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function isPointerInGraceArea(event, area) {
  if (!area) return false;
  const cursorPos = { x: event.clientX, y: event.clientY };
  return isPointInPolygon(cursorPos, area);
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root3 = Menu;
var Anchor2 = MenuAnchor;
var Portal = MenuPortal;
var Content2$1 = MenuContent;
var Group = MenuGroup;
var Label = MenuLabel;
var Item2$1 = MenuItem;
var CheckboxItem = MenuCheckboxItem;
var RadioGroup = MenuRadioGroup;
var RadioItem = MenuRadioItem;
var ItemIndicator = MenuItemIndicator;
var Separator = MenuSeparator;
var Arrow2 = MenuArrow;
var SubTrigger = MenuSubTrigger;
var SubContent = MenuSubContent;

var DROPDOWN_MENU_NAME = "DropdownMenu";
var [createDropdownMenuContext, createDropdownMenuScope] = createContextScope(
  DROPDOWN_MENU_NAME,
  [createMenuScope]
);
var useMenuScope = createMenuScope();
var [DropdownMenuProvider, useDropdownMenuContext] = createDropdownMenuContext(DROPDOWN_MENU_NAME);
var DropdownMenu = (props) => {
  const {
    __scopeDropdownMenu,
    children,
    dir,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  const triggerRef = reactExports.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DROPDOWN_MENU_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DropdownMenuProvider,
    {
      scope: __scopeDropdownMenu,
      triggerId: useId(),
      triggerRef,
      contentId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root3, { ...menuScope, open, onOpenChange: setOpen, dir, modal, children })
    }
  );
};
DropdownMenu.displayName = DROPDOWN_MENU_NAME;
var TRIGGER_NAME = "DropdownMenuTrigger";
var DropdownMenuTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props;
    const context = useDropdownMenuContext(TRIGGER_NAME, __scopeDropdownMenu);
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor2, { asChild: true, ...menuScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        id: context.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": context.open,
        "aria-controls": context.open ? context.contentId : void 0,
        "data-state": context.open ? "open" : "closed",
        "data-disabled": disabled ? "" : void 0,
        disabled,
        ...triggerProps,
        ref: composeRefs(forwardedRef, context.triggerRef),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          if (!disabled && event.button === 0 && event.ctrlKey === false) {
            context.onOpenToggle();
            if (!context.open) event.preventDefault();
          }
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (disabled) return;
          if (["Enter", " "].includes(event.key)) context.onOpenToggle();
          if (event.key === "ArrowDown") context.onOpenChange(true);
          if (["Enter", " ", "ArrowDown"].includes(event.key)) event.preventDefault();
        })
      }
    ) });
  }
);
DropdownMenuTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DropdownMenuPortal";
var DropdownMenuPortal = (props) => {
  const { __scopeDropdownMenu, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...menuScope, ...portalProps });
};
DropdownMenuPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "DropdownMenuContent";
var DropdownMenuContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...contentProps } = props;
    const context = useDropdownMenuContext(CONTENT_NAME, __scopeDropdownMenu);
    const menuScope = useMenuScope(__scopeDropdownMenu);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2$1,
      {
        id: context.contentId,
        "aria-labelledby": context.triggerId,
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
          hasInteractedOutsideRef.current = false;
          event.preventDefault();
        }),
        onInteractOutside: composeEventHandlers(props.onInteractOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
        }),
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
DropdownMenuContent.displayName = CONTENT_NAME;
var GROUP_NAME = "DropdownMenuGroup";
var DropdownMenuGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
DropdownMenuGroup.displayName = GROUP_NAME;
var LABEL_NAME = "DropdownMenuLabel";
var DropdownMenuLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
DropdownMenuLabel.displayName = LABEL_NAME;
var ITEM_NAME = "DropdownMenuItem";
var DropdownMenuItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Item2$1, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
DropdownMenuItem.displayName = ITEM_NAME;
var CHECKBOX_ITEM_NAME = "DropdownMenuCheckboxItem";
var DropdownMenuCheckboxItem = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
});
DropdownMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "DropdownMenuRadioGroup";
var DropdownMenuRadioGroup = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
});
DropdownMenuRadioGroup.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "DropdownMenuRadioItem";
var DropdownMenuRadioItem = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
});
DropdownMenuRadioItem.displayName = RADIO_ITEM_NAME;
var INDICATOR_NAME = "DropdownMenuItemIndicator";
var DropdownMenuItemIndicator = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
DropdownMenuItemIndicator.displayName = INDICATOR_NAME;
var SEPARATOR_NAME = "DropdownMenuSeparator";
var DropdownMenuSeparator = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...separatorProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
});
DropdownMenuSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "DropdownMenuArrow";
var DropdownMenuArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
DropdownMenuArrow.displayName = ARROW_NAME;
var SUB_TRIGGER_NAME = "DropdownMenuSubTrigger";
var DropdownMenuSubTrigger = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...subTriggerProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SubTrigger, { ...menuScope, ...subTriggerProps, ref: forwardedRef });
});
DropdownMenuSubTrigger.displayName = SUB_TRIGGER_NAME;
var SUB_CONTENT_NAME = "DropdownMenuSubContent";
var DropdownMenuSubContent = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...subContentProps } = props;
  const menuScope = useMenuScope(__scopeDropdownMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SubContent,
    {
      ...menuScope,
      ...subContentProps,
      ref: forwardedRef,
      style: {
        ...props.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
DropdownMenuSubContent.displayName = SUB_CONTENT_NAME;
var Root2 = DropdownMenu;
var Trigger = DropdownMenuTrigger;
var Portal2 = DropdownMenuPortal;
var Content2 = DropdownMenuContent;
var Label2 = DropdownMenuLabel;
var Item2 = DropdownMenuItem;
var CheckboxItem2 = DropdownMenuCheckboxItem;
var RadioItem2 = DropdownMenuRadioItem;
var ItemIndicator2 = DropdownMenuItemIndicator;
var Separator2 = DropdownMenuSeparator;
var SubTrigger2 = DropdownMenuSubTrigger;
var SubContent2 = DropdownMenuSubContent;

export { Content$2 as $, Trigger2 as A, Content2$2 as B, Cloud as C, Root2$1 as D, Root$5 as E, server_default as F, Slot$3 as G, Header as H, Icon as I, Menu$1 as J, ChevronRight as K, LoaderCircle as L, MessageSquare as M, LayoutDashboard as N, Users as O, Portal$2 as P, CreditCard as Q, React as R, Shield as S, Trigger$3 as T, UserCheck as U, Viewport$1 as V, FileText as W, X, Settings as Y, List as Z, Trigger$2 as _, Mail as a, Root2$2 as a0, Share2 as a1, User as a2, Bot as a3, Root$1 as a4, Viewport as a5, Corner as a6, ScrollAreaScrollbar as a7, ScrollAreaThumb as a8, Overlay as a9, Brain as aA, Clock as aB, Sparkles as aC, Plus as aD, Download as aE, Send as aF, Copy as aG, FileImage as aH, FileCode as aI, ExternalLink as aJ, ChartColumn as aK, Activity as aL, Zap as aM, Stethoscope as aN, ArrowRight as aO, ClipboardList as aP, Portal$1 as aa, Content as ab, Close as ac, Title as ad, Description as ae, Root as af, SubTrigger2 as ag, SubContent2 as ah, Portal2 as ai, Content2 as aj, Item2 as ak, CheckboxItem2 as al, ItemIndicator2 as am, RadioItem2 as an, Circle as ao, Label2 as ap, Separator2 as aq, Root2 as ar, Trigger as as, BookOpen as at, Search as au, FilePlus as av, FolderOpen as aw, Eye as ax, EyeOff as ay, Trash2 as az, Checkbox as b, createColumnHelper as c, CheckboxIndicator as d, Check as e, Lock as f, getCoreRowModel as g, CircleAlert as h, Save as i, jsxRuntimeExports as j, flexRender as k, ChevronDown as l, ScrollUpButton as m, ChevronUp as n, ScrollDownButton as o, Content2$3 as p, Label$1 as q, reactExports as r, Item$2 as s, ItemIndicator$1 as t, useReactTable as u, ItemText as v, Separator$1 as w, Root2$3 as x, Value as y, Item as z };
//# sourceMappingURL=react-vendor_BBaf1uT2.mjs.map
