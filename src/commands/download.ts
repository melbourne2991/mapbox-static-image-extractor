import { TileBoundsCalculator } from "../TileBoundsCalculator";
import { MapBoxStaticImageApi } from "../MapBoxStaticImageApi";
import path from "path";
import { Context } from "../types";
import mkdirp from "mkdirp";
import { ImageWriter } from "../ImageWriter";
import mime from "mime-types";

export async function download(ctx: Context) {
  const zoomLevels = Object.keys(ctx.zoomLevelReferenceBounds);

  const tileBoundsCalculator = new TileBoundsCalculator({
    zoomLevelReferenceBounds: ctx.zoomLevelReferenceBounds,
    tileSizePx: [ctx.imageSize, ctx.imageSize],
    targetBounds: ctx.mapBounds,
  });

  if (!process.env.MAPBOX_ACCESS_TOKEN)
    throw new Error("Missing Mapbox Access Token!");

  const mapboxStaticImageApi = new MapBoxStaticImageApi({
    imageHeight: ctx.imageSize,
    imageWidth: ctx.imageSize,
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    style: ctx.mapStyle,
  });

  for (let zoomLevel of zoomLevels) {
    const zoomLevelDirPath = path.resolve(ctx.mapDirPath, `data/${zoomLevel}`);
    mkdirp(zoomLevelDirPath);

    const imageWriter = new ImageWriter({
      dirPath: zoomLevelDirPath,
    });

    const zoomLevelData = tileBoundsCalculator.getZoomLevelData(zoomLevel);

    for (let [i, tile] of zoomLevelData.tiles.entries()) {
      const response = await mapboxStaticImageApi.getImage(tile.lngLatBounds);
      const ext = mime.extension(response.headers["content-type"]);

      imageWriter.saveImage(response.data, `${i}.${ext}`);
    }
  }
}
