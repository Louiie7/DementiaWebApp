module.exports = {
  putInDatabase(obj, conn){
    console.log(obj.data)
    conn.query('INSERT INTO notes (data) VALUES ("'+ obj.data + '")', function callback(error, res){})
  },

  getFromDatabase(obj, conn){
    return "get"
  }
}
