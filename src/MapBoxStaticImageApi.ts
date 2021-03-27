import { Vec4 } from "./types";
import axios from "axios";

export interface MapBoxStaticImageApiParams {
  imageWidth: number;
  imageHeight: number;
  style: string;
  accessToken: string;
}

export class MapBoxStaticImageApi {
  private buildEndpoint: (bounds: Vec4) => string;

  constructor({
    imageHeight,
    imageWidth,
    accessToken,
    style,
  }: MapBoxStaticImageApiParams) {
    this.buildEndpoint = (bounds: Vec4) => {
      const boundsStr = `[${bounds.join(",")}]`;
      return `https://api.mapbox.com/styles/v1/${style}/static/${boundsStr}/${imageWidth}x${imageHeight}?access_token=${accessToken}&attribution=false&logo=false&padding=0`;
    };
  }

  getImage = async (bounds: Vec4) => {
    const endpoint = this.buildEndpoint(bounds);
    console.log(endpoint);

    const res = await axios.get(endpoint, {
      responseType: "stream",
    });

    console.log(res.headers);

    return res;
  };
}
