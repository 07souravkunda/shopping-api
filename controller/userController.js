const AppError = require('../utils/appError');
const User = require('../models/userModel');
const asyncCatch = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not handled'
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not handled'
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not handled'
  });
};

exports.updateMe = asyncCatch(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirmation) {
    return next(
      new AppError(
        'to change password make request to users/updatePassword route',
        400
      )
    );
    const obj = filterObj(req.body, name);
    const user = await User.findByIdAndUpdate(req.user.id, obj);
    res.status(200).json({
      status: 'success',
      user
    });
  }
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not handled'
  });
};

exports.deleteMe = asyncCatch(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { valid: false });
  res.status(204).json({
    status: 'success',
    user: null
  });
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not handled'
  });
};
