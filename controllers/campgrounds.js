const Campground = require('../models/campgrounds');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}
  
module.exports.requireNewForm= (req, res) => {
    res.render("campgrounds/new"); //views campgrounds not a part of route
}
  
module.exports.createCampground =async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Succesfully made a new campground!!");
    res.redirect(`/campgrounds/${campground._id}`);
}
  
module.exports.showCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({path:"reviews",populate:{path:'author'}})
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}
  
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campgrounds");
    }
      
    res.render("campgrounds/edit", { campground });
}
  
module.exports.updateCampground = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id);
    
   

    req.flash("success", "Successfully Updated Campground!!");
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Campground!!");
    res.redirect("/campgrounds");
  }