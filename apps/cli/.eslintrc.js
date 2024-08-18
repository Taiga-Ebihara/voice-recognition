module.exports = {
  ...require("@voice-recognition/eslint/base-eslint"),
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
};
