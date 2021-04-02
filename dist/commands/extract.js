"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = void 0;

var _runOsmosis = require("../runOsmosis");

const extract = async ctx => {
  await (0, _runOsmosis.runOsmosis)(ctx.osmosisPath, ["--read-pbf", ctx.pbfPath, "--log-progress", "--bounding-box", ...(0, _runOsmosis.contextBoundsToOsmosis)(ctx.mapBounds), "--write-xml", `${ctx.mapPath}/data.osm.xml`]);
};

exports.extract = extract;