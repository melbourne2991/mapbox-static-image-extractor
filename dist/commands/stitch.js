"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stitch = stitch;

var _gm = _interopRequireDefault(require("gm"));

var _TileBoundsCalculator = require("../TileBoundsCalculator");

var _pathHelpers = require("../pathHelpers");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function stitch(ctx) {
  const zoomLevels = Object.keys(ctx.zoomLevelReferenceBounds);
  const tileBoundsCalculator = new _TileBoundsCalculator.TileBoundsCalculator({
    zoomLevelReferenceBounds: ctx.zoomLevelReferenceBounds
  });

  for (let zoomLevel of zoomLevels) {
    const tileMatrix = tileBoundsCalculator.getTilesFromTargetBounds(ctx.mapBounds, zoomLevel);
    const zoomLevelDataPath = (0, _pathHelpers.getZoomLevelDataPath)(ctx, zoomLevel);
    let gmOp = (0, _gm.default)(undefined);

    for (let [colIndex, col] of tileMatrix.entries()) {
      for (let rowIndex = col.length; rowIndex--; rowIndex > 0) {
        const fileName = `${colIndex}x${rowIndex}.png`;
        const rowIndexRev = col.length - 1 - rowIndex;
        const xOffset = colIndex * ctx.imageSize;
        const yOffset = rowIndexRev * ctx.imageSize;

        const filePath = _path.default.resolve(zoomLevelDataPath, fileName);

        gmOp = gmOp.in("-page", `+${xOffset}+${yOffset}`).in(filePath);
      }
    }

    await new Promise((resolve, reject) => {
      gmOp.mosaic().write(_path.default.resolve(zoomLevelDataPath, "stitched.png"), err => {
        if (err) return reject(err);
        resolve(undefined);
      });
    });
  }
}