import { Vec2, Vec4 } from "./types";

export type TileBoundsCalculatorParams<T extends Record<string, Vec4>> = {
  zoomLevelReferenceBounds: T;
};

export class TileBoundsCalculator<T extends Record<string, Vec4>> {
  zoomLevelReferenceBounds: T;

  constructor({ zoomLevelReferenceBounds }: TileBoundsCalculatorParams<T>) {
    this.zoomLevelReferenceBounds = zoomLevelReferenceBounds;
  }

  public getTilesFromTargetBounds = (
    targetBounds: Vec4,
    zoomLevel: string
  ): Vec4[][] => {
    const targetSize = getBoundsSize(targetBounds);
    const tileSize = getBoundsSize(
      this.zoomLevelReferenceBounds[zoomLevel] as Vec4
    );

    console.log("zoomLevelRefBounds", this.zoomLevelReferenceBounds);
    console.log("tileSize", tileSize);

    const len: Vec2 = [
      Math.ceil(targetSize[0] / tileSize[0]),
      Math.ceil(targetSize[1] / tileSize[1]),
    ];

    const tiles: Vec4[][] = [];

    for (let i = 0; i < len[0]; i++) {
      const offsetX = targetBounds[0] + i * tileSize[0];
      const col = [];

      tiles.push(col);

      for (let j = 0; j < len[1]; j++) {
        const offsetY = targetBounds[1] + j * tileSize[1];

        col.push([
          offsetX,
          offsetY,
          offsetX + tileSize[0],
          offsetY + tileSize[1],
        ]);
      }
    }

    return tiles;
  };
}

const BOUNDS_MIN_LNG = 0;
const BOUNDS_MIN_LAT = 1;
const BOUNDS_MAX_LNG = 2;
const BOUNDS_MAX_LAT = 3;

function getBoundsSize(bounds: Vec4): Vec2 {
  return [
    bounds[BOUNDS_MAX_LNG] - bounds[BOUNDS_MIN_LNG],
    bounds[BOUNDS_MAX_LAT] - bounds[BOUNDS_MIN_LAT],
  ];
}
