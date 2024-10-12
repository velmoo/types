import path from "path";
import fs from "fs-extra";

const rootFolder = path.join(__dirname, "..");
const joinRoot = (...pathToJoin: string[]) => path.join(rootFolder, ...pathToJoin);

const outDirName = "dist";
const outDir = joinRoot(outDirName);

const checkDir = (dirPath: string = outDir) => {
  const dirItems = fs.readdirSync(dirPath).map((item) => path.join(dirPath, item));

  for (const item of dirItems) {
    if (fs.statSync(item).isDirectory()) {
      checkDir(item);
    } else if (path.extname(item) === ".mjs") {
      fs.removeSync(item);
    }
  }
};

checkDir();
