import path from "path";
import fs from "fs-extra";

const isDir = (path: string) => fs.statSync(path).isDirectory();
const withoutExt = (path: string) => /((?:\w|\\)*)\.\w+$/.exec(path)?.[1] ?? path;

const rootFolder = path.resolve(__dirname, "../");
const joinRoot = (pathToJoin: string) => path.join(rootFolder, pathToJoin);

const pkgJsonFile = joinRoot("package.json");
const pkgJson = fs.readJsonSync(pkgJsonFile);

const targetFolderName = "types";

pkgJson.exports = {
  ".": "./dist/index.d.mts",
  "./package.json": "./package.json",
};

const targetFolder = joinRoot(targetFolderName);
const targetFolderItems = fs.readdirSync(targetFolder);

for (const item of targetFolderItems) {
  const itemWithoutExt = withoutExt(item);
  const itemPath = path.join(targetFolder, item);
  const itemIsDir = isDir(itemPath);

  if (itemIsDir) {
    const key1 = `./${itemWithoutExt}`;
    const value1 = `./dist/${itemWithoutExt}/index.d.mts`;
    pkgJson.exports[key1] = value1;

    const key2 = `./${itemWithoutExt}/*`;
    const value2 = `./dist/${itemWithoutExt}/*.d.mts`;
    pkgJson.exports[key2] = value2;
  } else {
    const key = `./${itemWithoutExt}`;
    const value = `./dist/${itemWithoutExt}.d.mts`;
    pkgJson.exports[key] = value;
  }
}

fs.writeJsonSync(pkgJsonFile, pkgJson, { spaces: 2 });
