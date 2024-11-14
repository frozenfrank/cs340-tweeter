import { UserDTO } from "../../dto/UserDTO";
import { UserRequestSingle } from "./UserRequestSingle";

export interface UserRequestDouble extends UserRequestSingle {
  readonly user2: UserDTO;
}
