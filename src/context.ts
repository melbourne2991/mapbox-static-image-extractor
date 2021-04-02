import { Schema, Validator } from "jsonschema";
import { BaseConfig, Context, MapConfig } from "./types";
import fs from "fs";
import path from "path";

const validator = new Validator();

const baseConfigSchema: Schema = {
  id: "/BaseConfig",
  type: "object",
  required: ["mapsDir", "pbfDir", "osmosisPath"],
  properties: {
    mapsDir: { type: "string" },
    pbfDir: { type: "string" },
    osmosisPath: { type: "string" },
  },
};

const mapConfigSchema: Schema = {
  id: "/MapConfig",
  type: "object",
  required: [
    "zoomLevelReferenceBounds",
    "mapBounds",
    "imageSize",
    "pbfFile",
    "mapStyle",
  ],
  properties: {
    zoomLevelReferenceBounds: {
      type: "object",
    },
    mapStyle: {
      type: "string",
    },
    mapBounds: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: { type: "number" },
    },
    imageSize: {
      type: "number",
    },
    pbfFile: {
      type: "string",
    },
  },
};

export const getBaseConfig = (): BaseConfig => {
  const baseConfigPath = path.resolve(process.cwd(), "map-utils.config.json");
  const baseConfigRaw = readBaseConfig(baseConfigPath);
  const result = validator.validate(baseConfigRaw, baseConfigSchema);

  if (!result.valid) throw `Invalid base config:\n${result.errors.join("\n")}`;

  return baseConfigRaw;
};

export const getContext = (mapName: string): Context => {
  const baseConfig = getBaseConfig();

  const mapDirPath = path.resolve(process.cwd(), "maps", mapName);
  const mapConfigRaw = readMapConfig(mapDirPath);

  const result = validator.validate(mapConfigRaw, mapConfigSchema);

  const {
    pbfFile,
    zoomLevelReferenceBounds,
    mapBounds,
    imageSize,
    mapStyle,
  } = mapConfigRaw;

  if (!result.valid) throw `Invalid map config:\n${result.errors.join("\n")}`;

  const pbfPath = path.resolve(process.cwd(), baseConfig.pbfDir, pbfFile);
  const osmosisPath = path.resolve(process.cwd(), baseConfig.osmosisPath);

  verifyFileExists(pbfPath);
  verifyFileExists(osmosisPath);

  return {
    pbfPath,
    mapDirPath,
    zoomLevelReferenceBounds,
    mapBounds,
    osmosisPath,
    imageSize,
    mapStyle,
  };
};

function readBaseConfig(baseConfigFullPath: string): BaseConfig {
  if (!fs.existsSync(baseConfigFullPath)) {
    throw new Error(`Missing base config: ${baseConfigFullPath}`);
  }

  return JSON.parse(fs.readFileSync(baseConfigFullPath, "utf8"));
}

function readMapConfig(mapDirFullPath: string): MapConfig {
  const configJsonPath = path.resolve(mapDirFullPath, "config.json");

  if (!fs.existsSync(configJsonPath)) {
    throw new Error(`Missing config.json in: ${mapDirFullPath}`);
  }

  return JSON.parse(fs.readFileSync(configJsonPath, "utf8"));
}

function verifyFileExists(filePath: string) {
  if (!fs.existsSync(filePath) && fs.statSync(filePath).isFile())
    throw new Error(`File does not exist: ${filePath}`);
}
