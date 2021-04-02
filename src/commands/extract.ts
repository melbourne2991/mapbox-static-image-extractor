import { contextBoundsToOsmosis, runOsmosis } from "../runOsmosis";
import { Context } from "../types";

export const extract = async (ctx: Context) => {
  await runOsmosis(ctx.osmosisPath, [
    "--read-pbf",
    ctx.pbfPath,
    "--log-progress",
    "--bounding-box",
    ...contextBoundsToOsmosis(ctx.mapBounds),
    "--write-xml",
    `${ctx.mapPath}/data.osm.xml`,
  ]);
};
