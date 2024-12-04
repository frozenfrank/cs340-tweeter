export interface ImageDAO {
  /** Stores the image in a persistent location and returns a URL to view it. */
  uploadProfileImage(
    imageBase64: string,
    fileExtension: string,
    userAlias?: string,
  ): Promise<string>;
}
