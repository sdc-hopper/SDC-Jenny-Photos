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
  primaryId: Sequelize.INTEGER,
  url: Sequelize.TEXT
}, {timestamps: false})


sequelize.sync({ force: true })
.then(() => {

// ****** SAVE TO DB FUNCTIONS ******

  console.log('Tables synced. Seeding started...')

  const pool = new Pool({
    database: 'test',
  });

  let readAndSave = async () => {
    try {
      await pool.query(`COPY "Primaries" FROM '/Users/JennyHou/Desktop/REPOS/00_HR/02_sdc/SDC-Jenny-Photos/SEEDTESTING/practice/primary.csv' WITH DELIMITER ',' CSV HEADER;`)
      console.log(`seeded primary csv`)

      await pool.query(`COPY "Secondaries" FROM '/Users/JennyHou/Desktop/REPOS/00_HR/02_sdc/SDC-Jenny-Photos/SEEDTESTING/practice/secondary.csv' WITH DELIMITER ',' CSV HEADER;`)
      console.log('seeded secondary csv')

      // QUERY BY PRIMARY ID & ASSOCIATIONS

      await Primary.hasMany(Secondary, {
        foreignKey: 'primaryId',
        as: 'Secondaries',
      })
      await Secondary.belongsTo(Primary, {
        foreignKey: 'primaryId',
        as: 'Primaries',
      })

      let results1 = await Primary.findByPk(1, {include: ["Secondaries"]})
      console.log('associations:', results1.Secondaries)

      // QUERY BY INDEXING

      await pool.query(`CREATE INDEX "primaryQuery" ON "Secondaries"("primaryId");`)
      console.log('create indexes')

      let results2 = await pool.query(`SELECT * FROM "Secondaries" WHERE "primaryId"=1;`)
      console.log('indexing:', results2)

    } catch(e) {
      console.log('readAndSave error:',e)
    }
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