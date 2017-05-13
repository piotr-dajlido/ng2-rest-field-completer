var express = require('express');
var app = express();

var data = {};
data['00-700'] = ['Warszawa', 'Radom', 'Wrocław'];
data['00-800'] = ['Sopot', 'Poznań', 'Katowice', 'Częstochowa'];
data['00-900'] = ['Gliwice'];

app.get('/', function (req, res) {
  var responseData = data[req.query.zipCode] || [];
  res.send(responseData);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
