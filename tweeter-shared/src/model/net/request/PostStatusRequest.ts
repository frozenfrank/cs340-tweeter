import { StatusDTO } from "../../dto/StatusDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface PostStatusRequest extends TweeterRequest {
  readonly status: StatusDTO;
}
