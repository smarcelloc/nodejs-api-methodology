module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript', 'minify'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@src': './src',
        },
      },
    ],
  ],
  ignore: ['**/*.spec.ts', '**/*.test.ts', 'test/**/*'],
};
