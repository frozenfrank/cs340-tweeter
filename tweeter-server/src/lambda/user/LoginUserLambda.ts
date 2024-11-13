import { LoginUserRequest, SignedInUserResponse } from "tweeter-shared";
import { buildUserService } from "../helper/factory";
import { packageResponse } from "../helper/helper";

export const handler = async (request: LoginUserRequest): Promise<SignedInUserResponse> => {
  const followService = buildUserService();
  const [user, token] = await followService.login(request.alias, request.password);
  return packageResponse({ user, token });
};
