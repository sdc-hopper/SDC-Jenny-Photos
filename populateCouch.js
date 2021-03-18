require('dotenv').config();
const nano = require('nano')(`http://admin:${process.env.NANOPZ}@localhost:5984`);
const axios = require('axios')

let NANO_DB = 'test'
let ID_START = 0
let BATCHSIZE = 1000 // default: 1000
let BATCHLOOPS = 10000 // default: 10000
const nanodb = nano.use(NANO_DB)
let featuresPhotoSizes = [[960, 832], [960, 400], [960, 123], [960, 832], [700, 568], [700, 568], [700, 568], [960, 832], [547, 454], [300, 270], [300, 270], [300, 270], [50, 50], [50, 50], [50, 50], [50, 50], [50, 50]];
let availableIds;

const makeEntry = async () => {
  try {
      let urlArray = featuresPhotoSizes.map(size =>  {
      let randomIdIndex = Math.floor(Math.random() * availableIds.length)
      return `https://picsum.photos/${size[0]}/${size[1]}/?image=${availableIds[randomIdIndex].id}`
    })

    let entry = {
      id: ID_START + 1000,
      primaryUrl: urlArray[0],
      productUrls: urlArray.slice(0, 7),
      featuresUrls: urlArray
    }
    return entry
  } catch(e) {
    console.log('makeEntry error:', e)
  }
}

let makeDataArray = async () => {
  try {
    let arr = []
    for (let i = 0; i < BATCHSIZE; i++) {
      let entry = await makeEntry()
      arr.push(entry) // INSERT DATA TEST HERE
      ID_START++
    }
    return arr
  } catch(e) {
    console.log('makeDataArray error:', e)
  }
}

let insertArray = async (dbArray) => {
  try {
    await nanodb.bulk({docs: dbArray})
  } catch(e) {
    console.log('insertArray error', e)
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
    await nano.db.destroy(NANO_DB)
    await nano.db.create(NANO_DB)

    let req = await axios('https://picsum.photos/list')
    availableIds = req.data

    for (let i = 0; i < BATCHLOOPS; i++) {
      let dataToInsert = await makeDataArray()
      await insertArray(dataToInsert)
      if (i % 200 === 0 || i === BATCHLOOPS - 1) {
        let entries = log1000(ID_START)
        console.log(`finished batch ${i}, entry ${entries}`)
      }
    }
  } catch(e) {
    console.log('loopBatch error', e)
  }
}
loopBatch()