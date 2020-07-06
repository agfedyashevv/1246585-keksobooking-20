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
  var IMG_ADDRESS_TEMPLATE = 'img/avatars/user';
  var IMG_ADDRESS_FORMAT = '.png';
  var DESCRIPTION = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta qui reprehenderit laboriosam ullam odit fugit quis eius, ipsum dolores sunt iusto sapiente voluptas cum? Blanditiis consequatur distinctio quasi assumenda minus!';

  // находит ширину окна, в котором будут размещаться пины
  var maxWidth = document.querySelector('.map__overlay').offsetWidth;

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

  // создаем массив из сгенерированных объектов / карточек / объявлений о сдаче
  var generateAnnouncements = function () {
    var announcements = [];
    for (var i = 1; i <= COUNT_СYCLES; i++) {
      var locationX = getRandomNumber(MAP_X_MIN, maxWidth);
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
          features: getRandomArray(featuresList),
          description: 'Описание ' + i + ': ' + DESCRIPTION,
          photos: getRandomArray(photosList)
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
    generateAnnouncements: generateAnnouncements
  };

})();
