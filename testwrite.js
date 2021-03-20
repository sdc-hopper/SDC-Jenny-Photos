const fs = require('fs');

console.time('saveToPgTime')

assocId = 1
type = ['primary', 'product', 'features']
url = 'http...'

let dataArray = type.map(kind => {
  return {
    assocId: assocId,
    type: kind,
    url: url
  }
})

console.log(dataArray)




let writeToCSV = (arr) => {
  const filename = 'test.csv';
  fs.writeFile(filename, extractCSV(arr), err => {
    if (err) {
      console.log('error writing to csv:', err)
    } else {
      console.log(`saved as ${filename}`);
//       let time2 = performance.now()
// console.log('time2', time2, 'dif ms', time1 - time2)
console.timeEnd('saveToPgTime')
    }
  })
}

let extractCSV = (arr) => {

  const header = ['assocId,type,url']
  const rows = arr.map(row => {
    console.log('row', row)
    return `${row.assocId},${row.type},${row.url}`
    });
  return header.concat(rows).join('\n');
}


writeToCSV(dataArray)
