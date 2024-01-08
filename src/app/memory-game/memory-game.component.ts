import { Component, Input, OnInit} from '@angular/core';
interface Card {
  id: number;
  imageUrl: string;
  flipped: boolean;
  vanish: boolean;

}


@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss'
})
export class MemoryGameComponent implements OnInit{
  
  @Input()  level: number=1;
  userSelectedLevel: number=1;
  rows!: number;
  columns!: number;
  totalCards!: number;
  cards: Card[] = [];
  moves: number = 0;
  misses: number = 0;
  roundsPlayed: number = 0;
  knowledgePoints: number = 0;
  accuracy: number = 0;
  lastLevel:number=1;
  ngOnInit(): void {
    this.initializeGame();
  }
  

  onLevelChange() {
    this.level = this.userSelectedLevel;
    this.initializeGame();
    
  }
  
  
  
  
  
  initializeGame() {
    
    
    console.log('Game initialized. Level:', this.level);

    if (this.userSelectedLevel == 1) {
      
    
  
      this.rows = 2;
      this.columns = 3;
    } else if (this.userSelectedLevel == 2) {
      
      this.rows = 3;
      this.columns = 4;
    } else if (this.userSelectedLevel == 3) {
      
      this.rows = 3;
      this.columns = 6;
    } else if (this.userSelectedLevel == 4) {
      
      this.rows = 4;
      this.columns = 6;
    }
    if(this.lastLevel!=this.userSelectedLevel)
    { 
      this.moves = 0;
  this.misses = 0;
  this.roundsPlayed = 0;
  this.knowledgePoints = 0;
  this.accuracy = 0;
    }

    this.totalCards = (this.rows * this.columns)/2;
    this.cards = this.generateCards();
    this.shuffleCards();
  }

  generateCards(): Card[] {
    const cards: Card[] = [];

    for (let i = 1; i <= this.totalCards; i++) {
      const card: Card = {
        id: i,
        imageUrl: `assets/image${i}.jpg`,
        flipped: false,
        vanish: false // New property initialized to false
      };

      cards.push(card, { ...card });
    }

    return cards;
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  flipCard(card: Card) {
    if (!card.flipped && !card.vanish) {
      card.flipped = true;
  
      const flippedCards = this.cards.filter(c => c.flipped && !c.vanish);
      if (flippedCards.length === 2) {
        this.moves++;
  
        if (flippedCards[0].id !== flippedCards[1].id) {
          this.misses++;
          setTimeout(() => {
            flippedCards.forEach(c => (c.flipped = false));
          }, 1000);
        } else {
          setTimeout(() => {
            flippedCards.forEach(c => (c.vanish = true));
            if (this.cards.every(c => c.vanish || c.flipped)) {
              this.roundsPlayed++;
              this.accuracy = Math.round((this.knowledgePoints / this.moves) * 10);
              if (this.roundsPlayed === 1) {
                // Display the last card for a moment before going to the next round
                setTimeout(() => {
                  this.initializeGame();
                }, 1000); // Adjust the timeout duration as needed
              } else {
                this.initializeGame();
              }
            }
          }, 1050);
          this.knowledgePoints += 10;
        }
      }
    }
    this.lastLevel=this.userSelectedLevel;
  }
}