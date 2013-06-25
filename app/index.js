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

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname,
                                                        '../package.json')));
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
    name: 'appName',
    message: 'What do you want to call your app?',
    default: 'My Firefox OS App'
  },{
    name: 'devUserName',
    message: 'What is your Github username?',
    default: 'rick-astley'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.appName = props.appName;
    this.devUserName = props.devUserName;

    cb();
  }.bind(this));
};

FirefoxOSGenerator.prototype._copyGaiaBB = function (dst) {
  var done = this.async();

  console.log('Gaia repository will now be downloaded.\nDepending on your' +
              'connection, this will probably take a while.\n' +
              'Don\'t panic!'.yellow);

  this.remote('mozilla-b2g', 'gaia', function (err, remote) {
    if (err) {
      console.log('Error fetching Gaia');
    }
    else {
      remote.directory('shared/style', dst);
    }
    done();
  });
};

FirefoxOSGenerator.prototype.app = function app() {
  // app skeleton
  this.mkdir('app');
  this.mkdir('app/icons');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/vendor');
  this.mkdir('app/images');
  this.mkdir('app/styles');
  this.copy('app/_manifest.webapp', 'app/manifest.webapp');
  this.copy('app/_index.html', 'app/index.html');
  this.copy('app/icons/120x120.png', 'app/icons/120x120.png');
  this.copy('app/icons/128x128.png', 'app/icons/128x128.png');
  this.copy('app/icons/60x60.png', 'app/icons/60x60.png');
  this.copy('app/scripts/main.js', 'app/scripts/main.js');
  this.copy('app/styles/main.sass', 'app/styles/main.sass');

  // test framework
  this.mkdir('test');
  this.mkdir('test/lib');
  this.copy('test/index.html', 'test/index.html');
  this.copy('test/lib/mocha.js', 'test/lib/mocha.js');
  this.copy('test/lib/mocha.css', 'test/lib/mocha.css');
  this.copy('test/lib/sinon.js', 'test/lib/sinon.js');
  this.copy('test/lib/chai.js', 'test/lib/chai.js');

  // copy gaia's BB
  this.mkdir('app/styles/gaiabb');
  this._copyGaiaBB('app/styles/gaiabb');
};

FirefoxOSGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('package.json', 'package.json');
  this.copy('Gruntfile.js', 'Gruntfile.js');
  this.copy('jshintrc', '.jshintrc');
  this.copy('_README.md', 'README.md');
};

