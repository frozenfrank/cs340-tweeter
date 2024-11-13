import { TweeterRequest } from "./TweeterRequest";

export interface RegisterUserRequest extends TweeterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly password: string;
  readonly userImageBase64: string;
  readonly imageFileExtension: string;
}
