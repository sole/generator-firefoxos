# <%= appName %>

## Grunt tasks

### Run JSHint

[JSHint](http://www.jshint.com) is a JavaScript linter that will not
only spot syntactic errors, but will also warn you about bad practises
or wrong style conventions.

You can edit the file `.jshintrc` to setup your own rules. Some rules
that have been included in this file are:

- Maximum line length of 80 characters.
- 2-space indentation, with white spaces.
- Forbid use of undeclared vars.
- Enforce camel case naming convention.
- Etc.

You can run JSHint on all JavaScript files in `scripts` (and
subdirectories) with:

```bash
grunt jshint
```

**Note**: Sometimes you will need to include 3rd-party code that do not
comform to these rules. If you put your 3rd-party (or legacy) code in
the `scripts/vendor` directory, it will be ignored by JSHint.

### Launch a server

You can launch a HTTP server, with `/` pointing at the app's `build`
directory.

```bash
grunt server
```

This task will:

  - Clean temporary directories
  - Run JSHint.
  - Compile SASS files.
  - Minify all Gaia's Building Blocks in one single CSS file'.
  - Build the app into `build`.
  - Run a server in [0.0.0.0:9000](http://0.0.0.0:9000)
  - Watch for changes in Sass, HTML and JavaScript files and copy
    them in the `build` directory.

### Build the app

Building the app compiles and copies all the relevant app files to
a `build` directory. You can then run a server from there, or zip the
app.

This task will:

- Run JSHint.
- Compile SASS files.
- Minify all Gaia's Building Blocks in one single CSS file'.
- Copy all the app files to `build`

### Clean temporary files

Some tasks create temporary directories or minified files. These are:

- `app/.tmp`
- `build`
- `app/styles/gaiabb/all.css`

You can wipe them out with:

```bash
grunt clean
```

Note that this will also delete Sass' cache files, that are being stored
in `app/.tmp`.

### Run tests

Test use [Mocha](http://visionmedia.github.io/mocha/) as spec-based
framework, [Sinon](http://www.sinonjs.org) to create mocks and stubs,
and [Chai](http://www.chaijs.com/) for the expectations.

You can run tests in the shell with:

```bash
grunt test
```

This will use PhantomJS as web browser, which is webkit-based. You
probably want to run your tests in a Firefox Nightly browser with:

```bash
grunt server:test
```

This will start a web server in [0.0.0.0:9002](0.0.0.0:9002) with your
test suite loaded in `/`.

