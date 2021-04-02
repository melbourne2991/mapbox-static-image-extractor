"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _download = require("./commands/download");

var _stitch = require("./commands/stitch");

var _extract = require("./commands/extract");

var _context = require("./context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();

_commander.default.requiredOption("-m, --map-name <mapName>", "Name of target map");

_commander.default.command("download").action(() => {
  (0, _download.download)((0, _context.getContext)(_commander.default.opts().mapName)).catch(console.log);
});

_commander.default.command("stitch").action(() => {
  (0, _stitch.stitch)((0, _context.getContext)(_commander.default.opts().mapName)).catch(console.log);
});

_commander.default.command("extract").action(() => {
  (0, _extract.extract)((0, _context.getContext)(_commander.default.opts().mapName)).catch(console.log);
});

_commander.default.parse(process.argv);