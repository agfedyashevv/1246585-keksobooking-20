'use strict';

(function () {

  var HEIGHT_TAIL_MAIN_PIN = 22;
  var MAP_Y_MIN = 130;
  var MAP_Y_MAX = 630;
  var MAP_X_MIN = 0;
  var mapOverlay = document.querySelector('.map__overlay');
  var maxWidth = mapOverlay.offsetWidth;
  var mapSection = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var similarListElement = window.mapControl.mapElement.querySelector('.map__pins');
  var mapPinMain = window.mapControl.mapElement.querySelector('.map__pin--main');
  var mapFilters = document.querySelector('.map__filters');
  var activeMode = false;
  var pins = [];
  var pinHeightWithoutTail = mapPinMain.offsetHeight;
  var pinHeight = pinHeightWithoutTail + HEIGHT_TAIL_MAIN_PIN;
  var halfPinWidth = mapPinMain.offsetWidth / 2;

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
      window.mapControl.deleteUnActiveMode();
    }
  };

  // отслеживает нажатие Enter
  var onEnterProcess = function (evt) {
    if (evt.key === 'Enter') {
      window.mapControl.deleteUnActiveMode();
    }
  };

  var onEscProcess = function (evt) {
    if (evt.key === 'Escape') {
      window.mapControl.deleteUnActiveMode();
    }
  };

  // выводит координаты главного пина в строку 'Адрес'
  var getMainPinAddress = function () {
    var leftCoord = mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2;
    var topCoord = mapPinMain.offsetTop + mapPinMain.offsetHeight / 2;

    if (window.pin.activeMode) {
      topCoord = mapPinMain.offsetTop + pinHeight;
    }

    window.mapControl.addressInput.value = Math.floor(leftCoord) + ', ' + Math.floor(topCoord);
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

    pinElement.addEventListener('click', function () {
      var activePin = document.querySelector('.map__pin--active');

      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }

      mapSection.insertBefore(window.card.renderAnnouncement(pin), mapFiltersContainer);
      pinElement.classList.add('map__pin--active');

      window.card.popupClose.addEventListener('click', window.card.onLeftMouseClose);
      document.addEventListener('keydown', window.card.onEscClose);
    });

    return pinElement;
  };

  // отображает все пины с сервера
  var showServerPins = function (announcements) {
    var fragment = document.createDocumentFragment();

    announcements.forEach(function (element) {
      fragment.appendChild(renderPin(element));
    });

    return window.pin.similarListElement.appendChild(fragment);
  };

  var drawPins = window.debounce(function () {
    deletePins();
    var newPins = window.filter.set(pins);
    showServerPins(newPins);
  });

  var requestPins = function () {
    window.backend.loadData(onSuccess, onLoadError);
  };

  var deleteServerPins = function (elements) {
    elements.forEach(function (el) {
      el.remove();
    });
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

  var onLoadError = function (errorMessage) {
    var messageText = errorElement.querySelector('p');
    messageText.textContent = errorMessage;
    errorElement.querySelector('.error__button').addEventListener('click', closeLoadErrorMessage);
    document.addEventListener('keydown', closeEscLoadErrorMessage);
    mainSection.insertAdjacentElement('afterbegin', errorElement);
  };

  var closeLoadErrorMessage = function () {
    errorElement.remove();
    window.mapControl.setUnActiveMode();
    errorElement.querySelector('.error__button').removeEventListener('click', closeLoadErrorMessage);
  };

  var closeEscLoadErrorMessage = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      errorElement.remove();
      window.mapControl.setUnActiveMode();
      document.removeEventListener('keydown', closeEscLoadErrorMessage);
    }
  };

  var closeServerError = function (element) {
    element.remove();
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

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var mapCoord = mapOverlay.getBoundingClientRect();

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var coordX = moveEvt.clientX - mapCoord.left;
      var coordY = moveEvt.clientY - mapCoord.top;

      coordX = Math.max(MAP_X_MIN, Math.min(maxWidth, coordX)) - halfPinWidth;
      coordY = Math.max(MAP_Y_MIN, Math.min(MAP_Y_MAX, coordY)) - pinHeight;

      mapPinMain.style.left = coordX + 'px';
      mapPinMain.style.top = coordY + 'px';

      getMainPinAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // добавляет отслеживание нажатия левой кнопки мыши и Enter для главного пина
  mapPinMain.addEventListener('mousedown', onLeftMouseDownProcess);
  mapPinMain.addEventListener('keydown', onEnterProcess);

  mapFilters.addEventListener('change', drawPins);
  mapFilters.addEventListener('change', window.card.closeAnnouncements);

  window.pin = {
    getAddress: getMainPinAddress,
    activeMode: activeMode,
    stopEventListener: stopMainPinEventListener,
    similarListElement: similarListElement,
    onError: onError,
    request: requestPins,
    draw: drawPins,
    onSuccess: onSuccess,
    mainSection: mainSection,
    delete: deletePins,
    mapFilters: mapFilters,
    onLeftMouseDownProcess: onLeftMouseDownProcess,
    onEnterProcess: onEnterProcess
  };

})();
