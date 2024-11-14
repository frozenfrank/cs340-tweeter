import { LoginUserRequest, SignedInUserResponse } from "tweeter-shared";
import { buildUserService } from "../helper/factory";
import { packageResponse } from "../helper/helper";

export const handler = async (request: LoginUserRequest): Promise<SignedInUserResponse> => {
  const service = buildUserService();
  const [user, token] = await service.login(request.alias, request.password);
  return packageResponse({ user, token });
};
