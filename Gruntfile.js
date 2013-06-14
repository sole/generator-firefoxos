'use strict';

module.exports = function (grunt) {
  [
    'grunt-contrib-clean',
    'grunt-contrib-copy',
    'grunt-contrib-jshint',
    'grunt-contrib-sass'
  ].forEach(grunt.loadNpmTasks);

  // put your sass files (not partials!) here
  // remember that you can import files from sass with @import
  var sassFiles = [
    //'sample.sass',
    'main.sass'
  ].reduce(function (result, item) {
    var src = 'app/styles/';
    var dest = 'app/.tmp/styles/';
    result[dest + item.replace(/\..*$/, '.css')] = src + item;
    return result;
  }, {});

  grunt.initConfig({
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
        files: sassFiles
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
          {
            expand: true,
            dot: true,
            cwd: 'app',
            src: [
              '.tmp/styles/**/*.css',
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

  grunt.registerTask('build', 'Build app', ['sass:dev', 'copy:build']);
  grunt.registerTask('default', 'Default task', [
    'clean',
    'build'
  ]);
};

