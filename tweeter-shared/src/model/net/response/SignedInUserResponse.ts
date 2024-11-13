import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface SignedInUserResponse extends TweeterResponse {
  readonly token: string;
  readonly user: UserDTO;
}
