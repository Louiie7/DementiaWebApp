//keywords.js contains everything related to finding and comparing keywords in strings.

let fs = require('fs'); // file reader
module.exports = { // makes the functions in the object accesible in the keywords module.

  // returns and array of Strings containing keywords from the string input.
  getkeywords(string) {
    let words = string.split(" "); //creates a list of words
    let common = new Set(readFromFile("commonwords.csv")); /* the common variable contains common english words.
    This could be optimized by saving the list of common words for laster use. */
    let keywords = new Set(); // initializes a set of keywords to keep track of the keywords in the string. A set is used to avoid duplicates.
    for(let i = 0; i < words.length; i++) { // all the words in the words list is considered
      if(!common.has(words[i])){ // only add given word if it is not a common word
        keywords.add(words[i]); // add the given word to the Set of keywords
      }
    }
    return Array.from(keywords); // convert the Set to a list to make the keywords compatible outside the function
  },

  /* returns a sum representing the keywords matching between the setofkeywords and the listofkeywords.
   The keywordsHashTable contains the "importance" factor of a given keyword */
  compareKeywords(setofkeywords, listofkeywords, keywordsHashTable){
    let result = 0; // contains the mentioned sum
    for(let j = 0; j < listofkeywords.length; j++){ // all the keywords in the listofkeywords are considered
      if(setofkeywords.has(listofkeywords[j])){ // only add the given keyword from the listofkeywords if it is contained in the setofkeywords
        result += keywordsHashTable[listofkeywords[j]]; // append "importance" factor of the keyword to the result variable
      }
    }
    return result; // return the factor describing common keywords.
  },

  // normalizes the value to a value between 0 and 1 to make sure the factor does not account for more than the other factors.
  normalize(numericalValue, totalKeywords){
    return numericalValue / totalKeywords.size; // the sum calculated in compareKeywords divided by the total amount of possible common keywords.
  }
}

// returns the list of words in a csv file with the filename as the relative path
function readFromFile(filename){
  let content = fs.readFileSync(__dirname+"/"+filename, 'utf8'); // reads the file
  let common = content.split(","); // makes a list of words from the csv file by splitting on comma.
  return common; // returns the list
}
