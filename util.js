// utility functions
function randint(i,j){
  if(j === undefined){
    j = i; i = 1; }
  return i + Math.floor((j - i) * Math.random());
}
function numberCommas(x){
  return ("" + x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function sleep(millis){
  await new Promise((resolve)=> setTimeout(resolve, millis));
}
