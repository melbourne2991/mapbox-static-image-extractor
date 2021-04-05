import { Context } from "../types";
import gm from "gm";
import { TileBoundsCalculator } from "../TileBoundsCalculator";
import { getZoomLevelDataPath } from "../pathHelpers";
import path from "path";

export async function stitch(ctx: Context) {
  const zoomLevels = Object.keys(ctx.zoomLevelReferenceBounds);

  const tileBoundsCalculator = new TileBoundsCalculator({
    zoomLevelReferenceBounds: ctx.zoomLevelReferenceBounds,
    tileSizePx: [ctx.imageSize, ctx.imageSize],
    targetBounds: ctx.mapBounds,
  });

  for (let zoomLevel of zoomLevels) {
    const zoomLevelData = tileBoundsCalculator.getZoomLevelData(zoomLevel);

    const zoomLevelDataPath = getZoomLevelDataPath(ctx, zoomLevel);

    let gmOp = gm((undefined as unknown) as string);

    for (let [i, tile] of zoomLevelData.tiles.entries()) {
      const fileName = `${i}.png`;
      const filePath = path.resolve(zoomLevelDataPath, fileName);
      gmOp = gmOp
        .in("-page", `+${tile.pxOffset[0]}+${tile.pxOffset[1]}`)
        .in(filePath);
    }

    const stitchedPath = path.resolve(zoomLevelDataPath, "stitched.png");
    const croppedPath = path.resolve(zoomLevelDataPath, "cropped.png");

    await new Promise((resolve, reject) => {
      gmOp.mosaic().write(stitchedPath, (err) => {
        if (err) return reject(err);
        resolve(undefined);
      });
    });

    await new Promise((resolve, reject) => {
      gm(stitchedPath)
        .crop(zoomLevelData.imageSizePx[0], zoomLevelData.imageSizePx[1], 0, 0)
        .write(croppedPath, (err) => {
          if (err) return reject(err);
          resolve(undefined);
        });
    });
  }
}
