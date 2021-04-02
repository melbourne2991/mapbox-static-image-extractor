import child_process from "child_process";
import path from "path";

export const runOsmosis = async (osmosisPath: string, osmosisArgs: any[]) => {
  await new Promise((resolve, reject) => {
    const args = [
      path.resolve(osmosisPath, "bin/osmosis"), // didn't work with path based
      ...osmosisArgs,
    ];

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

export const contextBoundsToOsmosis = (
  mapBounds: [number, number, number, number]
): string[] => {
  const left = mapBounds[0];
  const right = mapBounds[2];
  const top = mapBounds[3];
  const bottom = mapBounds[1];

  return [`top=${top}`, `left=${left}`, `bottom=${bottom}`, `right=${right}`];
};
