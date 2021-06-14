import getData from "./getData.js";

const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let count = 0;
let movement = 0;
const showMe =
  "https://d2eopxgp627wep.cloudfront.net/ps/audios/000/000/710/original/Show_me_what_you_got!.wav?1469744432";
const iLike =
  "https://d2eopxgp627wep.cloudfront.net/ps/audios/000/000/706/original/I_like_what_you_got.wav?1469744420";

const body = document.querySelector("body");
const cromulon = document.querySelector(".cromulon");
const startButton = document.querySelector(".initial__button");
const initial = document.querySelector(".initial");
const game = document.querySelector(".memory-game");
const frontFace = document.querySelectorAll(".front-face");
const performance = document.querySelector(".performance");
const chronometerDisplay = document.querySelectorAll(".performance__item")[0];
const movements = document.querySelectorAll(".performance__item")[1];
const modal = document.querySelector(".modal");
const resultsTime = document.querySelectorAll(".content__results")[0];
const resultsMovements = document.querySelectorAll(".content__results")[1];
const playAgain = document.querySelector(".content__button");

let hours = `00`,
  minutes = `00`,
  seconds = `00`,
  chronometerCall;

const chronometer = () => {
  seconds++;

  if (seconds < 10) seconds = `0` + seconds;

  if (seconds > 59) {
    seconds = `00`;
    minutes++;

    if (minutes < 10) minutes = `0` + minutes;
  }

  if (minutes > 59) {
    minutes = `00`;
    hours++;

    if (hours < 10) hours = `0` + hours;
  }

  chronometerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
};

const character = async () => {
  const data = await getData();
  console.log(data);
  for (let i = 0; i < frontFace.length; i++) {
    frontFace[i].src = data.results[i].image;
    cards[i].dataset.framework = data.results[i].id;
    frontFace[i].alt = data.results[i].name;
  }
  for (let i = 0, j = 10; i < frontFace.length / 2; i++, j++) {
    frontFace[i].src = data.results[j].image;
    cards[i].dataset.framework = data.results[j].id;
    frontFace[i].alt = data.results[j].name;
  }
};

const start = () => {
  startButton.removeEventListener("click", start);
  character();
  cromulon.classList.add("activated");
  setTimeout(() => {
    new Audio(showMe).play();
  }, 500);
  setTimeout(() => {
    cromulon.classList.remove("activated");
  }, 3000);
  setTimeout(() => {
    initial.style.display = "none";
    body.style.backgroundImage = 'url("./assets/rickandmorty-background.png")';
    game.style.display = "flex";
    performance.style.display = "flex";
  }, 5000);
  shuffle();
};

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  movement += 1;
  movements.textContent = `MOVIMIENTOS: ${movement}`;
  if (movement === 1) chronometerCall = setInterval(chronometer, 1000);

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

const finishGame = async () => {
  await new Audio(iLike).play();
  modal.classList.add("modal-active");
  clearInterval(chronometerCall);
  resultsTime.textContent = `Tiempo: ${hours}:${minutes}:${seconds}`;
  resultsMovements.textContent = `Movimientos: ${movement}`;
};

const newGame = () => {
  modal.classList.remove("modal-active");
  shuffle();
  resetBoard();
  count = 0;
  movement = 0;
  hours = "00";
  minutes = "00";
  seconds = "00";
  chronometerDisplay.textContent = "00:00:00";
  movements.textContent = `MOVIMIENTOS: ${movement}`;
  cards.forEach(card => {
    card.classList.remove("flip");
    card.addEventListener("click", flipCard);
  });
};

cards.forEach(card => card.addEventListener("click", flipCard));
startButton.addEventListener("click", start);
playAgain.addEventListener("click", newGame);
