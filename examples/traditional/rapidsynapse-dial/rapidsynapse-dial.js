(function(exports) {

  var RS = window.RS;

  var Dial = function(el, options) {
    this.init.apply(this, arguments);
  };

  Dial.prototype.init = function(el, options) {
    // initialize properties
    this.el = el;
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.value = options.value || 0;
    this.ratio = options.ratio || 1;
    this.dragFactor = options.dragFactor || 5;

    // proxy html element methods
    this.addEventListener = function() {
      el.addEventListener.apply(el, arguments);
    };
    this.dispatchEvent = function() {
      el.dispatchEvent.apply(el, arguments);
    };

    // setup
    this.upgradeElement(el);

    // wire events
    this.el.onmousedown = this.startDrag.bind(this);
    window.onmouseup = this.endDrag.bind(this);
    window.mouseleave = this.endDrag.bind(this);

    this.updateRotation();
  };

  // DOM

  Dial.prototype.upgradeElement = function(el) {
    el.classList.add('rapidsynapse-dial');
    el.innerHTML = '<div class="rapidsynapse-dial-tick"></div>';
  };

  // Events

  Dial.prototype.startDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.el.ownerDocument.body.classList.add('dragging');
    this.lastY = e.clientY;
    this.el.style.transitionDuration = '';
    window.onmousemove = this.drag.bind(this);
  };

  Dial.prototype.drag = function(e) {
    var dy = e.clientY - this.lastY;
    this.lastY = e.clientY;
    this.setValue(this.value + (dy * -1 * (this.dragFactor / this.ratio)));
  };

  Dial.prototype.endDrag = function(e) {
    this.el.ownerDocument.body.classList.remove('dragging');
    this.lastY = undefined;
    window.onmousemove = null;
  };

  // Value/Rotation Management

  Dial.prototype.setValue = function(v) {
    var valueChanged;

    this.value = RS.bound(v, this.min, this.max, 2);

    valueChanged = new CustomEvent('valueChanged', {'detail': this.value});
    this.el.setAttribute('value', this.value);
    this.el.dispatchEvent(valueChanged);
    this.updateRotation();
  };

  Dial.prototype.updateRotation = function() {
    var degrees = 360 / this.max * this.value * this.ratio;
    this.el.style.transform = 'rotate(' + degrees + 'deg)';
  };

  exports.RapidSynapseDial = Dial;

})(window);
