// const fs = require('fs');
const Tours = require('../models/tourModel');
const API = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/catchAsync');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkValidate = (req, res, next) => {
//   console.log('you call me');
//   let isValidate = true;
//   const { id, name, duration, difficulty } = req.body;
//   if (!req.body.name || !req.body.price) {
//     isValidate = isValidate && false;
//   }
//   isValidate = typeof id === 'number' && isValidate;
//   isValidate = typeof name === 'string' && name.length > 0 && isValidate;
//   isValidate = typeof duration === 'number' && duration > 0 && isValidate;
//   isValidate =
//     typeof difficulty === 'string' &&
//     (difficulty === 'easy' || difficulty === 'hard') &&
//     isValidate;
//   if (isValidate) {
//     console.log(isValidate);
//     next();
//   } else {
//     console.log(isValidate, 'false');
//     return res.status(400).json({
//       status: 'fail',
//       message: 'invalid input'
//     });
//   }
// };

exports.getAliasTours = (req, res, next) => {
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,rating,description';
  req.query.limit = '5';
  req.query.page = '1';
  next();
  //sort=-price,ratingsAverage&limit=3&page=4&fields=name,rating,description
};

exports.getAllTours = asyncCatch(async (req, res, next) => {
  // try {
  // const queryObj = { ...req.query };
  // const specialString = ['page', 'sort', 'limit', 'fields'];
  // specialString.forEach(el => {
  //   delete queryObj[el];
  // });
  // let queryString = JSON.stringify(queryObj);
  // queryString = queryString.replace(
  //   /\b(gt|gte|lt|lte)\b/g,
  //   match => `$${match}`
  // );
  // console.log(queryString);
  // let query = Tours.find(JSON.parse(queryString));
  // if (req.query.sort) {
  //   const str = req.query.sort.split(',').join(' ');
  //   console.log(str);
  //   query.sort(str);
  // } else {
  //   query.sort('createdAt');
  // }
  // if (req.query.page) {
  //   const pageNo = req.query.page * 1;
  //   const limitNo = req.query.limit * 1;
  //   const skip = (pageNo - 1) * limitNo;
  //   const total = await Tours.countDocuments();
  //   if (skip >= total) {
  //     throw new Error('This is an error!');
  //   } else query.skip(skip).limit(limitNo);
  // }
  // if (req.query.fields) {
  //   const select = req.query.fields.split(',').join(' ');
  //   console.log(select);
  //   query.select(select);
  // } else {
  //   query.select('-__v');
  // }
  const features = new API(req.query, Tours.find())
    .filter()
    .sort()
    .fieldSelect()
    .paginate();
  const tours = await features.tourQuery;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

exports.getTourStats = asyncCatch(async (req, res, next) => {
  // try {
  const tourStat = await Tours.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$duration',
        avgRatings: { $avg: '$ratingsAverage' },
        toralRatings: { $sum: '$ratingsQuantity' },
        totalPrice: { $sum: '$price' },
        maxPrice: { $min: '$price' },
        minPrice: { $max: '$price' },
        totalDocument: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      tourStat
    }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

exports.getTour = asyncCatch(async (req, res, next) => {
  // try {
  const tour = await Tours.findById(req.params.id);

  if (!tour) {
    return next(new AppError('inavlid id', 404));
  }
  res.status(200).json({
    status: 'success',
    tour
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

exports.createTour = asyncCatch(async (req, res, next) => {
  console.log(req.body);
  const newTour = await Tours.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

// const newId = tours[tours.length - 1].id + 1;
// const newTour = {
//   id: newId,
//   time: req.reqTime,
//   ...req.body
// };
// tours.push(newTour);
// fs.writeFile(
//   `${__dirname}/dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   err => {
//     res.status(201).json({
//       status: 'success',
//       data: newTour
//     });
//   }
// );

exports.updateTour = asyncCatch(async (req, res, next) => {
  // try {
  const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new AppError('invalid id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

exports.deleteTour = asyncCatch(async (req, res, next) => {
  // try {
  const tour = await Tours.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new ApiError('inavlid id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

exports.getYearlyPlan = asyncCatch(async (req, res, next) => {
  // try {
  const year = req.params.year * 1;
  const plan = await Tours.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date('2021-1-1'),
          $lte: new Date('2021-12-31')
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        totalTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    { $sort: { _id: -1 } },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $limit: 12 }
  ]);
  res.status(200).json({
    status: 'success',
    data: plan
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});
