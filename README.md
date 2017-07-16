# broccoli-plugin-karma
[Karma](http://karma-runner.github.io/) test runner for broccoli builds

# Install

```sh
npm install --save-dev broccoli-karma-plugin
```

# Usage

```js
// Brocfile.js
const broccoliKarma = require('broccoli-plugin-karma'),

    runTests = broccoliKarma('inputTree/', {
        files: ['**/*.js'] // Files paths are relative to input tree
        autoWatch: true, // Use with broccoli serve, on by default
        singleRun: false, // Use with broccoli build, off by default
        // Here any karma options
});

module.exports = runTests;
```

To use plugin with `broccoli serve` you need option `autoWatch: true` (by default it is true).
Then on first build plugin will start karma server, and on rebuild file changes will be watched by karma.
There is no live reload server or script included.
You will need to author your own, or manually refresh the page on rebuilds to rerun your tests.

To use with `broccoli build` you need to set option `singleRun: true`.
With this option karma starts server, runs tests and exits (so-called continuous integration mode).
Plugin will wait until karma exits, and if some test will fail, task will return an error.

# License

Public domain, see the `LICENCE.md` file.
