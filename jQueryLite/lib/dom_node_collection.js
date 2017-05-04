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
    // els = this.elements.reduce((accum, el) => accum.concat(el.children), []);
    this.elements.forEach((el) => {
      els = els.concat(Array.from(el.children));
    });
    console.log(els);
    return new DOMNodeCollection(els);
  }
}

module.exports = DOMNodeCollection;
