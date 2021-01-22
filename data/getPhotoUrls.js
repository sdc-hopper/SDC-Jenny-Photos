const cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

const getPhotoUrls = (tag) => {
  let maxResults;
  let urls;
  if (tag === 'primary') {
    maxResults = 100;
  } else if (tag === 'images') {
    maxResults = 300;
  } else {
    throw 'Invalid tag parameter'
  }

  return new Promise((resolve, reject) => {
    cloudinary.v2.api.resources_by_tag(tag, {max_results: maxResults}, (err, result) => {
      if (err) {
        reject(err)
      } else {
        let photosInfo = result.resources;
        urls = photosInfo.map(photoInfo => photoInfo.url);
        resolve(urls);
      }
    });
  });
};


module.exports.getPhotoUrls = getPhotoUrls;