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
}

module.exports = DOMNodeCollection;
