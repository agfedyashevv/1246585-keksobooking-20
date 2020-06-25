'use strict';

(function () {

  var adFormSubmit = document.querySelector('.ad-form__submit');
  var mapAdForm = document.querySelector('.ad-form');
  var priceInput = mapAdForm.querySelector('#price');
  var typeOfHousing = mapAdForm.querySelector('#type');
  var timeIn = mapAdForm.querySelector('#timein');
  var timeOut = mapAdForm.querySelector('#timeout');
  var rooms = mapAdForm.querySelector('#room_number');
  var capacity = mapAdForm.querySelector('#capacity');

  var minPricesForNight = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  // установка зависимостей типа жилья и цены за ночь
  var setHousingPrice = function () {
    priceInput.placeholder = minPricesForNight[typeOfHousing.value];
    priceInput.min = minPricesForNight[typeOfHousing.value];
  };

  // установка зависимостей времени заезда и выезда
  var setTimeInToOut = function () {
    timeOut.value = timeIn.value;
  };

  var setTimeOutToIn = function () {
    timeIn.value = timeOut.value;
  };

  // установка зависимостей количества комнат и мест
  var setRoomCapacity = function () {
    if (Number(rooms.value) < Number(capacity.value)) {
      capacity.setCustomValidity('Количество гостей не может превышать количество комнат');
    } else if (Number(capacity.value) === 0 && Number(rooms.value) !== 100) {
      capacity.setCustomValidity('«Не для гостей» можно выбрать только 100 комнат');
    } else if (Number(rooms.value) === 100 && Number(capacity.value) !== 0) {
      capacity.setCustomValidity('100 комнат — «не для гостей»');
    } else {
      capacity.setCustomValidity('');
    }
  };

  typeOfHousing.addEventListener('change', setHousingPrice);
  timeIn.addEventListener('change', setTimeInToOut);
  timeOut.addEventListener('change', setTimeOutToIn);
  rooms.addEventListener('change', setRoomCapacity);
  capacity.addEventListener('change', setRoomCapacity);
  adFormSubmit.addEventListener('click', setRoomCapacity);

  adFormSubmit.addEventListener('submit', function (evt) {
    window.backend.uploadData(new FormData(adFormSubmit), function (response) {
      window.form.mapAdForm.classList.add('ad-form--disabled');
      window.mapControl.disableElements();
    });
    evt.preventDefault();
  });

  window.form = {
    mapAdForm: mapAdForm
  };

})();
