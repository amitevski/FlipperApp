/**
 * Created by acomitevski on 30/04/14.
 */

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

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'simplemocha']);

};
