'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    // JS linter config
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/{,*/}*.js',
        'app/scripts/vendor/{, */}*'
      ]
    }
  });

  grunt.registerTask('default', 'Default task', ['jshint']);
};

