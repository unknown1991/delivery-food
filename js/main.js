'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem('delivery');

const getData = async function(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибка ${response.status}!`);
  }

  return await response.json();
};


function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}


function authorized() {

  function logOut() {
    login = null;

    buttonAuth.style.display = '';
    buttonOut.style.display = '';
    userName.style.display = '';

    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('delivery');
    checkAuth();
  }

  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'block';
  userName.textContent = login;
  userName.style.display = 'block';  

  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {

  function loginErrorMessage() {
    loginInput.style.borderColor = 'red';
    loginInput.placeholder = 'Введите логин!';
  }

  function checkLogin() {
    if (!loginInput.value) {
      loginErrorMessage();
    }    
  }

  function clearErrorMessage() {
    loginInput.style.borderColor = '';
    loginInput.placeholder = '';
  }

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;

    if (login) {
      
      clearErrorMessage();
      localStorage.setItem('delivery', login);

      toggleModalAuth();

      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      loginInput.removeEventListener('focus', clearErrorMessage);
      loginInput.removeEventListener('blur', checkLogin);
      closeAuth.removeEventListener('click', clearErrorMessage);
      logInForm.reset();

      checkAuth();
    } else {
      loginErrorMessage();
    }
    
    
    
  }
  

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  loginInput.addEventListener('focus', clearErrorMessage);
  loginInput.addEventListener('blur', checkLogin);
  closeAuth.addEventListener('click', clearErrorMessage);
}


function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();

function createCardRestaurant(restaurant) {

  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;  

  const card = `
    <a href="#" class="card card-restaurant" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}


function createGoodCard(goods) {

  const { description, id, image, name, price } = goods;

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);

  card.addEventListener('click', function () {
    if (!login) {
      toggleModalAuth();
     }
  });

  cardsMenu.insertAdjacentElement('beforeend', card);
}


function openGoods(event) {
  
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if (restaurant) {    

    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    getData(`./db/${restaurant.dataset.products}`).then(function(data) {
      data.forEach(createGoodCard);
    });
  }

}



function init(params) {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant);
  });  

  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
      restaurants.classList.remove('hide');
      menu.classList.add('hide');
  });

  new Swiper('.swiper-container', {
    loop: true,
    sliderPerView: 1,
  });
}

init();