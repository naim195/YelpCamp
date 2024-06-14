const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campgrounds");
const { campgroundSchema } = require("../schemas");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

const campgrounds = require('../controllers/campgrounds');

// Routes for '/'
router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Route for '/new'
router.get('/new', isLoggedIn, campgrounds.requireNewForm);

// Routes for '/:id'
router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Route for '/:id/edit'
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
