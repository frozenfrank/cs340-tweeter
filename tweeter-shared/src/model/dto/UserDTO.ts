export interface UserDTO {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly imageUrl: string;
  readonly passwordHash: string;
  readonly followeeCount?: number;
  readonly followerCount?: number;
}
