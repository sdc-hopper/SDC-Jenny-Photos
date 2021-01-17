const db = require('./database/index.js');
const mongoose = require('mongoose');
const faker = require('faker');
const getPhotos = require('./data/getPhotoUrls.js');


const populateDb = () => {
  let primaryPhotos;
  let productPhotos;
  let featuresPhotos;

  getPhotos.getPhotoUrls('primary', (urls) => {
    primaryPhotos = urls;
    getPhotos.getPhotoUrls('features', (urls) => {
      featuresPhotos = urls;
      getPhotos.getPhotoUrls('images', (urls) => {
        productPhotos = urls;
        savePhotos(primaryPhotos, productPhotos, featuresPhotos, (success) => {
          console.log(success);
        });
      });
    });
  });
}

const savePhotos = (primaryUrls, productPhotosUrls, featurePhotosUrls, cb) => {
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
      db.Photo.findOneAndUpdate({ id: item.productId }, item, { upsert: true, new: true }).exec();
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
      db.Photo.findOneAndUpdate({ id: item.productId }, item, { upsert: true, new: true }).exec();
    }
  }
  cb('success');
}


module.exports.populateDb = populateDb;