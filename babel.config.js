module.exports =
  process.env.BABEL_ENV === "server"
    ? {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"]
      }
    : {
        presets: ["@vue/app"]
      };
