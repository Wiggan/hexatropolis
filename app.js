var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//require('./services/database').init();
var indexRouter = require('./routes/index');
var dropTestRouter = require('./routes/drop_test');
var pocRouter = require('./routes/game_poc');
var poc3dRouter = require('./routes/game_poc_3d');
var poc3dEditorRouter = require('./routes/game_poc_3d_editor');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/drop_test', dropTestRouter);
app.use('/poc', pocRouter);
app.use('/poc3d', poc3dRouter);
app.use('/poc3deditor', poc3dEditorRouter);


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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
