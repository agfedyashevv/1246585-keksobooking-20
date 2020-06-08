'use strict';

var COUNT_СYCLES = 8;
var IMG_ADDRESS_TEMPLATE = 'img/avatars/user';
var IMG_ADDRESS_FORMAT = '.png';
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var MAP_X_MIN = 0;
var MAP_X_MAX = 1200;
var MIN_PRICE = 1000;
var MAX_PRICE = 5000;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;

var map = document.querySelector('.map');
var similarListElement = map.querySelector('.map__pins');

// находит шаблон пина
var PinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var types = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var checkinTimes = [
  '12:00',
  '13:00',
  '14:00'
];

var checkoutTimes = [
  '12:00',
  '13:00',
  '14:00'
];

var featuresList = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photosList = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// генерирует рандомное число
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min); // Максимум не включается, минимум включается
};

// берет случайный элемент из массива
var getRandomItemFromArray = function (item) {
  var randomItem = Math.floor(Math.random() * item.length);

  return randomItem;
};

// получаем массив со случайным набором удобств
var getFeaturesList = function (featuresArr) {
  var features = [];
  var featuresLength = featuresArr.length;
  var randomCountOfFeatures = getRandomNumber(0, featuresLength);
  for (var i = 0; i <= randomCountOfFeatures; i++) {
    features.push(features[i]);
  }

  return features;
};

// получаем массив со случайным набором изображений места проживания
var getPhotosList = function (photosArr) {
  var photos = [];
  var photosLength = photosArr.length;
  var randomCountOfPhotos = getRandomNumber(0, photosLength);
  for (var i = 0; i <= randomCountOfPhotos; i++) {
    photos.push(photos[i]);
  }

  return photos;
};

// создаем массив из сгенерированных объектов / карточек / объявлений о сдаче
var generateAnnouncements = function () {
  var announcements = [];
  for (var i = 1; i <= COUNT_СYCLES; i++) {
    var locationX = getRandomNumber(MAP_X_MIN, MAP_X_MAX);
    var locationY = getRandomNumber(MAP_Y_MIN, MAP_Y_MAX);

    announcements.push({
      author: {
        avatar: IMG_ADDRESS_TEMPLATE + 0 + i + IMG_ADDRESS_FORMAT,
      },
      offer: {
        title: 'Заголовок ' + i,
        address: 'Адрес ' + locationX + ', ' + locationY,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: getRandomItemFromArray(types),
        rooms: getRandomNumber(1, MAX_ROOMS),
        guests: getRandomNumber(1, MAX_GUESTS),
        checkin: getRandomItemFromArray(checkinTimes),
        checkout: getRandomItemFromArray(checkoutTimes),
        features: getFeaturesList(featuresList),
        description: 'Описание ' + i,
        photos: getPhotosList(photosList)
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }

  return announcements;
};

// собирает всю информацию в объявление / в карточку
var renderAnnouncement = function (announcement) {
  var announcementElement = PinTemplate.cloneNode(true);
  announcementElement.querySelector('.popup__avatar').textContent = announcement.author.avatar;
  announcementElement.querySelector('.popup__title').textContent = announcement.offer.title;
  announcementElement.querySelector('.popup__text--address').textContent = announcement.offer.address;

  return announcementElement;
};

// добавляем все сгенерированные объявления в DOM / в структуру / то есть отображаем на карте
var showRandomAnnouncements = function () {
  var announcements = generateAnnouncements();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < announcements.length; i++) {
    fragment.appendChild(renderAnnouncement(announcements[i]));
  }
  return similarListElement.appendChild(fragment);
};

// собирает всю информацию о пине
var renderPin = function (pin) {
  var pinElement = PinTemplate.cloneNode(true);
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;
  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';

  return pinElement;
};

// добавляет все сгенерированные пины в DOM / в структуру / то есть отображаем на карте
var showRandomPin = function (announcements) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < announcements.length; i++) {
    fragment.appendChild(renderPin(announcements[i]));
  }

  return similarListElement.appendChild(fragment);
};

var init = function () {
  var pinData = generateAnnouncements();
  map.classList.remove('map--faded');
  showRandomPin(pinData);
  showRandomAnnouncements();
};

init();
