import esbuild from "esbuild";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const isDev = process.argv.includes("--dev");

const dirname = path.dirname(fileURLToPath(import.meta.url));
const p = (...pathParts) => path.join(dirname, "..", ...pathParts);

const pkgJson = JSON.parse(fs.readFileSync(p("package.json"), "utf8"));

async function emitDeclarationFiles() {
  await execa("tsc", ["--emitDeclarationOnly", "--declarationDir", p("dist")]);
}

async function main() {
  await Promise.all([
    emitDeclarationFiles(),
    esbuild.build({
      entryPoints: [p("src/index.ts")],
      bundle: true,
      minify: !isDev,
      sourcemap: isDev,
      outfile: p("dist/index.js"),
      platform: "browser",
      target: ["es2022"],
      format: "esm",
      external: Object.keys(pkgJson.dependencies).concat(
        Object.keys(pkgJson.peerDependencies),
      ),
    }),
  ]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
