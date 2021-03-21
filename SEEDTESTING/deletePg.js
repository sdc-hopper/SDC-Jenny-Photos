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
startup()

const AllUrls = sequelize.define('AllUrls',{
  assocId: Sequelize.INTEGER,
  type: Sequelize.TEXT,
  url: Sequelize.TEXT
}, {timestamps: false})

sequelize.sync({ force: true })
.then(() => {
  console.log('db wiped, connection closing.')
  sequelize.close()
})
.catch(e => console.log('db wipe error:',e))