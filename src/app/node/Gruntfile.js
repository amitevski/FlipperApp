/**
 * Created by acomitevski on 30/04/14.
 */

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // server tests
    simplemocha: {
      options: {
        globals: ['expect', 'sinon', 'root'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },

      server: {
        src: ['test/spechelper.js', 'test/**/*.js']
      }
    }

  });

  // Default task(s).
  grunt.registerTask('default', ['simplemocha']);

};
