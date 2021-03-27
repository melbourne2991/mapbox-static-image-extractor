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
  });

  const mapboxStaticImageApi = new MapBoxStaticImageApi({
    imageHeight: ctx.imageSize,
    imageWidth: ctx.imageSize,
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    style: "melbourne2991/ckmh9pcbxjclk17o7d7x7nrkh",
  });

  for (let zoomLevel of zoomLevels) {
    const zoomLevelDirPath = path.resolve(ctx.mapPath, `data/${zoomLevel}`);
    mkdirp(zoomLevelDirPath);

    const imageWriter = new ImageWriter({
      dirPath: zoomLevelDirPath,
    });

    const tileMatrix = tileBoundsCalculator.getTilesFromTargetBounds(
      ctx.mapBounds,
      zoomLevel
    );

    for (let [i, col] of tileMatrix.entries()) {
      for (let [j, tile] of col.entries()) {
        const response = await mapboxStaticImageApi.getImage(tile);
        const ext = mime.extension(response.headers["content-type"]);

        imageWriter.saveImage(response.data, `${i}x${j}.${ext}`);
      }
    }
  }
}
