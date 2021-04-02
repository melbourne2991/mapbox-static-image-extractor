import { runOsmosis, contextBoundsToOsmosis } from "../runOsmosis";
import { Context } from "../types";
import Pgp, { QueryFile } from "pg-promise";
import path from "path";

const pgp = Pgp();

// https://wiki.openstreetmap.org/wiki/Osmosis/PostGIS_Setup
const osmosisSetup = (root: string) =>
  [
    "script/pgsnapshot_schema_0.6.sql",
    "script/pgsnapshot_schema_0.6_action.sql",
    "script/pgsnapshot_schema_0.6_bbox.sql",
    "script/pgsnapshot_schema_0.6_linestring.sql",
  ].map((filePath) => {
    const fullPath = path.resolve(root, filePath);
    console.log("Full path", fullPath);
    return new QueryFile(fullPath);
  });

export const store = async (ctx: Context) => {
  console.log(ctx);

  let client = pgp({
    database: "postgres",
    port: 5432,
    ...ctx.dbConfig,
  });

  if (ctx.clearDb) {
    await client.none("DROP DATABASE $1:name", [ctx.dbName]);
  }

  try {
    await client.none("CREATE DATABASE $1:name", [ctx.dbName]);
  } catch (err) {
    if (!err.message.includes("already exists")) {
      throw err;
    }
  }

  client = pgp({
    database: ctx.dbName,
    port: 5432,
    ...ctx.dbConfig,
  });

  try {
    await client.none("CREATE EXTENSION hstore; CREATE EXTENSION postgis;");
  } catch (err) {
    if (!err.message.includes("already exists")) {
      throw err;
    }
  }

  for (let queryFile of osmosisSetup(ctx.osmosisPath)) {
    try {
      await client.none(queryFile);
    } catch (err) {
      if (!err.message.includes("already exists")) {
        throw err;
      }
    }
  }

  await runOsmosis(ctx.osmosisPath, [
    "--read-pbf",
    ctx.pbfPath,
    "--log-progress",
    "--bounding-box",
    ...contextBoundsToOsmosis(ctx.mapBounds),
    "--write-pgsql",
    `user=${ctx.dbConfig.user}`,
    `password=${ctx.dbConfig.password}`,
    `database=${ctx.dbName}`,
  ]);
};
