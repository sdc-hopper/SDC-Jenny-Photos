const fs = require('fs');
const Pool = require('pg').Pool;
const fastcsv = require('fast-csv');
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();

// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   database: 'test',
//   logging: false,
// });

// let preStream = async () => {
//   try {
//     await sequelize.authenticate()
//     console.log('- sequelize connected.')

//     const AllUrls = sequelize.define('AllUrls',{
//       assocId: Sequelize.INTEGER,
//       type: Sequelize.TEXT,
//       url: Sequelize.TEXT
//     }, {timestamps: false})

//     await sequelize.sync({ force: true })
//     console.log('- tables reset, closing connection.')

//     await writeAndSave()

//     sequelize.close()
//   } catch(e) {
//     console.log('preStream error', e)
//   }
// }
// preStream()

console.time('saveToDb')

let readAndSave = async () => {
  try {
    let stream = fs.createReadStream('pg.csv');
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
                if (err) {
                  console.log(err.stack);
                } else {
                  // console.log('inserted'+res.rowCount+' row:', row)
                } // take out if working
              })
            })
          } catch(e) {
            console.log('pool error:',e)
          } finally {
            console.timeEnd('saveToDb')
            done()
          }
        })
      });

    stream.pipe(csvStream);
  } catch(e) {
    console.log('readAndSave error:',e)
  }
}
readAndSave()