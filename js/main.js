'use strict';

// ширина и высота метки

const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
// пределы положения метки на карте
const MIN_Y = 130;
const MAX_Y = 630;
let mapWidth = document.querySelector(`.map`).clientWidth;


// функция для выборки координат метки
function getRandomСoordinates(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //  Максимум и минимум включаются
}
//
// функция создания массива обектов с данными

function getArrayCart() {
  let ArrayCart = [];
  let arrayType = [`palace`, `flat`, `house`, `bungalow`];
  let arrayCheckin = [`12:00`, `13:00`, `14:00`];
  let arrayFeatures = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  let ArrayPhotosUrl = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];

  for (let i = 0; i < 8; i++) {
    let Cart = {author: {}, offer: {}, location: {}};
    Cart.author.avatar = `img/avatars/user` + `0` + (i + 1) + `.png`;
    Cart.offer.title = `Заголовок`;
    Cart.offer.adress = `600, 350`;
    Cart.offer.price = `350`;
    Cart.offer.type = arrayType[Math.floor(Math.random() * arrayType.length)];
    Cart.offer.rooms = 2;
    Cart.offer.guests = 3;
    Cart.offer.checkin = arrayCheckin[Math.floor(Math.random() * arrayCheckin.length)];
    Cart.offer.checkout = arrayCheckin[Math.floor(Math.random() * arrayCheckin.length)];
    Cart.offer.features = arrayFeatures[Math.floor(Math.random() * arrayFeatures.length)];
    Cart.offer.description = `Описание`;
    Cart.offer.photos = ArrayPhotosUrl;
    Cart.location.x = getRandomСoordinates(0, mapWidth);
    Cart.location.y = getRandomСoordinates(MIN_Y, MAX_Y);

    ArrayCart.push(Cart);// заполняем массив
  }
  return ArrayCart;
}

let arrayCart = getArrayCart();

// временно удаляем класс
let map = document.querySelector(`.map`);
map.classList.remove(`map--faded`);

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

// функция для вставки готовых пинов в разметку
function insertTemplatePin() {
  let mapPinTemplate = document.querySelector(`.map__pins`);
  let pins = document.createDocumentFragment();
  for (let i = 0; i < arrayCart.length; i++) {
    const pin = createPin(arrayCart[i]);
    pins.appendChild(pin);
  }
  mapPinTemplate.appendChild(pins);
}

insertTemplatePin();

// находим элемент перед которым нужно вставить карточки обявления
let mapFiltersContainer = map.querySelector(`.map__filters-container`);

// функция для заполнения данными карточки обявления
function insertDataCard() {
  let cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  let dataCardTemplate = document.createDocumentFragment();
  
  // создаем словарь
  let offerType = {ftat: 'Квартира', house: 'Дом', palace: "Дворец", bungalow: "Бунгало"};
  
  // функция для вставки src для картинок
  function insertSrcImg(arrayScrImg) {
    let popupPhotos = cardTemplate.querySelector(`.popup__photos`);
    let imgScr = document.createDocumentFragment();
    let test = document.querySelector(`#card`).content.querySelector(`.popup__photo`);

    for(let i = 0; i < arrayScrImg.length; i++) {
      let imgTemplate = test.cloneNode(true);
      imgTemplate.src = arrayScrImg[i];
      imgScr.appendChild(imgTemplate);
    }

    popupPhotos.appendChild(imgScr);
    console.log(popupPhotos);
  }

  for (let i = 0; i < arrayCart.length; i++) {
    let cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector(`.popup__title`).textContent = arrayCart[i].offer.title;
    cardElement.querySelector(`.popup__text--address`).textContent = arrayCart[i].offer.adress;
    cardElement.querySelector(`.popup__text--price`).textContent = arrayCart[i].offer.price +'₽/ночь';
    cardElement.querySelector(`.popup__text--capacity`).textContent = arrayCart[i].offer.rooms + " комнаты для " + arrayCart[i].offer.guests + " гостей";
    cardElement.querySelector(`.popup__text--time`).textContent = "Заезд после " + arrayCart[i].offer.checkin + " выезд до " + arrayCart[i].offer.checkout;
    cardElement.querySelector(`.popup__features`).textContent = arrayCart[i].offer.features;
    cardElement.querySelector(`.popup__description`).textContent = arrayCart[i].offer.description;
    cardElement.querySelector(`.popup__avatar`).src = arrayCart[i].author.avatar;
    cardElement.querySelector(`.popup__type`).textContent = offerType[arrayCart[i].offer.type];
    insertSrcImg(arrayCart[i].offer.photos);

    dataCardTemplate.appendChild(cardElement);
  }
  console.log(dataCardTemplate);
  //mapFiltersContainer.insertAdjacentHTML(beforeBegin, dataCardTemplate);
}

insertDataCard();

