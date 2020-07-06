'use strict';

(function () {

  var HEIGHT_TAIL_MAIN_PIN = 22;
  var similarListElement = window.mapControl.mapElement.querySelector('.map__pins');
  var mapPinMain = window.mapControl.mapElement.querySelector('.map__pin--main');
  var mapFilters = document.querySelector('.map__filters');
  var pinImage = mapPinMain.querySelector('img');
  var activeMode = false;
  var pins = [];

  // находит шаблон пина
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  // находит шаблон сообщения об ошибке
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var errorElement = errorTemplate.cloneNode(true);

  var mainSection = document.querySelector('main');

  // отслеживает нажатие левой кнопки мыши
  var onLeftMouseDownProcess = function (evt) {
    if (evt.button === 0) {
      evt.preventDefault();
      window.mapControl.deleteUnactiveMode();
    }
  };

  // отслеживает нажатие Enter
  var onEnterProcess = function (evt) {
    if (evt.key === 'Enter') {
      window.mapControl.deleteUnactiveMode();
    }
  };

  var onEscProcess = function (evt) {
    if (evt.key === 'Escape') {
      window.mapControl.deleteUnactiveMode();
    }
  };

  // выводит координаты главного пина в строку 'Адрес'
  var getMainPinAddress = function () {
    var leftCoord = mapPinMain.offsetLeft;
    var topCoord = mapPinMain.offsetTop;

    if (window.pin.activeMode) {
      leftCoord = mapPinMain.offsetLeft + pinImage.width / 2;
      topCoord = mapPinMain.offsetTop + pinImage.height / 2 + HEIGHT_TAIL_MAIN_PIN;
    }

    var adress = window.mapControl.addressInput.value = leftCoord + ', ' + topCoord;

    return adress;
  };

  // убирает отслеживание нажатия левой кнопки мыши и Enter для главного пина
  var stopMainPinEventListener = function () {
    mapPinMain.removeEventListener('keydown', onEnterProcess);
    mapPinMain.removeEventListener('keydown', onEscProcess);
    mapPinMain.removeEventListener('mousedown', onLeftMouseDownProcess);
  };

  // собирает всю информацию о пине
  var renderPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    var image = pinElement.querySelector('img');
    image.src = pin.author.avatar;
    image.alt = pin.offer.title;
    pinElement.style.left = pin.location.x + 'px';
    pinElement.style.top = pin.location.y + 'px';

    return pinElement;
  };

  // отображает все пины с сервера
  var showServerPins = function (announcements) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < announcements.length; i++) {
      fragment.appendChild(window.pin.renderPin(announcements[i]));
    }

    return window.pin.similarListElement.appendChild(fragment);
  };

  var drawPins = window.debounce(function () {
    deletePins();
    var newPins = window.filter.setFilters(pins);
    showServerPins(newPins);
  });

  var requestPins = function () {
    window.backend.loadData(onSuccess, onError);
  };

  var deleteServerPins = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  };

  var deletePins = function () {
    var pinButtons = similarListElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    deleteServerPins(pinButtons);
  };

  var onSuccess = function (announcements) {
    pins = announcements;
    mapPinMain.addEventListener('mousedown', onLeftMouseDownProcess);
    mapPinMain.addEventListener('keydown', onEnterProcess);
  };

  var onError = function (errorMessage) {
    var messageText = errorElement.querySelector('p');
    messageText.textContent = errorMessage;
    document.addEventListener('click', closeLeftMouseError);
    document.addEventListener('keydown', closeEscError);
    mainSection.insertAdjacentElement('afterbegin', errorElement);
  };

  var closeServerError = function (element) {
    element.remove();
    requestPins();
  };

  var closeLeftMouseError = function (evt) {
    if (evt.button === 0) {
      closeServerError(errorElement);
      document.removeEventListener('click', closeLeftMouseError);
    }
  };

  var closeEscError = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeServerError(errorElement);
      document.removeEventListener('keydown', closeEscError);
    }
  };

  mapFilters.addEventListener('change', drawPins);

  window.pin = {
    getMainPinAddress: getMainPinAddress,
    activeMode: activeMode,
    stopMainPinEventListener: stopMainPinEventListener,
    renderPin: renderPin,
    similarListElement: similarListElement,
    onError: onError,
    requestPins: requestPins,
    drawPins: drawPins,
    onSuccess: onSuccess,
    mainSection: mainSection,
    deletePins: deletePins,
    pins: pins,
    mapFilters: mapFilters
  };

})();
