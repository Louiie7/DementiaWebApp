let keyword = require('./application/keywords.js')

module.exports = {
  putInDatabase(obj, conn){
    let dataToQuery = keyword.getkeywords(obj.data)
    console.log(dataToQuery)
    conn.query('INSERT INTO notes (data) VALUES ("'+ dataToQuery + '")', function callback(error, res){})
  },

  getFromDatabase(obj, conn){
    return "get"
  }
}
