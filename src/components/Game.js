import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Deck from './Deck';
import Card from './Card';

const Game = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [deck, setDeck] = useState(null);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(true);
  const [wins, setWins] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      if (e.code === 'Space') hit();
      if (e.code === 'Enter') stand();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  const startGame = () => {
    setMessage('Shuffling...');
    setTimeout(() => {
      const newDeck = new Deck();
      const playerCards = [newDeck.drawCard(), newDeck.drawCard()];
      const dealerCards = [newDeck.drawCard(), newDeck.drawCard()];
      
      setDeck(newDeck);
      setPlayerHand(playerCards);
      setDealerHand(dealerCards);
      setMessage('');
      setGameOver(false);
    }, 800);
  };

  const calculateScore = (hand) => {
    const sortedHand = [...hand].sort(card => card.rank === 'Ace' ? 1 : -1);
    let score = 0;
    for (const card of sortedHand) {
      if (card.rank === 'Ace') {
        score += score + 11 <= 21 ? 11 : 1;
      } else {
        score += card.value;
      }
    }
    return score;
  };

  const isSoftHand = (hand) => {
    return hand.some(card => card.rank === 'Ace') && 
           calculateScore(hand) <= 21 &&
           calculateScore(hand.filter(card => card.rank !== 'Ace')) + 11 <= 21;
  };

  const hit = () => {
    if (gameOver) return;
    
    const newCard = deck.drawCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    
    if (calculateScore(newHand) > 21) {
      setMessage('Bust! Dealer wins!');
      setGameOver(true);
      setCurrentStreak(0);
      setTotalGames(prev => prev + 1);
    }
  };

  const stand = () => {
    if (gameOver) return;

    let currentDealerHand = [...dealerHand];
    let dealerScore = calculateScore(currentDealerHand);
    
    while (dealerScore < 17) {
      const newCard = deck.drawCard();
      currentDealerHand.push(newCard);
      dealerScore = calculateScore(currentDealerHand);
    }
    
    setDealerHand(currentDealerHand);
    
    const playerScore = calculateScore(playerHand);
    if (dealerScore > 21) {
      setMessage('You win! Dealer busts!');
      setWins(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
    } else if (dealerScore > playerScore) {
      setMessage('Dealer wins!');
      setCurrentStreak(0);
    } else if (dealerScore < playerScore) {
      setMessage('You win!');
      setWins(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
    } else {
      setMessage('Push - It\'s a tie!');
    }
    
    setTotalGames(prev => prev + 1);
    setGameOver(true);
  };

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  return (
    <div className="game">
      <div className="stats-container">
        <div className="stat-box">
          <span className="stat-label">Wins</span>
          <span className="stat-value">{wins}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Streak</span>
          <span className="stat-value">{currentStreak}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Win/Loss Ratio</span>
          <span className="stat-value">
            {totalGames > 0 ? (wins / totalGames).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      <div className="game-controls">
        <button onClick={startGame}>New Game</button>
        {!gameOver && (
          <>
            <button onClick={hit}>Hit</button>
            <button onClick={stand}>Stand</button>
          </>
        )}
      </div>
      
      <div className={`hand ${
        gameOver && playerHand.length > 0
          ? (playerScore > dealerScore && playerScore <= 21) || dealerScore > 21
            ? 'winning-hand'
            : playerScore === dealerScore
            ? 'tie-hand'
            : 'losing-hand'
          : ''
      }`}>
        <h2>Your Hand ({playerScore}) {isSoftHand(playerHand) && <span className="soft-indicator">Soft</span>}</h2>
        {playerHand.map((card, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card rank={card.rank} suit={card.suit} />
          </motion.div>
        ))}
      </div>
      
      <div className="hand">
        <h2>Dealer's Hand ({dealerScore})</h2>
        {dealerHand.map((card, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              rank={gameOver || index === 0 ? card.rank : 'Hidden'} 
              suit={gameOver || index === 0 ? card.suit : 'Hidden'} 
            />
          </motion.div>
        ))}
      </div>
      
      {message && (
        <h3 className={`message ${
          message.includes('You win') || message.includes('Dealer busts')
            ? 'win'
            : message.includes('Push')
            ? 'tie'
            : message.includes('Dealer wins') || message.includes('Bust!')
            ? 'lose'
            : ''
        }`}>
          {message}
        </h3>
      )}
    </div>
  );
};

export default Game;
