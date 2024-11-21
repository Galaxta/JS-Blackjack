class Deck {
    constructor() {
      this.cards = this.createDeck();
      this.shuffle();
    }
  
    createDeck() {
      const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
      const deck = [];
      for (const suit of suits) {
        for (const rank of ranks) {
          const value = rank === 'Ace' ? 11 : (['Jack', 'Queen', 'King'].includes(rank) ? 10 : parseInt(rank));
          deck.push({ rank, suit, value });
        }
      }
      return deck;
    }
  
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
  
    drawCard() {
      return this.cards.pop();
    }
}
  
export default Deck;
