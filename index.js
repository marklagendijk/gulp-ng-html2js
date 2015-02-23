var _ = require("lodash");
var gutil = require("gulp-util");
var map = require("map-stream");

var TEMPLATES = {
    MODULE_PER_FILE: "angular.module('<%= moduleName %>', []).run(['$templateCache', function($templateCache) {\n" +
    "  $templateCache.put('<%= template.url %>',\n    '<%= template.prettyEscapedContent %>');\n" +
    "}]);\n",

    SINGLE_MODULE: "(function(module) {\n" +
    "try {\n" +
    "  module = angular.module('<%= moduleName %>');\n" +
    "} catch (e) {\n" +
    "  module = angular.module('<%= moduleName %>', []);\n" +
    "}\n" +
    "module.run(['$templateCache', function($templateCache) {\n" +
    "  $templateCache.put('<%= template.url %>',\n    '<%= template.prettyEscapedContent %>');\n" +
    "}]);\n" +
    "})();\n",

    SINGLE_DECLARED_MODULE: "angular.module('<%= moduleName %>').run(['$templateCache', function($templateCache) {\n" +
    "  $templateCache.put('<%= template.url %>',\n    '<%= template.prettyEscapedContent %>');\n" +
    "}]);\n"
};

/**
 * Converts HTML files into Javascript files which contain an AngularJS module which automatically pre-loads the HTML
 * file into the [$templateCache](http://docs.angularjs.org/api/ng.$templateCache). This way AngularJS doens't need to
 * request the actual HTML file anymore.
 * @param [options] - The plugin options
 * @param [options.moduleName] - The name of the module which will be generated. When omitted the fileUrl will be used.
 * @param [options.declareModule] - Whether to try to create the module. Default true, if false it will not create options.moduleName.
 * @param [options.stripPrefix] - The prefix which should be stripped from the file path
 * @param [options.prefix] - The prefix which should be added to the start of the url
 * @returns {stream}
 */
module.exports = function (options) {
    "use strict";

    function ngHtml2Js(file, callback) {
        if (file.isStream()) {
            return callback(new Error("gulp-ng-html2js: Streaming not supported"));
        }

        if (file.isBuffer()) {
            file.contents = new Buffer(generateModuleDeclaration(file, options));
            file.path = gutil.replaceExtension(file.path, ".js");
        }

        return callback(null, file);
    }

    function generateModuleDeclaration(templateFile, options) {
        var template = getTemplate();
        var templateParams = getTemplateParams();

        return _.template(template)(templateParams);


        function getTemplate() {
            if (options && options.template) {
                return options.template;
            }
            else if (options && options.moduleName) {
                if (options.declareModule === false) {
                    return TEMPLATES.SINGLE_DECLARED_MODULE;
                }
                else {
                    return TEMPLATES.SINGLE_MODULE;
                }
            }
            else {
                return TEMPLATES.MODULE_PER_FILE;
            }
        }

        function getTemplateParams() {
            var params = {
                template: {
                    url: getTemplateUrl()
                }
            };
            params.moduleName = getModuleName(params.template.url);
            params.template.content = String(templateFile.contents);
            params.template.escapedContent = getEscapedTemplateContent(params.template.content);
            params.template.prettyEscapedContent = getPrettyEscapedContent(params.template.content);

            return params;
        }

        function getModuleName(templateUrl) {
            if (options && _.isFunction(options.moduleName)) {
                return options.moduleName(templateFile);
            }
            else if (options && options.moduleName) {
                return options.moduleName;
            }
            else {
                return templateUrl;
            }
        }

        function getTemplateUrl() {
            // Start with the relative file path
            var url = templateFile.relative;

            // Replace '\' with '/' (Windows)
            url = url.replace(/\\/g, "/");

            if (options) {
                // Remove the stripPrefix
                if (_.startsWith(url, options.stripPrefix)) {
                    url = url.replace(options.stripPrefix, "");
                }
                // Add the prefix
                if (options.prefix) {
                    url = options.prefix + url;
                }

                // Rename the url
                if (_.isFunction(options.rename)) {
                    url = options.rename(url, templateFile);
                }
            }

            return url;
        }
    }

    function getEscapedTemplateContent(templateContent) {
        return templateContent
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/\r?\n/g, "\\n");
    }

    function getPrettyEscapedContent(templateContent) {
        return templateContent
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/\r?\n/g, "\\n' +\n    '");
    }

    return map(ngHtml2Js);
};
