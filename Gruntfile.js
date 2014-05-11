module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodewebkit: {
      options: {
	      version: '0.8.4',
        build_dir: './dist',
        // specifiy what to build
        mac: true,
        win: false,
        linux32: false,
        linux64: true
      },
      src: ['src/app/**/*']
    },

    exec: {
      dev: {
        cwd: 'dist/cache/mac/0.8.4/',
        cmd: 'open -a node-webkit ../../../../src/app/'
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['exec:dev']);

};
