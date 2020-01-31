const express = require('express');
const tourController = require('../controller/tourController');
const authenticationController = require('../controller/authenticationController');
const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.getAliasTours, tourController.getAllTours);
router.route('/get-tour-stat').get(tourController.getTourStats);
router.route('/yearly-plan/:year').get(tourController.getYearlyPlan);
router
  .route('/')
  .get(authenticationController.sendProtect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authenticationController.sendProtect,
    authenticationController.restrict('admin'),
    tourController.deleteTour
  );

module.exports = router;
