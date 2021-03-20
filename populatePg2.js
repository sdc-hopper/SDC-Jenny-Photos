const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();
const axios = require('axios')

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
  console.log('Tables synced. Seeding started...')

// ****** START SEEDING ******

let PG_DB = 'test'
let ID_START = 0
let BATCHSIZE = 100 // default: 1000
let BATCHLOOPS = 10000000 / BATCHSIZE // default: 10000 || 10000000 / BATCHSIZE
let featuresPhotoSizes = [[960, 832], [960, 400], [960, 123], [960, 832], [700, 568], [700, 568], [700, 568], [960, 832], [547, 454], [300, 270], [300, 270], [300, 270], [50, 50], [50, 50], [50, 50], [50, 50], [50, 50]];
let availableIds;

const makeEntry = async () => {
  try {
      let urlArray = featuresPhotoSizes.map(size =>  {
      let randomIdIndex = Math.floor(Math.random() * availableIds.length)
      return `https://picsum.photos/${size[0]}/${size[1]}/?image=${availableIds[randomIdIndex].id}`
    })

    let entry = []

    let primaryEntry = {
      assocId: ID_START + 1000,
      type: 'primary',
      url: urlArray[0]
    }
    entry.push(primaryEntry)

    urlArray.forEach(url => {
       let featuresEntry = {
         assocId: ID_START + 1000,
         type: 'features',
         url: url
       }
       entry.push(featuresEntry)
    })

    urlArray.slice(0,7).forEach(url => {
      let productArray = {
        assocId: ID_START + 1000,
        type: 'product',
        url: url
      }
      entry.push(productArray)
    })
    return entry
  } catch(e) {
    console.log(e)
  }
}

let makeDataArray = async () => {
  try {
    for (let i = 0; i < BATCHSIZE; i++) {
      let entry = await makeEntry()
      // console.log('ENTRY TABLES TEST', entry)
      await AllUrls.bulkCreate(entry)
      ID_START++
    }
  } catch(e) {
    console.log('makeDataArray error:', e)
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

let loopBatch = async () => {
  try {
    let req = await axios('https://picsum.photos/list')
    availableIds = req.data

    for (let i = 0; i < BATCHLOOPS; i++) {
      await makeDataArray()
      if (i % 1000 === 0 || i === BATCHLOOPS - 1) {
        let entries = log1000(ID_START)
        console.log(`finished batch ${i} at ${i/BATCHLOOPS * 100}%, entry ${entries}`)
      }
    }

    // let query1001 = await AllUrls.findAll({where: { assocId: 1001 }, raw: true })
    // console.log('primaryUrl id 1001 test:', query1001)

    sequelize.close()
  } catch(e) {
    console.log('loopBatch error', e)
  }
}
loopBatch()

})
.catch(err => console.log('seeding error', e))