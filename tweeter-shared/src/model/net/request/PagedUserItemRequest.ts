import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: UserDTO | null;
}
