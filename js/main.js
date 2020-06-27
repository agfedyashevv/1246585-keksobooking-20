'use strict';

(function () {

  var disabledPage = document.querySelectorAll('fieldset, select');

  window.mapControl.disableElements(disabledPage);
  window.mapControl.setCursorDefault(window.mapControl.mapFilter);
  window.mapControl.setCursorDefault(window.mapControl.mapFeature);
  window.pin.getMainPinAddress();
  window.pin.requestPins();

  window.main = {
    disabledPage: disabledPage
  };

})();
