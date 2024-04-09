var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');
require('dotenv').config()

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
const { checkMonitorConfiguration } = require('./service/monitor');
const { extractDeviceArrayFromString, updateDeviceOnEnvironment } = require('./utils');
const { setDevice, getDevice } = require('./service/storage');
const { getDeviceId } = require('./service/device');
const { configureMqttDevice, publishDeviceInformation, connectToMQTTBroker } = require('./service/mqtt');

var app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

// SET BASE URL TO DEVICE
// axios.defaults.baseURL = `http://${process.env.CONTROL_ID_IP}/`;

const devices = extractDeviceArrayFromString(process.env.CONTROL_DEVICES);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

devices.forEach(async device => {
  await connectToMQTTBroker();
  await getDeviceId(device);
  setDevice(device);
  await checkMonitorConfiguration(device);
  console.log('configuring mqtt device');
  await configureMqttDevice(device);
  await wait(1000);
  publishDeviceInformation(device);
});

module.exports = app;
