//ширина и высота метки
const pinWidth = 156;
const pinHeight = 156;


//функция создания массива обектов с данными

function getArrayCart () {
    var ArrayCart = [];
    let arrayType = ["palace","flat","house","bungalow"];
    let arrayCheckin = ["12:00","13:00","14:00"];
    let arrayFeatures = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
    let ArrayPhotosUrl = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", 
                          "http://o0.github.io/assets/images/tokyo/hotel2.jpg", 
                          "http://o0.github.io/assets/images/tokyo/hotel3.jpg"]

    for (let i = 0; i < 8; i++) {
        let Cart = {author: {}, offer: {}, location: {}};
        Cart.author.avatar = "img/avatars/user"+ "0" + i  +".png";
        Cart.offer.title = "Заголовок";
        Cart.offer.adress = "600, 350";
        Cart.offer.price = "350";
        Cart.offer.type = arrayType[Math.floor(Math.random()*arrayType.length)];
        Cart.offer.rooms = 2;
        Cart.offer.guests = 3;
        Cart.offer.checkin = arrayCheckin[Math.floor(Math.random()*arrayCheckin.length)];
        Cart.offer.checkout = arrayCheckin[Math.floor(Math.random()*arrayCheckin.length)];
        Cart.offer.features = arrayFeatures[Math.floor(Math.random()*arrayFeatures.length)];
        Cart.offer.description = "Описание";
        Cart.offer.photos = ArrayPhotosUrl;
        Cart.location.x = 20;
        Cart.location.y = 630;

        ArrayCart.push(Cart);// заполняем массив
    }
    return ArrayCart;
}

let arrayCart = getArrayCart ();

//console.log(arrayCart);

//временно удаляем класс 
let map = document.querySelector('.map');
console.log(map);
map.classList.remove('map--faded');


//нахождение шаблона с метками
let pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
//let pinElement = pinTemplate.cloneNode(true);

//функция для заполнения данными шаблона
function fillingTemplateData (arrayData) {
    let pins = document.createDocumentFragment();
    
    for (var i = 1; i < arrayData.length; i++) {
        let pinElement = pinTemplate.cloneNode(true);
        pinElement.querySelector('img').src = arrayData[i].author.avatar;
        pinElement.querySelector('img').alt = arrayData[i].offer.title;
        pinElement.style = "left:"+ (arrayData[i].location.x + pinWidth) +"px;"+ "top:"+ (arrayData[i].location.y + pinHeight) +"px;"
        
        pins.appendChild(pinElement);
      }

      return pins;
}

//функция для вставки готовых пинов в разметку

function insertTemplatePin () {
    let mapPinTemplate = document.querySelector('.map__pins');
    let readyTemplates = fillingTemplateData(arrayCart);
    mapPinTemplate.appendChild(readyTemplates);
}

insertTemplatePin();
