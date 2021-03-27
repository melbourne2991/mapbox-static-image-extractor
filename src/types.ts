export type Vec4 = [number, number, number, number];
export type Vec2 = [number, number];

export interface MapConfig {
  zoomLevelReferenceBounds: Record<number, Vec4>;
  mapBounds: Vec4;
  imageSize: number;
}

export interface Context extends MapConfig {
  mapPath: string;
}
