import { Injectable } from '@nestjs/common';
import environments from 'src/helpers/environments';

var ImageKit = require('imagekit');
@Injectable()
export class ImageGateway {
  private _imageKit = new ImageKit({
    publicKey:
      environments.IMAGE_KIT_PUB_KEY ,
    privateKey:
      environments.IMAGE_KIT_PRV_KEY ,
    urlEndpoint:
      environments.IMAGE_KIT_URL_ENDPOINT ,
  });

  async upload(file: any): Promise<ImageKitResponse> {
    return await this._imageKit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
  }
}

export interface ImageKitResponse {
  fileId: string;
  name: string;
  size: number;
  versionInfo: {
    id: string;
    name: string;
  };
  filePath: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  AITags: string | null;
}
