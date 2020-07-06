'use strict';
(function () {

  var MAX_PINS_ON_MAP = 5;
  var DEFAULT_FILTER_VALUE = 'any';

  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housinGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');

  var priceValues = {
    low: {
      min: 0,
      max: 9999
    },
    middle: {
      min: 10000,
      max: 49999
    },
    high: {
      min: 50000,
      max: 10000000
    }
  };

  var housingFilter = function (pin) {
    return housingType.value === DEFAULT_FILTER_VALUE
      || housingType.value === pin.offer.type;
  };

  var priceFilter = function (pin) {
    return housingPrice.value === DEFAULT_FILTER_VALUE
      || pin.offer.price >= priceValues[housingPrice.value].min
      && pin.offer.price <= priceValues[housingPrice.value].max;
  };

  var roomsFilter = function (pin) {
    return housingRooms.value === DEFAULT_FILTER_VALUE
      || pin.offer.rooms === Number(housingRooms.value);
  };

  var guestsFilter = function (pin) {
    return housinGuests.value === DEFAULT_FILTER_VALUE
      || pin.offer.guests === Number(housinGuests.value);
  };

  var featuresFilter = function (pin) {
    var selectFeatures = Array.from(housingFeatures.querySelectorAll('input:checked'));
    return selectFeatures.every(function (element) {
      return pin.offer.features.some(function (feature) {
        return feature === element.value;
      });
    });
  };

  var setFilters = function (pins) {
    var newPins = [];
    var i = 0;
    while (newPins.length < MAX_PINS_ON_MAP && i < pins.length) {
      var pin = pins[i];
      if (housingFilter(pin)
        && priceFilter(pin)
        && roomsFilter(pin)
        && guestsFilter(pin)
        && featuresFilter(pin)) {
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
