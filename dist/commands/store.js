"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;

var _runOsmosis = require("../runOsmosis");

var _pgPromise = _interopRequireWildcard(require("pg-promise"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const pgp = (0, _pgPromise.default)(); // https://wiki.openstreetmap.org/wiki/Osmosis/PostGIS_Setup

const osmosisSetup = root => ["script/pgsnapshot_schema_0.6.sql", "script/pgsnapshot_schema_0.6_action.sql", "script/pgsnapshot_schema_0.6_bbox.sql", "script/pgsnapshot_schema_0.6_linestring.sql"].map(filePath => {
  const fullPath = _path.default.resolve(root, filePath);

  console.log("Full path", fullPath);
  return new _pgPromise.QueryFile(fullPath);
});

const store = async ctx => {
  console.log(ctx);
  let client = pgp({
    database: "postgres",
    port: 5432,
    ...ctx.dbConfig
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
    ...ctx.dbConfig
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

  await (0, _runOsmosis.runOsmosis)(ctx.osmosisPath, ["--read-pbf", ctx.pbfPath, "--log-progress", "--bounding-box", ...(0, _runOsmosis.contextBoundsToOsmosis)(ctx.mapBounds), "--write-pgsql", `user=${ctx.dbConfig.user}`, `password=${ctx.dbConfig.password}`, `database=${ctx.dbName}`]);
};

exports.store = store;