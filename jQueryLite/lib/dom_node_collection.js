class DOMNodeCollection {
  constructor(elements) {
    this.elements = elements;
  }

  html(innerHTML) {
    if (innerHTML === undefined) {
      return this.elements[0].innerHTML;
    } else {
      this.elements.forEach( el => {
        el.innerHTML = innerHTML;
      });
    }
  }

  empty() {
    this.html('');
  }
}

module.exports = DOMNodeCollection;
