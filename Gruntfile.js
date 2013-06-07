'use strict';

module.exports = function (grunt) {
  [
    'grunt-contrib-clean',
    'grunt-contrib-copy',
    'grunt-contrib-jshint'
  ].forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    // JS linter config
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/{,*/}*.js',
        '!app/scripts/vendor/{, */}*'
      ]
    },

    clean: ['build'],

    copy: {
      build: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'app',
            src: [
              'scripts/**/*.js',
              'icons/**/*.{png,jpg,jpeg}',
              'images/**/*.{png,gif,jpg,jpeg}',
              '*.html',
              'manifest.webapp'
            ],
            dest: 'build'
          }
        ]
      }
    }
  });

  grunt.registerTask('build', 'Build app', ['copy:build']);
  grunt.registerTask('default', 'Default task', [
    'clean',
    'build'
  ]);
}

