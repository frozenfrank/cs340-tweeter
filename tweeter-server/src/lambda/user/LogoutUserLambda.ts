import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { buildUserService } from "../helper/factory";
import { successfulEmptyResponse } from "../helper/helper";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
  const followService = buildUserService();
  await followService.logout(request.token);
  return successfulEmptyResponse();
};
