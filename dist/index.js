"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _download = require("./commands/download");

var _stitch = require("./commands/stitch");

var _extract = require("./commands/extract");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander.default.requiredOption("-m, --map-dir <mapDir>", "Path to map directory");

_commander.default.command("download").action(() => {
  (0, _download.download)(getContext()).catch(console.log);
});

_commander.default.command("stitch").action(() => {
  (0, _stitch.stitch)(getContext()).catch(console.log);
});

_commander.default.requiredOption("-p, --pbf-file <pbfFile>", "Path to pbf").command("extract").action(() => {
  console.log(_commander.default.opts());
  const context = { ...getContext(),
    pbfFile: _path.default.resolve(process.cwd(), _commander.default.opts().pbfFile)
  };
  (0, _extract.extract)(context).catch(console.log);
});

_commander.default.parse(process.argv);

function getContext() {
  const mapDirFullPath = _path.default.resolve(process.cwd(), _commander.default.opts().mapDir);

  const context = { ...readConfig(mapDirFullPath),
    mapPath: mapDirFullPath
  };
  return context;
}

function readConfig(mapDirFullPath) {
  const configJsonPath = _path.default.resolve(mapDirFullPath, "config.json");

  if (!_fs.default.existsSync(configJsonPath)) {
    throw new Error(`Missing config.json in: ${mapDirFullPath}`);
  }

  return JSON.parse(_fs.default.readFileSync(configJsonPath, "utf8"));
}