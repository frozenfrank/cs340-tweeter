import { UserRequestDouble, ValueResponse } from "tweeter-shared";
import { buildFollowService } from "../helper/factory";
import { packageValueResponse } from "../helper/helper";

export const GetFolloweeCountLambda = async (request: UserRequestDouble): Promise<ValueResponse<boolean>> => {
  const followService = buildFollowService();
  const result = await followService.getIsFollowerStatus(request.token, request.user, request.user2);
  return packageValueResponse(result);
};
