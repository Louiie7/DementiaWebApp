let keyword = require('./application/keywords.js')
let lcs = require('./application/LCS.js')
let linearModel = require('./application/linearModel.js')

module.exports = {
  putInDatabase(requestBody, connection){
    let keywords = keyword.getkeywords(requestBody.data);
    let original = requestBody.data;
    connection.query(
      'INSERT INTO notes (original, keywords) VALUES ("'+ original + '","' + keywords.toString() + '")',
      function callback(error, res){
        for(let i = 0; i < keywords.length; i++){
          insertKeyword(keywords[i], res.insertId, connection);
        }
      }
    ) //queries takes on average log(n). // table med keywords, id, antal gange brugt ud af antal keywords brugt, hvilke notes der indeholder dette keyword.
  },

  async getFromDatabase(requestBody, connection){
    const request = requestBody.data;
    let promise = new Promise((resolve, reject) => {
      const keywords = new Set(keyword.getkeywords(request));
      const keywordQueryString = buildKeywordQueryString(keywords);
      let notePromise = buildNoteQueryStringAndKeywordTable(connection, keywordQueryString);
      notePromise.then(result => {
        const noteQueryString = result.queryString;
        const keywordweightsHashTable = result.keywordweightsHashTable;
        connection.query(noteQueryString, function callback(error, res){
          if(error) throw error;
          console.log(res[0])
          const bestMachingNote = findBestMatchingNote(res, request, keywords, keywordweightsHashTable);
          if(bestMachingNote != -1){ //edge case handling
            resolve(res[bestMachingNote].original);
          }else{
            resolve("No notes are added yet or no notes are matching");
          }
        })
      })
    })
    return await promise;
  }
}

function findBestMatchingNote(res, request, keywords, keywordweightsHashTable){
  let max = 0;
  let maxIndex = -1;
  for(let i = 0; i < res.length; i++){
    let noteKeywords = res[i].keywords.split(",");
    const factor_1 = keyword.compareKeywords(keywords, noteKeywords, keywordweightsHashTable);
    const factor_2 = lcs.LCS(request, res[i].original);
    const factor_1_normalized = keyword.normalize(factor_1, keywords);
    const factor_2_normalized = lcs.normalize(factor_2, request);
    const factor_3_normalized = lcs.normalize(factor_2, res[i].original);
    const result = linearModel.evaluate([
      factor_1_normalized,
      factor_2_normalized,
      factor_3_normalized
    ]) * (factor_1_normalized == 0 ? 0 : 1);
    if(result > max){
      max = result;
      maxIndex = i;
    }
  }
  return maxIndex;
}

async function buildNoteQueryStringAndKeywordTable(connection, keywordQueryString){
  let noteQueryList = ['SELECT * FROM notes WHERE '];
  let keywordweightsHashTable = {}
  let promise = new Promise((resolve, reject) => {
    connection.query(keywordQueryString, (error, res) => {
      if(error) throw error;
      for(let i = 0; i < res.length; i++){
        const ids = res[i].associatedNotes.split(",")
        keywordweightsHashTable[res[i].keyword] = 1/res[i].amount
        for(let j = 0; j < res[i].amount; j++){
          noteQueryList.push('id = ' + ids[j] + ' OR ')
        }
      }
      const noteQueryString = noteQueryList.join("").substring(0, noteQueryList.join("").length-4);
      resolve(
        {
          "queryString" : noteQueryString,
          "keywordweightsHashTable": keywordweightsHashTable
        }
      );
    })
  })
  return await promise
}

function buildKeywordQueryString(keywords){
  const keyWordList = Array.from(keywords);
  let keywordQueryList = ['SELECT * FROM keywords WHERE ']; //avoiding string concatenation
  for(let i = 0; i < keyWordList.length; i++){
    keywordQueryList.push('keyword = "' + keyWordList[i] + '" OR ')
  }
  const keywordQueryString = keywordQueryList.join("").substring(0, keywordQueryList.join("").length-4);
  return keywordQueryString;
}

function insertKeyword(thekeyword, id, connection){
  //tjek if keyword exists. if keyword exists then update. else create the new keyword row
  connection.query('SELECT * FROM keywords WHERE keyword = "' + thekeyword +'"', (error, res) => {
    if(error)throw error;
    if(res.length == 0){
      connection.query('INSERT INTO keywords (keyword, amount, associatedNotes) VALUES ("'+ thekeyword +'",1,"'+ id +'")', (err, res2) => {
        if(err) throw err;
      })
    }else{
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
