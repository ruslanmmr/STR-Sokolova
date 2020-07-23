var gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    pug = require("gulp-pug"),
    sass = require("gulp-sass"),
    mincss = require("gulp-clean-css"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    favicons = require("gulp-favicons"),
    replace = require("gulp-replace"),
    newer = require("gulp-newer"),
    plumber = require("gulp-plumber"),
    debug = require("gulp-debug"),
    watch = require("gulp-watch"),
    clean = require("gulp-clean"),
    rsync = require('gulp-rsync');


  let $images = ["./src/img/**/*.{jpg,jpeg,png,gif}", "!./src/img/favicons/*.{jpg,jpeg,png,gif}"],
      $pug = ["./src/views/**/*.pug", "!./src/views/blocks/*.pug", "!./src/views/layout/*.pug"],
      $pug_watch = "./src/views/**/*.pug",
      $scripts = ["./src/js/*.js", "!./src/js/libs/*.js"],
      $styles = ["./src/styles/*.scss", "!./src/styles/components/*.scss", "!./src/styles/libs/*.scss"],
      $styles_watch = ["./src/styles/**/*.scss"],
      $favicons = "./src/img/favicons/*.{jpg,jpeg,png,gif}",
      $other = ["./src/**/*", "!./src/img/**/*.{jpg,jpeg,png,gif}", "!./src/js/*.js", "!./src/styles/*.scss", "!./src/styles/components","!./src/styles/components/**/*", "!./src/views", "!./src/views/**/*"];

gulp.task("pug", function () {
  return gulp.src($pug)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest("./build/"))
    .pipe(debug({
      "title": "html"
    }))
    .on("end", browsersync.reload);
});

gulp.task("scripts", function () {
  return gulp.src($scripts)
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ["@babel/preset-env"]}))
    .pipe(gulp.dest("./build/js/"))
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write("./maps/"))
    .pipe(gulp.dest("./build/js/"))
    .pipe(debug({"title": "scripts"}))
    .on("end", browsersync.reload);
});

gulp.task("styles", function () {
  return gulp.src($styles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("./build/styles/"))
    .pipe(mincss())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write("./maps/"))
    .pipe(gulp.dest("./build/styles/"))
    .pipe(debug({"title": "styles"}))
    .on("end", browsersync.reload);
});


gulp.task("images", function () {
  return gulp.src($images)
    .pipe(newer("./build/img/"))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest("./build/img/"))
    .pipe(debug({
      "title": "images"
    }))
    .on("end", browsersync.reload);
});

gulp.task("favicons", function () {
  return gulp.src($favicons)
    .pipe(favicons({
      icons: {
        appleIcon: true,
        favicons: true,
        online: false,
        appleStartup: false,
        android: false,
        firefox: false,
        yandex: false,
        windows: false,
        coast: false
      }
    }))
    .pipe(gulp.dest("./build/img/favicons/"))
    .pipe(debug({
      "title": "favicons"
    }));
});

gulp.task("other", function () {
  return gulp.src($other)
    .pipe(gulp.dest("./build/"))
    .on("end", browsersync.reload);
});

gulp.task("clean", function () {
  return gulp.src("./build/*", {
      read: false
    })
    .pipe(clean())
    .pipe(debug({
      "title": "clean"
    }));
});

gulp.task("serve", function () {
  return new Promise((res, rej) => {
    browsersync.init({
      server: "./build/",
      tunnel: false,
      port: 9000
    });
    res();
  });
});

gulp.task("watch", function () {
  return new Promise((res, rej) => {
    watch($pug_watch, gulp.series("pug"));
    watch($styles_watch, gulp.series("styles"));
    watch($scripts, gulp.series("scripts"));
    watch($images, gulp.series("images"));
    watch($favicons, gulp.series("favicons"));
    watch($other, gulp.series("other"));
    res();
  });
});


// BUILD
gulp.task("default", gulp.series("clean",
  gulp.parallel("pug", "scripts", "styles", "images", "favicons", "other"),
  gulp.parallel("watch", "serve")
));
