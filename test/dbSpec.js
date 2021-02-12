const { expect, assert } = require('chai');
const mongoose = require('mongoose');
const db = 'mongodb://localhost/photos';
const database = require('../database/index.js');
const dbSeed = require('../populate.js');
const faker = require('faker');


describe('Database', () => {

  let primaryPhotoCount = 100;
  let primaryPhotoUrls = [];

  let productPhotoCount = 300;
  let productPhotoUrls = [];

  before(() => {
    for (let i = 0; i < productPhotoCount; i++) {
      if (i < primaryPhotoCount) {
        primaryPhotoUrls.push(faker.image.imageUrl());
      }
      productPhotoUrls.push(faker.image.imageUrl());
    }
  })

  describe('Database seeding', () => {
    it('should seed the database with 100 records', async () => {

      await dbSeed.savePhotos(primaryPhotoUrls, productPhotoUrls);

      await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });

      let dbRecordsCount = await database.Photo.countDocuments()
      assert(dbRecordsCount === 100, 'record count should be 100');
    });
  });

  describe('Database re-seeding', () => {
    it('should not duplicating records upon re-seeding', async () => {

      await dbSeed.savePhotos(primaryPhotoUrls, productPhotoUrls);

      await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });

      let dbRecordsCount = await database.Photo.countDocuments()
      assert(dbRecordsCount === 100, 'record count should still be 100');
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});