import getData from "./getData.js";

const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let count = 0;
const showMe =
  "https://d2eopxgp627wep.cloudfront.net/ps/audios/000/000/710/original/Show_me_what_you_got!.wav?1469744432";
const iLike =
  "https://d2eopxgp627wep.cloudfront.net/ps/audios/000/000/706/original/I_like_what_you_got.wav?1469744420";

const cromulon = document.querySelector(".cromulon");
const startButton = document.querySelector(".initial__button");
const initial = document.querySelector(".initial");
const game = document.querySelector(".memory-game");
// const card = document.querySelectorAll(".memory-card");
const frontFace = document.querySelectorAll(".front-face");
const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const playAgain = document.querySelector(".content__button");

const character = async () => {
  const data = await getData();
  for (let i = 0; i < frontFace.length; i++) {
    frontFace[i].src = data.results[i].image;
    frontFace[i].alt = data.results[i].name;
    cards[i].dataset.framework = data.results[i].name;
  }
  for (let i = 0, j = 10; i < frontFace.length / 2; i++, j++) {
    frontFace[i].src = data.results[j].image;
    cards[i].dataset.framework = data.results[j].name;
  }
};

character();

const start = () => {
  cromulon.classList.add("activated");
  setTimeout(() => {
    cromulon.classList.remove("activated");
  }, 3000);
  setTimeout(() => {
    new Audio(showMe).play();
  }, 500);
  setTimeout(() => {
    initial.style.display = "none";
    body.style.backgroundImage = 'url("./assets/rickandmorty-background.png")';
    game.style.display = "flex";
  }, 5000);
  shuffle();
};

startButton.addEventListener("click", start);

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;

  checkForMath();
}

const checkForMath = () => {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
};

const disableCards = () => {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  count += 1;

  count === 10 ? finishGame() : resetBoard();
};

const unflipCards = () => {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1000);
};

const resetBoard = () => {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

const shuffle = () => {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
};

const finishGame = () => {
  new Audio(iLike).play();
  modal.classList.add("modal-active");
};

const newGame = () => {
  modal.classList.remove("modal-active");
  shuffle();
  resetBoard();
  count = 0;
  cards.forEach(card => {
    card.classList.remove("flip");
    card.addEventListener("click", flipCard);
  });
};

playAgain.addEventListener("click", newGame);

cards.forEach(card => card.addEventListener("click", flipCard));
