let {watch,src,dest,series}        = require('gulp');
let browserSync = require('browser-sync').create();
let terser=require('gulp-terser-js');
let filter=require('gulp-filter');
let changed=require('gulp-changed');

function defaultTask(cb){
	console.log("This is default task!");
	cb()
}
const debugWatcher=watch(["./source/*.html","./source/script/**.*","./source/style/**.*"]) 
function debugServer(){
	browserSync.init({
		server:{baseDir:"source",
			index:"globe.html"
		}
	});
	debugWatcher.on('change',function(path,stats){
		src(path)
			.pipe(browserSync.reload({stream:true}))
	});
}
const build=series(minifyjs);
const jsf=filter(['source/script/**/*.js'],{restore:true});
const builddest="build/";
function minifyjs(cb){
	src(['source/**/*'])
	.pipe(changed(builddest))
	.pipe(jsf)
	.pipe(terser({mangle:{toplevel:false}}))
	.pipe(jsf.restore)
	.pipe(dest(builddest));
	cb();
}


exports.debugserver=debugServer;
exports.default=defaultTask;
exports.build=build;
