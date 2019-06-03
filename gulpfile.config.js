var SRC_DIR = './src/'; // 源文件目录
var DIST_DIR = './dist/'; // 文件处理后存放的目录
var DIST_FILES = DIST_DIR + '**'; // 目标路径下的所有文件

var Config = {
    src: SRC_DIR,
    dist: DIST_DIR,
    dist_files: DIST_FILES,
    html: {
        src: SRC_DIR + '**/*.html',
        dist: DIST_DIR
    },
    lib: {
        src: SRC_DIR + 'lib/**/*', // lib目录：./src/lib
        dist: DIST_DIR + 'lib' // lib文件build后存放的目录：./dist/lib
    },
    css: {
        src: SRC_DIR + 'css/**/*.css', // css目录：./src/css/
        dist: DIST_DIR + 'css' // SASS文件生成CSS后存放的目录：./dist/css
    },
    sass: {
        src: SRC_DIR + 'sass/**/*.scss', // SASS目录：./src/sass/
        dist: DIST_DIR + 'css' // SASS文件生成CSS后存放的目录：./dist/css
    },
    iconFont: {
        src: SRC_DIR + 'iconfont/*', // SASS目录：./src/sass/
        dist: DIST_DIR + 'iconfont' // SASS文件生成CSS后存放的目录：./dist/css
    },
    js: {
        src: SRC_DIR + 'js/**/*.js', // JS目录：./src/js/
        dist: DIST_DIR + 'js' // JS文件build后存放的目录：./dist/js
    },
    img: {
        src: SRC_DIR + 'images/*', // img目录：./src/images/
        dist: DIST_DIR + 'images' // img文件build后存放的目录：./dist/images
    }
};

module.exports = Config;