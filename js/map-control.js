'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var mapFilter = document.querySelectorAll('.map__filter');
  var mapFeature = document.querySelectorAll('.map__feature');
  var addressInput = document.querySelector('fieldset input[name = address]');
  var disabledPage = document.querySelectorAll('fieldset, select');

  // делает элементы неактивными
  var disableElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].setAttribute('disabled', true);
    }
  };

  // делает все элементы активными, кроме поля Адрес
  var enabledElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].removeAttribute('disabled');
    }
    addressInput.setAttribute('readonly', true);
  };

  // убирает скрытие элементов страницы и переводит страницу в активное состояние
  var deleteUnactiveMode = function () {
    mapElement.classList.remove('map--faded');
    window.form.mapAdForm.classList.remove('ad-form--disabled');
    window.pin.stopMainPinEventListener();
    window.pin.drawPins();
    enabledElements(disabledPage);
    setCursorPointer(mapFilter);
    setCursorPointer(mapFeature);
    window.pin.activeMode = true;
    window.pin.getMainPinAddress();
  };

  // устанавливает курсор с типом по умолчанию
  var setCursorDefault = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.cursor = 'default';
    }
  };

  // устанавливает курсор с типом Pointer
  var setCursorPointer = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.cursor = 'pointer';
    }
  };

  window.mapControl = {
    mapElement: mapElement,
    mapFilter: mapFilter,
    mapFeature: mapFeature,
    addressInput: addressInput,
    disableElements: disableElements,
    setCursorDefault: setCursorDefault,
    deleteUnactiveMode: deleteUnactiveMode,
    disabledPage: disabledPage
  };

})();
