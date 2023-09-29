const cardContainer = document.querySelector(".card-container");
const input = document.querySelector(".search-form__input");
const searchList = document.querySelector(".search-form__list");
const cardTemplate = document.querySelector(".card-template");
const cardName = cardTemplate.content.querySelector(".card__text--name");
const owner = cardTemplate.content.querySelector(".card__text--owner");
const stars = cardTemplate.content.querySelector(".card__text--stars");
const closeButton = document.querySelector(".close-button");

let nameArr;
let starsArr;
let ownerArr;

const fetchFn = async () => {
  if (input.value) {
    await fetch(`https://api.github.com/search/repositories?q=${input.value}`)
      .then((value) => value.json())
      .then((data) => {
        let counter = 1;
        nameArr = [];
        starsArr = [];
        ownerArr = [];
        const html = data.items
          .map((item) => {
            nameArr.push(item.name);
            starsArr.push(item.stargazers_count);
            ownerArr.push(item.owner.login);

            return `<li class="search-form__item"><span class="search-form__text">${counter++}. ${
              item.name
            }</span></li>`;
          })
          .slice(0, 5)
          .join("");
        searchList.innerHTML = html;
        return html;
      });
  } else {
    searchList.innerHTML = null;
  }
};

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

const debounceFetch = debounce(fetchFn, 400);

input.addEventListener("keyup", debounceFetch);

searchList.addEventListener("click", function cardFn(event) {
  input.value = "";
  let count = event.target.textContent[0] - 1;
  if (event.target.closest(".search-form__item")) {
    searchList.innerHTML = null;
    cardName.textContent = `Name: ${nameArr[count]}`;
    owner.textContent = `Owner: ${ownerArr[count]}`;
    stars.textContent = `Stars: ${starsArr[count]}`;
    let card = cardTemplate.content.cloneNode(true);
    cardContainer.appendChild(card);
  }
});

cardContainer.addEventListener("click", (event) => {
  const targetCard = event.target.closest(".card");
  if (event.target.className === "close-button") {
    targetCard.remove();
  }
});
