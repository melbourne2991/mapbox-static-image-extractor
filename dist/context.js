"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContext = exports.getBaseConfig = void 0;

var _jsonschema = require("jsonschema");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validator = new _jsonschema.Validator();
const baseConfigSchema = {
  id: "/BaseConfig",
  type: "object",
  required: ["mapsDir", "pbfDir", "osmosisPath"],
  properties: {
    mapsDir: {
      type: "string"
    },
    pbfDir: {
      type: "string"
    },
    osmosisPath: {
      type: "string"
    }
  }
};
const mapConfigSchema = {
  id: "/MapConfig",
  type: "object",
  required: ["zoomLevelReferenceBounds", "mapBounds", "imageSize", "pbfFile", "mapStyle"],
  properties: {
    zoomLevelReferenceBounds: {
      type: "object"
    },
    mapStyle: {
      type: "string"
    },
    mapBounds: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "number"
      }
    },
    imageSize: {
      type: "number"
    },
    pbfFile: {
      type: "string"
    }
  }
};

const getBaseConfig = () => {
  const baseConfigPath = _path.default.resolve(process.cwd(), "map-utils.config.json");

  const baseConfigRaw = readBaseConfig(baseConfigPath);
  const result = validator.validate(baseConfigRaw, baseConfigSchema);
  if (!result.valid) throw `Invalid base config:\n${result.errors.join("\n")}`;
  return baseConfigRaw;
};

exports.getBaseConfig = getBaseConfig;

const getContext = mapName => {
  const baseConfig = getBaseConfig();

  const mapDirPath = _path.default.resolve(process.cwd(), "maps", mapName);

  const mapConfigRaw = readMapConfig(mapDirPath);
  const result = validator.validate(mapConfigRaw, mapConfigSchema);
  const {
    pbfFile,
    zoomLevelReferenceBounds,
    mapBounds,
    imageSize,
    mapStyle
  } = mapConfigRaw;
  if (!result.valid) throw `Invalid map config:\n${result.errors.join("\n")}`;

  const pbfPath = _path.default.resolve(process.cwd(), baseConfig.pbfDir, pbfFile);

  const osmosisPath = _path.default.resolve(process.cwd(), baseConfig.osmosisPath);

  verifyFileExists(pbfPath);
  verifyFileExists(osmosisPath);
  return {
    pbfPath,
    mapDirPath,
    zoomLevelReferenceBounds,
    mapBounds,
    osmosisPath,
    imageSize,
    mapStyle
  };
};

exports.getContext = getContext;

function readBaseConfig(baseConfigFullPath) {
  if (!_fs.default.existsSync(baseConfigFullPath)) {
    throw new Error(`Missing base config: ${baseConfigFullPath}`);
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

function verifyFileExists(filePath) {
  if (!_fs.default.existsSync(filePath) && _fs.default.statSync(filePath).isFile()) throw new Error(`File does not exist: ${filePath}`);
}