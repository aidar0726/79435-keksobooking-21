'use strict';

// ширина и высота метки

const pinWidth = 156;
const pinHeight = 156;
// пределы положения метки на карте
const minY = 130;
const maxY = 630;
const mapWidth = document.querySelector(`.map`).clientWidth;


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
    Cart.location.y = getRandomСoordinates(minY, maxY);

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
  pinElement.style = `left:` + (pinData.location.x + pinWidth) + `px;` + `top:` + (pinData.location.y + pinHeight) + `px;`;
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
