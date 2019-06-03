/**
 *  开发环境
 *
 */

const gulp = require('gulp'),
    Config = require('./gulpfile.config'),
    rename = require('gulp-rename'),                    // 文件更名
    sass = require('gulp-sass'),                        // sass编译
    minifyCss = require('gulp-clean-css'),              // 压缩css文件，并给引用url添加版本号避免缓存
    livereload = require('gulp-livereload'),            // 热加载
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),             // 添加供应商前缀
    concat = require('gulp-concat'),                    // 合并多个文件
    del = require('del'),                               // 清空
    babel = require('gulp-babel'),                      // es6转es5
    connect = require('gulp-connect'),                  // 服务
    pxtoviewport = require('postcss-px-to-viewport'),   // px转vw
    rev = require('gulp-rev'),                          // 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),       // 路径替换
    debug = require('gulp-debug'),                      // debug
    postcsssvg = require('postcss-write-svg'),
    proxy = require('http-proxy-middleware'),               // 代理
    // url = "https://smallapp.xilaikd.com/xilaisender_s/";   // 正式
    url = "https://smallapp-cs.xilaikd.com/xilaisender_s/";     // 测试
    // url="http://10.10.10.201:1882/xilaisender_s/"          //开发

function dev() {
    const plugins = [
        autoprefixer({browsers: ['last 3 version'], cascade: false}),
        pxtoviewport({
            viewportWidth: 750,
            viewportHeight: 1334,
            unitPrecision: 5,
            viewportUnit: 'vw',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false
        }),
        postcsssvg({})
    ];
    // 清空dist
    gulp.task('clean', function (cb) {
        return del(['./rev', Config.dist_files], cb);
    });

    //web服务器
    gulp.task('webserver', function () {
        connect.server({
            port: 8080,
            host: "0.0.0.0",
            root: 'dist',
            middleware: function (connect, opt) {
                return [
                    proxy('/addressBook/', {
                        target: url,
                        changeOrigin: true
                    }),
                    proxy('/coupon/', {
                        target: url,
                        changeOrigin: true
                    }),
                    proxy('/idCardAuth/', {
                        target: url,
                        changeOrigin: true
                    }),
                    proxy('/order/', {
                        target: url,
                        changeOrigin: true
                    }),
                    proxy('/expressOrderDetail/', {
                        target: url,
                        changeOrigin: true
                    }),
                    proxy('/xilaisender_s/', {
                        target: url,
                        changeOrigin: true,
                        pathRewrite: {'^/xilaisender_s/': '/'}
                    }),
                    proxy('/xilaimanager_s/', {
                        target: url,
                        changeOrigin: true
                    })
                ]
            }
        });
    });


    // 压缩js
    gulp.task('uglifyRename:dev', function () {
        gulp.src(Config.js.src)
            .pipe(babel({
                presets: ["es2015", "stage-0"]
            }))
            .pipe(gulp.dest(Config.js.dist))
            .pipe(livereload());

    });

    //编译sass并且压缩
    gulp.task('sass2css:dev', function () {
        gulp.src(Config.sass.src)
            .pipe(sass())
            .pipe(postcss(plugins))

            .pipe(gulp.dest(Config.sass.dist))
            .pipe(livereload());
    });

    // 压缩css
    gulp.task('mini-css:dev', function () {
        return gulp.src([Config.css.src])
            .pipe(minifyCss())
            .pipe(rev())
            .pipe(postcss(plugins))
            .pipe(gulp.dest(Config.css.dist))
            .pipe(rev.manifest())
            .pipe(debug({title: '生成jsonMap:'}))
            .pipe(gulp.dest(Config.dist));
    });


    //copy html 文件
    gulp.task('copyHtml:dev', function () {
        gulp.src(Config.html.src)
            .pipe(gulp.dest(Config.html.dist))
            .pipe(livereload());

    });
    // 替换html路径
    gulp.task('md5:dev', ['mini-css:dev'], function () {
        return gulp.src(['./dist/*.json', Config.html.src])
            .pipe(revCollector({
                replaceReved: true
            }))
            .pipe(debug({title: '路径替换:'}))
            .pipe(gulp.dest(Config.html.dist))
            .pipe(livereload());
    });

    //copy img 文件
    gulp.task('copyImg:dev', function () {
        gulp.src(Config.img.src)
            .pipe(gulp.dest(Config.img.dist))
            .pipe(livereload());

    });


    // copy lib下的所有文件
    gulp.task('copylib:dev', function () {
        gulp.src(Config.lib.src)
            .pipe(gulp.dest(Config.lib.dist))
            .pipe(livereload());

    });
    // copy iconFont下的所有文件
    gulp.task('copyIconFont:dev', function () {
        gulp.src(Config.iconFont.src)
            .pipe(gulp.dest(Config.iconFont.dist))
            .pipe(livereload());
    });

    gulp.task('dev', ['webserver', 'mini-css:dev', 'sass2css:dev', 'md5:dev', 'uglifyRename:dev', 'copyImg:dev', 'copylib:dev', 'copyIconFont:dev'], function () {
        console.log("--------开发环境包打包完成------------");
        gulp.watch(Config.js.src, ['uglifyRename:dev']); //监听js文件
        gulp.watch(Config.sass.src, ['sass2css:dev']); //监听 scss
        gulp.watch(Config.css.src, ['md5:dev']); //监听 css
        gulp.watch(Config.html.src, ['md5:dev']); //监听html
        gulp.watch(Config.img.src, ['copyImg:dev']); //监听img
        gulp.watch(Config.lib.src, ['copylib:dev']); //监听lib
        gulp.watch(Config.iconFont.src, ['copyIconFont:dev']); //监听iconFont
        livereload.listen();
    });

}

//======= gulp dev 开发环境下 ===============
module.exports = dev;