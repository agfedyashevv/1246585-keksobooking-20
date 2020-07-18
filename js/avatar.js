'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PREVIEW_AVATAR_WIDTH = 40;
  var PREVIEW_AVATAR_HEIGHT = 40;
  var PREVIEW_HOUSING_WIDTH = 70;
  var PREVIEW_HOUSING_HEIGHT = 70;
  var AVATAR_DEFAULT_PREVIEW = 'img/muffin-grey.svg';

  var avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var avatarPreviewImg = document.querySelector('.ad-form-header__preview img');
  var housingFileChooser = document.querySelector('.ad-form__upload input[type=file]');
  var housingPreview = document.querySelector('.ad-form__photo');

  var fileReader = function (fileChooser, preview, imgWidth, imgHeight) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var photo = document.createElement('img');
        photo.src = reader.result;
        photo.width = imgWidth;
        photo.height = imgHeight;
        preview.innerHTML = '';
        preview.appendChild(photo);
      });

      reader.readAsDataURL(file);
    }
  };

  var removePreviewPhotos = function () {
    avatarPreviewImg.src = AVATAR_DEFAULT_PREVIEW;
    avatarPreviewImg.width = PREVIEW_AVATAR_WIDTH;
    avatarPreviewImg.height = PREVIEW_AVATAR_HEIGHT;
    avatarPreview.innerHTML = '';
    avatarPreview.appendChild(avatarPreviewImg);

    housingPreview.innerHTML = '';
  };

  avatarFileChooser.addEventListener('change', function () {
    fileReader(avatarFileChooser, avatarPreview, PREVIEW_AVATAR_WIDTH, PREVIEW_AVATAR_HEIGHT);
  });

  housingFileChooser.addEventListener('change', function () {
    fileReader(housingFileChooser, housingPreview, PREVIEW_HOUSING_WIDTH, PREVIEW_HOUSING_HEIGHT);
  });

  window.avatar = {
    removePreviewPhotos: removePreviewPhotos
  };

})();
