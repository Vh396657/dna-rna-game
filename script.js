const board = document.getElementById('board');
const message = document.getElementById('message');
const timerDisplay = document.getElementById('timer');

let flippedCards = [];
let matchedCards = [];
let timer = 0;
let timerInterval;

// Normal nucleotides
const normalCards = [
  { value: 'A', type: 'normal' },
  { value: 'T', type: 'normal' },
  { value: 'C', type: 'normal' },
  { value: 'G', type: 'normal' },
  { value: 'A', type: 'normal' },
  { value: 'T', type: 'normal' },
  { value: 'C', type: 'normal' },
  { value: 'G', type: 'normal' }
];

// Mutation nucleotides (must match mutation-to-mutation correctly)
const mutationCards = [
  { value: 'A°', type: 'mutation' },
  { value: 'T°', type: 'mutation' },
  { value: 'C°', type: 'mutation' },
  { value: 'G°', type: 'mutation' }
];

let cards = [...normalCards, ...mutationCards];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  timer = 0;
  timerDisplay.textContent = `Time: ${timer}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function createBoard() {
  shuffle(cards);
  board.innerHTML = '';
  matchedCards = [];
  flippedCards = [];
  message.textContent = '';

  cards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    if (card.type === 'mutation') {
      cardElement.classList.add('mutation');
    }

    cardElement.dataset.value = card.value;
    cardElement.dataset.type = card.type;
    cardElement.addEventListener('click', flipCard);
    board.appendChild(cardElement);
  });

  startTimer();
}

function flipCard(e) {
  const card = e.target;

  if (card.classList.contains('flipped') || flippedCards.length === 2) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.value;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function isCorrectBaseMatch(base1, base2) {
  return (
    (base1 === 'A' && base2 === 'T') ||
    (base1 === 'T' && base2 === 'A') ||
    (base1 === 'C' && base2 === 'G') ||
    (base1 === 'G' && base2 === 'C')
  );
}

function resetGame(reason) {
  clearInterval(timerInterval);
  message.textContent = reason;
  setTimeout(() => {
    createBoard();
  }, 1200);
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  const base1 = card1.dataset.value.replace('°', '');
  const base2 = card2.dataset.value.replace('°', '');

  const type1 = card1.dataset.type;
  const type2 = card2.dataset.type;

  const correctBase = isCorrectBaseMatch(base1, base2);

  // NORMAL ↔ NORMAL match
  if (type1 === 'normal' && type2 === 'normal' && correctBase) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards.push(card1, card2);
  }

  // MUTATION ↔ MUTATION match (must match correctly)
  else if (type1 === 'mutation' && type2 === 'mutation' && correctBase) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards.push(card1, card2);
  }

  // ANY wrong mutation interaction resets
  else if (type1 === 'mutation' || type2 === 'mutation') {
    resetGame("Incorrect pair! DNA ruined!");
    flippedCards = [];
    return;
  }

  // Normal incorrect match (just flip back)
  else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '';
      card2.textContent = '';
    }, 800);
  }

  flippedCards = [];

  // Win condition (ALL cards matched)
  if (matchedCards.length === cards.length) {
    clearInterval(timerInterval);
    message.textContent =
      `🧬 DNA Successfully Stabilized in ${timer} seconds!`;
  }
}

function restartGame() {
  resetGame("Lab Restarted...");
}

createBoard();