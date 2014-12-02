(function(scope) {
  var RS = window.RS;

  var template = document
    .currentScript
    .ownerDocument
    .querySelector('template');

  var tuner = Object.create(HTMLElement.prototype);

  tuner.createdCallback = function() {
    // initialize properties
    this.min = this.getAttribute('min') || 0;
    this.max = this.getAttribute('max') || 100;
    this.macroRatio = this.getAttribute('macro-ratio') || 1;
    this.microRatio = this.getAttribute('micro-ratio') || 1;

    this.upgradeElement();
    this.wireEvents();

    this.setValue(this.getAttribute('value'));
  };

  tuner.upgradeElement = function() {
    // setup html
    this.appendChild(
      document.importNode(template.content, true)
    );

    // referece dials
    this.macro = this.querySelector('.macro');
    this.micro = this.querySelector('.micro');

    // setup macro
    this.macro.min = this.min;
    this.macro.max = this.max;
    this.macro.value = this.value;
    this.macro.ratio = this.macroRatio;

    // setup micro
    this.micro.min = this.min;
    this.micro.max = this.max;
    this.micro.value = this.value;
    this.micro.ratio = this.microRatio;

    // reference input
    this.input = this.querySelector('input');
  };

  tuner.wireEvents = function() {
    this.macro.addEventListener('valueChanged', function(e) {
      this.setValue(e.detail);
    }.bind(this));

    this.micro.addEventListener('valueChanged', function(e) {
      this.setValue(e.detail);
    }.bind(this));

    this.input.addEventListener('blur', function(e) {
      this.enableTransitions();
      this.setValue(e.target.value);
      setTimeout(this.disableTransitions.bind(this), 2000);
    }.bind(this));
  };

  tuner.setValue = function(v) {
    v = RS.bound(v, this.min, this.max, 2);

    var dirty = this.value !== v;

    if (dirty) {
      this.value = v;
      this.micro.setValue(v);
      this.macro.setValue(v);
      this.input.value = v;
    }
  };

  // Transition Style Management

  tuner.enableTransitions = function() {
    this.macro.style.transitionDuration = '2s';
    this.micro.style.transitionDuration = '2s';
  };

  tuner.disableTransitions = function() {
    this.macro.style.transitionDuration = '';
    this.micro.style.transitionDuration = '';
  };

  // Register custom element

  document.registerElement('rapidsynapse-tuner', {
    prototype: tuner
  });

})(window);
