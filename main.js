window.addEventListener("load", Init);

const Pause = async ()=> sleep(1333)

// Variable names that start with uppercase are globals or functions that modify globals.
let BJ, NotifySpan;

async function Init(){
  BJ = Blackjack();
  NotifySpan = document.getElementById("notify_span");
  Events();

  Notify("Shuffling deck...");
  await Pause();

  if(BJ.showHints){
      NotifyAppend("Deck: " + BJ.deck.map(Card).join(", "));
      await Pause();
  }
  
  NotifyAppend("Loading Blackjack table...");
  await Pause();

  BJ.nextHand();
  Display();
}
function NotifyClear(){
  NotifySpan.innerHTML = "";
}
function NotifyAppend(msg){
  if(NotifySpan.innerHTML.length){
    NotifySpan.appendChild(document.createElement("br"));
    NotifySpan.appendChild(document.createElement("br"));
  }
  NotifySpan.appendChild(document.createTextNode(msg));
}
function Notify(msg){
  //console.log("Notification: " + msg);
  NotifyClear();
  NotifyAppend(msg);
}
function Display(){
  NotifyClear();
  if(BJ.showHints){
    let seen = BJ.discard.slice(0);
    seen.push(...BJ.playerCards);
    seen.push(...BJ.dealerCards);
    seen.sort((x, y) => x - y);
    NotifyAppend("Seen Cards: " + seen.map(Card).join(", "));
    let remaining = BJ.deck.slice(0).sort((x, y)=> x - y);
    NotifyAppend("Remaing Cards: " + remaining.map(Card).join(", "));
  }
  NotifyAppend("Money: $" + numberCommas(BJ.money));
  NotifyAppend("Bet: $" + numberCommas(BJ.bet) + (BJ.doubled? "(x2)": ""));
  NotifyAppend("Dealer: " + BJ.dealerCards.map(Card).join(", ") + (BJ.showHints && BJ.dealt? " (" + BJ.dealerScore + ")" : ""));
  NotifyAppend("Player: " + BJ.playerCards.map(Card).join(", ") + (BJ.showHints && BJ.dealt? " (" + BJ.playerScore + ")" : ""));
  if(BJ.message.length) NotifyAppend("\"" + BJ.message.trim() + "\"");
}
function Events(){
  // window.addEventListener("click", (e)=>click(BJ, e));
  window.addEventListener("keydown", (e)=> keyDown(BJ, e));
  let buttons = document.getElementsByTagName("button"); 
  for(let i in buttons){
      let button = buttons[i];
      let handler = ((button_text)=> ((event) => click(BJ, button_text)))(button.innerHTML); 
      button.onclick = handler }
  async function click(state, button_text){
    const actions = {
      "Increase Bet": "increaseBet",
      "Decrease Bet": "decreaseBet",
      "Deal": "deal",
      "Hit": "hit", "Stay": "stay", "Double Down": "doubleDown",
      "Split": "split", "Surrender": "surrender",
      "Restart": "restart",
    }
    BJ.message = ""; // clear last message
    BJ[actions[button_text.trim()]]();
    if(BJ.handFinished){
      Display();
      await Pause();
      BJ.resolveHand();
      Display();
      await Pause();
      await Pause();
      BJ.nextHand();
      Display();
    } else {
      Display();
    }
  }
  function keyDown(state, e){
    let keycode = e.keyCode;
    state.lastkey = keycode;
  }
}

