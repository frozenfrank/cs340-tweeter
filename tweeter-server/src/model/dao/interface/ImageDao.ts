import { DAO } from "./DAO";

export interface ImageDAO extends DAO {
  /** Stores the image in a persistent location and returns a URL to view it. */
  uploadProfileImage(
    imageBase64: string,
    fileExtension: string,
  ): Promise<string>;
}
