module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss/nesting")(require("postcss-nesting")),
    require("tailwindcss"),
    require("postcss-preset-env")({
      stage: 3,
      features: {
        "nesting-rules": true
      }
    }),
    {
      postcssPlugin: "internal:charset-removal",
      AtRule: {
        charset: (atRule) => {
          if (atRule.name === "charset") {
            atRule.remove();
          }
        }
      }
    }
  ]
};
