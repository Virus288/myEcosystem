import { Config } from "jest";
import defaultConfig from "./jest.config.default";

const config: Config = {
  ...defaultConfig,
  roots: ["./tests"]
};

export default config;
