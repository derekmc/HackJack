function Blackjack(){
  // public fields
  const MAXBET = 256 * 1000 * 1000;
  const WIN = 1;
  const LOSS = -1;
  const TIE = 0;
  let bj = {};
  
  bj.restart = ()=>{
    bj.bet = 3;
    bj.money = 100;
    bj.message = "";
    bj.doubled = false;
    bj.dealt = false;
    bj.handFinished = false;

    bj.deck = Deck().shuffle();
    bj.discard = Deck().clear();

    bj.playerDeck = bj.deck;
    bj.playerDiscard = bj.discard;

    bj.playerCards = [];
    bj.dealerCards = [];

    bj.playerScore = 0;
    bj.dealerScore = 0;
    
    bj.showHints = true;
  }
  bj.restart();

  
  //
  // utility function (self-contained, not closures).
  //
  function cardPoints(card){
    let value = card%13 + 1;
    return value > 10? 10 : value;
  }
  function cardScores(cards){
    let scores = [0];
    for(let i=0; i<cards.length; ++i){
      let pts = cardPoints(cards[i]);
      let n = scores.length;
      if(pts == 1){
        for(let j=0; j<n; ++j){
          // keep track of all possible scores.
          scores[j + n] = scores[j] + 11; }}
      for(let j=0; j<n; ++j){
        scores[j] += pts; }
      // console.log("Cards, Scores", cards, scores);
    }
    return scores.sort((x, y) => x - y);
  }



  //
  // setting functions
  //
  bj.setHintsEnabled = (value) => {
    bj.showHints = value? true: false;
  }
  bj.usePlayerDeck = ()=>{
    bj.playerDeck = Deck().shuffle();
    bj.playerDiscard = Deck().clear();
  }
  bj.useSameDeck = ()=>{
    bj.playerDeck = bj.deck;
    bj.discard = bj.discard;
  }



  //
  // helper functions
  //
  bj.shuffle = ()=>{
    bj.deck.append(bj.discard);
    bj.deck.shuffle();
    bj.discard.clear();
  }
  bj.playerShuffle = ()=>{
    bj.playerDeck.append(bj.playerDiscard);
    bj.playerDeck.shuffle();
    bj.playerDiscard.clear();
  }
  bj.dealerHit = ()=>{
    if(!bj.deck.length) bj.shuffle();
    let card = bj.deck.draw();
    if(card >=0) bj.dealerCards.push(card);
  }
  bj.copyState = ()=>{
    let other = BlackJack();
    other.bet = bj.bet;
    other.money = bj.money;
    other.playerDeck = bj.playerDeck? bj.playerDeck.copy() : null;
    other.dealerDeck = bj.dealerDeck.copy();
    other.showHints = bj.showHints;
    return other;
  }
  bj.computeScores = ()=>{
    if(!bj.dealt) return;
    let dealerScores = cardScores(bj.dealerCards);
    let playerScores = cardScores(bj.playerCards);
    let i = -1;
    bj.playerScore = playerScores[0];
    while((playerScores[++i] < 21) && i < playerScores.length){
      bj.playerScore = playerScores[i]; }
    if(bj.playerScore == 21 && bj.playerCards.length == 2){
      bj.playerScore = 21.5; } // blackjack!
    i = -1;
    bj.dealerScore = dealerScores[0];
    while((dealerScores[++i] < 21) && i < dealerScores.length){
      bj.dealerScore = dealerScores[i]; }
    if(bj.dealerScore == 21 && bj.dealerCards.length == 2){
      bj.dealerScore = 21.5; } // blackjack!
    console.log("Player Cards", bj.playerCards);
    console.log("Dealer Cards", bj.dealerCards);
  }
  bj.resolveHand = ()=>{
    if(!bj.dealt) throw new Error("Blackjack.resolveHand: cannot resolve hand before dealing.");
    bj.computeScores();
    bj.message = "";
    while(bj.dealerScore > 0 && bj.dealerScore < 17){
      bj.dealerHit();
      bj.computeScores(); }
    let outcome = TIE;
    if(bj.playScore == 21.5){
      bj.message += "Blackjack!"
    }
    if(bj.playerScore >= 22){
      bj.message += "You are busted. ";
      outcome = LOSS;
    } else if(bj.playerScore > bj.dealerScore || bj.dealerScore >= 22){
      outcome = WIN;
    } else if(bj.playerScore < bj.dealerScore){
      outcome = LOSS;
    }
    let bet = bj.bet * (bj.doubled? 2 : 1);
    if(outcome == WIN){
      bj.message += ` You won the hand: +$${bet}`;
      bj.money += bet;
    }
    if(outcome == LOSS){
      bj.message += ` You lost the hand: -$${bet}`;
      bj.money -= bet;
    }
    if(outcome == TIE){
      bj.message += " Tie.";
    }
  }



  //
  // actions
  //
  bj.nextHand = ()=>{
    bj.doubled = false;
    bj.handFinished = false;
    bj.dealt = false;
    bj.discard.append(bj.dealerCards);
    bj.playerDiscard.append(bj.playerCards);
    bj.dealerCards.length = 0;
    bj.playerCards.length = 0;
  }
  bj.deal = ()=>{
    if(bj.dealt){
      bj.message = "You cannot deal the hand again.";
      return; }
    bj.dealt = true;
    bj.dealerHit();
    bj.hit();
    bj.hit();
    bj.computeScores();
    bj.message = "Cards have been dealt.";
  }
  bj.hit = ()=>{
    console.log(' hit');
    if(!bj.dealt){
      bj.message = "You cannot 'hit' before the hand has been dealt.";
      return; }
    if(bj.handFinished){
      bj.message = "Hand is already finished.";
      return; }
    if(!bj.playerDeck.length) bj.playerShuffle();
    let card = bj.playerDeck.draw();
    if(card >= 0) bj.playerCards.push(card);
    bj.computeScores();
    let score = bj.playerScore;
    if(score == 0 || score >= 21){
      bj.message = score >= 22? "You are busted." : "Hand Finished.";
      bj.handFinished = true; }
  }
  bj.stay = ()=>{
    console.log(' stay');
    if(!bj.dealt){
      bj.message = "You cannot 'stay' before the hand has been dealt.";
      return; }
    if(bj.handFinished){
      bj.message = "Hand is already finished.";
      return; }
    bj.handFinished = true;
    bj.message = "Hand Finished.";
  }
  bj.increaseBet = ()=>{
    if(bj.dealt){
      bj.message = "You cannot change the bet after dealing the hand.";
      return; }
    if(bj.bet < MAXBET && bj.bet < bj.money){
      bj.bet *= 2;
      if(bj.bet > 1000) bj.bet = 1000 * Math.floor(bj.bet/1000);
      if(bj.bet > 1000 * 1000) bj.bet = 1000 * 1000 * Math.floor(bj.bet/1000/1000);
      if(bj.bet > bj.money) bj.bet = bj.money;
    }
  }
  bj.decreaseBet = ()=>{
    if(bj.dealt){
      bj.message = "You cannot change the bet after dealing the hand.";
      return; }
    if(bj.bet > 1){
      bj.bet = Math.floor(bj.bet/2);
    }
  }
  bj.doubleDown = ()=>{
    console.log(' double down');
    if(!bj.dealt){
      bj.message = "You cannot 'double down' before the hand has been dealt.";
      return; }
    if(bj.handFinished){
      bj.message = "Hand is already finished.";
      return; }
    bj.hit();
    bj.handFinished = true;
    bj.message = "Hand Finished.";
  }
  bj.split = ()=>{
    console.log(' split');
    bj.message = "TODO: split";
  }
  bj.surrender = ()=>{
    console.log(' surrender');
    bj.message = "TODO: surrender";
  }
  // TODO remove specified card from deck.
  // bj.filter = ()=>{
  // }

  return bj;
}

