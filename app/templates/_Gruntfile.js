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
    'grunt-contrib-compress',
    'grunt-contrib-handlebars',
    'grunt-mocha',
    'grunt-firefoxos'
  ].forEach(grunt.loadNpmTasks);

  // add here the libs you install with bower
  var bowerFiles = [
    'requirejs/require.js',
    'backbone/backbone-min.js',
    'zepto/zepto.min.js',
    'underscore/underscore-min.js',
    'handlebars.js/dist/handlebars.runtime.js'
  ];

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
    // handlebars config
    handlebars: {
      compile: {
        files: {
          '.tmp/scripts/templates.js': [
            'app/scripts/templates/*.hbs'
          ]
        },
        options: {
          namespace: 'Handlebars.templates',
          amd: true,
          processName: function (filename) {
            return filename
              .replace('app/scripts/templates/', '')
              .replace('.hbs', '');
          }
        }
      }
    },

    // watch config
    watch: {<% if (shallUseGaiaBB) { %>
      gaiabb: {
        files: ['app/styles/gaiabb/**/*.css', '!app/styles/gaiabb/all.css'],
        tasks: ['cssmin']
      },<% } %>
      sass: {
        files: ['app/styles/**/*.{scss,sass}'],
        tasks: ['sass:dev']
      },
      handlebars: {
        files: ['app/templates/*.hbs'],
        tasks: ['handlebars:compile']
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
      release: ['application.zip'],
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
          src: [
            'styles/**/*.css',<% if (shallUseGaiaBB) { %>
            '!styles/gaiabb/**/*.css',
            'styles/gaiabb/all.css',
            'styles/gaiabb/**/*.{png,gif,jpg,jpeg}',<% } %>
            'scripts/**/*.js',
            'icons/**/*.{png,jpg,jpeg}',
            'images/**/*.{png,gif,jpg,jpeg}',
            '*.html',
            'manifest.webapp'
          ],
          dest: 'build'
        }, {
          expand: true,
          cwd: 'app',
          src: bowerFiles.map(function (x) { return 'components/' + x; }),
          dest: 'build'
        }]
      },
      sass: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: [<% if (shallUseGaiaBB) { %>
            '!styles/gaiabb/**/*.css',<% } %>
            'styles/**/*.css'
          ],
          dest: 'build'
        }]
      },
      handlebars: {
        files: [{
          expand: true,
          cwd: '.tmp',
          dest: 'build',
          src: ['scripts/templates.js']
        }]
      }
    },

    // Firefox OS push config
    ffospush: {
      app: {
        appId: '<%= _.slugify(appName) %>',
        zip: 'application.zip'
      }
    },

    // compress (zip a file for release) config
    compress: {
      release: {
        options: {
          archive: 'application.zip',
        },
        files: [{
          cwd: 'build',
          expand: true,
          src: '**/*'
        }]
      }
    }
  });

  grunt.registerTask('build', 'Build app for release', [
    'jshint',
    'clean:build',<% if (shallUseGaiaBB) { %>
    'cssmin',<% } %>
    'sass:release',
    'handlebars:compile',
    'copy:build',
    'copy:sass',
    'copy:handlebars'
  ]);

  grunt.registerTask('release', 'Creates a zip with an app build', [
    'build',
    'clean:release',
    'compress:release'
  ]);

  grunt.registerTask('test', 'Launch tests in shell with PhantomJS', [
    'jshint',
    'clean:server',
    'sass:dev',
    'handlebars:compile',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('server', 'Launch local server', function (target) {
    if (target === 'test') {
      grunt.task.run([
        'jshint',
        'clean:server',
        'sass:dev',
        'handlebars:compile',
        'connect:test:keepalive'
      ]);
    }
    else {
      grunt.task.run([
        'jshint',
        'clean:server',<% if (shallUseGaiaBB) { %>
        'cssmin',<% } %>
        'sass:dev',
        'handlebars:compile',
        'connect:server',
        'watch'
      ]);
    }
  });

  grunt.registerTask('log', 'Outputs FF OS device\'s log', ['ffoslog']);
  grunt.registerTask('reset', 'Resets FF OS device', ['ffosreset']);
  grunt.registerTask('push', 'Installs the app in the FF OS device', [
    'release',
    'ffospush:app'
  ]);

  grunt.registerTask('default', 'Default task', [
    'jshint'
  ]);
};

