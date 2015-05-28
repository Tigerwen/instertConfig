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
                src: 'test/main.js',
                dest: 'tmp/main.js',
                insertNode: 'paths',
                insertModule: {'flight_core/list/list': 'http://xxxx.com/xxx/flight_core/list/list'}
            },
            test: {
                src: 'test/main.js',
                dest: 'tmp/main1.js',
                insertNode: 'paths',
                insertModule: {'flight_core/list/list': 'http://xxxx.com/xxx/flight_core/list/list'}
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'insertConfig']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['test']);

};