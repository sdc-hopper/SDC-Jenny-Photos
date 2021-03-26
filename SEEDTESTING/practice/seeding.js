const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();
const { Pool } = require('pg');

// ****** WIPE DB ******

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

const Primary = sequelize.define('Primary',{
  url: Sequelize.TEXT
}, {timestamps: false})

const Secondary = sequelize.define('Secondary',{
  assocId: Sequelize.INTEGER,
  url: Sequelize.TEXT
}, {timestamps: false})

sequelize.sync({ force: true })
.then(() => {

// ****** SAVE TO DB FUNCTIONS ******

  console.log('Tables synced. Seeding started...')

  const pool = new Pool({
    database: 'test',
  });

  let readAndSave = () => {
    pool.query(`COPY "Primaries" FROM '/Users/JennyHou/Desktop/REPOS/00_HR/02_sdc/SDC-Jenny-Photos/SEEDTESTING/practice/primary.csv' WITH DELIMITER ',' CSV HEADER;`)
    .then(() => {
      console.log(`seeded primary csv`)
    pool.query(`COPY "Secondaries" FROM '/Users/JennyHou/Desktop/REPOS/00_HR/02_sdc/SDC-Jenny-Photos/SEEDTESTING/practice/secondary.csv' WITH DELIMITER ',' CSV HEADER;`)
    })
    .then(() => {
      console.log('seeded secondary csv')
    })
    .catch(error => console.log('copy error:',error))
  }

// ****** EXECUTE SAVE CSV TO DB ******

return readAndSave()
.then(() => console.log('complete readAndSave'))
.catch(e => console.log('readAndSave error',e))

})
.catch(err => console.log('pool connect error', err))
.finally(() => {
  sequelize.close()
})