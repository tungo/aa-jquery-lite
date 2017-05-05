const DOMNodeCollection = require("./dom_node_collection.js");

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

window.callbackQueue = [];
document.addEventListener("DOMContentLoaded", () => {
  window.callbackQueue.forEach((el) => el());
});
