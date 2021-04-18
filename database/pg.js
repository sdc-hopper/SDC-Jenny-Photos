const dotenv = require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  database: 'test',
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
})

client.connect()
.then(() => console.log('client connected'))
.catch(e => console.log('client connection error:',e))

let getAllProductPhotos = async (id) => {
  try {
    const results = await client.query(`SELECT * FROM "AllUrls" WHERE "assocId"=${id};`)
    const idUrls = results.rows
    const obj = {
      primaryUrl: idUrls[0].url,
      productUrls: idUrls.slice(3,10).map(obj => obj.url),
      _id: Number(id),
    }
    // console.log('db obj test', obj)
    return obj
  } catch(e) {
    console.log('db get photos error:',e)
    throw e
  }
}

module.exports = {
  getAllProductPhotos,
}