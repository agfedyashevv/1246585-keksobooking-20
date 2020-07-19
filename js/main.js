'use strict';

(function () {

  var disabledPage = document.querySelectorAll('fieldset, select');

  window.mapControl.disableElements(disabledPage);
  window.mapControl.setCursorDefault(window.mapControl.filter);
  window.mapControl.setCursorDefault(window.mapControl.feature);
  window.pin.getAddress();
  window.pin.request();

  window.main = {
    disabledPage: disabledPage
  };

})();
