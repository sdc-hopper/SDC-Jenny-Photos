// SAVE VERSION 1: USED CSV PARSER TO PIPE ENTRIES ROW BY ROW, HOWEVER MAXED OUT HEAP MEMORY, AND ONLY COMPLETED BATCHES AT 500 LIMIT WHICH WOULD HAVE TAKEN 20,000 CSV FILES

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();
const axios = require('axios')
const fs = require('fs');
const fastcsv = require('fast-csv');
const Pool = require('pg').Pool;

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

// ****** CSV WRITE FUNCTIONS ******

let BATCHSIZE = 250000
// let BATCHLOOPS = 10000000 / BATCHSIZE
let BATCHLOOPS = 2
let LOOP = 0;

// ****** SAVE TO DB FUNCTIONS ******

let readAndSave = async () => {
  try {
    // console.log('CHECKPOINT: readAndSave, loop:', LOOP)
    // console.time('saveToDbTime')

    let stream = fs.createReadStream(`pg${LOOP}.csv`);
    let csvData = [];
    let csvStream = fastcsv.parse()
      .on('data', (data) => {
        csvData.push(data);
      })
      .on('end', () => {
        csvData.shift();

        const pool = new Pool({
          host: 'localhost',
          database: 'test',
          port: 5432,
        });

        const query = `INSERT INTO "AllUrls" ("assocId", type, url) VALUES ($1, $2, $3)`;

        pool.connect((err, client, done) => {
          if (err) throw err;
          try {
            csvData.forEach(row => {
              client.query(query, row, (err, res) => {
                if (err) throw err;
              })
            })
          } catch(e) {
            console.log('pool error:',e)
          } finally {
            // console.timeEnd('saveToDbTime')
            done()
          }
        })
      });

    stream.pipe(csvStream);
  } catch(e) {
    console.log('readAndSave error:',e)
  }
}

// ****** EXECUTE WRITE CSV & SAVE TO DB ******
let execSeed = async () => {
  try {
    console.time('*** saveToDbTime ***')
    for (let i = 0; i < BATCHLOOPS; i++) {
      await readAndSave()
      LOOP++
  }
     console.timeEnd('*** saveToDbTime ***')

  // let idNum = 1003
  // let queryTest = await AllUrls.findAll({where: { assocId: idNum }, raw: true })
  // console.log(`primaryUrl id ${idNum} test:`, queryTest)

} catch(e) {
  console.log('execSeed error:',e)
}
}
execSeed()

sequelize.close()
})
.catch(err => console.log('seeding error', e))