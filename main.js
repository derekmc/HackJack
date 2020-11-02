window.addEventListener("load", Init);

const Pause = async ()=> sleep(1333)

// Variable names that start with uppercase are globals or functions that modify globals.
let BJ, NotifySpan;

async function Init(){
  BJ = Blackjack();
  NotifySpan = document.getElementById("notify_span");
  NotifyClear();
  Events();

  NotifyText("Shuffling deck...");
  await Pause();

  if(BJ.showHints){
      NotifyText(BJ.deck.map(Card).join(", "));
      await Pause();
      await Pause();
  }
  
  NotifyText("Loading Blackjack table...");
  await Pause();

  BJ.nextHand();
  Display();
}
function NotifyClear(){
  NotifySpan.innerHTML = "";
}
function NotifyHtml(html){
  if(NotifySpan.innerHTML.length){
    NotifySpan.appendChild(document.createElement("br"));
    //NotifySpan.appendChild(document.createElement("br"));
  }
  let span = document.createElement("span");
  span.innerHTML = html;
  NotifySpan.appendChild(span);
}
function NotifyText(msg){
  msg = msg? msg : "";
  if(NotifySpan.innerHTML.length){
    NotifySpan.appendChild(document.createElement("br"));
    //NotifySpan.appendChild(document.createElement("br"));
  }
  NotifySpan.appendChild(document.createTextNode(msg));
}
function Display(){
  NotifyClear();
  if(BJ.showHints){
    let drawnlist = BJ.discard.slice(0)
    drawnlist.push(...BJ.playerCards);
    drawnlist.push(...BJ.dealerCards);
    let drawn = drawnlist.reduce((all, x)=>{ all[x] = true; return all;}, {});
    let deck = Deck();
    let op = (card) => {
      return ((card in drawn)?
               "<del>" + Card(card) + "</del>" : Card(card)) +
             ((card%13 == 12 && card != 51)? "<br>" : "");
    }
    NotifyHtml(deck.map(op).join(" "));
    NotifyText();
  }
  NotifyText("Money: $" + numberCommas(BJ.money));
  NotifyText("Bet: $" + numberCommas(BJ.bet) + (BJ.doubled? " (x2)": ""));
  NotifyText("Dealer: " + BJ.dealerCards.map(Card).join(", ") + (BJ.showHints && BJ.dealt? " (" + BJ.dealerScore + ")" : ""));
  NotifyText("Player: " + BJ.playerCards.map(Card).join(", ") + (BJ.showHints && BJ.dealt? " (" + BJ.playerScore + ")" : ""));
  NotifyText();
  if(BJ.message.length) NotifyText("\"" + BJ.message.trim() + "\"");
}
function Events(){
  // window.addEventListener("click", (e)=>click(BJ, e));
  window.addEventListener("keydown", (e)=> keyDown(BJ, e));
  let buttons = document.getElementsByTagName("button"); 
  for(let i in buttons){
      let button = buttons[i];
      let handler = ((button_text)=> ((event) => click(BJ, button_text)))(button.innerHTML); 
      if(button.innerHTML == 'Restart') handler = Init;
      button.onclick = handler }
  async function click(state, button_text){
    const actions = {
      "Increase Bet": "increaseBet",
      "Decrease Bet": "decreaseBet",
      "Deal": "deal",
      "Hit": "hit", "Stay": "stay", "Double Down": "doubleDown",
      "Split": "split", "Surrender": "surrender",
    }
    BJ.message = ""; // clear last message
    BJ[actions[button_text.trim()]]();
    Display();
    if(BJ.playerFinished){
      await Pause();
      while(!BJ.dealerHit()){
        Display();
        await Pause(); }
      BJ.resolveHand();
      //BJ.message;
      Display();
      await Pause();
      await Pause();
      BJ.nextHand();
      Display();
    }
  }
  function keyDown(state, e){
    let keycode = e.keyCode;
    state.lastkey = keycode;
  }
}

