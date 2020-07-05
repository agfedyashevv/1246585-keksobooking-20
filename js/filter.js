'use strict';
(function () {

  var MAX_PINS_ON_MAP = 5;

  var housingType = document.querySelector('#housing-type');

  var housingFilter = function (pin) {
    return housingType.value === pin.offer.type || housingType.value === 'any';
  };

  var setFilters = function (pins) {
    var newPins = [];
    var i = 0;
    while (newPins.length < MAX_PINS_ON_MAP && i < pins.length) {
      var pin = pins[i];
      if (housingFilter(pin)) {
        newPins.push(pins[i]);
      }
      i++;
    }
    return newPins;
  };

  window.filter = {
    setFilters: setFilters
  };
})();
