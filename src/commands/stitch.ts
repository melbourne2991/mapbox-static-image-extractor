import { Context } from "../types";
import gm from "gm";
import { TileBoundsCalculator } from "../TileBoundsCalculator";
import { getZoomLevelDataPath } from "../pathHelpers";
import path from "path";

export async function stitch(ctx: Context) {
  const zoomLevels = Object.keys(ctx.zoomLevelReferenceBounds);

  const tileBoundsCalculator = new TileBoundsCalculator({
    zoomLevelReferenceBounds: ctx.zoomLevelReferenceBounds,
  });

  for (let zoomLevel of zoomLevels) {
    const tileMatrix = tileBoundsCalculator.getTilesFromTargetBounds(
      ctx.mapBounds,
      zoomLevel
    );

    const zoomLevelDataPath = getZoomLevelDataPath(ctx, zoomLevel);

    let gmOp = gm(undefined as string);

    for (let [colIndex, col] of tileMatrix.entries()) {
      for (let rowIndex = col.length; rowIndex--; rowIndex > 0) {
        const fileName = `${colIndex}x${rowIndex}.png`;
        const rowIndexRev = col.length - 1 - rowIndex;

        const xOffset = colIndex * ctx.imageSize;
        const yOffset = rowIndexRev * ctx.imageSize;

        const filePath = path.resolve(zoomLevelDataPath, fileName);

        gmOp = gmOp.in("-page", `+${xOffset}+${yOffset}`).in(filePath);
      }
    }

    await new Promise((resolve, reject) => {
      gmOp
        .mosaic()
        .write(path.resolve(zoomLevelDataPath, "stitched.png"), (err) => {
          if (err) return reject(err);
          resolve(undefined);
        });
    });
  }
}
