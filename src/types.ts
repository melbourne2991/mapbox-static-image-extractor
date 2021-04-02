export type Vec4 = [number, number, number, number];
export type Vec2 = [number, number];

export interface MapConfig {
  zoomLevelReferenceBounds: Record<number, Vec4>;
  mapBounds: Vec4;
  imageSize: number;
  pbfFile: string;
  mapStyle: string;
}

export interface BaseConfig {
  mapsDir: string;
  pbfDir: string;
  osmosisPath: string;
}

export interface Context {
  mapDirPath: string;
  pbfPath: string;
  osmosisPath: string;
  zoomLevelReferenceBounds: Record<number, Vec4>;
  mapBounds: Vec4;
  imageSize: number;
  mapStyle: string;
}
