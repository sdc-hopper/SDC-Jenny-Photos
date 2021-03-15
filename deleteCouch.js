require('dotenv').config();
const nano = require('nano')(`http://admin:${process.env.NANOPZ}@localhost:5984`);

let NANO_DB = 'test'

let wipeDb = async() => {
  try {
    await nano.db.destroy(NANO_DB)
    await nano.db.create(NANO_DB)
  } catch(e) {
    console.log('wipeDb error', e)
  }
}
wipeDb()