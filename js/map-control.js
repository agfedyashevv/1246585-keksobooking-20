'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var mapFilter = document.querySelectorAll('.map__filter');
  var mapFeature = document.querySelectorAll('.map__feature');
  var addressInput = document.querySelector('fieldset input[name = address]');
  var disabledPage = document.querySelectorAll('fieldset, select');
  var mapPinMain = mapElement.querySelector('.map__pin--main');

  // делает элементы неактивными
  var disableElements = function (elements) {
    elements.forEach(function (el) {
      el.setAttribute('disabled', true);
    });
  };

  // делает все элементы активными, кроме поля Адрес
  var enabledElements = function (elements) {
    elements.forEach(function (el) {
      el.removeAttribute('disabled');
    });
    addressInput.setAttribute('readonly', true);
  };

  // убирает скрытие элементов страницы и переводит страницу в активное состояние
  var deleteUnActiveMode = function () {
    if (!window.pin.activeMode) {
      window.pin.request();
      window.pin.draw();
    }
    mapElement.classList.remove('map--faded');
    window.form.adField.classList.remove('ad-form--disabled');
    window.pin.stopEventListener();
    enabledElements(disabledPage);
    setCursorPointer(mapFilter);
    setCursorPointer(mapFeature);
    window.pin.activeMode = true;
    window.pin.getAddress();
  };

  // деактивировать страницу
  var setUnActiveMode = function () {
    mapElement.classList.add('map--faded');
    window.form.adField.classList.add('ad-form--disabled');
    disableElements(disabledPage);
    setCursorDefault(mapFilter);
    setCursorDefault(mapFeature);
    window.pin.activeMode = false;
    window.form.adField.reset();
    window.card.closeAnnouncements();
    window.pin.mapFilters.reset();
    window.pin.delete();
    window.form.setHousingPrice();
    window.avatar.removePreviewPhotos();
    mapPinMain.style = 'left: 570px; top: 375px;';
    window.pin.getAddress();
    mapPinMain.addEventListener('mousedown', window.pin.onLeftMouseDownProcess);
    mapPinMain.addEventListener('keydown', window.pin.onEnterProcess);
  };

  // устанавливает курсор с типом по умолчанию
  var setCursorDefault = function (elements) {
    elements.forEach(function (el) {
      el.style.cursor = 'default';
    });
  };

  // устанавливает курсор с типом Pointer
  var setCursorPointer = function (elements) {
    elements.forEach(function (el) {
      el.style.cursor = 'pointer';
    });
  };

  window.mapControl = {
    mapElement: mapElement,
    filter: mapFilter,
    feature: mapFeature,
    addressInput: addressInput,
    disableElements: disableElements,
    setCursorDefault: setCursorDefault,
    deleteUnActiveMode: deleteUnActiveMode,
    disabledPage: disabledPage,
    setUnActiveMode: setUnActiveMode
  };

})();
