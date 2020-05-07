const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

// day1
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem('delivery');

function toogleModalAuth() {
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

      toogleModalAuth();

      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
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
  

  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
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