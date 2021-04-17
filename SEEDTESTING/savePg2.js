// SAVE VERSION 2: ATTEMPTED TO IMPLEMENT COPY USING PG-COPY-STREAMS BUT KEPT GETTING ERROR 'CONNECTION TERMINATED' OR 'RELEASE CALLED ON CLIENT WHICH HAS ALREADY BEEN RELEASED TO THE POOL', SO REMOVED CLIENT QUERY AND USED POOL INSTEAD. ALSO REMOVED 'TYPE' CATEGORY AFTER DATA REFACTOR.

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();
const { Pool } = require('pg');

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
  url: Sequelize.TEXT
}, {timestamps: false})

sequelize.sync({ force: true })
.then(() => {

// ****** SAVE TO DB FUNCTIONS ******

  console.log('Tables synced. Seeding started...')

  let CSV_FILE_SAVES = 40
  let LOOP = 0;

  const pool = new Pool({
    database: 'test',
  });

  let readAndSave = () => {
    // pool.query(`COPY "AllUrls" FROM '/Users/JennyHou/Desktop/REPOS/00_HR/02_sdc/SDC-Jenny-Photos/SEEDTESTING/pg${LOOP}.csv' WITH DELIMITER ',' CSV HEADER;`)
    pool.query(`COPY "AllUrls" FROM '/csvs/pg${LOOP}.csv' WITH DELIMITER ',' CSV HEADER;`)
    .then(() => console.log(`seeded csv file`))
    .catch(error => console.log('copy error:',error))
  }

// ****** EXECUTE SAVE CSV TO DB ******

  let execSeed = async () => {
    try {
      for (let i = 0; i < CSV_FILE_SAVES; i++) {
        await readAndSave()
        LOOP++
      }
    } catch(e) {
    console.log('execSeed error:',e)
    }
  }

execSeed()
})
.catch(err => console.log('pool connect error', err))
.finally(() => {
  sequelize.close()
})