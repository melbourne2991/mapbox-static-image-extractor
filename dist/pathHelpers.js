"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getZoomLevelDataPath = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getZoomLevelDataPath = (ctx, zoomLevel) => _path.default.resolve(ctx.mapDirPath, `data/${zoomLevel}`);

exports.getZoomLevelDataPath = getZoomLevelDataPath;