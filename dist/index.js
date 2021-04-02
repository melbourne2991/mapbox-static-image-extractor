"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _download = require("./commands/download");

var _stitch = require("./commands/stitch");

var _extract = require("./commands/extract");

var _store = require("./commands/store");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander.default.requiredOption("-m, --map-name <mapName>", "Name of target map");

_commander.default.command("download").action(() => {
  (0, _download.download)(getContext()).catch(console.log);
});

_commander.default.command("stitch").action(() => {
  (0, _stitch.stitch)(getContext()).catch(console.log);
});

_commander.default.command("extract").action(() => {
  (0, _extract.extract)(getContext()).catch(console.log);
});

_commander.default.option("-c, --clear-db").command("store").action(() => {
  const clearDb = _commander.default.opts().clearDb;

  (0, _store.store)({ ...getContext(),
    clearDb
  }).catch(console.log);
});

_commander.default.parse(process.argv);

function getContext() {
  const baseConfigFullPath = _path.default.resolve(process.cwd(), "mapgm.config.json");

  const baseConfig = readBaseConfig(baseConfigFullPath);
  console.log(baseConfigFullPath);

  const mapDirFullPath = _path.default.resolve(process.cwd(), baseConfig.mapsDir, _commander.default.opts().mapName);

  console.log(mapDirFullPath);
  const mapConfig = readMapConfig(mapDirFullPath);
  console.log(mapConfig);

  const pbfFileFullPath = _path.default.resolve(mapDirFullPath, mapConfig.pbfFile);

  console.log(pbfFileFullPath);
  const context = { ...baseConfig,
    ...mapConfig,
    mapPath: mapDirFullPath,
    pbfPath: pbfFileFullPath
  };
  return context;
}

function readBaseConfig(baseConfigFullPath) {
  if (!_fs.default.existsSync(baseConfigFullPath)) {
    throw new Error(`Missing mapgm.config.json in: ${baseConfigFullPath}`);
  }

  return JSON.parse(_fs.default.readFileSync(baseConfigFullPath, "utf8"));
}

function readMapConfig(mapDirFullPath) {
  const configJsonPath = _path.default.resolve(mapDirFullPath, "config.json");

  if (!_fs.default.existsSync(configJsonPath)) {
    throw new Error(`Missing config.json in: ${mapDirFullPath}`);
  }

  return JSON.parse(_fs.default.readFileSync(configJsonPath, "utf8"));
}