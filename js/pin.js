'use strict';

(function () {

  var HEIGHT_TAIL_MAIN_PIN = 22;
  var similarListElement = window.mapControl.mapElement.querySelector('.map__pins');
  var mapPinMain = window.mapControl.mapElement.querySelector('.map__pin--main');
  var activeMode = false;

  // находит шаблон пина
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

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

  // выводит координаты указателя главного пина в строку 'Адрес'
  var getMainPinAddress = function () {
    var leftCoord = mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2;
    var topCoord = mapPinMain.offsetTop + mapPinMain.offsetHeight / 2;

    if (window.pin.activeMode) {
      topCoord = mapPinMain.offsetTop + mapPinMain.offsetHeight + HEIGHT_TAIL_MAIN_PIN;
    }

    var adress = window.mapControl.addressInput.value = Math.floor(leftCoord) + ', ' + Math.floor(topCoord);

    return adress;
  };

  // убирает отслеживание нажатия левой кнопки мыши и Enter для главного пина
  var stopMainPinEventListener = function () {
    mapPinMain.removeEventListener('keydown', onEnterProcess);
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

  // добавляет все сгенерированные пины в DOM / в структуру / то есть отображаем на карте
  var showRandomPins = function (announcements) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < announcements.length; i++) {
      fragment.appendChild(renderPin(announcements[i]));
    }

    return similarListElement.appendChild(fragment);
  };

  var checkMoveLimits = function () {
    var halfPinWidth = mapPinMain.offsetWidth / 2;
    var halfPinHeight = mapPinMain.offsetHeight / 2;
    var pinXLeft = mapPinMain.offsetLeft;
    var pinYTop = mapPinMain.offsetTop;

    if (pinXLeft + halfPinWidth <= window.data.mapXMin) {
      mapPinMain.style.left = window.data.mapXMin - halfPinWidth + 'px';
    }
    if (pinXLeft + halfPinWidth >= window.data.maxWidth) {
      mapPinMain.style.left = window.data.maxWidth - halfPinWidth + 'px';
    }
    if (pinYTop <= window.data.mapYMin) {
      mapPinMain.style.top = window.data.mapYMin - halfPinHeight + HEIGHT_TAIL_MAIN_PIN + 'px';
    }
    if (pinYTop + halfPinHeight - HEIGHT_TAIL_MAIN_PIN >= window.data.mapYMax) {
      mapPinMain.style.top = window.data.mapYMax - halfPinHeight + HEIGHT_TAIL_MAIN_PIN + 'px';
    }
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      checkMoveLimits();
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

  window.pin = {
    getMainPinAddress: getMainPinAddress,
    activeMode: activeMode,
    stopMainPinEventListener: stopMainPinEventListener,
    showRandomPins: showRandomPins
  };

})();
