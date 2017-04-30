var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('nw', function()
{
    var nw = new NwBuilder(
    {
        files: ['index.html', 'package.json', 'js/**', 'css/**'],
        platforms: ['linux64', 'win64', 'osx64'],
        flavor: 'normal'
    });

    nw.on('log', function(msg)
    {
        gutil.log('nw-builder', msg);
    });

    return nw.build().catch(function(err)
    {
        gutil.log('nw-builder', err);
    });
});

gulp.task('default', ['nw']);
