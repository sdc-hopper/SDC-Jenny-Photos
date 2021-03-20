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

const PrimaryUrls = sequelize.define('PrimaryUrls', {
  assocId: Sequelize.INTEGER,
  primaryUrl: Sequelize.TEXT,
}, { timestamps: false
})

const ProductUrls = sequelize.define('ProductUrls', {
  assocId: Sequelize.INTEGER,
  productUrl: Sequelize.TEXT
}, { timestamps: false
})

const FeaturesUrls = sequelize.define('FeaturesUrls', {
  assocId: Sequelize.INTEGER,
  featuresUrl: Sequelize.TEXT
}, { timestamps: false
})

// PrimaryUrls.hasMany(ProductUrls)
// ProductUrls.belongsTo(PrimaryUrls)
// PrimaryUrls.hasMany(FeaturesUrls)
// FeaturesUrls.belongsTo(PrimaryUrls)

// PrimaryUrls.hasMany(ProductUrls, { as: "productUrls"})
// ProductUrls.belongsTo(PrimaryUrls, {
//   foreignKey: "assocId",
//   as: "PrimaryUrls"
// })
// PrimaryUrls.hasMany(FeaturesUrls, { as: "featuresUrls"})
// FeaturesUrls.belongsTo(PrimaryUrls, {
//   foreignKey: "assocId",
//   as: "PrimaryUrls"
// })

sequelize.sync({ force: true })
.then(() => {
  console.log('Tables synced. Seeding started...')

// ****** START SEEDING ******

let PG_DB = 'test'
let ID_START = 0
let BATCHSIZE = 1000 // default: 1000
let BATCHLOOPS = 10000 // default: 10000
let featuresPhotoSizes = [[960, 832], [960, 400], [960, 123], [960, 832], [700, 568], [700, 568], [700, 568], [960, 832], [547, 454], [300, 270], [300, 270], [300, 270], [50, 50], [50, 50], [50, 50], [50, 50], [50, 50]];
let availableIds;

const makeEntry = async () => {
  try {
      let urlArray = featuresPhotoSizes.map(size =>  {
      let randomIdIndex = Math.floor(Math.random() * availableIds.length)
      return `https://picsum.photos/${size[0]}/${size[1]}/?image=${availableIds[randomIdIndex].id}`
    })

    let entryTables = {}

    entryTables.featuresArray = urlArray.map(url => {
      return {
        assocId: ID_START + 1000,
        featuresUrl: url
      }
    })

    entryTables.productArray = entryTables.featuresArray.slice(0,7).map(entry => {
      return {
        assocId: ID_START + 1000,
        productUrl: entry.featuresUrl
      }
    })

    entryTables.primaryEntry = {
      assocId: ID_START + 1000,
      primaryUrl: urlArray[0]
    }

    return entryTables
  } catch(e) {
    console.log(e)
  }
}

let makeDataArray = async () => {
  try {
    let primaryArray = []
    for (let i = 0; i < BATCHSIZE; i++) {
      let tables = await makeEntry()
      // console.log('ENTRY TABLES TEST', entry)
      await ProductUrls.bulkCreate(tables.productArray)
      await FeaturesUrls.bulkCreate(tables.featuresArray)
      primaryArray.push(tables.primaryEntry)
      ID_START++
    }
    await PrimaryUrls.bulkCreate(primaryArray)
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
    // console.log('ids', availableIds.reverse())

    for (let i = 0; i < BATCHLOOPS; i++) {
      await makeDataArray()
      if (i % 200 === 0 || i === BATCHLOOPS - 1) {
        let entries = log1000(ID_START)
        console.log(`finished batch ${i}, entry ${entries}`)
      }
    }

    // let query = await PrimaryUrls.findAll({include: ["productUrls"]})
    // console.log('QUERY TEST', query[0].dataValues.ProductUrls)

    let queryPrimaryUrl = await PrimaryUrls.findAll({where: { assocId: 1005 }, raw: true})
    console.log('primaryUrl id 1005 test:', queryPrimaryUrl)

    let queryProductUrls = await ProductUrls.findAll({where: { assocId: 1005 }, raw: true})
    console.log('productUrls id 1005 test:', queryProductUrls)

    let queryFeaturesUrls = await FeaturesUrls.findAll({where: { assocId: 1005 }, raw: true})
    console.log('featuresUrls id 1005 test:', queryFeaturesUrls)

    sequelize.close()
  } catch(e) {
    console.log('loopBatch error', e)
  }
}
loopBatch()

})
.catch(err => console.log('seeding error', e))