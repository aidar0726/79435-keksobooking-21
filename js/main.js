'use strict';

// ширина и высота метки
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
// пределы положения метки на карте
const MIN_Y = 130;
const MAX_Y = 630;

// временно удаляем класс
let map = document.querySelector(`.map`);
map.classList.remove(`map--faded`);

// функция создания массива обектов с данными
function getArrayCart() {
  // функция для выборки координат метки
  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //  Максимум и минимум включаются
  }
  const mapWidth = document.querySelector(`.map`).clientWidth;
  let arrayCard = [];
  let arrayType = [`palace`, `flat`, `house`, `bungalow`];
  let arrayCheckin = [`12:00`, `13:00`, `14:00`];
  let arrayFeatures = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  let arrayPhotosUrl = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];

  for (let i = 0; i < 8; i++) {
    let card = {author: {}, offer: {}, location: {}};
    card.author.avatar = `img/avatars/user` + `0` + (i + 1) + `.png`;
    card.offer.title = `Заголовок`;
    card.offer.adress = `600, 350`;
    card.offer.price = `350`;
    card.offer.type = arrayType[Math.floor(Math.random() * arrayType.length)];
    card.offer.rooms = 2;
    card.offer.guests = 3;
    card.offer.checkin = arrayCheckin[Math.floor(Math.random() * arrayCheckin.length)];
    card.offer.checkout = arrayCheckin[Math.floor(Math.random() * arrayCheckin.length)];
    card.offer.features = arrayFeatures[Math.floor(Math.random() * arrayFeatures.length)];
    card.offer.description = `Описание`;
    card.offer.photos = arrayPhotosUrl.slice(0, getRandom(1, arrayPhotosUrl.length));
    card.location.x = getRandom(0, mapWidth);
    card.location.y = getRandom(MIN_Y, MAX_Y);

    arrayCard.push(card);// заполняем массив
  }
  return arrayCard;
}

// функция для вставки готовых пинов в разметку
function insertPins(data) {
  // нахождение шаблона с метками
  let pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

// функция для создания пина
  function createPin(pinData) {
    const pinElement = pinTemplate.cloneNode(true);
    pinElement.querySelector(`img`).src = pinData.author.avatar;
    pinElement.querySelector(`img`).alt = pinData.offer.title;
    pinElement.style = `left:` + (pinData.location.x - PIN_WIDTH / 2) + `px;` + `top:` + (pinData.location.y - PIN_HEIGHT) + `px;`;
    return pinElement;
  }

  let mapPinTemplate = document.querySelector(`.map__pins`);
  let pins = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    const pin = createPin(data[i]);
    pins.appendChild(pin);
  }
  mapPinTemplate.appendChild(pins);
}

// функция для заполнения данными карточки обявления
function insertCard(cardData) {
  const mapFiltersContainer = map.querySelector(`.map__filters-container`);
  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

  // словарь для сопоставления данных из API с отображаемыми названиями
  const offerType = {
    flat: `Квартира`,
    house: `Дом`,
    palace: `Дворец`,
    bungalow: `Бунгало`
  };

  // функция создания картинок для карточки
  function createCardImages(photos) {
    const fragment = document.createDocumentFragment();
    const template = document.querySelector(`#card`).content.querySelector(`.popup__photo`);
    for (let i = 0; i < photos.length; i++) {
      let imgTemplate = template.cloneNode(true);
      imgTemplate.src = photos[i];
      fragment.appendChild(imgTemplate);
    }
    return fragment;
  }

  function createCard(data) {
    let cardElement = cardTemplate.cloneNode(true);

    // Удаляем фото вёрстки
    const photoElement = cardElement.querySelector('.popup__photos').querySelector('.popup__photo');
    cardElement.querySelector('.popup__photos').removeChild(photoElement);

    cardElement.querySelector(`.popup__title`).textContent = data.offer.title;
    cardElement.querySelector(`.popup__text--address`).textContent = data.offer.adress;
    cardElement.querySelector(`.popup__text--price`).textContent = data.offer.price + `/ночь`;
    cardElement.querySelector(`.popup__text--capacity`).textContent = data.offer.rooms + ` комнаты для ` + data.offer.guests + ` гостей`;
    cardElement.querySelector(`.popup__text--time`).textContent = `заезд после ` + data.offer.checkin + `, выезд до ` + data.offer.checkout;
    cardElement.querySelector(`.popup__features`).textContent = data.offer.features;
    cardElement.querySelector(`.popup__description`).textContent = data.offer.description;
    cardElement.querySelector(`.popup__avatar`).src = data.author.avatar;
    cardElement.querySelector(`.popup__type`).textContent = offerType[data.offer.type];
    cardElement.querySelector(`.popup__photos`).appendChild(createCardImages(data.offer.photos));
    return cardElement;
  }

  const card = createCard(cardData);
  map.insertBefore(card, mapFiltersContainer);
}

const arrayCart = getArrayCart();
insertPins(arrayCart);
insertCard(arrayCart[0]);

