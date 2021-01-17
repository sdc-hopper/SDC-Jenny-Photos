const mongoose = require('mongoose');
const db = 'mongodb://localhost/photos'
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to mongodb');
  }
});


const photoSchema = mongoose.Schema({
  id: Number,
  primaryUrl: String,
  productUrls: Array,
  featuresUrls: Array,
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports.Photo = Photo;