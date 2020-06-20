'use strict';

(function () {

  var HEIGHT_TAIL_MAIN_PIN = 22;
  var similarListElement = window.mapControl.mapElement.querySelector('.map__pins');
  var mapPinMain = window.mapControl.mapElement.querySelector('.map__pin--main');
  var pinImage = mapPinMain.querySelector('img');
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
