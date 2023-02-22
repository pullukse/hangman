

const readline = require('readline');
const chalk = require('chalk');


// Define the words for the game
const words = [
    'javascript',
    'node',
    'information',
    'data',
    'backend',
    'json',
    'eval',
    'object',
    'python',
];

// Create an array to track the player's guesses
let guessedLetters = [];

// Create a function to check if a letter has already been guessed
function hasAlreadyGuessed(letter) {
  return guessedLetters.includes(letter);
}

// Create a function to print the current state of the game
function printGameState(word, remainingGuesses) {
  let displayWord = '';
  for (const letter of word) {
    if (hasAlreadyGuessed(letter)) {
      displayWord += letter;
    } else {
      displayWord += '_';
    }
  }
  console.log(chalk.hex('#e8d500')(`\nGuess the word: ${displayWord}`));
  console.log(chalk.hex('#e8d500')(`Previous guesses: ${guessedLetters.join(', ')}`));
  console.log(chalk.red(`Guesses remaining: ${remainingGuesses}\n`));
}

// Create a function to get the player's guess
function getPlayerGuess() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('\nPick a letter: \n', (guess) => {
      rl.close();
      resolve(guess);
    });
  });
}

// Create a function to check if the player has won
function hasPlayerWon(word) {
  for (const letter of word) {
    if (!hasAlreadyGuessed(letter)) {
      return false;
    }
  }
  return true;
}

// Start the game loop
async function startGame() {
  console.log(chalk.bgMagenta('\nWelcome to Wordle! \nThe secret word is related to INF1005 material. \nGood luck!\n'));

  // Select a random word from the array
  const randomWord = words[Math.floor(Math.random() * words.length)];

  // Reset the array of guessed letters
  guessedLetters = [];

  let remainingGuesses = 5;

  while (remainingGuesses > 0 && !hasPlayerWon(randomWord)) {
    printGameState(randomWord, remainingGuesses);

    const guess = await getPlayerGuess();

    if (hasAlreadyGuessed(guess)) {
      console.log(chalk.red(`\nYou already guessed "${guess}". Try again.\n`));
      continue;
    }

    guessedLetters.push(guess);

    if (randomWord.includes(guess)) {
      console.log(chalk.bgGreen(`\nGood guess! The word contains the letter "${guess}".\n`));
    } else {
      console.log(chalk.bgRed(`\nSorry, the word does not contain the letter "${guess}".\n`));
      remainingGuesses--;
    }
  }

  if (hasPlayerWon(randomWord)) {
    console.log(chalk.hex('#427301')(`\nCongratulations, you won! The word was "${randomWord}"!\n`));
  } else {
    console.log(chalk.hex('#7a0d01')(`\nSorry :( you ran out of guesses. The word was "${randomWord}".\n`));
  }

  // Ask if the player wants to play again
  const playAgain = await getPlayerChoice(chalk.bgBlue('\nDo you want to play again? (y/n)\n'));
  if (playAgain === 'y') {
    console.log(chalk.bgBlue('\nWelcome back!\n'));
    startGame();
  } else {
    console.log(chalk.bgMagenta('\nThanks for playing!\n'));
    process.exit();
  }
}

// Create a function to get the player's choice
function getPlayerChoice(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question, (choice) => {
      rl.close();
      resolve(choice);
    });
  });
}

// Start the game
startGame();
