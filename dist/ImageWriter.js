"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageWriter = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ImageWriter {
  constructor({
    dirPath
  }) {
    this.dirPath = dirPath;
  }

  saveImage = async (data, fileName) => {
    const filePath = _path.default.resolve(this.dirPath, `${fileName}`);

    const writer = _fs.default.createWriteStream(filePath);

    data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  };
}

exports.ImageWriter = ImageWriter;