"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = void 0;

var _child_process = _interopRequireDefault(require("child_process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const extract = async ctx => {
  await new Promise((resolve, reject) => {
    console.log("spawning");
    const left = ctx.mapBounds[0];
    const right = ctx.mapBounds[2];
    const top = ctx.mapBounds[3];
    const bottom = ctx.mapBounds[1];
    const args = ["/Users/will/opt/osmosis/bin/osmosis", // didn't work with path based
    "--read-pbf", ctx.pbfFile, "--log-progress", "--bounding-box", `top=${top}`, `left=${left}`, `bottom=${bottom}`, `right=${right}`, "--write-xml", `${ctx.mapPath}/data.osm.xml`];
    console.log(args);

    const cp = _child_process.default.spawn("/bin/bash", args, {
      stdio: "inherit"
    });

    cp.on("exit", code => {
      code === 0 ? resolve(null) : reject(`Osmosis failed with error code: ${code}`);
    });
  });
};

exports.extract = extract;

function bbox(def) {
  return {
    bottomLeft: {
      x: def[0],
      y: def[1]
    },
    topRight: {
      x: def[2],
      y: def[3]
    },
    topLeft: {
      x: def[0],
      y: def[3]
    },
    bottomRight: {
      x: def[2],
      y: def[1]
    }
  };
}

const fixedDecimal = number => {
  return parseFloat(`${number}`).toFixed(3);
};