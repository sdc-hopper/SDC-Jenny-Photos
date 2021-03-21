// VERSION 4: FUNCTION OUTPUTS CSV FILES CORRECTLY BUT SAVE FUNCTION DOESN'T SEED WITHOUT PRIMARY INDEXES. ADDED PRIMARY INDEXES IN ON EXTRACTION STEP.

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

let BATCHSIZE = 100000 // 200000
let BATCHLOOPS = 2
// let BATCHLOOPS = 10000000 / BATCHSIZE
let PRIMARY_ID = 0
let ASSOC_ID = 1000
let LOOP = 0;
let featuresPhotoSizes = [[960, 832], [960, 400], [960, 123], [960, 832], [700, 568], [700, 568], [700, 568], [960, 832], [547, 454], [300, 270], [300, 270], [300, 270], [50, 50], [50, 50], [50, 50], [50, 50], [50, 50]];
let availableIds;

const makeIdArray = async () => {
  try {
    // console.log('CHECKPOINT: makeIdArray')
      let urlArray = featuresPhotoSizes.map(size =>  {
      let randomIdIndex = Math.floor(Math.random() * availableIds.length)
      return `https://picsum.photos/${size[0]}/${size[1]}/?image=${availableIds[randomIdIndex].id}`
    })

    let group = []

    let primaryEntry = {
      assocId: ASSOC_ID,
      type: 'primary',
      url: urlArray[0]
    }
    group.push(primaryEntry)

    urlArray.forEach(url => {
       let featuresEntry = {
         assocId: ASSOC_ID,
         type: 'features',
         url: url
       }
       group.push(featuresEntry)
    })

    urlArray.slice(0,7).forEach(url => {
      let productArray = {
        assocId: ASSOC_ID,
        type: 'product',
        url: url
      }
      group.push(productArray)
    })
    return group
  } catch(e) {
    console.log(e)
  }
}

let log1000 = (num) => {
  let numArr = num.toString().split('').reverse()
  for (let i = 1; i <= numArr.length - 1; i++) {
    if (i % 3 === 0) {
      numArr[i] = numArr[i] + ','
    }
  }
  return numArr.reverse().join('')
}

let makeBatches = async () => {
  try {
    // console.log('CHECKPOINT: makeBatches')
    let req = await axios('https://picsum.photos/list')
    availableIds = req.data
    let dataArray = []
    for (let i = 0; i < BATCHSIZE; i++) {
      let entry = await makeIdArray()
      if (i % 100000 === 0 || i === BATCHSIZE - 1) {
        let entries = log1000(ASSOC_ID)
        console.log(`finished batch ${i} at ${i/BATCHSIZE * 100}%, entry ${entries}`)
      }
      dataArray.push(entry)
      ASSOC_ID++
    }
    return dataArray
  } catch(e) {
    console.log('makeBatches error:', e)
  }
}

let extractCSV = async () => {
  try {
    console.log('CHECKPOINT: extractCSV')
    let data = await makeBatches()
    // const header = ['assocId,type,url']
    let dataStringArray = []
    data.forEach(idGroup => {
      idGroup.forEach(row => {
        dataStringArray.push(`${PRIMARY_ID},${row.assocId},${row.type},${row.url}`)
        PRIMARY_ID++
      });
    })
    // let finalString = header.concat(dataStringArray).join('\n');
    let finalString = dataStringArray.join('\n');
    // console.log('extract test', finalString)
    return finalString
  } catch(e) {
    console.log('extractCSV error:',e)
  }
}

let writeToCSV = async () => {
  try {
    console.log('CHECKPOINT: writeToCSV, loop:', LOOP)
    // console.time('csvWriteTime')
    const filename = `pg${LOOP}.csv`;
    let csvString = await extractCSV()
    await fs.writeFile(__dirname + '/' + filename, csvString, err => {
      if (err) {
        console.log('error writing to csv:', err)
      } else {
        console.log(`saved as ${filename}`);
        // console.timeEnd('csvWriteTime')
      }
    })
  } catch(e) {
    console.log('writeToCSV error:',e)
  }
}

// // ****** SAVE TO DB FUNCTIONS ******

// let readAndSave = async () => {
//   try {
//     console.log('CHECKPOINT: readAndSave, loop:', LOOP)
//     console.time('saveToDbTime')

//     let stream = fs.createReadStream(`pg${LOOP}.csv`);
//     let csvData = [];
//     let csvStream = fastcsv.parse()
//       .on('data', (data) => {
//         csvData.push(data);
//       })
//       .on('end', () => {
//         csvData.shift();

//         const pool = new Pool({
//           host: 'localhost',
//           database: 'test',
//           port: 5432,
//         });

//         const query = `INSERT INTO "AllUrls" ("assocId", type, url) VALUES ($1, $2, $3)`;

//         pool.connect((err, client, done) => {
//           if (err) throw err;
//           try {
//             csvData.forEach(row => {
//               client.query(query, row, (err, res) => {
//                 if (err) throw err;
//               })
//             })
//           } catch(e) {
//             console.log('pool error:',e)
//           } finally {
//             console.timeEnd('saveToDbTime')
//             done()
//           }
//         })
//       });

//     stream.pipe(csvStream);
//   } catch(e) {
//     console.log('readAndSave error:',e)
//   }
// }

// ****** EXECUTE WRITE CSV ******
let execSeed = async () => {
  try {
    console.time('*** execSeed ***')
    for (let i = 0; i < BATCHLOOPS; i++) {
      await writeToCSV()
      LOOP++
    }
    console.timeEnd('*** execSeed ***')

} catch(e) {
  console.log('execSeed error:',e)
}
}
execSeed()

sequelize.close()
})
.catch(err => console.log('seeding error', e))