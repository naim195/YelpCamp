const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campgrounds");
const { campgroundSchema } = require("../schemas");
const { isLoggedIn,isAuthor,validateCampground } = require("../middleware");



router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  }),
);

router.get("/new", isLoggedIn, async (req, res) => {
  res.render("campgrounds/new"); //views campgrounds not a part of route
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Succesfully made a new campground!!");
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({path:"reviews",populate:{path:'author'}})
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  }),
);

router.get(
  "/:id/edit",
  isLoggedIn, isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campgrounds");
    }
      
    res.render("campgrounds/edit", { campground });
  }),
);

router.put(
  "/:id",
  isLoggedIn, isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id);
    
   

    req.flash("success", "Successfully Updated Campground!!");
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.delete(
  "/:id",
  isLoggedIn,isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Campground!!");
    res.redirect("/campgrounds");
  }),
);

module.exports = router;