const express = require('express')
const app = express()

app.get('/', function (req, res) {
  app.use(express.static('public'))
})

app.listen(3000, function () {
  console.log('ChatApp listening on port 3000')
})
