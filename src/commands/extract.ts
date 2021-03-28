import { Context } from "../types";
import child_process from "child_process";

export const extract = async (ctx: Context & { pbfFile: string }) => {
  await new Promise((resolve, reject) => {
    console.log("spawning");

    const left = ctx.mapBounds[0];
    const right = ctx.mapBounds[2];
    const top = ctx.mapBounds[3];
    const bottom = ctx.mapBounds[1];

    const args = [
      "/Users/will/opt/osmosis/bin/osmosis", // didn't work with path based
      "--read-pbf",
      ctx.pbfFile,
      "--log-progress",
      "--bounding-box",
      `top=${top}`,
      `left=${left}`,
      `bottom=${bottom}`,
      `right=${right}`,
      "--write-xml",
      `${ctx.mapPath}/data.osm.xml`,
    ];

    console.log(args);

    const cp = child_process.spawn("/bin/bash", args, {
      stdio: "inherit",
    });

    cp.on("exit", (code) => {
      code === 0
        ? resolve(null)
        : reject(`Osmosis failed with error code: ${code}`);
    });
  });
};

function bbox(def: [number, number, number, number]) {
  return {
    bottomLeft: {
      x: def[0],
      y: def[1],
    },
    topRight: {
      x: def[2],
      y: def[3],
    },
    topLeft: {
      x: def[0],
      y: def[3],
    },
    bottomRight: {
      x: def[2],
      y: def[1],
    },
  };
}

const fixedDecimal = (number: number) => {
  return parseFloat(`${number}`).toFixed(3);
};
