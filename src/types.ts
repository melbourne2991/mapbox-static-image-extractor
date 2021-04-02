export type Vec4 = [number, number, number, number];
export type Vec2 = [number, number];

export interface MapConfig {
  zoomLevelReferenceBounds: Record<number, Vec4>;
  mapBounds: Vec4;
  imageSize: number;
  dbName: string;
  pbfFile: string;
}

export interface BaseConfig {
  mapsDir: string;
  dbConfig: {
    user: string;
    password: string;
  };
  pbfFile: string;
  osmosisPath: string;
}

export type MergedConfig = MapConfig & BaseConfig;

export interface Context extends MergedConfig {
  mapPath: string;
  pbfPath: string;
  clearDb?: boolean;
}
