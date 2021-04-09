const fs = require('fs')

const extractCSV = () => {
  // last 1000 prod ids
  let csvVals = ['testIds']
  for (let i = 10000000; i < 10001000; i++) {
    csvVals.push(i)
  }
  // console.log(csvVals.length, csvVals[0], csvVals[csvVals.length - 1])
  const csvString = csvVals.join('\n')
  return csvString
}

const writeCSV = async () => {
  try {
    const csvString = extractCSV()
    await fs.writeFile(__dirname + '/' + 'testIds.csv', csvString, err => {
      if (err) {
        console.log('writeFile error:',err)
      } else {
        console.log('saved test ids')
      }
    })
  } catch(e) {
    console.log('writeCSV error:',e)
  }
}
writeCSV()
