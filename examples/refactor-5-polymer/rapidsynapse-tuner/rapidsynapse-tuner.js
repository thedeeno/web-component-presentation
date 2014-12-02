(function() {
  var RS = window.RS;

  Polymer({

    publish: {
      'min': 0,
      'max': 100,
      'macroRatio': 1,
      'microRatio': 1,
      'value': 0,
      'prettyValue': 0
    },

    computed: {
      prettyValue: 'constrain(value)'
    },

    setDialsToValue: function(e) {
      // enable transitions
      this.$.macro.style.transitionDuration = '2s';
      this.$.micro.style.transitionDuration = '2s';

      // set value
      this.value = this.$.direct.value;

      // disable transitions
      setTimeout(function() {
        this.$.macro.style.transitionDuration = '';
        this.$.micro.style.transitionDuration = '';
      }.bind(this), 2000);
    },

    constrain: function(v) {
      return RS.bound(v, this.min, this.max, 2);
    },

  });

})();
