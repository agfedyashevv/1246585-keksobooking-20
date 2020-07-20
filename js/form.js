'use strict';

(function () {

  var CAPACITY_MIN = 0;
  var ROOMS_MAX = 100;

  var adFormSubmit = document.querySelector('.ad-form__submit');
  var adField = document.querySelector('.ad-form');
  var priceInput = adField.querySelector('#price');
  var typeOfHousing = adField.querySelector('#type');
  var timeIn = adField.querySelector('#timein');
  var timeOut = adField.querySelector('#timeout');
  var rooms = adField.querySelector('#room_number');
  var capacity = adField.querySelector('#capacity');
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
    } else if (Number(capacity.value) === CAPACITY_MIN && Number(rooms.value) !== ROOMS_MAX) {
      capacity.setCustomValidity('«Не для гостей» можно выбрать только 100 комнат');
    } else if (Number(rooms.value) === ROOMS_MAX && Number(capacity.value) !== CAPACITY_MIN) {
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
    window.mapControl.setUnactiveMode();
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
    document.removeEventListener('click', function () {
      closeSuccessMessage(successElement);
    });
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();

    window.backend.uploadData(new FormData(adField), showSuccessMessage, window.pin.onError);
  };

  var resetForm = function (evt) {
    evt.preventDefault();

    window.mapControl.setUnactiveMode();
  };

  typeOfHousing.addEventListener('change', setHousingPrice);
  timeIn.addEventListener('change', setTimeInToOut);
  timeOut.addEventListener('change', setTimeOutToIn);
  rooms.addEventListener('change', setRoomCapacity);
  capacity.addEventListener('change', setRoomCapacity);
  adFormSubmit.addEventListener('click', setRoomCapacity);
  adField.addEventListener('submit', onFormSubmit);
  adFormReset.addEventListener('click', resetForm);

  window.form = {
    adField: adField,
    offerTypes: offerTypes,
    setHousingPrice: setHousingPrice
  };

})();
