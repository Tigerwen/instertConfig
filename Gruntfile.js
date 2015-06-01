/*
 * insertConfig
 * https://github.com/wenxiang.hu/insertConfig
 *
 * Copyright (c) 2015 wenxiang.hu
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        insertConfig: {
            dev: {
                src: ['test/main.js'],
                dest: ['tmp/main.js'],
                insertModules: {
                    paths: {
                        'flight_core/list/list': 'http://xxxx.com/xxx/flight_core/list/list'
                    },
                    baseUrl: '://www.xxx.com/'
                }
            },
            dist: {
                src: ['tmp/main.js'],
                srcReg: [new RegExp('^tmp/\\w*/\\w*(\.js)$')],
                insertModules: {
                    paths: {},
                    baseUrl: '://www.xxx.com/'
                },
                replaceReg: [new RegExp('^tmp/'),new RegExp('\.js$')]
            }
        },

        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            dist: {
                files: [{
                    src: [
                        'tmp/**/*.js',
                        '**/*.css'
                    ]
                }]
            }
        },

        copy: {
            dist: {
                expand: true,
                cwd: 'test/',
                src: '**',
                dest: 'tmp/'
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-filerev');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('dev', ['clean', 'insertConfig:dev']);
    grunt.registerTask('build', ['clean','copy','filerev' ,'insertConfig:dist']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['build']);

};