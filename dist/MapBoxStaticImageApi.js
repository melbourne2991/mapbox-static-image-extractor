"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapBoxStaticImageApi = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MapBoxStaticImageApi {
  constructor({
    imageHeight,
    imageWidth,
    accessToken,
    style
  }) {
    this.buildEndpoint = bounds => {
      const boundsStr = `[${bounds.join(",")}]`;
      return `https://api.mapbox.com/styles/v1/${style}/static/${boundsStr}/${imageWidth}x${imageHeight}?access_token=${accessToken}&attribution=false&logo=false&padding=0`;
    };
  }

  getImage = async bounds => {
    const endpoint = this.buildEndpoint(bounds);
    console.log(endpoint);
    const res = await _axios.default.get(endpoint, {
      responseType: "stream"
    });
    console.log(res.headers);
    return res;
  };
}

exports.MapBoxStaticImageApi = MapBoxStaticImageApi;