let fs = require('fs');
module.exports = {
  getkeywords(string) {
    let words = string.split(" ")
    let common = new Set(readFromFile("commonwords.csv"))
    let keywords = new Set();
    for(let i = 0; i < words.length; i++) {
      if(!common.has(words[i])){
        keywords.add(words[i])
      }
    }
    return Array.from(keywords);
  },

  compareKeywords(setofkeywords, listofkeywords){
    let counter = 0;
    for(let j = 0; j < listofkeywords.length; j++){
      if(setofkeywords.has(listofkeywords[j])){
        counter++;
      }
    }
    return counter
  },

  normalize(numericalValue, totalKeywords){
    return numericalValue / totalKeywords.size;
  }
}

function readFromFile(filename){
  let content = fs.readFileSync(__dirname+"/"+filename, 'utf8')
  let common = content.split(",")
  return common
}
