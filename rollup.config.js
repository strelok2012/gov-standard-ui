const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;
const path = require('path');
const typescript = require('rollup-plugin-ts');
const postcss = require('rollup-plugin-postcss');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const dtsPlugin = require('rollup-plugin-dts').default;
const postcssConfig = require('./postcss.config.js');
const json = require('@rollup/plugin-json');

module.exports = (options) => {
  const {
    dir,
    packageJson,
    plugins = [],
    external = [],
    dts = true,
    compilerOptions = {},
    babelPresets = [],
    babelPlugins = []
  } = options;

  const tsconfig = require(path.resolve(__dirname, './tsconfig.json'));
  tsconfig.compilerOptions = { ...tsconfig.compilerOptions, ...compilerOptions };

  const defaultPresets = ['@babel/preset-env', ['@babel/preset-typescript', tsconfig.compilerOptions]];

  const inputs = [
    {
      input: options.input || path.resolve(dir, 'src/index.ts'),
      output: options.output || [
        {
          file: packageJson.main,
          format: 'cjs',
          sourcemap: true
        },
        {
          file: packageJson.module,
          format: 'esm',
          sourcemap: true
        }
      ],
      treeshake: true,
      external,
      plugins: [
        ...plugins,
        resolve.nodeResolve({ extensions: ['.js', '.ts', '.tsx'] }),
        json(),
        typescript({ tsconfig: { ...tsconfig.compilerOptions, emitDeclarationOnly: true } }),
        babel({
          plugins: [['@babel/plugin-proposal-decorators', { legacy: true }, ...babelPlugins]],
          extensions: ['.js', '.ts', '.tsx'],
          presets: babelPresets.length > 0 ? [...babelPresets, ...defaultPresets] : defaultPresets,
          babelHelpers: 'bundled',
          ignore: [/node_modules/]
        }),
        postcss(postcssConfig),
        peerDepsExternal(),
        commonjs()
      ]
    },
    {
      input: path.resolve(dir, '../../styles/themes/gov-standard-base/index.css'),
      output: [
        {
          file: packageJson.style,
          sourcemap: true
        }
      ],
      plugins: [postcss({ ...postcssConfig, inject: false, extract: 'gov-standard.css' })]
    }
  ];

  if (dts) {
    inputs.push({
      input: path.resolve(dir, packageJson.module.replace('.js', '.d.ts')),
      output: [{ file: path.resolve(dir, 'dist/index.d.ts'), format: 'esm' }],
      plugins: [dtsPlugin()]
    });
  }

  return inputs;
};
