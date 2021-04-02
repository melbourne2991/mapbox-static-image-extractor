import program from "commander";
import path from "path";
import fs from "fs";
import { BaseConfig, Context, MapConfig } from "./types";
import { download } from "./commands/download";
import { stitch } from "./commands/stitch";
import { extract } from "./commands/extract";
import { store } from "./commands/store";

program.requiredOption("-m, --map-name <mapName>", "Name of target map");

program.command("download").action(() => {
  download(getContext()).catch(console.log);
});

program.command("stitch").action(() => {
  stitch(getContext()).catch(console.log);
});

program.command("extract").action(() => {
  extract(getContext()).catch(console.log);
});

program
  .option("-c, --clear-db")
  .command("store")
  .action(() => {
    const clearDb = program.opts().clearDb;

    store({
      ...getContext(),
      clearDb,
    }).catch(console.log);
  });

program.parse(process.argv);

function getContext(): Context {
  const baseConfigFullPath = path.resolve(process.cwd(), "mapgm.config.json");
  const baseConfig = readBaseConfig(baseConfigFullPath);

  console.log(baseConfigFullPath);

  const mapDirFullPath = path.resolve(
    process.cwd(),
    baseConfig.mapsDir,
    program.opts().mapName
  );

  console.log(mapDirFullPath);

  const mapConfig = readMapConfig(mapDirFullPath);

  console.log(mapConfig);

  const pbfFileFullPath = path.resolve(mapDirFullPath, mapConfig.pbfFile);

  console.log(pbfFileFullPath);

  const context: Context = {
    ...baseConfig,
    ...mapConfig,

    mapPath: mapDirFullPath,
    pbfPath: pbfFileFullPath,
  };

  return context;
}

function readBaseConfig(baseConfigFullPath: string): BaseConfig {
  if (!fs.existsSync(baseConfigFullPath)) {
    throw new Error(`Missing mapgm.config.json in: ${baseConfigFullPath}`);
  }

  return JSON.parse(fs.readFileSync(baseConfigFullPath, "utf8"));
}

function readMapConfig(mapDirFullPath: string): MapConfig {
  const configJsonPath = path.resolve(mapDirFullPath, "config.json");

  if (!fs.existsSync(configJsonPath)) {
    throw new Error(`Missing config.json in: ${mapDirFullPath}`);
  }

  return JSON.parse(fs.readFileSync(configJsonPath, "utf8"));
}
