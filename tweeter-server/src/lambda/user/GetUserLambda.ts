import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { buildUserService } from "../helper/factory";
import { packageResponse } from "../helper/helper";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const service = buildUserService();
  const user = await service.getUser(request.token, request.alias);
  return packageResponse({ user });
};
