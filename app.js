const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');
const companyRoutes = require('./api/routes/company');
const offerRoutes = require('./api/routes/offer');
const requestRoutes = require('./api/routes/request');
var cors = require('cors')
//mongoose.connect('mongodb://cluster0:cluster0@cluster0-shard-00-00-h7fy9.mongodb.net:27017,cluster0-shard-00-01-h7fy9.mongodb.net:27017,cluster0-shard-00-02-h7fy9.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', );

//mongoose.Promise = global.Promise;
const db_url = "mongodb://cluster0:cluster0@cluster0-shard-00-00-h7fy9.mongodb.net:27017,cluster0-shard-00-01-h7fy9.mongodb.net:27017,cluster0-shard-00-02-h7fy9.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0
};
mongoose.connect(db_url, options, function (error) {
  if (error) console.error(error);
  else console.log('mongo connected');
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("DATABASE [OK]");
});
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors())
// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/company", companyRoutes);
app.use("/offer", offerRoutes);
app.use("/request", requestRoutes)


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500);

  res.json({
    error: {
      message: error.message
    }
  });
});


module.exports = app;