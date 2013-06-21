'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var FirefoxOSGenerator = module.exports = function FirefoxOSGenerator(
  args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(FirefoxOSGenerator, yeoman.generators.NamedBase);

FirefoxOSGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);

  var prompts = [{
    name: 'someOption',
    message: 'Would you like to enable this option?',
    default: 'Y/n',
    warning: 'Yes: Enabling this will be totally awesome!'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.someOption = (/y/i).test(props.someOption);

    cb();
  }.bind(this));
};

FirefoxOSGenerator.prototype.app = function app() {
  // create dir structure
  this.mkdir('app');
  this.mkdir('app/icons');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/vendor');
  this.mkdir('app/images');
  this.mkdir('app/styles');

  this.copy('app/manifest.webapp', 'app/manifest.webapp');
  this.copy('app/index.html', 'app/index.html');
  this.copy('app/icons/120x120.png', 'app/icons/120x120.png');
  this.copy('app/icons/128x128.png', 'app/icons/128x128.png');
  this.copy('app/icons/60x60.png', 'app/icons/60x60.png');
  this.copy('app/scripts/main.js', 'app/scripts/main.js');
  this.copy('app/styles/main.sass', 'app/styles/main.sass');
};

FirefoxOSGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('package.json', 'package.json');
  this.copy('Gruntfile.js', 'Gruntfile.js');
  this.copy('jshintrc', '.jshintrc');
  this.copy('README.md', 'README.md');
};

