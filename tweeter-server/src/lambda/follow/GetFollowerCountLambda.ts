import { UserRequestSingle, ValueResponse } from "tweeter-shared";
import { buildFollowService } from "../helper/factory";
import { packageValueResponse } from "../helper/helper";

export const GetFollowerCountLambda = async (request: UserRequestSingle): Promise<ValueResponse<number>> => {
  const followService = buildFollowService();
  const result = await followService.getFollowerCount(request.token, request.user);
  return packageValueResponse(result);
};
