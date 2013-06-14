'use strict';

module.exports = function (grunt) {
  [
    'grunt-contrib-clean',
    'grunt-contrib-copy',
    'grunt-contrib-jshint',
    'grunt-contrib-sass'
  ].forEach(grunt.loadNpmTasks);

  var sassFiles = 
  grunt.initConfig({
    // -- arbitrary properties --

    sassFiles: [{
      expand: true,
      cwd: 'app/styles/',
      src: ['**/*.{sass,scss}', '!**/_*'], // take sass files & ignore partials
      dest: 'app/.tmp/styles/',
      ext: '.css'
    }],

    // -- end of properties -----

    // JS linter config
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/**/*.js',
        '!app/scripts/vendor/**/*'
      ]
    },

    // SASS config
    sass: {
      options: {
        cacheLocation: 'app/.tmp/.sass-cache'
      },
      dev: {
        options: {
          style: 'expanded',
          lineComments: true
        },
        files: '<%= sassFiles %>'
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: sassFiles
      }
    },

    // clean config
    clean: ['build', 'app/.tmp'],

    // copy config
    copy: {
      build: {
        files: [
          // regular files
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
          },
          // files that have been compiled into .tmp
          {
            expand: true,
            cwd: 'app/.tmp',
            src: [
              'styles/**/*.css'
            ],
            dest: 'build'
          }
        ]
      }
    }
  });

  grunt.registerTask('build', 'Build app', ['sass:dev', 'copy:build']);
  grunt.registerTask('default', 'Default task', [
    'clean',
    'build'
  ]);
};

