'use strict';

// ширина и высота метки
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
// ширина и высота главной метки
const MAPPIN_WIDTH = 65;
const MAPPIN_HEIGHT = 65;
const MAPPIN_OFFSET = 10;
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
    card.offer.adress = getRandom(0, mapWidth) + ` , ` + getRandom(MIN_Y, MAX_Y);
    card.offer.price = `350`;
    card.offer.type = arrayType[Math.floor(Math.random() * arrayType.length)];
    card.offer.rooms = 2;
    card.offer.guests = 3;
    card.offer.checkin = arrayCheckin[Math.floor(Math.random() * arrayCheckin.length)];
    card.offer.checkout = arrayCheckin[Math.floor(Math.random() * arrayCheckin.length)];
    card.offer.features = arrayFeatures.slice(0, getRandom(1, arrayFeatures.length));
    card.offer.description = `Описание`;
    card.offer.photos = arrayPhotosUrl.slice(0, getRandom(1, arrayPhotosUrl.length));
    card.location.x = getRandom(0, mapWidth);
    card.location.y = getRandom(MIN_Y, MAX_Y);

    arrayCard.push(card);// заполняем массив
  }
  return arrayCard;
}
const card = createCard();
const mapFiltersContainer = map.querySelector(`.map__filters-container`);
map.insertBefore(card, mapFiltersContainer);

// функция для вставки готовых пинов в разметку
function insertPins(data) {
  // нахождение шаблона с метками
  let pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

  // функция для создания пина
  function createPin(pinData) {
    const pinElement = pinTemplate.cloneNode(true);
    pinElement.addEventListener(`click`, function () {
      card.classList.remove(`hidden`);
      insertCard(pinData, card);
    });

    pinElement.addEventListener(`keydown`, function (evt) {
      if (evt.key === `Enter`) {
        card.classList.remove(`hidden`);
      }
    });

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

function createCard() {
  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  let cardElement = cardTemplate.cloneNode(true);
  const popupClose = cardElement.querySelector(`.popup__close`);
  popupClose.addEventListener(`click`, function () {
    cardElement.classList.add(`hidden`);
  });

  popupClose.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      cardElement.classList.add(`hidden`);
    }
  });

  document.addEventListener(`keydown`, function (evt) {

    if ((evt.key === `Escape` || evt.key === `Esc`) && !cardElement.classList.contains(`hidden`)) {
      cardElement.classList.add(`hidden`);
    }
  });

  return cardElement;
}


