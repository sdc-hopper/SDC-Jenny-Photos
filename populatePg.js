const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'test',
});

let startup = async () => {
  try {
    await sequelize.authenticate()
    console.log('Sequelize connected.')
  } catch(e) {
    console.log('startup error', e)
  }
}

const TestData = sequelize.define('TestData', {
  testId: Sequelize.INTEGER
}, { timestamps: false
})

sequelize.sync({ force: true })
.then(() => {
  console.log('Tables synced. Seeding started...')

let PG_DB = 'test'
let ID_START = 0
let BATCHSIZE = 5
let BATCHLOOPS = 2

let makeDataArray = () => {
  let arrPromises = []
  for (let i = 0; i < BATCHSIZE; i++) {
    arrPromises.push(TestData.create({'testId': ID_START})) // INSERT DATA TEST HERE
    ID_START++
  }
  return arrPromises
}

let insertArray = async (dbArray) => {
  try {
    await Promise.all(dbArray)
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
    for (let i = 0; i < BATCHLOOPS; i++) {
      let dataToInsert = makeDataArray()
      await insertArray(dataToInsert)
      if (i % 50 === 0) {
        let entries = log1000(ID_START)
        console.log(`finished batch ${i}, entry ${entries}`)
      }
    }
  } catch(e) {
    console.log('loopBatch error', e)
  }
}
loopBatch()

})
.catch(err => console.log('seeding error', e))