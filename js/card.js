'use strict';

(function () {
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var similarCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  var announcementElement = similarCardTemplate.cloneNode(true);

  var cardCloseButton = announcementElement.querySelector('.popup__close');

  // собирает всю информацию в объявление / в карточку
  var renderAnnouncement = function (announcement) {
    announcementElement.querySelector('.popup__avatar').textContent = announcement.author.avatar;
    announcementElement.querySelector('.popup__title').textContent = announcement.offer.title;
    announcementElement.querySelector('.popup__text--address').textContent = announcement.offer.address;

    return announcementElement;
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
