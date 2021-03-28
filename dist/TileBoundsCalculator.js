"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileBoundsCalculator = void 0;

class TileBoundsCalculator {
  constructor({
    zoomLevelReferenceBounds
  }) {
    this.zoomLevelReferenceBounds = zoomLevelReferenceBounds;
  }

  getTilesFromTargetBounds = (targetBounds, zoomLevel) => {
    const targetSize = getBoundsSize(targetBounds);
    const tileSize = getBoundsSize(this.zoomLevelReferenceBounds[zoomLevel]);
    const len = [Math.ceil(targetSize[0] / tileSize[0]), Math.ceil(targetSize[1] / tileSize[1])];
    const tiles = [];

    for (let i = 0; i < len[0]; i++) {
      const offsetX = targetBounds[0] + i * tileSize[0];
      const col = [];
      tiles.push(col);

      for (let j = 0; j < len[1]; j++) {
        const offsetY = targetBounds[1] + j * tileSize[1];
        col.push([offsetX, offsetY, offsetX + tileSize[0], offsetY + tileSize[1]]);
      }
    }

    return tiles;
  };
}

exports.TileBoundsCalculator = TileBoundsCalculator;
const BOUNDS_MIN_LAT = 0;
const BOUNDS_MIN_LNG = 1;
const BOUNDS_MAX_LAT = 2;
const BOUNDS_MAX_LNG = 3;

function getBoundsSize(bounds) {
  return [bounds[BOUNDS_MAX_LAT] - bounds[BOUNDS_MIN_LAT], bounds[BOUNDS_MAX_LNG] - bounds[BOUNDS_MIN_LNG]];
}