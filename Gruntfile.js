'use strict';

module.exports = function (grunt) {
  [
    'grunt-contrib-watch',
    'grunt-contrib-copy',
    'grunt-contrib-clean'
  ].forEach(grunt.loadNpmTasks);

  var templateVars = {
    appName: 'Waka waka',
    devUserName: 'darth-vader',
    shallUseGaiaBB: true,
    shallUseFramework: true
  };

  grunt.initConfig({
    copy: {
      all: {
        files: {
          'app/templates/Gruntfile.js': 'app/templates/_Gruntfile.js',
          'app/templates/README.md': 'app/templates/_README.md',
          'app/templates/app/index.html': 'app/templates/app/_index.html',
          'app/templates/.jshintrc': 'app/templates/jshintrc',
          'app/templates/app/manifest.webapp': 'app/templates/app/_manifest.webapp',
          'app/templates/.bowerrc': 'app/templates/bowerrc',
          'app/templates/app/styles/main.sass': 'app/templates/app/styles/_main.sass'
        },
        options: {
          processContent: function (content) {
            return grunt.template.process(content, {
              data: templateVars
            });
          }
        }
      }
    },

    clean: {
      all: ['app/templates/Gruntfile.js',
            'app/templates/README.md',
            'app/templates/app/index.html',
            'app/templates/.jshintrc',
            'app/templates/app/manifest.webapp',
            'app/templates/app/styles/main.sass',
            'app/templates/.bowerrc'],
      release: ['app/templates/node_modules',
                'app/templates/build',
                'app/scripts/components',
                'app/templates/application.zip']
    },

    watch: {
      all: {
        files: ['app/templates/**/_*'],
        tasks: ['copy:all']
      }
    }
  });

  grunt.registerTask('default', ['clean:all', 'copy:all', 'watch']);
  grunt.registerTask('compile', 'copy:all');
  grunt.registerTask('release', ['clean:all', 'clean:release']);
}

