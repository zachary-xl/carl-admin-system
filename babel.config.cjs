module.exports = {
  plugins: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3
      }
    ]
  ]
};
