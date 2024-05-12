const mongoose = require("mongoose");
const Campground = require("../models/campgrounds");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");

mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random].state}, ${cities[random].city}`,
      title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
    });
      await camp.save();
  }
};

seedDb();