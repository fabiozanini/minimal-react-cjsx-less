var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var creactify = require('coffee-reactify'); 
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
  'react',
  'react/addons'
];

// Bundle the JS app into a single file
var appTask = function (options) {

  // Bundler for the app, with hot reloading
  var appBundler = browserify({
    entries: [options.src],
    transform: [creactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  dependencies.forEach(function (dep) {
  	appBundler.external(dep);
  });
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('main.js'))
      .pipe(gulp.dest(options.dest, {ext: 'js'}))
      .pipe(livereload())
      .pipe(notify(function () {
        console.log('APP (re)built in ' + (Date.now() - start) + 'ms');
      }));
  };
  appBundler = watchify(appBundler);
  appBundler.on('update', rebundle);
  rebundle();

  // Bundler for the dependencies, no hot reloading
  var depsBundler = browserify({
    debug: true,
    require: dependencies
  });
  var start = new Date();
  console.log('Building dependencies');
  depsBundler.bundle()
    .on('error', gutil.log)
    .pipe(source('dependencies.js'))
    .pipe(gulp.dest(options.dest))
    .pipe(notify(function () {
      console.log('Dependencies built in ' + (Date.now() - start) + 'ms');
    }));
  
}

// Bundle the CSS into a single file
var lessTask = function (options) {
      var run = function () {
        console.log(arguments);
        var start = new Date();
        console.log('Building LESS bundle');
        gulp.src(options.src)
          .pipe(concat('index.less'))
          .pipe(less())
          .pipe(gulp.dest(options.dest))
          .pipe(notify(function () {
            console.log('LESS bundle built in ' + (Date.now() - start) + 'ms');
          }));
      };
      run();
      gulp.watch(options.src, run);
}

// main event loop
gulp.task('default', function () {
  appTask({
    src: './app/main.cjsx',
    dest: './build'
  });
  
  lessTask({
    src: './styles/**/*.less',
    dest: './build'
  });

  connect.server({
        root: 'build/',
        port: 8889
    });
});
