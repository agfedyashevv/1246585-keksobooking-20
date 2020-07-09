'use strict';

(function () {
  var mapFiltersContainer = document.querySelector('.map__filters-container');
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
    var features = announcementElement.querySelector('.popup__features');
    var photos = announcementElement.querySelector('.popup__photos');

    announcementElement.querySelector('.popup__avatar').textContent = announcement.author.avatar;
    announcementElement.querySelector('.popup__title').textContent = announcement.offer.title;
    announcementElement.querySelector('.popup__text--address').textContent = announcement.offer.address;
    announcementElement.querySelector('.popup__type').textContent = announcement.offer.type;
    renderFeatures(features, announcement.offer.features);
    announcementElement.querySelector('.popup__description').textContent = announcement.offer.description;
    window.data.renderPhotos(photos, announcement.offer.photos);

    if (announcement.offer.price) {
      priceValue.textContent = announcement.offer.price + ' ₽/ночь';
    } else {
      hideElement(priceValue);
    }

    if (announcement.offer.checkin && announcement.offer.checkout) {
      timeValue.textContent = 'заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;
    } else {
      hideElement(timeValue);
    }

    if (announcement.offer.rooms || announcement.offer.guests) {
      capacityValue.textContent = announcement.offer.rooms + ' комнат(ы) для ' + announcement.offer.guests + ' гостей(я)';
    } else {
      hideElement(capacityValue);
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

  // добавляем все сгенерированные объявления в DOM / в структуру / то есть отображаем на карте
  var showAnnouncements = function () {
    var mapPin = document.querySelector('.map__pin:not(.map__pin--main)');
    mapPin.removeEventListener('click', window.card.showAnnouncements);

    var announcements = window.data.generateAnnouncements();
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < 1; i++) {
      fragment.appendChild(renderAnnouncement(announcements[i]));
    }

    cardCloseButton.addEventListener('click', onLeftMouseCloseCard);
    document.addEventListener('keydown', onEscCloseCard);

    return mapFiltersContainer.before(fragment);
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

  var closeAnnouncements = function () {
    announcementElement.remove();
    announcementElement.removeEventListener('click', onLeftMouseCloseCard);
    announcementElement.removeEventListener('keydown', onEscCloseCard);
    var mapPin = document.querySelector('.map__pin:not(.map__pin--main)');
    mapPin.addEventListener('click', window.card.showAnnouncements);
  };

  window.card = {
    showAnnouncements: showAnnouncements,
    closeAnnouncements: closeAnnouncements,
    announcementElement: announcementElement
  };

})();
