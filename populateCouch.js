require('dotenv').config();
const nano = require('nano')(`http://admin:${process.env.NANOPZ}@localhost:5984`);

let NANO_DB = 'test'
let ID_START = 0
let BATCHSIZE = 1000 // default: 1000
let BATCHLOOPS = 10000 // default: 10000
const nanodb = nano.use(NANO_DB)

let makeDataArray = () => {
  let arr = []
  for (let i = 0; i < BATCHSIZE; i++) {
    arr.push({'test': ID_START}) // INSERT DATA TEST HERE
    ID_START++
  }
  return arr
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

    for (let i = 0; i < BATCHLOOPS; i++) {
      let dataToInsert = makeDataArray()
      await insertArray(dataToInsert)
      if (i % 50 === 0 || i === BATCHLOOPS - 1) {
        let entries = log1000(ID_START)
        console.log(`finished batch ${i}, entry ${entries}`)
      }
    }
  } catch(e) {
    console.log('loopBatch error', e)
  }
}
loopBatch()