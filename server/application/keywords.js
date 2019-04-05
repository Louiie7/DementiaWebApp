let fs = require('fs');
module.exports = {
  getkeywords(string) {
    let words = string.split(" ")
    let common = new Set(readFromFile("commonwords.csv"))
    let keywords = []
    for(let i = 0; i < words.length; i++) {
      if(!common.has(words[i]))
        keywords.push(words[i])
    }
    return keywords

  }
}
function readFromFile(filename){
  let content = fs.readFileSync(__dirname+"/"+filename, 'utf8')
  let common = content.split(",")
  return common
}
