const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const url = process.env.CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('database connection successful');
  });

const importAll = async () => {
  try {
    await Tour.insertMany(tours);
    console.log('import success');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteAll = async () => {
  try {
    await Tour.deleteMany();
    console.log('delete successful');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importAll();
} else if (process.argv[2] === '--delete') {
  deleteAll();
}

console.log(process.argv);
