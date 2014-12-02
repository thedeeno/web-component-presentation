(function(exports) {
  var RS = window.RS;
  var RapidSynapseDial = exports.RapidSynapseDial;

  // Constructor Function

  var Tuner = function(el, options) {
    this.init.apply(this, arguments);
  };

  // Initialize

  Tuner.prototype.init = function(el, options) {
    this.options = options;
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.macroRatio = options.macroRatio || 1;
    this.microRatio = options.microRatio || 1;

    this.upgradeElement(el);
    this.wireEvents();

    this.setValue(options.value);
  };

  Tuner.prototype.upgradeElement = function(el) {
    el.classList.add('rapidsynapse-tunner');

    // NOTE: Slower than concat but more readable. Worth it in this case.
    el.innerHTML = [
      '<h2>macro control</h2>',
      '<div class="rapidsynapse-tuner-macro"></div>',
      '',
      '<h2>micro control</h2>',
      '<div class="rapidsynapse-tuner-micro"></div>',
      '',
      '<h2>value</h2>',
      '<input></input>'
    ].join('\n');

    // referece dials
    var macroEl = el.querySelector('.rapidsynapse-tuner-macro');
    var microEl = el.querySelector('.rapidsynapse-tuner-micro');

    // upgrade dials
    var macroOptions = RS.merge(this.options, {ratio: this.macroRatio});
    var microOptions = RS.merge(this.options, {ratio: this.microRatio});
    this.macro = new RapidSynapseDial(macroEl, macroOptions);
    this.micro = new RapidSynapseDial(microEl, microOptions);

    // reference input
    this.input = el.querySelector('input');
  };

  Tuner.prototype.wireEvents = function() {
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

  Tuner.prototype.setValue = function(v) {
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

  Tuner.prototype.enableTransitions = function() {
    this.macro.el.style.transitionDuration = '2s';
    this.micro.el.style.transitionDuration = '2s';
  };

  Tuner.prototype.disableTransitions = function() {
    this.macro.el.style.transitionDuration = '';
    this.micro.el.style.transitionDuration = '';
  };

  exports.RapidSynapseTuner = Tuner;
})(window);
