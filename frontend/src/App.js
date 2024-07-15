import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [remainingGuesses, setRemainingGuesses] = useState(6);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [remainingHints, setRemainingHints] = useState(3);

  useEffect(() => {
    fetchNewWord();
  }, []);

  const fetchNewWord = () => {
    fetch('http://localhost:5000/word')
      .then(response => response.json())
      .then(data => {
        setWord(data.word);
        setHint(data.hint);
        setGuessedLetters([]);
        setRemainingGuesses(6);
        setGameOver(false);
        setWin(false);
        setRemainingHints(3);
      });
  };

  const handleLetterClick = (letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!word.includes(letter)) {
      setRemainingGuesses(remainingGuesses - 1);
    }

    const allLettersGuessed = word.split('').every(l => guessedLetters.includes(l) || l === letter);

    if (allLettersGuessed) {
      setWin(true);
      setGameOver(true);
    }

    if (remainingGuesses - 1 === 0) {
      setGameOver(true);
    }
  };

  const handleHintClick = () => {
    if (remainingHints > 0 && !gameOver) {
      const letters = word.split('');
      const unguessedLetters = letters.filter(l => !guessedLetters.includes(l));
      if (unguessedLetters.length > 0) {
        setGuessedLetters([...guessedLetters, unguessedLetters[0]]);
        setRemainingHints(remainingHints - 1);
      }
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, index) => {
      if (guessedLetters.includes(letter) || win) {
        return <span key={index} className="letter">{letter}</span>;
      }
      return <span key={index} className="letter">_</span>;
    });
  };

  return (
    <div className="App">
      <div className="game-container">
        <h1>Word Guess Game</h1>
        <div className="hint">
          <p>Hint: {hint}</p>
        </div>
        <div className="word">
          {renderWord()}
        </div>
        <div className="hint-controls">
          <button onClick={handleHintClick} disabled={gameOver || remainingHints === 0}>Get Hint</button>
          <p>Hints Remaining: {remainingHints}</p>
        </div>
        <div className="letters">
          {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter)}
              disabled={guessedLetters.includes(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="guess-status">
          <p>Remaining Guesses: {remainingGuesses}</p>
        </div>
        <div className="controls">
          <button onClick={fetchNewWord} disabled={!gameOver}>Restart</button>
        </div>
        {gameOver && (
          <div className="game-over">
            <h2>{win ? "Congrats! You've guessed the word correctly!" : "Game Over! You made too many mistakes."}</h2>
            <p>The word was: {word}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
