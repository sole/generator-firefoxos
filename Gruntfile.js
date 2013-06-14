'use strict';

module.exports = function (grunt) {
  [
    'grunt-contrib-clean',
    'grunt-contrib-copy',
    'grunt-contrib-jshint',
    'grunt-contrib-sass',
    'grunt-contrib-watch',
    'grunt-contrib-connect'
  ].forEach(grunt.loadNpmTasks);

  var sassFiles = [{
    expand: true,
    cwd: 'app/styles/',
    src: ['**/*.{sass,scss}', '!**/_*'], // take sass files & ignore partials
    dest: 'app/.tmp/styles/',
    ext: '.css'
  }];

  grunt.initConfig({
    // -- arbitrary properties --
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
        files: sassFiles
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: sassFiles
      }
    },

    // watch config
    watch: {
      sass: {
        files: ['app/styles/**/*.{scss,sass}'],
        tasks: ['sass:dev', 'copy:sass']
      },
      app: { // html & js
        files: ['app/scripts/**/*.js', 'app/*.html'],
        tasks: ['copy:build']
      }
    },

    // server config
    connect: {
      server: {
        options: {
          port: 9000,
          base: 'build'
        }
      }
    },

    // clean config
    clean: ['build', 'app/.tmp'],

    // copy config
    copy: {
      build: {
        files: [{
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
        }]
      },
      sass: {
        files: [{
          expand: true,
          cwd: 'app/.tmp',
          src: [
            'styles/**/*.css'
          ],
          dest: 'build'
        }]
      }
    }
  });

  grunt.registerTask('build', 'Build app', [
    'jshint',
    'sass:dev',
    'copy:build',
    'copy:sass'
  ]);

  grunt.registerTask('server', 'Launch local server', [
    'clean',
    'build',
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('default', 'Default task', [
    'clean',
    'build'
  ]);
};

