const fs = require("fs");

const swcConfig = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, "utf-8"));

module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", swcConfig],
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/{!(types.js|index.js),}.{js,jsx}"],
  testMatch: ["<rootDir>/__tests__/*.test.{js,jsx}"],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  testEnvironment: "jest-environment-jsdom",
};
