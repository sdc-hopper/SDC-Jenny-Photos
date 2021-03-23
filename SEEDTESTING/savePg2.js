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
.then(() => {

// ****** SAVE TO DB FUNCTIONS ******

  console.log('Tables synced. Seeding started...')

  let CSV_FILE_SAVES = 50
  let LOOP = 0;

  const pool = new Pool({
    database: 'test',
  });

  let readAndSave = () => {
    pool.query(`COPY "AllUrls" FROM '/Users/JennyHou/Desktop/REPOS/00_HR/02_sdc/SDC-Jenny-Photos/SEEDTESTING/pg${LOOP}.csv' WITH DELIMITER ',' CSV HEADER;`)
    .then(() => console.log(`seeded csv file`))
    .catch(error => console.log('copy error:',error))
    // let fileStream = fs.createReadStream('pg0.csv')// change
    // fileStream.on('error', done)
    // stream.on('error', (error) => {
    //   console.log('streamError', error)
    // })
    // fileStream.pipe(stream)
  }

// ****** EXECUTE WRITE CSV & SAVE TO DB ******
  let execSeed = async () => {
    try {
      for (let i = 0; i < CSV_FILE_SAVES; i++) {
        await readAndSave()
        LOOP++
    }
    // let idNum = 1003
    // let queryTest = await AllUrls.findAll({where: { assocId: idNum }, raw: true })
    // console.log(`primaryUrl id ${idNum} test:`, queryTest)
    } catch(e) {
    console.log('execSeed error:',e)
    } finally {
    // await pool.end(() => console.log('pool ending'))
    }
  }

execSeed()
})
.catch(err => console.log('pool connect error', err))
.finally(() => {
  sequelize.close()
})