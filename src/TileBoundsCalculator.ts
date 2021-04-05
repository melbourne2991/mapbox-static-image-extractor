import { Vec2, Vec4 } from "./types";

export type TileBoundsCalculatorParams<T extends Record<string, Vec4>> = {
  zoomLevelReferenceBounds: T;
  tileSizePx: [number, number];
  targetBounds: Vec4;
};

interface Tile {
  top: number;
  left: number;
  pxOffset: [number, number];
  lngLatBounds: Vec4;
}

interface PixelLatLngRatios {
  pixelsPerLngLat: [number, number];
  lngLatPerPixel: [number, number];
}
interface ZoomLevelData {
  tiles: Tile[];
  ratios: PixelLatLngRatios;
  imageSizePx: [number, number];
  imageSizeLngLat: [number, number];
}

const BOUNDS_MIN_LNG = 0;
const BOUNDS_MIN_LAT = 1;
const BOUNDS_MAX_LNG = 2;
const BOUNDS_MAX_LAT = 3;

export class TileBoundsCalculator<T extends Record<string, Vec4>> {
  zoomLevelReferenceBounds: T;
  tileSizePx: [number, number];
  targetBounds: Vec4;

  constructor({
    zoomLevelReferenceBounds,
    tileSizePx,
    targetBounds,
  }: TileBoundsCalculatorParams<T>) {
    this.zoomLevelReferenceBounds = zoomLevelReferenceBounds;
    this.tileSizePx = tileSizePx;
    this.targetBounds = targetBounds;
  }

  public getZoomLevelData = (zoomLevel: string): ZoomLevelData => {
    const targetSize = getBoundsSize(this.targetBounds);
    const tileSize = getBoundsSize(
      this.zoomLevelReferenceBounds[zoomLevel] as Vec4
    );

    const len: Vec2 = [
      Math.ceil(targetSize[0] / tileSize[0]),
      Math.ceil(targetSize[1] / tileSize[1]),
    ];

    const tiles: Tile[][] = [];
    const colCount = len[0];
    const rowCount = len[1];

    for (let colIndex = 0; colIndex < colCount; colIndex++) {
      const offsetX = this.targetBounds[0] + colIndex * tileSize[0];
      const col: Tile[] = [];

      tiles.push(col);

      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const offsetY = this.targetBounds[1] + rowIndex * tileSize[1];

        const rowIndexRev = rowCount - 1 - rowIndex;
        const pxOffsetX = colIndex * this.tileSizePx[0];
        const pxOffsetY = rowIndexRev * this.tileSizePx[1];

        col.push({
          top: rowIndexRev,
          left: colIndex,
          lngLatBounds: [
            offsetX,
            offsetY,
            offsetX + tileSize[0],
            offsetY + tileSize[1],
          ],
          pxOffset: [pxOffsetX, pxOffsetY],
        });
      }
    }

    const ratios = pixelRelLatLngRatios(tileSize, this.tileSizePx);
    const imageSizePx = [
      Math.ceil(targetSize[0] * ratios.pixelsPerLngLat[0]),
      Math.ceil(targetSize[1] * ratios.pixelsPerLngLat[1]),
    ] as [number, number];

    const imageSizeLngLat = [
      imageSizePx[0] * ratios.lngLatPerPixel[0],
      imageSizePx[1] * ratios.lngLatPerPixel[1],
    ] as [number, number];

    const imageLatLngBounds = [
      this.targetBounds[BOUNDS_MIN_LNG],
      this.targetBounds[BOUNDS_MIN_LAT],
      this.targetBounds[BOUNDS_MIN_LNG] + imageSizeLngLat[0],
      this.targetBounds[BOUNDS_MIN_LAT] + imageSizeLngLat[1],
    ];

    return {
      tiles: tiles.flatMap((tile) => tile),
      ratios,
      imageSizePx,
      imageSizeLngLat,
    };
  };
}

export function getBoundsSize(bounds: Vec4): Vec2 {
  return [
    bounds[BOUNDS_MAX_LNG] - bounds[BOUNDS_MIN_LNG],
    bounds[BOUNDS_MAX_LAT] - bounds[BOUNDS_MIN_LAT],
  ];
}

export function pixelRelLatLngRatios(
  tileSizeLngLat: [number, number],
  tileSizePx: [number, number]
): PixelLatLngRatios {
  const lngLatPerPixel = [
    tileSizeLngLat[0] / tileSizePx[0],
    tileSizeLngLat[1] / tileSizePx[1],
  ] as [number, number];

  const pixelsPerLngLat = [
    tileSizePx[0] / tileSizeLngLat[0],
    tileSizePx[1] / tileSizeLngLat[1],
  ] as [number, number];

  return {
    pixelsPerLngLat,
    lngLatPerPixel,
  };
}
