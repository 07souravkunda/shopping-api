const express = require('express');

const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRouters');
const AppError = require('./utils/appError');
const globalErrorController = require('./controller/globalErrorController');

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello I am middleware');
  next();
});
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.reqTime = new Date().toTimeString();
  next();
});

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('*', function(req, res, next) {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `The path ${req.originalUrl} is not handled`
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on server`);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

app.use(globalErrorController);

module.exports = app;
