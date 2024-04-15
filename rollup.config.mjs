import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

const overrides = {
  compilerOptions: {
    declaration: true,
  },
  exclude: ["src/jest-test/*.ts"],
};

const config = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.min.js",
      format: "es",
      plugins: [terser()],
    },
    {
      name: "VerificationCode",
      file: "dist/index.umd.js",
      format: "umd",
      exports: "named",
      plugins: [terser()],
    },
  ],
  plugins: [typescript({ tsconfigOverride: overrides })],
};

export default config;
