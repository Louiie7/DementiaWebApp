const express = require('express')
const app = express()
const port = 3000

app.get('/speech-to-text', (req, res) => {
  res.end("")
});

app.listen(port, () => console.log("Listining on port " + port))
