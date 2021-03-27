import program from "commander";
import path from "path";
import fs from "fs";
import { MapConfig } from "./types";
import { download } from "./commands/download";
import { stitch } from "./commands/stitch";

program.requiredOption("-m, --map-dir <mapDir>", "Path to map directory");

program.command("download").action(async () => {
  await download(getContext());
});

program.command("stitch").action(async () => {
  await stitch(getContext());
});

program.parse(process.argv);

function getContext() {
  const mapDirFullPath = path.resolve(process.cwd(), program.opts().mapDir);

  const context = {
    ...readConfig(mapDirFullPath),
    mapPath: mapDirFullPath,
  };

  return context;
}

function readConfig(mapDirFullPath: string): MapConfig {
  const configJsonPath = path.resolve(mapDirFullPath, "config.json");

  if (!fs.existsSync(configJsonPath)) {
    throw new Error(`Missing config.json in: ${mapDirFullPath}`);
  }

  return JSON.parse(fs.readFileSync(configJsonPath, "utf8"));
}
