const compression = require('compresson')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 4002;
const app = express();
// const dbQuery = require('../database/query.js');
// const dbQuery = require('../database/pg.js');
const newRelic = require('newrelic');
const axios = require('axios');
const redis = require('redis');
const redisPort = 6379
const client = redis.createClient(redisPort)

client.on("error", (err) => {
  console.log(err)
})

app.use(compression())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../public'));
app.use('/:id', express.static(__dirname + '/../public'));

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.get('/photos/id/:productId', async (req, res) => {
  let id = req.params.productId;

  try {
    client.get(id, async(err, photos) => {
      if (err) throw err;
      if (photos) {
        res.status(200).send({
          photos: JSON.parse(photos),
          message: "data retrieved from the cache"
        })
      } else {
        const photos = await axios(`http://3.20.63.46:4002/photos/id/${id}`)
        client.setex(id, 600, JSON.stringify(photos.data))
        res.status(200).send({
          photos: photos.data,
          message: "cache miss"
        })
      }
    })
  } catch(e) {
    res.status(500).send({message:err.message})
  }

  // axios(`http://3.20.63.46:4002/photos/id/${id}`)
  // // dbQuery.getAllProductPhotos(productId)
  //   .then(productPhotoUrls => {
  //     console.log('photos reg test', productPhotoUrls.data)
  //     if (!productPhotoUrls) {
  //       res.status(404).send('Invalid product id');
  //     } else {
  //       res.status(200).send(productPhotoUrls.data);
  //     }
  //   });
});

// app.get('/photos/product/:productId/primary', (req, res) => {
//   let productId = req.params.productId;
//   dbQuery.getProductPrimaryPhoto(productId)
//     .then(primaryPhotoUrl => {
//       if (!primaryPhotoUrl) {
//         res.status(404).send('Invalid product id');
//       } else {
//         res.status(200).send(primaryPhotoUrl);
//       }
//     });
// });

// app.get('/photos/features/:productId', (req, res) => {
//   let productId = req.params.productId;
//   dbQuery.getProductFeaturesPhotos(productId)
//     .then(featuresPhotosUrls => {
//       if (!featuresPhotosUrls) {
//         res.status(404).send('Invalid product id');
//       } else {
//         res.status(200).send(featuresPhotosUrls);
//       }
//     });
// });

// app.post('/photos/product/primary/multiple', (req, res) => {
//   let productIds = req.body;
//   if (productIds.length > 30 || productIds.length === 0 || !productIds) {
//     res.status(400).send('Request limit is 30 product ids');
//   } else {
//     dbQuery.getMultipleProductsPrimaryPhotos(productIds)
//       .then(primaryPhotoUrls => {
//         if (!Object.keys(primaryPhotoUrls).length) {
//           res.status(404).send('Invalid product ids');
//         } else {
//           res.status(200).send(primaryPhotoUrls)
//         }
//       });
//   }
// });


app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = app;