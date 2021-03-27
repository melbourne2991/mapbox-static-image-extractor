import fs from "fs";
import path from "path";

export interface ImageWriterParams {
  dirPath: string;
}

export interface Pipable {
  pipe: (ws: fs.WriteStream) => any;
}

export class ImageWriter {
  private dirPath: string;

  constructor({ dirPath }: ImageWriterParams) {
    this.dirPath = dirPath;
  }

  saveImage = async (data: Pipable, fileName: string) => {
    const filePath = path.resolve(this.dirPath, `${fileName}`);
    const writer = fs.createWriteStream(filePath);

    data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  };
}
