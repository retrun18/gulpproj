let {watch,src,dest}        = require('gulp');
let browserSync = require('browser-sync').create();

function defaultTask(cb){
console.log("This is default task!");
cb()
}
const debugWatcher=watch(["./source/*.html","./source/script/**.*","./source/style/**.*"]) 
function debugServer(){
    browserSync.init({
        server:{basedir:"./source/",
		index:"./source/map.html"
	}
    });
    debugWatcher.on('change',function(path,stats){
	src(path)
	.pipe(browserSync.reload({stream:true}))
    });
}


exports.debugserver=debugServer;
exports.default=defaultTask;
