(function(scope) {
  var RS = window.RS;

  var template = document
    .currentScript
    .ownerDocument
    .querySelector('template');

  var dial = Object.create(HTMLElement.prototype);

  dial.createdCallback = function() {
    // initialize properties
    this.min = this.getAttribute('min') || 0;
    this.max = this.getAttribute('max') || 100;
    this.value = this.getAttribute('value') || 0;
    this.ratio = this.getAttribute('ratio') || 1;
    this.dragFactor = this.getAttribute('dragFactor') || 5;

    // setup html
    this.appendChild(
      document.importNode(template.content, true)
    );

    // wire events
    this.onmousedown = this.startDrag.bind(this);
    window.onmouseup = this.endDrag.bind(this);
    window.mouseleave = this.endDrag.bind(this);

    this.updateRotation();
  };

  // Events

  dial.startDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.ownerDocument.body.classList.add('dragging');
    this.lastY = e.clientY;
    this.style.transitionDuration = '';
    window.onmousemove = this.drag.bind(this);
  };

  dial.drag = function(e) {
    var dy = e.clientY - this.lastY;
    this.lastY = e.clientY;
    this.setValue(this.value + (dy * -1 * (this.dragFactor / this.ratio)));
  };

  dial.endDrag = function(e) {
    this.ownerDocument.body.classList.remove('dragging');
    this.lastY = undefined;
    window.onmousemove = null;
  };

  // Value/Rotation Management

  dial.setValue = function(v) {
    var valueChanged;

    this.value = RS.bound(v, this.min, this.max, 2);

    valueChanged = new CustomEvent('valueChanged', {'detail': this.value});
    this.setAttribute('value', this.value);
    this.dispatchEvent(valueChanged);
    this.updateRotation();
  };

  dial.updateRotation = function() {
    var degrees = 360 / this.max * this.value * this.ratio;
    this.style.transform = 'rotate(' + degrees + 'deg)';
  };

  document.registerElement('rapidsynapse-dial', {prototype: dial});

})(window);
