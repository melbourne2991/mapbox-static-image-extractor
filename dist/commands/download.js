"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = download;

var _TileBoundsCalculator = require("../TileBoundsCalculator");

var _MapBoxStaticImageApi = require("../MapBoxStaticImageApi");

var _path = _interopRequireDefault(require("path"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _ImageWriter = require("../ImageWriter");

var _mimeTypes = _interopRequireDefault(require("mime-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function download(ctx) {
  const zoomLevels = Object.keys(ctx.zoomLevelReferenceBounds);
  const tileBoundsCalculator = new _TileBoundsCalculator.TileBoundsCalculator({
    zoomLevelReferenceBounds: ctx.zoomLevelReferenceBounds
  });
  const mapboxStaticImageApi = new _MapBoxStaticImageApi.MapBoxStaticImageApi({
    imageHeight: ctx.imageSize,
    imageWidth: ctx.imageSize,
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    style: "melbourne2991/ckmh9pcbxjclk17o7d7x7nrkh"
  });

  for (let zoomLevel of zoomLevels) {
    const zoomLevelDirPath = _path.default.resolve(ctx.mapPath, `data/${zoomLevel}`);

    (0, _mkdirp.default)(zoomLevelDirPath);
    const imageWriter = new _ImageWriter.ImageWriter({
      dirPath: zoomLevelDirPath
    });
    const tileMatrix = tileBoundsCalculator.getTilesFromTargetBounds(ctx.mapBounds, zoomLevel);

    for (let [i, col] of tileMatrix.entries()) {
      for (let [j, tile] of col.entries()) {
        const response = await mapboxStaticImageApi.getImage(tile);

        const ext = _mimeTypes.default.extension(response.headers["content-type"]);

        imageWriter.saveImage(response.data, `${i}x${j}.${ext}`);
      }
    }
  }
}