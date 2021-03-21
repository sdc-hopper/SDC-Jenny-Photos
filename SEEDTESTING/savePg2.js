// SAVE VERSION 2: ATTEMPTED TO IMPLEMENT COPY USING PG-COPY-STREAMS BUT KEEP GETTING ERROR 'CONNECTION TERMINATED' OR 'RELEASE CALLED ON CLIENT WHICH HAS ALREADY BEEN RELEASED TO THE POOL'.

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();
const axios = require('axios')
const fs = require('fs');
const fastcsv = require('fast-csv');
const { Pool, Client } = require('pg');
const copyFrom = require('pg-copy-streams').from;

// ****** WIPE DB ******

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'test',
  logging: false,
});

let startup = async () => {
  try {
    await sequelize.authenticate()
    console.log('Sequelize connected.')
  } catch(e) {
    console.log('startup error', e)
  }
}
startup()

const AllUrls = sequelize.define('AllUrls',{
  assocId: Sequelize.INTEGER,
  type: Sequelize.TEXT,
  url: Sequelize.TEXT
}, {timestamps: false})

sequelize.sync({ force: true })
// sequelize.sync()
.then(() => {
  console.log('Tables synced. Seeding started...')

  // ****** SAVE TO DB FUNCTIONS ******

  let BATCHSIZE = 250000
  // let BATCHLOOPS = 10000000 / BATCHSIZE
  let BATCHLOOPS = 1
  let LOOP = 0;

let readAndSave = async () => {
  try {
        const pool = new Pool({
          database: 'test',
        });

      pool.connect((err, client, done) => {
      if (err) throw err;
      let stream = client.query(copyFrom(`COPY "AllUrls" FROM STDIN`))
      let fileStream = fs.createReadStream('pg0.csv')// change
      fileStream.on('error', done)
      stream.on('error', (error) => {
        console.log('streamError', error)
      })
      stream.on('end', ()=> {
        console.log('complete loading data')
        client.end()
      })
      fileStream.pipe(stream)
    })
  } catch(e) {
    console.log('readAndSave error:',e)
  }
}
// ****** EXECUTE WRITE CSV & SAVE TO DB ******
let execSeed = async () => {
  try {
    // console.time('*** saveToDbTime ***')
    // for (let i = 0; i < BATCHLOOPS; i++) {
      await readAndSave()
      // LOOP++
  // }
    //  console.timeEnd('*** saveToDbTime ***')
//
  // let idNum = 1003
  // let queryTest = await AllUrls.findAll({where: { assocId: idNum }, raw: true })
  // console.log(`primaryUrl id ${idNum} test:`, queryTest)

} catch(e) {
  console.log('execSeed error:',e)
}
}
execSeed()
.catch(err => console.log('execSeed error', e))
.finally(() => sequelize.close())
})
.catch(err => console.log('seeding error', e))