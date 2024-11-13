import { RegisterUserRequest, SignedInUserResponse } from "tweeter-shared";
import { buildUserService } from "../helper/factory";
import { packageResponse } from "../helper/helper";

export const handler = async (request: RegisterUserRequest): Promise<SignedInUserResponse> => {
  const followService = buildUserService();
  const [user, token] = await followService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBase64,
    request.imageFileExtension,
  );
  return packageResponse({ user, token });
};
