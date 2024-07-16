const path = require("path");
const { defineConfig } = require("vite");
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "TonstakersSDK",
      fileName: () => `tonstakers-sdk.min.js`,
      formats: ["umd"],
    },
  },
  plugins: [
    nodePolyfills({
      include: ["buffer"],
      globals: {
        Buffer: true,
      },
    }),
    dts({ rollupTypes: true }),
  ],
});
