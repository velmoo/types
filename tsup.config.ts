import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["types/**"],
  dts: true,
  format: ["esm"],
  outDir: "dist",
  clean: true,
  splitting: false,
});
