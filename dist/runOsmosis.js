"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contextBoundsToOsmosis = exports.runOsmosis = void 0;

var _child_process = _interopRequireDefault(require("child_process"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const runOsmosis = async (osmosisPath, osmosisArgs) => {
  await new Promise((resolve, reject) => {
    const args = [_path.default.resolve(osmosisPath, "bin/osmosis"), // didn't work with path based
    ...osmosisArgs];

    const cp = _child_process.default.spawn("/bin/bash", args, {
      stdio: "inherit"
    });

    cp.on("exit", code => {
      code === 0 ? resolve(null) : reject(`Osmosis failed with error code: ${code}`);
    });
  });
};

exports.runOsmosis = runOsmosis;

const contextBoundsToOsmosis = mapBounds => {
  const left = mapBounds[0];
  const right = mapBounds[2];
  const top = mapBounds[3];
  const bottom = mapBounds[1];
  return [`top=${top}`, `left=${left}`, `bottom=${bottom}`, `right=${right}`];
};

exports.contextBoundsToOsmosis = contextBoundsToOsmosis;