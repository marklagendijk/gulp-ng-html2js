/*global describe, it*/
"use strict";

var fs = require("fs"),
	es = require("event-stream"),
	should = require("should");
require("mocha");

var gutil = require("gulp-util"),
	ngHtml2Js = require("../");

describe("gulp-ng-html2js", function () {


	describe("when file is provided via buffer", function(){
		it("should generate the angular module", function(done){
			var expectedFile = new gutil.File({
				path: "test/expected/example.js",
				cwd: "test/",
				base: "test/expected",
				contents: fs.readFileSync("test/expected/example.js")
			});

			testBufferedFile(null, expectedFile, done);
		});

		it("should use options.moduleName when provided", function(done){
			var expectedFile = new gutil.File({
				path: "test/expected/exampleWithModuleName.js",
				cwd: "test/",
				base: "test/expected",
				contents: fs.readFileSync("test/expected/exampleWithModuleName.js")
			});

			var params = {
				moduleName: 'myAwesomePartials'
			};

			testBufferedFile(params, expectedFile, done);
		});

		it("should add options.prefix to the url in the generated file", function(done){
			var expectedFile = new gutil.File({
				path: "test/expected/exampleWithPrefix.js",
				cwd: "test/",
				base: "test/expected",
				contents: fs.readFileSync("test/expected/exampleWithPrefix.js")
			});

			var params = {
				prefix: '/partials/'
			};

			testBufferedFile(params, expectedFile, done);
		});

		it("should subtract options.stripPrefix from the url in the generated file", function(done){
			var expectedFile = new gutil.File({
				path: "test/expected/exampleWithStripPrefix.js",
				cwd: "test/",
				base: "test/expected",
				contents: fs.readFileSync("test/expected/exampleWithStripPrefix.js")
			});

			var params = {
				stripPrefix: 'fixtures/'
			};

			testBufferedFile(params, expectedFile, done);
		});

		function testBufferedFile(params, expectedFile, done){
			var srcFile = new gutil.File({
				path: "test/fixtures/example.html",
				cwd: "test/",
				base: "test",
				contents: fs.readFileSync("test/fixtures/example.html")
			});

			var stream = ngHtml2Js(params);

			stream.on("error", function(err){
				should.exist(err);
				done(err);
			});

			stream.on("data", function(newFile){

				should.exist(newFile);
				should.exist(newFile.contents);

				String(newFile.contents).should.equal(String(expectedFile.contents));
				done();
			});

			stream.write(srcFile);
			stream.end();
		}
	});


	it("should error on stream", function (done) {

		var srcFile = new gutil.File({
			path: "test/fixtures/example.html",
			cwd: "test/",
			base: "test/fixtures",
			contents: fs.createReadStream("test/fixtures/example.html")
		});

		var stream = ngHtml2Js({
			moduleName: 'myAwesomePartials',
			prefix: '/partials/'
		});

		stream.on("error", function(err) {
			should.exist(err);
			done();
		});

		stream.on("data", function (newFile) {
			newFile.contents.pipe(es.wait(function(err, data) {
				done(err);
			}));
		});

		stream.write(srcFile);
		stream.end();
	});
});
