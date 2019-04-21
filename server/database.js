let keyword = require('./application/keywords.js')
let lcs = require('./application/LCS.js')
let linearModel = require('./application/linearModel.js')

module.exports = {
  putInDatabase(obj, conn){
    let keywords = keyword.getkeywords(obj.data).toString()
    let original = obj.data;
    conn.query(
      'INSERT INTO notes (original, keywords) VALUES ("'+ original + '","' + keywords + '")',
      function callback(error, res){}
    ) //queries takes on average log(n).
    // table med keywords, id, antal gange brugt ud af antal keywords brugt, hvilke notes der indeholder dette keyword.
  },

  async getFromDatabase(obj, conn){
    const request = obj.data;
    let promise = new Promise((resolve, reject) => {
      findBestMatchingNote(resolve, reject, request, conn);
    })
    return await promise;
  }
}

function findBestMatchingNote(resolve, reject, request, conn){
    conn.query('SELECT * FROM notes', function callback(error, res){
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
  }
