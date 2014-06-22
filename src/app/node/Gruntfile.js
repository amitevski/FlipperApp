/**
 * Created by acomitevski on 30/04/14.
 */

/*jshint camelcase: false */

'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // server tests
    simplemocha: {
      options: {
        globals: ['expect', 'sinon', 'root', 'proxyquire'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },

      server: {
        src: ['test/spechelper.js', 'test/**/*.js']
      }
    },
    mocha_istanbul: {
      coverage: {
        src: './test', // the folder, not the files,
        options: {
          globals: ['expect', 'sinon', 'root', 'proxyquire'],
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec',
          reportFormats: ['text'],
          recursive: true
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '*.js',
        'games/**/*.js',
        'helpers/**/*.js',
        'test/**/*.js',
      ]
    }

  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');
  // Default task(s).
  grunt.registerTask('test', ['jshint', 'mocha_istanbul']);
  grunt.registerTask('default', ['test']);

};
