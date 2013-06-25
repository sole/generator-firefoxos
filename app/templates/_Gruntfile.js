'use strict';
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  [<% if (shallUseGaiaBB) { %>
    'grunt-contrib-cssmin',<% } %>
    'grunt-contrib-clean',
    'grunt-contrib-copy',
    'grunt-contrib-jshint',
    'grunt-contrib-sass',
    'grunt-contrib-watch',
    'grunt-contrib-connect',
    'grunt-mocha'
  ].forEach(grunt.loadNpmTasks);

  var sassFiles = [{
    expand: true,
    cwd: 'app/styles/',
    src: ['**/*.{sass,scss}', '!**/_*'], // take sass files & ignore partials
    dest: '.tmp/styles/',
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
        cacheLocation: '.tmp/.sass-cache'
      },
      dev: {
        options: {
          style: 'expanded',
          lineComments: true
        },
        files: sassFiles
      },
      release: {
        options: {
          style: 'compressed'
        },
        files: sassFiles
      }
    },
<% if (shallUseGaiaBB) { %>
    // CSS min config -> for concatenating Gaia BB's
    cssmin: {
      gaiabb: {
        files: {
          'app/styles/gaiabb/all.css': ['app/styles/gaiabb/**/*.css',
                                        '!app/styles/gaiabb/all.css']
        }
      }
    },
<% } %>
    // watch config
    watch: {<% if (shallUseGaiaBB) { %>
      gaiabb: {
        files: ['app/styles/gaiabb/**/*.css', '!app/styles/gaiabb/all.css'],
        tasks: ['cssmin']
      },<% } %>
      sass: {
        files: ['app/styles/**/*.{scss,sass}'],
        tasks: ['sass:dev']
      }
    },

    // server config
    connect: {
      server: {
        options: {
          port: 9000,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      test: {
        options: {
          port: 9002,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },

    // mocha (test) config
    mocha: {
      all: {
        options: {
          urls: ['http://0.0.0.0:9002/index.html'],
          bail: true,
          reporter: 'Spec',
          run: true
        }
      }
    },

    // clean config
    clean: {
      build: [<% if (shallUseGaiaBB) { %>
        'app/styles/gaiabb/all.css',<% } %>
        'build',
        '.tmp'
      ],
      server: [<% if (shallUseGaiaBB) { %>
        'app/styles/gaiabb/all.css',<% } %>
        '.tmp'
      ]
    },

    // copy config
    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          src: [<% if (shallUseGaiaBB) { %>
            '!styles/gaiabb/**/*.css',
            'styles/gaiabb/all.css',
            'styles/gaiabb/**/*.{png,gif,jpg,jpeg}',<% } %>
            'scripts/**/*.js',
            'icons/**/*.{png,jpg,jpeg}',
            'images/**/*.{png,gif,jpg,jpeg}',
            'styles/**/*.css',
            '*.html',
            'manifest.webapp'
          ],
          dest: 'build'
        }]
      },
      sass: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: [
            'styles/**/*.css'
          ],
          dest: 'build'
        }]
      }
    }
  });

  grunt.registerTask('build', 'Build app release', [<% if (shallUseGaiaBB) { %>
    'cssmin',<% } %>
    'jshint',
    'clean:build',
    'sass:release',
    'copy:build',
    'copy:sass'
  ]);

  grunt.registerTask('test', 'Launch tests in shell with PhantomJS', [
    'jshint',
    'clean:server',
    'sass:dev',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('server', 'Launch local server', function (target) {
    if (target === 'test') {
      grunt.task.run([
        'jshint',
        'clean:server',
        'sass:dev',
        'connect:test:keepalive'
      ]);
    }
    else {
      grunt.task.run([<% if (shallUseGaiaBB) { %>
        'cssmin',<% } %>
        'jshint',
        'clean:server',
        'sass:dev',
        'connect:server',
        'watch'
      ]);
    }
  });

  grunt.registerTask('default', 'Default task', [
    'jshint'
  ]);
};

