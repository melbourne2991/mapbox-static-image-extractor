import { Context } from "./types";
import path from "path";

export const getZoomLevelDataPath = (ctx: Context, zoomLevel: string) =>
  path.resolve(ctx.mapPath, `data/${zoomLevel}`);
