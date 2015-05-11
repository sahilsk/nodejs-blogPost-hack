var gulp = require('gulp');
var server = require('gulp-express');
var rename = require('gulp-rename');
var watch = require("gulp-watch");

var browserify = require('gulp-browserify');
 



gulp.task('default', function() {
   server.run(['bin/www']);
});


gulp.task('server', function () {
    // Start the server at the beginning of the task 
    server.run(['bin/www']);
 
    // Restart the server when file changes 
    gulp.watch(['/**/*.js'], 
    	function(){
    		server.notify();

    	});

});

