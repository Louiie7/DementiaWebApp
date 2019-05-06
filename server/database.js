//this file contains everything related to server queries

// the modules from the application folder are included.
let keyword = require('./application/keywords.js');
let css = require('./application/CSS.js');
let linearModel = require('./application/linearModel.js');

module.exports = {
  // returns null: inserts the note recorded (Object requestBody) in the database by using the database connection object.
  putInDatabase(requestBody, connection){
    let keywords = keyword.getkeywords(requestBody.data); //gets the ketwords of the request
    let original = requestBody.data; // original is full length recording
    connection.query( // connection.query sends a sql query to the database.
      'INSERT INTO notes (original, keywords) VALUES ("'+ original + '","' + keywords.toString() + '")', // inserts the note and its ketwords in the notes table.
      function callback(error, res){ // when the query is finished
        for(let i = 0; i < keywords.length; i++){ //for all the ketwords
          insertKeyword(keywords[i], res.insertId, connection); //add the keyword the database
        }
      }
    ); //queries takes on average O(log(n)).
  },

  //asynchronous: returns promise with String best matching note based on the request and the database connection object
  async getFromDatabase(requestBody, connection){
    const request = requestBody.data;
    let promise = new Promise((resolve, reject) => { // a new promise is initialised to make the function work in a synchronous manner
      const keywords = new Set(keyword.getkeywords(request)); // get all the keywords from the request
      const keywordQueryString = buildKeywordQueryString(keywords); // build SQL query String for the keywords
      let notePromise = buildNoteQueryStringAndKeywordTable(connection, keywordQueryString); // get the keyword descriptions hashmap and the query String to get all the notes that contains the keywords
      notePromise.then(result => { // when the notePromise is resolved
        const noteQueryString = result.queryString;
        const keywordweightsHashTable = result.keywordweightsHashTable;
        connection.query(noteQueryString, function callback(error, res){ // send new SQL query to get all the notes that contained at least one keyword
          if(error) throw error; //error handling
          const bestMachingNote = findBestMatchingNote(res, request, keywords, keywordweightsHashTable); // get the best matching note
          if(bestMachingNote != -1){ //if there was a note matching
            resolve(res[bestMachingNote].original); // resolve the promise with the best matching note
          }else{//edge case handling if there was no notes matching
            resolve("No notes are added yet or no notes are matching");
          }
        })
      })
    })
    return await promise;
  }
}

/*return the index in the res list that corressponds to the best matching note.
The res list contains a list of RowDataPackets from the database.
The request is a String containing the actual request recorded on the website
keywords is a Set of Strings which are keywords. The keywordweightsHashTable
is a HashMap with weigting of individual keywords that are contained in the request*/
function findBestMatchingNote(res, request, keywords, keywordweightsHashTable){
  let max = 0.0; //the max variable contains the maximum output from the statistical model
  let maxIndex = -1; //contains the index corresponding to the max value.
  for(let i = 0; i < res.length; i++){ //looping over all the notes with at least on matching keyword
    let noteKeywords = res[i].keywords.split(","); //splits the String of all keywords from the database into a list of Strings
    const factor_1 = keyword.compareKeywords(keywords, noteKeywords, keywordweightsHashTable); // finds the matching keywords sum
    const factor_2 = css.CSS(request, res[i].original); // finds sum of common substrings.
    const factor_1_normalized = keyword.normalize(factor_1, keywords); // normalizes the keyword factor
    const factor_2_normalized = css.normalize(factor_2, request); // normalizes the common substrings factor in relation to the request
    const factor_3_normalized = css.normalize(factor_2, res[i].original); // also normalises in relation to the particular note
    const result = linearModel.evaluate([ //based on the normalised factors a single weigted value is calculated
      factor_1_normalized, factor_2_normalized, factor_3_normalized
    ]) * (factor_1_normalized == 0 ? 0 : 1); // if there is no keywords matching then the note should not even be considered
    if(result > max){ // if this note is better than the currently best note then update the max and maxIndex variables
      max = result;
      maxIndex = i;
    }
  }
  return maxIndex; // the best matching notes index is returned.
}

// return Promise with object containing the note query String and a hashmap of keyword weight descriptions based on the database connection object and the keyword sqk query String
async function buildNoteQueryStringAndKeywordTable(connection, keywordQueryString){
  let noteQueryList = ['SELECT * FROM notes WHERE ']; // initialise list with quert strings
  let keywordweightsHashTable = {}; // initialise hashtable for keywords
  let promise = new Promise((resolve, reject) => { // a new Promise is initialised to make the code run synchronously
    connection.query(keywordQueryString, (error, res) => { // send sql query to get all keyword descriptions
      if(error) throw error; //error handling
      for(let i = 0; i < res.length; i++){ // for all keyword rows
        const ids = res[i].associatedNotes.split(","); // get ids of all the notes that contain this keyword
        keywordweightsHashTable[res[i].keyword] = 1/res[i].amount; // normalize the weigth for the keyword in the hashtable
        for(let j = 0; j < res[i].amount; j++){ // for all the notes
          noteQueryList.push('id = ' + ids[j] + ' OR '); // append them to the note query string list
        }
      }
      const noteQueryString = noteQueryList.join("").substring(0, noteQueryList.join("").length-4); // initialise and convert to the note query string
      resolve( // resolve the promise
        {
          "queryString" : noteQueryString,
          "keywordweightsHashTable": keywordweightsHashTable
        }
      );
    })
  })
  return await promise
}

