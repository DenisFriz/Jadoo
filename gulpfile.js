// Default plugins
import gulp from "gulp";
const { src, dest, watch, task, series, parallel } = gulp;
import fs from "fs";
import concat from "gulp-concat";
import clean from "gulp-clean";
import map from "gulp-sourcemaps";
import size from "gulp-size";
import change from "gulp-changed";
import plumber from "gulp-plumber";

// Plugins for styles
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
const scss = gulpSass(dartSass);
import cleanCss from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";

// Plugins for HTML
import htmlmin from "gulp-htmlmin";
import notify from "gulp-notify";

//Plugins for images
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import webpHTML from "gulp-webp-html";

//Plugins from scripts
import uglify from "gulp-uglify";

import browserSync from "browser-sync";
const bs = browserSync.create();

import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

const buildFolder = "./app";
const srcFolder = "./src";

const path = {
  build: {
    html: buildFolder,
    css: `${buildFolder}/css`,
    js: `${buildFolder}/js`,
    images: `${buildFolder}/img/`,
    fonts: `${buildFolder}/fonts/`,
    svg: `${buildFolder}/sprites/`,
    additionalCss: `${buildFolder}/css/`,
    json: `${buildFolder}/js/`,
  },
  src: {
    html: `${srcFolder}/index.html`,
    scss: `${srcFolder}/assets/scss/main.scss`,
    js: `${srcFolder}/js/t.ts`,
    images: `${srcFolder}/img/**/*`,
    fonts: `${srcFolder}/assets/fonts/`,
    svg: `${srcFolder}/assets/sprites/*.svg`,
    additionalCss: `${srcFolder}/css/*.css`,
    json: `${srcFolder}/js/data.json`,
  },
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title,
      message: "Error <%= error.message %>",
      sound: false,
    }),
  };
};

function html() {
  return src(path.src.html)
    .pipe(
      size({
        showFiles: true,
      })
    )
    .pipe(webpHTML())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(
      size({
        showFiles: true,
      })
    )
    .pipe(dest(path.build.html))
    .pipe(bs.stream());
}

function styles() {
  return src(path.src.scss)
    .pipe(change("app/css"))
    .pipe(plumber(plumberNotify("SCSS")))
    .pipe(map.init())
    .pipe(
      size({
        showFiles: true,
      })
    )
    .pipe(scss({ outputStyle: "compressed" }).on("error", scss.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 8 versions"],
        cascade: false,
      })
    )
    .pipe(cleanCss())
    .pipe(concat("styles.min.css"))
    .pipe(
      size({
        showFiles: true,
      })
    )
    .pipe(map.write("."))
    .pipe(plumber.stop())
    .pipe(dest(path.build.css))
    .pipe(bs.stream());
}

function scripts() {
  return src("./src/scripts/slider.js")
    .pipe(uglify())
    .pipe(dest("./app/scripts"));
}

function images() {
  return src(path.src.images)
    .pipe(change("app/img/"))
    .pipe(webp())
    .pipe(dest(path.build.images))

    .pipe(src(path.src.images))
    .pipe(change("app/img/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(dest(path.build.images));
}

function otfToTtf() {
  return src(`${path.src.fonts}*.otf`)
    .pipe(plumber(plumberNotify("otfToTtf")))
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest(path.build.fonts));
}

function ttfToWoff() {
  return src(`${path.src.fonts}*.ttf`)
    .pipe(plumber(plumberNotify("ttfToWoff")))
    .pipe(
      fonter({
        formats: ["woff"],
      })
    )
    .pipe(dest(path.build.fonts))

    .pipe(src(`${path.src.fonts}*.ttf`))
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
}

function loadWoff2() {
  return src(`${path.src.fonts}*.woff2`).pipe(dest(path.build.fonts));
}

function svgBuild() {
  return src(path.src.svg).pipe(dest(path.build.svg)).pipe(bs.stream());
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./app",
    },
    notify: false,
  });
}

function watchFiles() {
  watch("./src/index.html", html);
  watch(["./src/assets/scss/**/*.scss"], styles);
}

task("clean", function (done) {
  if (fs.existsSync("./app/")) {
    return src("./app/", { read: false }).pipe(clean());
  }
  done();
});

const fonts = series(otfToTtf, ttfToWoff, loadWoff2);

task(
  "default",
  series(
    "clean",
    fonts,
    parallel(html, styles, scripts, images, svgBuild),
    parallel(watchFiles, server)
  )
);

export { styles, html, images, server, watchFiles };
