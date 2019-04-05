let keyword = require('./application/keywords.js')
let lcs = require('./application/LCS.js')

module.exports = {
  putInDatabase(obj, conn){
    let keywords = keyword.getkeywords(obj.data).toString()
    let original = obj.data;
    conn.query('INSERT INTO notes (original, keywords) VALUES ("'+ original + '","' + keywords + '")', function callback(error, res){})
  },

  getFromDatabase(obj, conn){
    let request = obj.data;
    conn.query('SELECT * FROM notes', function callback(error, res){
        if(error) throw error;
        console.log(res[0].keywords)
    })
    return "whdwhbd"
  }
}
