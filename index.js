import readline, { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const beginGame = callback => {
  rl.question('What word does your life depend on?\n', answer => {
    console.log(`Your word is: "${answer}"`)
    callback(answer)
  })
}

beginGame(word => {
  console.log('HANGMAN!')
  playRound({ guesses: [], word })
})

const playRound = gameState => {
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
    getGuess(gameState.guesses, guess => {
      playRound({ ...gameState, guesses: [...gameState.guesses, guess] })
    })
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

const getGuess = (guesses, callback) => {
  rl.question('Enter a guess: ', guess => {
    if (
      /[a-z]/i.test(guess) &&
      guess.length === 1 &&
      guesses.indexOf(guess) === -1
    ) {
      callback(guess.toLowerCase())
    } else {
      console.log('Please input a valid guess.')
      getGuess(guesses, callback)
    }
  })
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