// функция для заполнения данными карточки обявления
function insertCard(data, cardElement) {

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

  // функция создания доступных удобств в карточке обявлений
  function createCardFeatures(features) {
    const fragmentLi = document.createDocumentFragment();
    for (let i = 0; i < features.length; i++) {
      const tagLi = document.createElement(`li`);
      tagLi.className = `popup__feature popup__feature--` + features[i];
      fragmentLi.appendChild(tagLi);
    }
    return fragmentLi;
  }


  // Удаляем фото вёрстки и стоковый список удобств
  const photoElement = cardElement.querySelector(`.popup__photos`).querySelector(`.popup__photo`);
  cardElement.querySelector(`.popup__photos`).removeChild(photoElement);

  // Удаляем стоковый список удобств в верстке
  cardElement.querySelector(`.popup__features`).innerHTML = ``;

  cardElement.querySelector(`.popup__title`).textContent = data.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = data.offer.adress;
  cardElement.querySelector(`.popup__text--price`).textContent = data.offer.price + `/ночь`;
  cardElement.querySelector(`.popup__text--capacity`).textContent = data.offer.rooms + ` комнаты для ` + data.offer.guests + ` гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `заезд после ` + data.offer.checkin + `, выезд до ` + data.offer.checkout;
  cardElement.querySelector(`.popup__features`).appendChild(createCardFeatures(data.offer.features));
  cardElement.querySelector(`.popup__description`).textContent = data.offer.description;
  cardElement.querySelector(`.popup__avatar`).src = data.author.avatar;
  cardElement.querySelector(`.popup__type`).textContent = offerType[data.offer.type];
  cardElement.querySelector(`.popup__photos`).appendChild(createCardImages(data.offer.photos));
}

const arrayCart = getArrayCart();
insertPins(arrayCart);


// функция для переключения состояния карты(из активного в активное и наборот);
function switchMapState(flag) {
  const adForm = document.querySelector(`.ad-form`);
  const inputForm = document.querySelectorAll(`fieldset`);

  if (flag) {
    adForm.classList.add(`ad-form--disabled`);
    map.classList.add(`map--faded`);

    // делаем все поля формы неактивными
    for (let i = 0; i < inputForm.length; i++) {
      inputForm[i].setAttribute(`disabled`, `disabled`);
    }


  } else {
    adForm.classList.remove(`ad-form--disabled`);
    map.classList.remove(`map--faded`);
    // делаем все поля формы активными
    for (let i = 0; i < inputForm.length; i++) {
      inputForm[i].removeAttribute(`disabled`);
    }

  }

}

switchMapState(true);

const mapPin = document.querySelector(`.map__pin--main`);
// назначаем обработчики события на главную метку для активации формы
mapPin.addEventListener(`mousedown`, function (evt) {
  if (evt.which === 1) {
    switchMapState(false);
  }
});

mapPin.addEventListener(`keydown`, function (evt) {
  if (evt.key === `Enter`) {
    switchMapState(false);
  }

});

// находим и записываем координаты главного пина на карте в адрес формы

// функция для расчета координат главного пина при загрузке страницы
function findPinCoordinates() {
  let y = Math.round(parseInt(mapPin.style.top, 10) + MAPPIN_HEIGHT + MAPPIN_OFFSET);
  let x = Math.round(parseInt(mapPin.style.left, 10) + MAPPIN_WIDTH / 2);

  return x + `, ` + y;
}

const address = document.querySelector(`#address`);
address.setAttribute(`readonly`, `true`);
address.value = findPinCoordinates();

// todo: ВАЛИДАЦИЯ ФОРМЫ

const form = document.querySelector(`.ad-form`);
const sendFormButton = document.querySelector(`.ad-form__submit`);
const title = document.querySelector(`#title`);
const price = document.querySelector(`#price`);
const type = document.querySelector(`#type`);
const roomNumber = document.querySelector(`#room_number`);
const capacity = document.querySelector(`#capacity`);
const timeIn = document.querySelector(`#timein`);
const timeOut = document.querySelector(`#timeout`);

// При каждом изменении значения поля type (Тип жилья)
// вызывается эта функция, в ней меняются атрибуты min и placeholder для поля price (Цена за ночь)
const setMinPrice = (typeValue) => {
  const prices = {
    bungalow: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  price.setAttribute(`min`, prices[typeValue]);
  price.setAttribute(`placeholder`, prices[typeValue]);
};

// Проверка соответствия выбранного значения поля Количество комнат с полем Количество мест
const checkRoomsAndCapacityAccordance = () => {
  const roomNumberValue = roomNumber.value;
  const capacityValue = capacity.value;
  const accordance = {
    '1': [`1`],
    '2': [`1`, `2`],
    '3': [`1`, `2`, `3`],
    '100': [`0`]
  };
  // метод includes доступен начиная с ES2016 - https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  const isValid = accordance[roomNumberValue].includes(capacityValue);
  if (!isValid) {
    // Если не соответствует, вызываем ошибку
    capacity.setCustomValidity(`Кол-во гостей превышает кол-во выбранных комнат`);
  } else {
    // Если соответсвует, ошибку обязательно нужно отменить, самостоятельно она не отменится
    capacity.setCustomValidity(``);
  }
  // Передаём булеву isValid в свойство validity объекта, чтобы в checkValidity обрабатывать это поле также, как и другие
  return {
    valid: isValid
  };
};

// Проверка обязательных полей, а также полей Кол-во комнат и Кол-во мест
const checkValidity = () => {
  const fields = [title.validity, price.validity, checkRoomsAndCapacityAccordance()];
  // метод every доступен начиная с ES2016 - https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/every
  const isValid = fields.every((field) => field.valid);
  return isValid;
};

// Изменение атрибутов для поля Цена при изменении типа жилья
type.addEventListener(`change`, function (e) {
  setMinPrice(e.target.value);
});

// проверка синхронизации даты въезда и даты выезда
timeIn.addEventListener(`change`, function (e) {
  timeOut.value = e.target.value;
});

timeOut.addEventListener(`change`, function (e) {
  timeIn.value = e.target.value;
});

// Отмена отправки формы по умолчанию
form.addEventListener(`submit`, function (e) {
  e.preventDefault();
});

// Проверка полей по клику + отправка данных
sendFormButton.addEventListener(`click`, function () {
  const isValid = checkValidity();
  if (isValid) {
    form.submit();
  }
});
