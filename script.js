let secretNumber = Math.floor(Math.random() * 10) + 1;
let attempts = 5;

function checkGuess() {
  let guess = parseInt(document.getElementById('guess').value);
  let message = '';

  if (guess === secretNumber) {
    message = 'Parabéns! Você acertou!';
  } else {
    attempts--;
    if (attempts === 0) {
      message = `Fim de jogo! O número era ${secretNumber}`;
    } else {
      message = guess < secretNumber ? 'O número é maior!' : 'O número é menor!';
    }
  }
  document.getElementById('message').innerText = message;
}
