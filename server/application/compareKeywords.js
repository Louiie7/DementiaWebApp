function compare(keywords1, keywords2){
  keywords1 = new Set(keywords1.split(","));
  keywords2 = keywords2.split(",")
  let counter = 0;
  for(let i = 0; i < keywords2.length; i++){
    if(keywords1.has(keywords2[i])){
      counter++;
    }
  }
  return counter;
}

module.exports.compare = compare;
