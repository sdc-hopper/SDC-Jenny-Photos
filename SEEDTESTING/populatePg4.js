// VERSION 4: ISOLATED SAVE FUNCTION INTO SEPARATE FILE. WRITE FUNCTION OUTPUTS CSV FILES CORRECTLY BUT SAVE FUNCTION DOESN'T SEED WITHOUT PRIMARY INDEXES. ADDED PRIMARY INDEXES IN ON EXTRACTION STEP.

const axios = require('axios')
const fs = require('fs');
const fastcsv = require('fast-csv');

// ****** CSV WRITE FUNCTIONS ******

let BATCHSIZE = 200000 // 200000
// let BATCHLOOPS = 2
let BATCHLOOPS = 10000000 / BATCHSIZE
let PRIMARY_ID = 0
let ASSOC_ID = 1000
let LOOP = 0;
let featuresPhotoSizes = [[960, 832], [960, 400], [960, 123], [960, 832], [700, 568], [700, 568], [700, 568], [960, 832], [547, 454], [300, 270], [300, 270], [300, 270], [50, 50], [50, 50], [50, 50], [50, 50], [50, 50]];
let availableIds;

const makeIdArray = async () => {
  try {
      let urlArray = featuresPhotoSizes.map(size =>  {
      let randomIdIndex = Math.floor(Math.random() * availableIds.length)
      return `https://picsum.photos/${size[0]}/${size[1]}/?image=${availableIds[randomIdIndex].id}`
    })

    let idGroupEntries = []

    let primaryEntry = {
      assocId: ASSOC_ID,
      type: 'primary',
      url: urlArray[0]
    }
    idGroupEntries.push(primaryEntry)

    urlArray.forEach(url => {
       let featuresEntry = {
         assocId: ASSOC_ID,
         type: 'features',
         url: url
       }
       idGroupEntries.push(featuresEntry)
    })

    urlArray.slice(0,7).forEach(url => {
      let productArray = {
        assocId: ASSOC_ID,
        type: 'product',
        url: url
      }
      idGroupEntries.push(productArray)
    })
    return idGroupEntries
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
    let req = await axios('https://picsum.photos/list')
    availableIds = req.data
    let dataArray = []
    for (let i = 0; i < BATCHSIZE; i++) {
      let entry = await makeIdArray()
      // if (i % 100000 === 0 || i === BATCHSIZE - 1) {
      //   let entries = log1000(ASSOC_ID)
      //   console.log(`finished batch ${i} at ${i/BATCHSIZE * 100}%, entry ${entries}`)
      // }
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
    let data = await makeBatches()
    let dataStringArray = []
    data.forEach(idGroup => {
      idGroup.forEach(row => {
        dataStringArray.push(`${PRIMARY_ID},${row.assocId},${row.type},${row.url}`)
        PRIMARY_ID++
      });
    })
    let finalString = dataStringArray.join('\n');
    return finalString
  } catch(e) {
    console.log('extractCSV error:',e)
  }
}

let writeToCSV = async () => {
  try {
    console.log(`CHECKPOINT: writeToCSV, loop:${LOOP}/${BATCHLOOPS}`)
    const filename = `pg${LOOP}.csv`;
    let csvString = await extractCSV()
    await fs.writeFile(__dirname + '/' + filename, csvString, err => {
      if (err) {
        console.log('error writing to csv:', err)
      } else {
        console.log(`saved as ${filename}`);
      }
    })
  } catch(e) {
    console.log('writeToCSV error:',e)
  }
}

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