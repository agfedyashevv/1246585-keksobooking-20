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
  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  var successElement = successTemplate.cloneNode(true);

  var adFormReset = document.querySelector('.ad-form__reset');

  var offerTypes = {
    bungalo: {
      typeRu: 'Бунгало',
      minPrice: 0,
    },
    flat: {
      typeRu: 'Квартира',
      minPrice: 1000
    },
    house: {
      typeRu: 'Дом',
      minPrice: 5000
    },
    palace: {
      typeRu: 'Дворец',
      minPrice: 10000
    }
  };

  // установка зависимостей типа жилья и цены за ночь
  var setHousingPrice = function () {
    priceInput.placeholder = offerTypes[typeOfHousing.value].minPrice;
    priceInput.min = offerTypes[typeOfHousing.value].minPrice;
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

  var showSuccessMessage = function () {
    document.addEventListener('click', function () {
      closeSuccessMessage(successElement);
    });
    document.addEventListener('keydown', closeEscSuccess);
    window.pin.mainSection.insertAdjacentElement('afterbegin', successElement);
  };

  var closeEscSuccess = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccessMessage(successElement);
      document.removeEventListener('keydown', closeEscSuccess);
    }
  };

  var closeSuccessMessage = function () {
    successElement.remove(successElement);
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();

    window.backend.uploadData(new FormData(mapAdForm), showSuccessMessage, window.pin.onError);
    mapAdForm.reset();
    window.card.closeAnnouncements();
    window.pin.mapFilters.reset();
    window.mapControl.setUnactiveMode();
    window.pin.deletePins();
    setHousingPrice();
  };

  var resetForm = function (evt) {
    evt.preventDefault();
    mapAdForm.reset();
    window.card.closeAnnouncements();
    window.pin.mapFilters.reset();
    window.pin.drawPins();
    window.pin.getMainPinAddress();
    setHousingPrice();
  };

  typeOfHousing.addEventListener('change', setHousingPrice);
  timeIn.addEventListener('change', setTimeInToOut);
  timeOut.addEventListener('change', setTimeOutToIn);
  rooms.addEventListener('change', setRoomCapacity);
  capacity.addEventListener('change', setRoomCapacity);
  adFormSubmit.addEventListener('click', setRoomCapacity);
  mapAdForm.addEventListener('submit', onFormSubmit);
  adFormReset.addEventListener('click', resetForm);

  window.form = {
    mapAdForm: mapAdForm,
    offerTypes: offerTypes
  };

})();
