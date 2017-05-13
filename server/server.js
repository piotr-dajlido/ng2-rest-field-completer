var express = require('express');
var app = express();

var data = {};
data['00-700'] = ['Warszawa', 'Radom', 'Wrocław'];
data['00-800'] = ['Sopot', 'Poznań', 'Katowice', 'Częstochowa'];
data['00-900'] = ['Gliwice'];
data['99-999'] = ['Kocham Kasię'];

app.get('/', function (req, res) {
  var responseData = data[req.query.zipCode] || [];
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(responseData);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
