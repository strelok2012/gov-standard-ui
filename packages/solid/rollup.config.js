const config = require('../../rollup.config');

module.exports = config({
  dir: __dirname,
  packageJson: require('./package.json'),
  babelPresets: ['solid'],
  compilerOptions: {
    jsx: 'preserve',
    jsxImportSource: 'solid-js'
  }
});
