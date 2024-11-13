import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedUserItemResponse extends TweeterResponseResponse {
  readonly items: UserDTO | null;
  readonly hasMore: boolean;
}
