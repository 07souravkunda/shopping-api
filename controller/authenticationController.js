const jwt = require('jsonwebtoken');
const util = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const asyncCatch = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');

exports.signupUser = asyncCatch(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(200).json({
    status: 'success',
    token,
    user: user
  });
});

exports.loginUser = asyncCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('provide valid email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 404));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.sendProtect = asyncCatch(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(new AppError('user is not logged in!'));
  }

  const decoded = await util.promisify(jwt.verify)(
    req.headers.authorization.split(' ')[1],
    process.env.JWT_PRIVATE_KEY
  );
  console.log(decoded);
  const freshUser = await User.findById(decoded.id);
  console.log(freshUser);
  if (!freshUser) {
    return next(new AppError('User does not exist!'));
  }
  if (freshUser.isPasswordChanged(freshUser.passwordCreatedAt, decoded.iat)) {
    return next(new AppError('User has changed the password!'));
  }
  req.user = freshUser;
  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role);

      return next(
        new AppError('You have no authority to make this change.', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = asyncCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User with the email does not exist!', 404));
  }

  const resetToken = await user.generateForgotPasswordToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });
  try {
    await sendMail(user.email, resetToken);
    res.status(200).json({
      status: 'success',
      message: 'token has been sent through you mail'
    });
  } catch (err) {
    return next(new AppError('error in sending email!!'));
  }

  // next();
});

exports.resetPassword = asyncCatch(async (req, res, next) => {
  const decodedToken = await crypto
    .createHash('sha256')
    .update(req.params.id)
    .digest('hex');
  console.log('hello');
  console.log(req.params.id);
  console.log(decodedToken);
  const user = await User.findOne({
    passwordResetToken: decodedToken,
    passwordResetExpiresIn: { $gt: new Date().getTime() }
  });
  if (!user) {
    return next(new AppError('token doesnot exist', 404));
  }
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;
  await user.save();
  res.status(200).json({
    data: 'this is reset token working'
  });
});

exports.updatePassword = asyncCatch(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('you are not logged in', 403));
  }
  const user = await User.findById(req.user.id).select('+password');
  console.log(req.user);
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('password is wrong', 403));
  }

  user.password = req.body.newPassword;
  user.passwordConfirmation = req.body.passwordConfirmation;
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(200).json({
    status: 'success',
    token,
    user: user
  });
});
