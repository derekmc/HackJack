
// cards are typically an integer, but this turns that into a string.
function Card(card){
  if(card < 0) return null;
  let suit = "♡♤♧♢"[Math.floor(card/13)];
  let rank = "A 2 3 4 5 6 7 8 9 10 J Q K".split(" ")[card%13];
  return rank + suit;
}
function Deck(init){
  let deck = [];
  if(init){ for(let i=0; i<init.length; ++i){ deck[i] = init[i]; }}

  deck.draw = (n)=>{
    if(n === undefined) n = 1;
    if(!deck.length) return -1;
    if(n > deck.length) n = deck.length;
    let result = deck.splice(0, n);
    if(n == 1) return result[0];
    return result;
  }
  deck.shuffle = (start)=>{
    let n = deck.length;
    if(start === undefined){
      start = 0; }
    for(let i=start; i<n-1; ++i){
      let j = randint(i, n);
      let tempcard = deck[i];
      // console.log('swap', deck[i], deck[j], i, j);
      // console.log('deck', deck);
      deck[i] = deck[j];
      deck[j] = tempcard; }
    return deck;
  }
  deck.discard = (n)=>{ // removes 'count' cards off the top.
    return deck.splice(0, n);
  }
  deck.burn = (index)=>{ // removes the card at index
    return deck.splice(index, 1)[0];
  }
  deck.clear = ()=>{
    deck.length = 0;
    return deck;
  }

  deck.append = (other)=>{
    deck.push(...other);
    return deck;
  }
  deck.mirror = (other)=>{  // make this deck exactly like other deck
    deck.length = other.length;
    for(let i=0; i<other.length; ++i){
      deck[i] = other[i];
    }
    return deck;
  }
  deck.remove = (card)=>{ // removes the indicated card, returns the number removed
    let n = 0;
    for(let i=0; i<deck.length; ++i){
      if(deck[i] == card){
        deck.splice(i, 1)
        --i; ++n;
      }
    }
    return n;
  }
  deck.reset = ()=>{
    deck.length = 52;
    for(let i=0; i<52; ++i){
      deck[i] = i; }
    return deck;
  }
  deck.copy = ()=>{
    return Deck(deck);
  }
  deck.reset();
  return deck;
}

