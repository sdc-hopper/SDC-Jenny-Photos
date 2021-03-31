require('dotenv').config();
const nano = require('nano')(`http://admin:${process.env.NANOPZ}@localhost:5984`);
const nanodb = nano.use('test')

let index = async () => {
  try {
    const indexDef = {
      index: { fields: ['id'] },
      name: 'idIndex'
    };
    const response = await nanodb.createIndex(indexDef)
  } catch(e) {
    console.log('index error:',e)
  }
}
index()

/*
query after from mango:
{
   "selector": {
      "id": {
         "$eq": 10000
      }
   }
}
*/