// returns a String keyword sql query based on a Set of keywords
function buildKeywordQueryString(keywords){
  const keyWordList = Array.from(keywords); // convert the Set to a list
  let keywordQueryList = ['SELECT * FROM keywords WHERE ']; //avoiding string concatenation by making a list containing the query String parts.
  for(let i = 0; i < keyWordList.length; i++){ // for all the keywords
    keywordQueryList.push('keyword = "' + keyWordList[i] + '" OR '); // add them to the query String list
  }
  const keywordQueryString = keywordQueryList.join("").substring(0, keywordQueryList.join("").length-4); // initialise and convert to the note query string
  return keywordQueryString;
}

// returns null: inserts a keyword in the database along with the id of the note that contains the keyword
function insertKeyword(thekeyword, id, connection){
  //check if keyword exists. if keyword exists then update. else create the new keyword row
  connection.query('SELECT * FROM keywords WHERE keyword = "' + thekeyword +'"', (error, res) => {
    if(error)throw error;
    if(res.length == 0){ // if keyword is not already in database then insert it
      connection.query('INSERT INTO keywords (keyword, amount, associatedNotes) VALUES ("'+ thekeyword +'",1,"'+ id +'")', (err, res2) => {
        if(err) throw err;
      })
    }else{ // else just update the row of the keyword
      connection.query('UPDATE keywords SET amount = '+ (res[0].amount + 1) +', associatedNotes = "'+ res[0].associatedNotes + ',' + id + '" WHERE id = ' + res[0].id, (err, res2) => {
        if(err) throw err;
      })
    }
  })
}

/*async function findBestMatchingNote(resolve, reject, request, connection, keywords, notes){
    const keywords = new Set(keyword.getkeywords(request));
    const keyWordList = Array.from(keywords);
    let keywordQueryList = ['SELECT * FROM keywords WHERE ']; //avoiding string concatenation
    for(let i = 0; i < keyWordList.length; i++){
      keywordQueryList.push('keyword = "' + keyWordList[i] + '" OR ')
    }
    const keywordQueryString = keywordQueryList.join("").substring(0, keywordQueryList.join("").length-4);
    let noteQueryList = ['SELECT * FROM notes WHERE '];
    let keywordweightsHashTable = {}
    let promise = new Promise((resolve2, reject2) => {
      connection.query(keywordQueryString, (error, res) => {
        if(error) throw error;
        for(let i = 0; i < res.length; i++){
          const ids = res[i].associatedNotes.split(",")
          keywordweightsHashTable[res[i].keyword] = 1/res[i].amount
          for(let j = 0; j < res[i].amount; j++){
            noteQueryList.push('id = ' + ids[j] + ' OR ')
          }
        }
        resolve2()
      })
    })
    await promise
    const noteQueryString = noteQueryList.join("").substring(0, noteQueryList.join("").length-4);
    connection.query(noteQueryString, function callback(error, res){
        if(error) throw error; // test if error when no notes
        let max = 0;
        let maxIndex = -1;
        for(let i = 0; i < res.length; i++){
          let noteKeywords = res[i].keywords.split(",");
          const factor_1 = keyword.compareKeywords(keywords, noteKeywords, keywordweightsHashTable)
          const factor_2 = lcs.LCS(request, res[i].original)
          // const factor_3 = lcs.LCS(res[i].original, request) - redundant
          const factor_1_normalized = keyword.normalize(factor_1, keywords)
          const factor_2_normalized = lcs.normalize(factor_2, request)
          const factor_3_normalized = lcs.normalize(factor_2, res[i].original)
          const result = linearModel.evaluate([
            factor_1_normalized,
            factor_2_normalized,
            factor_3_normalized
          ]) * (factor_1_normalized == 0 ? 0 : 1)
          console.log(res[i].id, factor_1, factor_2, factor_2, factor_1_normalized, factor_2_normalized, factor_3_normalized, result)
          if(result > max){
            max = result;
            maxIndex = i;
          }
        }
        if(maxIndex != -1){ //edge case handling
          resolve(res[maxIndex].original);
        }else{
          resolve("No notes are added yet or no notes are matching");
        }
    })
  }*/

/*function findBestMatchingNote(resolve, reject, request, connection){
    connection.query('SELECT * FROM notes', function callback(error, res){
        if(error) throw error; // test if error when no notes
        const keywords = new Set(keyword.getkeywords(request))
        let max = 0;
        let maxIndex = -1;
        for(let i = 0; i < res.length; i++){
          let noteKeywords = res[i].keywords.split(",");
          const factor_1 = keyword.compareKeywords(keywords, noteKeywords)
          const factor_2 = lcs.LCS(request, res[i].original)
          // const factor_3 = lcs.LCS(res[i].original, request) - redundant
          const factor_1_normalized = keyword.normalize(factor_1, keywords)
          const factor_2_normalized = lcs.normalize(factor_2, request)
          const factor_3_normalized = lcs.normalize(factor_2, res[i].original)
          const result = linearModel.evaluate([
            factor_1_normalized,
            factor_2_normalized,
            factor_3_normalized
          ]) * (factor_1_normalized == 0 ? 0 : 1)
          console.log(res[i].id, factor_1, factor_2, factor_2, factor_1_normalized, factor_2_normalized, factor_3_normalized, result)
          if(result > max){
            max = result;
            maxIndex = i;
          }
        }
        if(maxIndex != -1){ //edge case handling
          resolve(res[maxIndex].original);
        }else{
          resolve("No notes are added yet or no notes are matching");
        }
    })
  }*/
