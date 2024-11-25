import React from 'react';

const Card = ({ rank, suit }) => {
  const suitSymbol = {
    'Hearts': '♥',
    'Diamonds': '♦',
    'Clubs': '♣',
    'Spades': '♠'
  }[suit] || '';

  const rankDisplay = {
    'Ace': 'A',
    'King': 'K',
    'Queen': 'Q',
    'Jack': 'J'
  }[rank] || rank;
  console.log('Card Props:', { rank, suit });

  if (rank === 'Hidden') {
    return (
      <div className="card card-back">
        <div className="card-pattern">
          <div className="card-pattern-inner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${suit?.toLowerCase()}`}>
      <div className="card-corner top">
        <div className="card-rank">{rankDisplay}</div>
        <div className="card-suit">{suitSymbol}</div>
      </div>
      <div className="card-center">{suitSymbol}</div>
      <div className="card-corner bottom">
        <div className="card-rank">{rankDisplay}</div>
        <div className="card-suit">{suitSymbol}</div>
      </div>
    </div>
  );
};

export default Card;
