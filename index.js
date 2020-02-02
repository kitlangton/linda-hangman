import readline from 'readline-promise'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const beginGame = async () => {
  const word = await rl.questionAsync('What word does your life depend on?\n')
  console.log(`Your word is: "${word}"`)
  playRound({ guesses: [], word })
}

const playRound = async gameState => {
  displayGuesses(gameState)
  displayWord(gameState)
  const winState = getWinState(gameState)
  if (winState === 'WIN') {
    console.log('YOU WIN!')
    rl.close()
  } else if (winState === 'LOSE') {
    console.log('YOU LOSE!')
    rl.close()
  } else {
    const guess = await getGuess(gameState.guesses)
    playRound({ ...gameState, guesses: [...gameState.guesses, guess] })
  }
}

// Helper functions

const getWinState = gameState => {
  if (wordWithGuesses(gameState).indexOf('_') === -1) {
    return 'WIN'
  } else if (gameState.guesses.length > 7) {
    return 'LOSE'
  }
}

const getGuess = async guesses => {
  const guess = await rl.questionAsync('Enter a guess: ')

  if (
    /[a-z]/i.test(guess) &&
    guess.length === 1 &&
    guesses.indexOf(guess) === -1
  ) {
    return guess.toLowerCase()
  } else {
    console.log('Please input a valid guess.')
    return await getGuess(guesses)
  }
}

const displayGuesses = gameState => {
  console.log('GUESSES', gameState.guesses.join(' '))
}

const wordWithGuesses = ({ guesses, word }) =>
  word
    .split('')
    .map(c =>
      /[a-z]/i.test(c) && guesses.indexOf(c.toLowerCase()) == -1 ? '_' : c
    )
    .join(' ')

const displayWord = gameState => console.log(wordWithGuesses(gameState))

beginGame()
