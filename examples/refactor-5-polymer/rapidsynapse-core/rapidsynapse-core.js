(function(scope) {
  scope.RS = scope.RS || {};

  scope.RS.merge = function(a, b) {
    var c = {};
    var key;
    for (key in a) { c[key] = a[key]; }
    for (key in b) { c[key] = b[key]; }
    return c;
  };

  // keep value within min/max
  scope.RS.bound = function(value, min, max, round) {
    if (round) {
      value = Math.round(value, round);
    }
    value = max < value ? max : value;
    value = min > value ? min : value;
    return value;
  };

})(window);
