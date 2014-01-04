# gulp-ng-html2js [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> ng-html2js plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-ng-html2js` as a development dependency:

```shell
npm install --save-dev gulp-ng-html2js
```

Then, add it to your `gulpfile.js`:

```javascript
var ngHtml2Js = require("gulp-ng-html2js");

gulp.src("./partials/*.html")
	.pipe(ngHtml2Js({
		moduleName: "MyAwesomePartials",
		prefix: "/partials"
	}))
	.pipe(gulp.dest("./dist/partials"));
```

## API

### ngHtml2Js(options)

#### options.moduleName
Type: `String`

The name of the generated AngularJS module. Uses the file url if omitted.

#### options.prefix
Type: `String`

The prefix which should be prepended to the file path to generate the file url.

#### options.stripPrefix
Type: `String`

The prefix which should be subtracted from the file path to generate the file url.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-ng-html2js
[npm-image]: https://badge.fury.io/js/gulp-ng-html2js.png

[travis-url]: http://travis-ci.org/marklagendijk/gulp-ng-html2js
[travis-image]: https://secure.travis-ci.org/marklagendijk/gulp-ng-html2js.png?branch=master

[depstat-url]: https://david-dm.org/marklagendijk/gulp-ng-html2js
[depstat-image]: https://david-dm.org/marklagendijk/gulp-ng-html2js.png
