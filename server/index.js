const express = require('express');
const port = 4002;
const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static(__dirname + '/../client/dist'));

app.get('/photo', (req, res) => {
  console.log('hello')
  res.end();
});


app.listen(port, () => console.log(`listening on port ${port}`));