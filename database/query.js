const mongoose = require('mongoose');
const db = require('./index.js');

const getPrimaryPhoto = async (id, cb) => {
  let productInfo = await db.Photo.findOne({id: id}).select('primaryUrl');
  let productPrimaryPhotoUrl = productInfo.primaryUrl;
  return productPrimaryPhotoUrl;
}

module.exports.getPrimaryPhoto = getPrimaryPhoto;