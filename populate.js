const db = require('./database/index.js');
const mongoose = require('mongoose');
const faker = require('faker');
const getPhotos = require('./data/getPhotoUrls.js');

// Orig seeding max: 250,000, must seed 40 times for 10mil
// let SEEDING = 250000
let SEEDING = 100
// let PREVSEEDED = 5000000 // take out condition once working

const populateDb = () => {
  Promise.all([getPhotos.getPhotoUrls('primary'), getPhotos.getPhotoUrls('images')])
  .then(([primaryUrls, imagesUrls]) => {
    console.log('SEED TEST', primaryUrls, imagesUrls)
    savePhotos(primaryUrls, imagesUrls);
  })
  .catch((err) => console.error(err))
}

// loremPicsum has 1080 available pictures. featuresIndex will keep track of the count and reset when it reaches 1080. Some 620 product features will be repeated.


const savePhotos = async (primaryUrls, productPhotosUrls) => {
  let dbRecords = [];
  let featuresPhotoSizes = [[960, 832], [960, 400], [960, 123], [960, 832], [700, 568], [700, 568], [700, 568], [960, 832], [547, 454], [300, 270], [300, 270], [300, 270], [50, 50], [50, 50], [50, 50], [50, 50], [50, 50]];
  let numberOfProductImages = 6;
  let featuresIndex = 0;

  for (let i = 0, j = 0; i < SEEDING; i++) {
    if (i % 50000 === 0) {
      console.log('SEEDED', i)
    }
    let featuresPhotoLimit = 1080;
    let features = [];
    let images = [];
    images.push(primaryUrls[i]);
    // number of available photos in host service is 300. 6 pictures per product 300/6 = 50.
    // the rest of the product pictures are mocked using faker.
    if (i < 50) { // possibly change to total / 2?
      for (let h = 0; h < featuresPhotoSizes.length; h++) {
        if (h < numberOfProductImages) {
          images.push(productPhotosUrls[j]);
          j++;
        }
        let photoWidth = featuresPhotoSizes[h][0];
        let photoHeight = featuresPhotoSizes[h][1];
        features.push(`https://picsum.photos/id/${featuresIndex}/${photoWidth}/${photoHeight}`);
        featuresIndex++;
      };
    } else {
      for (let h = 0; h < featuresPhotoSizes.length; h++) {
        if (h < numberOfProductImages) {
          images.push(`${faker.image.imageUrl()}?random=${Math.round(Math.random() * 10000)}`);
        }
        let photoWidth = featuresPhotoSizes[h][0];
        let photoHeight = featuresPhotoSizes[h][1];
        if (featuresIndex === featuresPhotoLimit) {
          featuresIndex = 0;
        };
        features.push(`https://picsum.photos/id/${featuresIndex}/${photoWidth}/${photoHeight}`);
        featuresIndex++;
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

  // if (checkForPreviousSeedCount >= PREVSEEDED) { // edit for 10mil
  //   await db.Photo.db.dropDatabase();
  // };

  return db.Photo.insertMany(dbRecords)
  .then((result) => console.log(`Database seeded with ${result.length} items`))
  .then(() => {
    return db.Photo.countDocuments()
  })
  .then(count => {
    console.log(`current total: ${count}`)
  })
  .catch((err) => console.error('Error seeding database', err))
  .finally(() => {
    console.log('Mongoose connection closing');
    mongoose.connection.close()
  });
}

 populateDb()

module.exports.savePhotos = savePhotos;
module.exports.populateDb = populateDb;