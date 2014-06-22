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
      },
      coveralls: {
        src: 'test', // the folder, not the files
        options: {
          globals: ['expect', 'sinon', 'root', 'proxyquire'],
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec',
          recursive: true,
          coverage:true,
          check: {
            lines: 75,
            statements: 75
          },
          root: './', // define where the cover task should consider the root of libraries that are covered by tests
          reportFormats: ['cobertura','lcovonly']
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

  grunt.event.on('coverage', function(lcov, done){
    require('coveralls').handleInput(lcov, function(err){
      if (err) {
        return done(err);
      }
      done();
    });
  });
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  // Default task(s).
  grunt.registerTask('test', ['jshint', 'mocha_istanbul:coveralls']);
  grunt.registerTask('default', ['test']);

};
