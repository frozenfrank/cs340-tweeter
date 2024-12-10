import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ImageDAO } from "../interface/ImageDAO";

export class S3ImageDao implements ImageDAO {
  private BUCKET = "byu-cs340-tweeter-2";
  private REGION = "us-west-2";
  private client = new S3Client({ region: this.REGION });

  uploadProfileImage(imageBase64: string, fileExtension: string, userAlias?: string): Promise<string> {
    const randString = this.getRandString();
    const filename = (userAlias ?? this.getRandString()) + "-" + randString + fileExtension;
    return this.putImage(filename, imageBase64);
  }

  private getRandString(): string {
    // WARNING: This has weaknesses
    // https://stackoverflow.com/a/8084248/2844859
    return (Math.random() + 1).toString(36).substring(2);
  }

  private async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: this.BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    try {
      await this.client.send(c);
      return (
        `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`
      );
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
