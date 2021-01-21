const express = require('express');
const bodyParser = require('body-parser');
const port = 4002;
const app = express();
const dbQuery = require('../database/query.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static(__dirname + '/../client/dist'));

app.get('/photos/id/:productId', (req, res) => {
  let productId = req.params.productId;
  console.log(productId);
  dbQuery.getPrimaryPhoto(productId)
  .then(url => res.send(JSON.stringify(url)));
});


app.listen(port, () => console.log(`listening on port ${port}`));