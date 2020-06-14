'use strict';

var COUNT_СYCLES = 8;
var IMG_ADDRESS_TEMPLATE = 'img/avatars/user';
var IMG_ADDRESS_FORMAT = '.png';
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var MAP_X_MIN = 0;
var MIN_PRICE = 1000;
var MAX_PRICE = 5000;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;
var DESCRIPTION = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta qui reprehenderit laboriosam ullam odit fugit quis eius, ipsum dolores sunt iusto sapiente voluptas cum? Blanditiis consequatur distinctio quasi assumenda minus!';
var HEIGHT_TAIL_MAIN_PIN = 22;
var MIN_PRICE_BUNGALO = 0;
var MIN_PRICE_FLAT = 1000;
var MIN_PRICE_HOUSE = 5000;
var MIN_PRICE_PALACE = 10000;

// находит ширину окна, в котором будут размещаться пины
var maxWidth = document.querySelector('.map__overlay').offsetWidth;
var map = document.querySelector('.map');
var similarListElement = map.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var pinImage = mapPinMain.querySelector('img');
var mapAdForm = document.querySelector('.ad-form');
var adFormSubmit = document.querySelector('.ad-form__submit');
var mapFilters = document.querySelector('.map__filters');
var mapFilter = document.querySelectorAll('.map__filter');
var mapFeature = document.querySelectorAll('.map__feature');
var disabledAdForm = mapAdForm.querySelectorAll('fieldset');
var disabledMapFilters = mapFilters.querySelectorAll('select');
var addressInput = document.querySelector('fieldset input[name = address]');
var priceInput = mapAdForm.querySelector('#price');
var typeOfHousing = mapAdForm.querySelector('#type');
var timeIn = mapAdForm.querySelector('#timein');
var timeOut = mapAdForm.querySelector('#timeout');
var rooms = mapAdForm.querySelector('#room_number');
var capacity = mapAdForm.querySelector('#capacity');

// находит шаблон пина
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var activeMode = false;

var minPricesForNight = {
  bungalo: MIN_PRICE_BUNGALO,
  flat: MIN_PRICE_FLAT,
  house: MIN_PRICE_HOUSE,
  palace: MIN_PRICE_PALACE
};

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

// отслеживает нажатие левой кнопки мыши
var onLeftMouseDownProcess = function (evt) {
  if (typeof evt === 'object') {
    evt.preventDefault();
    switch (evt.button) {
      case 0:
        deleteUnactiveMode();
        break;
    }
  }
};

// отслеживает нажатие Enter
var onEnterProcess = function (evt) {
  if (evt.key === 'Enter') {
    deleteUnactiveMode();
  }
};

// убирает отслеживание нажатия левой кнопки мыши и Enter для главного пина
var stopMainPinEventListener = function () {
  mapPinMain.removeEventListener('keydown', onEnterProcess);
  mapPinMain.removeEventListener('mousedown', onLeftMouseDownProcess);
};

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
  addressInput.setAttribute('disabled', true);
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

// убирает скрытие элементов страницы и переводит страницу в активное состояние
var deleteUnactiveMode = function () {
  map.classList.remove('map--faded');
  addressInput.classList.add('ad-form--disabled');
  mapAdForm.classList.remove('ad-form--disabled');
  var pinData = generateAnnouncements();
  showRandomPins(pinData);
  stopMainPinEventListener();
  enabledElements(disabledAdForm);
  enabledElements(disabledMapFilters);
  setCursorPointer(mapFilter);
  setCursorPointer(mapFeature);
  activeMode = true;
  getMainPinAddress();
};

// выводит координаты главного пина в строку 'Адрес'
var getMainPinAddress = function () {
  var leftCoord = mapPinMain.offsetLeft;
  var topCoord = mapPinMain.offsetTop;
  var adress = addressInput.value = leftCoord + ', ' + topCoord;

  if (activeMode) {
    leftCoord = mapPinMain.offsetLeft + pinImage.width / 2;
    topCoord = mapPinMain.offsetTop + pinImage.height / 2 + HEIGHT_TAIL_MAIN_PIN;
    adress = addressInput.value = leftCoord + ', ' + topCoord;
  }

  return adress;
};

// установка зависимостей типа жилья и цены за ночь
var setHousingPrice = function () {
  priceInput.placeholder = minPricesForNight[typeOfHousing.value];
  priceInput.min = minPricesForNight[typeOfHousing.value];
};

// установка зависимостей времени заезда и выезда
var setTimeInToOut = function () {
  timeOut.value = timeIn.value;
};

var setTimeOutToIn = function () {
  timeIn.value = timeOut.value;
};

// установка зависимостей количества комнат и мест
var setRoomCapacity = function () {
  if (Number(rooms.value) < Number(capacity.value)) {
    capacity.setCustomValidity('Количество гостей не может превышать количество комнат');
  } else if (Number(capacity.value) === 0 && Number(rooms.value) !== 100) {
    capacity.setCustomValidity('«Не для гостей» можно выбрать только 100 комнат');
  } else if (Number(rooms.value) === 100 && Number(capacity.value) !== 0) {
    capacity.setCustomValidity('100 комнат — «не для гостей»');
  } else {
    capacity.setCustomValidity('');
  }
};

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

// собирает всю информацию о пине
var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var image = pinElement.querySelector('img');
  image.src = pin.author.avatar;
  image.alt = pin.offer.title;
  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';

  return pinElement;
};

// добавляет все сгенерированные пины в DOM / в структуру / то есть отображаем на карте
var showRandomPins = function (announcements) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < announcements.length; i++) {
    fragment.appendChild(renderPin(announcements[i]));
  }

  return similarListElement.appendChild(fragment);
};

var init = function () {
  disableElements(disabledMapFilters);
  disableElements(disabledAdForm);
  setCursorDefault(mapFilter);
  setCursorDefault(mapFeature);
  getMainPinAddress();
};

// добавляет отслеживание нажатия левой кнопки мыши и Enter для главного пина
mapPinMain.addEventListener('mousedown', onLeftMouseDownProcess);
mapPinMain.addEventListener('keydown', onEnterProcess);
typeOfHousing.addEventListener('change', setHousingPrice);
timeIn.addEventListener('change', setTimeInToOut);
timeOut.addEventListener('change', setTimeOutToIn);
rooms.addEventListener('change', setRoomCapacity);
capacity.addEventListener('change', setRoomCapacity);
adFormSubmit.addEventListener('click', setRoomCapacity);

init();
