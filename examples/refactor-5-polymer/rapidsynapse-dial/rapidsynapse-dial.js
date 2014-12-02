(function(scope) {
  var RS = window.RS;

  Polymer({
    publish: {
      'min': 0,
      'max': 100,
      'value': 0,
      'ratio': 1,
      'dragFactor': 5
    },

    lastY: undefined,

    eventDelegates: {
      'mousedown': 'startDrag',
    },

    observe: {
      'value': 'rotate',
    },

    rotate: function() {
      var degrees = 360 / this.max * this.value * this.ratio;
      this.style.transform = 'rotate(' + degrees + 'deg)';
    },

    // Drag Management

    startDrag: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.ownerDocument.body.classList.add('dragging');
      this.lastY = e.clientY;
      this.style.transitionDuration = '';
      window.onmousemove = this.drag.bind(this);
    },

    drag: function(e) {
      var dy = e.clientY - this.lastY;
      var v = this.value + (dy * -1 * (this.dragFactor / this.ratio));
      this.lastY = e.clientY;
      this.value = RS.bound(v, this.min, this.max, 2);
    },

    endDrag: function(e) {
      this.ownerDocument.body.classList.remove('dragging');
      this.lastY = undefined;
      window.onmousemove = null;
    },

    ready: function() {
      window.addEventListener('mouseup', this.endDrag.bind(this));
      window.addEventListener('mouseleave', this.endDrag.bind(this));
    }

  });

})(window);
