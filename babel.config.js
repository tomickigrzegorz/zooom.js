module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // "debug": true,
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
  ],
  plugins: ['@babel/proposal-class-properties']
};
