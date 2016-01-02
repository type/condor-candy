var fs = require('fs'),
    config = require('config').settings;

module.exports = function(grunt) {
    var codeFiles = [
        'test/**/*.js',
        'controllers/**/*.js',
        'routes/**/*.js',
        'views/**/*.js',
        './*-app.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['build', 'public/js'],
        jshint: {
            files: codeFiles,
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                freeze: true,
                nocomma: true,
                noarg: true,
                nonew: true,
                notypeof: true,
                shadow: false,
                undef: true,
                unused: 'vars',
                node: true,
                mocha: true
            }
        },
        jsbeautifier: {
            files: codeFiles,
            options: {
                js: {
                    indentSize: 4,i
                    indentChar: ' ',
                    wrapLineLength: 0,
                    space_after_anon_function: false,
                    keep_function_indentation: true
                }
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer-core')({
                        browsers: ['last 3 versions' ,'ie >= 9']
                    })
                ]
            },
            dist: {
                src: 'public/css/*.css'
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test', // the folder, not the files
                options: {
                    root: './', // define where the cover task should consider the root of libraries that are covered by tests
                    //coverage: true,
                    check: {
                        statements: 75,
                        branches: 55,
                        functions: 76,
                        lines: 75
                    },
                    reportFormats: ['text', 'lcov', 'cobertura'],
                    coverageFolder: 'build/reports'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['clean', 'bowercopy', 'jshint', 'postcss:dist', 'jsbeautifier']);

};

