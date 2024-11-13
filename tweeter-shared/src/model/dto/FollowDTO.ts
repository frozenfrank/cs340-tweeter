import { UserDTO } from "./UserDTO";

export interface FollowDTO {
  readonly follower: UserDTO;
  readonly followee: UserDTO;
}
