import { UserDTO } from "./UserDTO";

export interface StatusDTO {
  readonly post: string;
  readonly user: UserDTO;
  readonly timestamp: number;
  /** This field is populated when it is returned from StatusDAOs.
   * It is required when using the object to query additional pages of statuses. */
  readonly timestamp_unique?: string;
}
