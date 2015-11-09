import gulp from 'gulp';
import gulpMocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import {} from 'babel-core/register';

gulp.task('lint', () => {
	return gulp.src(['src/**/*.js'])
		.pipe(eslint({ useEslintrc: true }))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('test', () => {
	return gulp
		.src('test/**/*.js')
		.pipe(gulpMocha());
});
