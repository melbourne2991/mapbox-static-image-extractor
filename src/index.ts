import program from "commander";
import path from "path";
import fs from "fs";
import { MapConfig } from "./types";
import { download } from "./commands/download";
import { stitch } from "./commands/stitch";
import { extract } from "./commands/extract";

program.requiredOption("-m, --map-dir <mapDir>", "Path to map directory");

program.command("download").action(() => {
  download(getContext()).catch(console.log);
});

program.command("stitch").action(() => {
  stitch(getContext()).catch(console.log);
});

program
  .requiredOption("-p, --pbf-file <pbfFile>", "Path to pbf")
  .command("extract")

  .action(() => {
    console.log(program.opts());

    const context = {
      ...getContext(),
      pbfFile: path.resolve(process.cwd(), program.opts().pbfFile),
    };

    extract(context).catch(console.log);
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
