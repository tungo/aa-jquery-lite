/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

window.$l = function (selector) {
  if (selector instanceof HTMLElement) {
    return new DOMNodeCollection([selector]);
  } else if (selector instanceof Function) {
    if (document.readyState === "complete") {
      return selector();
    } else {
      this.callbackQueue.push(selector);
      return;
    }
  }

  const elems = Array.from(document.querySelectorAll(selector));
  return new DOMNodeCollection(elems);
};

window.$l.extend = function (obj1, obj2) {
  let result = {};
  let args = Array.from(arguments);

  args.forEach((el) => {
    let keys = Object.keys(el);

    keys.forEach((k) => {
      result[k] = el[k];
    });
  });

  return result;
};

window.$l.ajax = function (options) {
  const defaults = {
    type: "GET",
    url: window.location.href,
    dataType: "json",
    data: {}
  };

  options = window.$l.extend(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(options.type, options.url);
  xhr.onload = function () {
    if (options.success instanceof Function &&
        this.status === 200) {
      options.success(xhr.response);
    } else if (options.error instanceof Function &&
               this.status !== 200) {
      options.error(xhr.response);
    }
  };
  xhr.send(options.data);
};

window.callbackQueue = [];
document.addEventListener("DOMContentLoaded", () => {
  window.callbackQueue.forEach((el) => el());
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(elements) {
    this.elements = elements;
  }

  attr(attribute, value) {
    if (value === undefined) {
      return this.elements[0].getAttribute(attribute);
    } else {
      this.elements.forEach((el) => {
        el.setAttribute(attribute, value);
      });
    }
  }

  addClass(className) {
    this.elements.forEach((el) => {
      if (!el.className.includes(className)) {
        el.className += ` ${className}`;
      }
    });
  }

  removeClass(classNames) {
    if (classNames === undefined) {
      this.elements.forEach((el) => {
        el.className = "";
      });
    } else {
      const classList = classNames.split(" ");

      this.elements.forEach((el) => {
        classList.forEach((className) => {
          el.className = el.className.replace(className, "").trim();
        });
      });
    }
  }

  html(innerHTML) {
    if (innerHTML === undefined) {
      return this.elements[0].innerHTML;
    } else {
      this.appendInnerHTML(innerHTML, false);
    }
  }

  empty() {
    this.html('');
  }

  appendInnerHTML(content, isAppend = true) {
    this.elements.forEach( el => {
      if (isAppend) {
        el.innerHTML += content;
      } else {
        el.innerHTML = content;
      }
    });
  }

  append(content) {
    if (content instanceof DOMNodeCollection) {
      const outerHTML = "";
      content.elements.forEach((el) => {
        outerHTML += el.outerHTML;
      });

      this.appendInnerHTML(outerHTML);
    } else if (content instanceof HTMLElement) {
      this.appendInnerHTML(content.outerHTML);
    } else {
      this.appendInnerHTML(content);
    }
  }

  children() {
    let els = [];
    this.elements.forEach((el) => {
      els = els.concat(Array.from(el.children));
    });

    return new DOMNodeCollection(els);
  }

  parent() {
    let parents = [];
    this.elements.forEach((el) => {
      if (!parents.includes(el.parentNode)) {
        parents.push(el.parentNode);
      }
    });

    return parents;
  }

  find(selector) {
    let foundElements = [];

    this.elements.forEach((el) => {
      let selectedChildren = Array.from(el.querySelectorAll(selector));
      foundElements = foundElements.concat(selectedChildren);
    });

    return new DOMNodeCollection(foundElements);
  }

  remove() {
    this.elements.forEach((el) => {
      el.remove();
    });
    this.elements = [];
  }

  on(type, callback) {
    this.elements.forEach((el) => {
      el.addEventListener(type, callback);

      if (el.eventListenerCallback === undefined) {
        el.eventListenerCallback = {};
      }
      el.eventListenerCallback[type] = callback;
    });
  }

  off(type) {
    this.elements.forEach((el) => {
      el.removeEventListener(type, el.eventListenerCallback[type]);
    });
  }
}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);