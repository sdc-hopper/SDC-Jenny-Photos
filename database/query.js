const mongoose = require('mongoose');
const db = require('./index.js');

const getProductPrimaryPhoto = async (id) => {
  let productInfo = await db.Photo.findOne({id: id}).select('primaryUrl');
  let productPrimaryPhotoUrl = productInfo.primaryUrl;

  return productPrimaryPhotoUrl;
};

const getAllProductPhotos = async (id) => {
  let productPhotos = await db.Photo.findOne({id: id}).select('primaryUrl productUrls');
  console.log('db test', productPhotos)
  return productPhotos;
}

const getMultipleProductsPrimaryPhotos = async(ids) => {
  let primaryPhotosQuery = await db.Photo.find({id: {$in: ids}}).select('id primaryUrl');
  let primaryPhotos = {};

  primaryPhotosQuery.forEach(photoInfo => {
    primaryPhotos[photoInfo.id] = photoInfo.primaryUrl
  });
  return new Promise((resolve, reject) => resolve(primaryPhotos));
}

const getProductFeaturesPhotos = async (id) => {
  let productInfo = await db.Photo.findOne({id: id}).select('id featuresUrls');
  return productInfo;
};

module.exports = {
  getProductPrimaryPhoto: getProductPrimaryPhoto,
  getAllProductPhotos: getAllProductPhotos,
  getMultipleProductsPrimaryPhotos: getMultipleProductsPrimaryPhotos,
  getProductFeaturesPhotos: getProductFeaturesPhotos
};