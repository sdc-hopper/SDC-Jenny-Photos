const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();

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

const TestData = sequelize.define('TestData', {
  testId: Sequelize.INTEGER
}, { timestamps: false
})

sequelize.sync({ force: true })
.then(() => {
  console.log('Tables synced. Seeding started...')

let PG_DB = 'test'
let ID_START = 0
let BATCHSIZE = 1000 // default: 1000
let BATCHLOOPS = 10000 // default: 10000

let makeDataArray = async () => {
  try {
    let arr = []
    for (let i = 0; i < BATCHSIZE; i++) {
      arr.push({'testId': ID_START}) // INSERT DATA TEST HERE
      ID_START++
    }
    await TestData.bulkCreate(arr)
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
    for (let i = 0; i < BATCHLOOPS; i++) {
      await makeDataArray()
      if (i % 100 === 0 || i === BATCHLOOPS - 1) {
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