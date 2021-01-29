const db = require('./database/index.js');
const mongoose = require('mongoose');
const faker = require('faker');
const getPhotos = require('./data/getPhotoUrls.js');


const populateDb = () => {
  Promise.all([getPhotos.getPhotoUrls('primary'), getPhotos.getPhotoUrls('images')])
  .then(([primaryUrls, imagesUrls]) => {
    savePhotos(primaryUrls, imagesUrls);
  })
  .catch((err) => console.error(err))
}


const savePhotos = async (primaryUrls, productPhotosUrls) => {
  let dbRecords = [];
  let featuresPhotoSizes = [[960, 832], [960, 400], [960, 123], [960, 832], [700, 568], [700, 568], [700, 568], [960, 832], [547, 454], [300, 270], [300, 270], [300, 270], [50, 50], [50, 50], [50, 50], [50, 50], [50, 50]];
  let numberOfProductImages = 7;

  for (let i = 0, j = 0; i < 100; i++) {
    let features = [];
    let images = [];
    // number of available photos in host service is 300. 6 pictures per product 300/6 = 50.
    // the rest of the product pictures are mocked using faker.
    if (i < 42) {
      for (let h = 0; h < featuresPhotoSizes.length; h++) {
        if (h < numberOfProductImages) {
          images.push(productPhotosUrls[j]);
          j++;
        }
        let photoWidth = featuresPhotoSizes[h][0];
        let photoHeight = featuresPhotoSizes[h][1];
        features.push(`http://placeimg.com/${photoWidth}/${photoHeight}`);
      }

    } else {
      for (let h = 0; h < featuresPhotoSizes.length; h++) {
        if (h < numberOfProductImages) {
          images.push(`${faker.image.imageUrl()}?random=${Math.round(Math.random() * 10000)}`);
        }
        let photoWidth = featuresPhotoSizes[h][0];
        let photoHeight = featuresPhotoSizes[h][1];
        features.push(`http://placeimg.com/${photoWidth}/${photoHeight}`);
      }
    }

    let item = {
      id: i + 1000,
      primaryUrl: primaryUrls[i],
      productUrls: images,
      featuresUrls: features
    }
    dbRecords.push(item);
  }

  let checkForPreviousSeedCount = await db.Photo.countDocuments();

  if (checkForPreviousSeedCount) {
    await db.Photo.db.dropDatabase();
  };

  return db.Photo.insertMany(dbRecords)
  .then((result) => console.log(`Database seeded with ${result.length} items`))
  .catch((err) => console.error('Error seeding database', err))
  .finally(() => {
    console.log('Mongoose connection closing');
    mongoose.connection.close()
  });
}

populateDb();

module.exports = savePhotos;