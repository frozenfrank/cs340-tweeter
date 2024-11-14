import { TweeterRequest } from "./TweeterRequest";

export interface LoginUserRequest extends Omit<TweeterRequest, 'token'> {
  readonly alias: string;
  readonly password: string;
}
