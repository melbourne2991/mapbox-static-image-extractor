import child_process from "child_process";
import path from "path";
import { Context } from "../types";
import fs from "fs";

export async function emitGeojson(ctx: Context) {
  const binPath = path.resolve(
    __dirname,
    "../../node_modules/.bin",
    "osmtogeojson"
  );

  const osmDataPath = `${ctx.mapDirPath}/data.osm`;

  if (!fs.existsSync(osmDataPath)) {
    throw new Error(
      `Missing OSM, run extract first: ${ctx.mapDirPath}/data.osm`
    );
  }

  return new Promise((resolve, reject) => {
    child_process.exec(
      `node --max_old_space_size=8192 ${binPath} ${ctx.mapDirPath}/data.osm > ${ctx.mapDirPath}/data.geojson`,
      (err, stdout, stderr) => {
        if (err) return reject(err);

        if (stderr) {
          return reject(stderr);
        }

        if (stdout) {
          return resolve(stdout);
        }
      }
    );
  });
}
