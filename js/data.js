'use strict';

(function () {

  var COUNT_СYCLES = 1;
  var MAP_Y_MIN = 130;
  var MAP_Y_MAX = 630;
  var MAP_X_MIN = 0;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 5000;
  var MAX_ROOMS = 5;
  var MAX_GUESTS = 10;
  var NUMBER_PHOTOS_MIN = 1;
  var NUMBER_PHOTOS_MAX = 3;
  var IMG_WIDTH = 45;
  var IMG_HEIGHT = 40;
  var IMG_ADDRESS_TEMPLATE = 'img/avatars/user';
  var IMG_URL = 'http://o0.github.io/assets/images/tokyo/hotel';
  var IMG_FORMAT_PNG = '.png';
  var IMG_FORMAT_JPG = '.jpg';
  var DESCRIPTION = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta qui reprehenderit laboriosam ullam odit fugit quis eius, ipsum dolores sunt iusto sapiente voluptas cum? Blanditiis consequatur distinctio quasi assumenda minus!';

  // находит ширину окна, в котором будут размещаться пины
  var maxWidth = document.querySelector('.map__overlay').offsetWidth;

  var types = [
    'Дворец',
    'Квартира',
    'Дом',
    'Бунгало'
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

  // генерирует рандомное число
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
  };

  // берет случайный элемент из массива
  var getRandomItemFromArray = function (item) {
    return Math.floor(Math.random() * item.length);
  };

  // получаем массив со случайным набором элементов
  var getRandomArray = function (anyArray) {
    var copyArray = anyArray;
    copyArray.splice(getRandomNumber(1, copyArray.length), getRandomNumber(1, copyArray.length));

    return copyArray;
  };

  // генерируем фото
  var generatePhotos = function () {
    var photos = [];
    var photosLength = window.data.getRandomNumber(NUMBER_PHOTOS_MIN, NUMBER_PHOTOS_MAX);
    for (var i = 1; i <= photosLength; i++) {
      var photo = IMG_URL + i + IMG_FORMAT_JPG;
      photos.push(photo);
    }
    return photos;
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

  // создаем массив из сгенерированных объектов / карточек / объявлений о сдаче
  var generateAnnouncements = function () {
    var announcements = [];
    for (var i = 1; i <= COUNT_СYCLES; i++) {
      var locationX = getRandomNumber(MAP_X_MIN, maxWidth);
      var locationY = getRandomNumber(MAP_Y_MIN, MAP_Y_MAX);

      announcements.push({
        author: {
          avatar: IMG_ADDRESS_TEMPLATE + 0 + i + IMG_FORMAT_PNG,
        },
        offer: {
          title: 'Заголовок ' + i,
          address: 'Адрес ' + locationX + ', ' + locationY,
          price: getRandomNumber(MIN_PRICE, MAX_PRICE),
          type: types[getRandomItemFromArray(types)],
          rooms: getRandomNumber(1, MAX_ROOMS),
          guests: getRandomNumber(1, MAX_GUESTS),
          checkin: checkinTimes[getRandomItemFromArray(checkinTimes)],
          checkout: checkoutTimes[getRandomItemFromArray(checkoutTimes)],
          features: getRandomArray(featuresList),
          description: 'Описание ' + i + ': ' + DESCRIPTION,
          photos: generatePhotos()
        },
        location: {
          x: locationX,
          y: locationY
        }
      });
    }

    return announcements;
  };

  window.data = {
    generateAnnouncements: generateAnnouncements,
    getRandomNumber: getRandomNumber,
    renderPhotos: renderPhotos
  };

})();
