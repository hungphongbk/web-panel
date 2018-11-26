module.exports =
  process.env.BABEL_ENV === "browser"
    ? {
        presets: ["@vue/app"]
      }
    : {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"]
      };
