const express = require('express');
const port = 4002;
const app = express();
// const cloudinary = require('cloudinary');
// const data = require('../data/getPhotoInfo.js');
// require('dotenv').config();


app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  next();
});

// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret
// });


app.use(express.static(__dirname + '/../client/dist'));

app.get('/photo', (req, res) => {
  console.log('hello')
  // data.getPhotoInfo('Primary')
  // cloudinary.v2.search
  //   .expression(`resource_type:image AND folder=Primary`)
  //   .execute()
  //   .then(result => {
  //     console.log(result);
  //     let urls = result.map(photoInfo => photoInfo.url)
  //     console.log('hello2: ', result.map(photoInfo => photoInfo.url))
  //   });



  // cloudinary.v2.api.resources_by_tag('primary', (err, result) => {
  //   if (err) {
  //     throw err;
  //   } else {
  //     console.log(result);
  //   }
  // });
  res.end();
});



app.listen(port, () => console.log(`listening on port ${port}`));