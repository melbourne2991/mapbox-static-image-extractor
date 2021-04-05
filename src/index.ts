require("dotenv").config();

import program from "commander";
import { download } from "./commands/download";
import { stitch } from "./commands/stitch";
import { extract } from "./commands/extract";
import { getContext } from "./context";
import { emitGeojson } from "./commands/emit-geojson";

program.requiredOption("-m, --map-name <mapName>", "Name of target map");

program.command("download").action(() => {
  download(getContext(program.opts().mapName)).catch(console.log);
});

program.command("stitch").action(() => {
  stitch(getContext(program.opts().mapName)).catch(console.log);
});

program.command("extract").action(() => {
  extract(getContext(program.opts().mapName)).catch(console.log);
});

program.command("emit-geojson").action(() => {
  emitGeojson(getContext(program.opts().mapName)).catch(console.log);
});

program.parse(process.argv);
