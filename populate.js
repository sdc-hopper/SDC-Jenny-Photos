const db = require('./database/index.js');
const mongoose = require('mongoose');
const faker = require('faker');
const getPhotos = require('./data/getPhotoUrls.js');


const populateDb = () => {
  let primaryPhotos;
  let productPhotos;
  let featuresPhotos;

  Promise.all([getPhotos.getPhotoUrls('primary'), getPhotos.getPhotoUrls('features'), getPhotos.getPhotoUrls('images')])
  .then(([primaryUrls, featuresUrls, imagesUrls]) => {
    savePhotos(primaryUrls, featuresUrls, imagesUrls);
  })
  .catch((err) => console.error(err))
  // .then(() => mongoose.disconnect())
}

const savePhotos = (primaryUrls, productPhotosUrls, featurePhotosUrls) => {

  let dbRecords = [];

  for (let i = 0, j = 0; i < 100; i++) {
    let features = [];
    let images = [];
    if (i < 30) {
      for (let k = 0; k < 5; k++) {
        features.push(featurePhotosUrls[j]);
        images.push(productPhotosUrls[j]);
        j++;
      }
      let item = {
        productId: i + 1,
        primaryUrl: primaryUrls[i],
        productUrls: images,
        featuresUrls: features
      }
      dbRecords.push(item);
    } else {
      for (let k = 0; k < 5; k++) {
        features.push(faker.image.imageUrl());
        images.push(faker.image.imageUrl());
      }
      let item = {
        productId: i + 1,
        primaryUrl: primaryUrls[i],
        productUrls: images,
        featuresUrls: features
      }
      dbRecords.push(item);
    }
  }

  let recordsToSave = dbRecords.map(item => {
    db.Photo.findOneAndUpdate({ id: item.productId }, item, { upsert: true, new: true }).exec();
  });

  Promise.all(recordsToSave)
  .then(result => {
    console.log(`${result.length} records saved in db`);
  })
}

populateDb();

module.exports.populateDb = populateDb;