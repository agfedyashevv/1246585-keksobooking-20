'use strict';

(function () {
  var IMG_WIDTH = 45;
  var IMG_HEIGHT = 40;

  var similarCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  var announcementElement = similarCardTemplate.cloneNode(true);

  var cardCloseButton = announcementElement.querySelector('.popup__close');
  var priceValue = announcementElement.querySelector('.popup__text--price');
  var timeValue = announcementElement.querySelector('.popup__text--time');
  var capacityValue = announcementElement.querySelector('.popup__text--capacity');

  // собирает всю информацию в объявление / в карточку
  var renderAnnouncement = function (announcement) {
    var popupFeatures = announcementElement.querySelector('.popup__features');
    var popupPhotos = announcementElement.querySelector('.popup__photos');

    announcementElement.querySelector('.popup__avatar').src = announcement.author.avatar;
    announcementElement.querySelector('.popup__title').textContent = announcement.offer.title;
    announcementElement.querySelector('.popup__text--address').textContent = announcement.offer.address;
    priceValue.textContent = announcement.offer.price + ' ₽/ночь';
    announcementElement.querySelector('.popup__type').textContent = window.form.offerTypes[announcement.offer.type].typeRu;
    capacityValue.textContent = announcement.offer.rooms + ' комнат(ы) для ' + announcement.offer.guests + ' гостей(я)';
    timeValue.textContent = 'заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;
    announcementElement.querySelector('.popup__description').textContent = announcement.offer.description;

    if (announcement.offer.features) {
      renderFeatures(popupFeatures, announcement.offer.features);
    } else {
      hideElement(popupFeatures);
    }

    if (announcement.offer.photos) {
      renderPhotos(popupPhotos, announcement.offer.photos);
    } else {
      hideElement(popupPhotos);
    }

    return announcementElement;
  };

  // скрываем элемент
  var hideElement = function (element) {
    element.classList.add('hidden');
  };

  // Функция отрисовки преимуществ
  var renderFeatures = function (container, features) {
    container.innerHTML = '';
    for (var i = 0; i < features.length; i++) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature', 'popup__feature--' + features[i]);
      container.appendChild(feature);
    }
  };

  // отрисовываем фото
  var renderPhotos = function (container, photos) {
    container.innerHTML = '';
    for (var i = 0; i < photos.length; i++) {
      var photo = document.createElement('img');
      photo.src = photos[i];
      photo.width = IMG_WIDTH;
      photo.height = IMG_HEIGHT;
      photo.classList.add('popup__photo');
      container.appendChild(photo);
    }
  };

  var onLeftMouseCloseCard = function (evt) {
    if (evt.button === 0) {
      closeAnnouncements();
    }
  };

  var onEscCloseCard = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeAnnouncements();
    }
  };

  var removeActivePin = function () {
    var activePin = document.querySelector('.map__pin--active');
    activePin.classList.remove('map__pin--active');
  };

  var closeAnnouncements = function () {
    var mapCard = document.querySelector('.map__card');

    if (mapCard) {
      mapCard.remove();
      removeActivePin();
    }

    document.removeEventListener('keydown', onEscCloseCard);
  };

  window.card = {
    closeAnnouncements: closeAnnouncements,
    cardCloseButton: cardCloseButton,
    onLeftMouseCloseCard: onLeftMouseCloseCard,
    onEscCloseCard: onEscCloseCard,
    renderAnnouncement: renderAnnouncement
  };

})();
