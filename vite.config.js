const path = require("path");
const { defineConfig } = require("vite");
import dts from "vite-plugin-dts";

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "tonstakers-sdk",
      fileName: () => `tonstakers-sdk.js`,
      formats: ["es"],
    },
    rollupOptions: {
      // external: ["@ton/core", "@ton/crypto", "@ton/ton", "tonapi-sdk-js"],
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
