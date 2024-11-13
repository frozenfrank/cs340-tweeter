import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface UserRequestSingle extends TweeterRequest {
  readonly user: UserDTO;
}
