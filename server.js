const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
  console.log(err);
  console.log(err.name, err.message);
  console.log('Exiting process');
  process.exit(1);
});
const app = require('./app');
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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app listening at ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('shutting down server!');
  server.close(() => {
    process.exit(1);
  });
});
